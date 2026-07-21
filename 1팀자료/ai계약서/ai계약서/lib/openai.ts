import OpenAI from 'openai';
import { analysisJsonSchema, AnalysisResult, AnalysisResultSchema } from './types';

const SYSTEM_INSTRUCTIONS = `당신은 계약서를 분석하는 AI 어시스턴트입니다. 아래 규칙을 반드시 지키세요.

1. 당신은 변호사가 아니며, 법률 자문이나 법적 판단을 제공하지 않습니다. "~해야 합니다", "위법입니다" 와 같은 단정적 법적 결론을 내리지 말고, "확인이 필요합니다", "불리하게 해석될 수 있습니다" 와 같이 정보 제공 톤을 유지하세요.
2. 계약서에 실제로 존재하는 문구만 그대로 인용하세요. 문서에 없는 내용을 추측하거나 지어내지 마세요. 확인할 수 없으면 missing_or_unclear_items 에 기재하세요.
3. 위험 조항에는 가능한 한 조항 번호 또는 원문 상 위치(예: "제3조 제2항")를 함께 표기하세요. 조항 번호가 없으면 null로 두세요.
4. 업로드된 문서가 계약서가 아니거나, 텍스트가 너무 부족해 판단할 수 없으면 is_contract 를 false 로 하고 summary 에 그 이유를 솔직하게 설명하세요.
5. 모든 출력(요약, 설명, 조항 제목 등)은 반드시 한국어로 작성하세요.
6. disclaimer 필드에는 반드시 "본 결과는 정보 제공 목적이며, 중요한 계약은 변호사 등 전문가의 검토가 필요합니다." 라는 문장을 포함하세요.
7. risk_score 는 0(매우 위험)~100(매우 안전) 척도가 아니라, 0(위험 요소 거의 없음)~100(위험 요소가 매우 많고 심각함) 척도로 사용하고, risk_level 은 그에 맞게 high/medium/low 로 매기세요. 단, 사용자에게 보여줄 때 혼동이 없도록 risk_score 가 높을수록 더 위험하다는 의미로 일관되게 사용하세요.
8. 위험 조항이 없다면 risks 배열을 비워두어도 됩니다. 근거 없이 위험 조항을 만들어내지 마세요.`;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY가 설정되지 않았습니다.');
  }
  return new OpenAI({ apiKey });
}

function getModel(): string {
  return process.env.OPENAI_MODEL || 'gpt-5.6-terra';
}

/**
 * Analyze a PDF contract. The PDF is sent to the Responses API as an
 * input_file so the model can read both the extracted text and the
 * rendered page images (useful for scanned contracts, stamps, tables).
 */
export async function analyzePdfContract(params: {
  base64Pdf: string;
  fileName: string;
}): Promise<AnalysisResult> {
  const client = getClient();
  const model = getModel();

  const response = await client.responses.create({
    model,
    instructions: SYSTEM_INSTRUCTIONS,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_file',
            filename: params.fileName,
            file_data: `data:application/pdf;base64,${params.base64Pdf}`
          },
          {
            type: 'input_text',
            text: '첨부된 문서를 분석해 주세요. 문서의 텍스트와 페이지 이미지를 모두 참고하여 위에 안내된 JSON 스키마에 맞게 결과를 작성하세요.'
          }
        ]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: analysisJsonSchema.name,
        schema: analysisJsonSchema.schema,
        strict: analysisJsonSchema.strict
      }
    }
  });

  return parseResponse(response);
}

/**
 * Analyze a DOCX contract. Text is extracted server-side (see lib/docx.ts)
 * and passed to the model as plain text.
 */
export async function analyzeTextContract(params: {
  text: string;
  fileName: string;
}): Promise<AnalysisResult> {
  const client = getClient();
  const model = getModel();

  const response = await client.responses.create({
    model,
    instructions: SYSTEM_INSTRUCTIONS,
    input: [
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: `파일명: ${params.fileName}\n\n다음은 문서에서 추출한 전체 텍스트입니다. 이 내용을 분석하여 위에 안내된 JSON 스키마에 맞게 결과를 작성하세요.\n\n---\n${params.text}\n---`
          }
        ]
      }
    ],
    text: {
      format: {
        type: 'json_schema',
        name: analysisJsonSchema.name,
        schema: analysisJsonSchema.schema,
        strict: analysisJsonSchema.strict
      }
    }
  });

  return parseResponse(response);
}

function parseResponse(response: any): AnalysisResult {
  // The SDK exposes a convenience `output_text` field with the raw JSON string.
  const raw = response.output_text;
  if (!raw) {
    throw new Error('모델 응답에서 결과를 찾을 수 없습니다.');
  }
  const parsed = JSON.parse(raw);
  return AnalysisResultSchema.parse(parsed);
}
