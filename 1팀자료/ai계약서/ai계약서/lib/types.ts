import { z } from 'zod';

export const SeverityEnum = z.enum(['high', 'medium', 'low']);
export type Severity = z.infer<typeof SeverityEnum>;

export const RiskLevelEnum = z.enum(['high', 'medium', 'low']);
export type RiskLevel = z.infer<typeof RiskLevelEnum>;

export const PartySchema = z.object({
  name: z.string(),
  role: z.string()
});

export const KeyTermsSchema = z.object({
  effective_date: z.string().nullable(),
  end_date: z.string().nullable(),
  payment_amount: z.string().nullable(),
  payment_schedule: z.string().nullable(),
  auto_renewal: z.string().nullable(),
  termination: z.string().nullable(),
  governing_law: z.string().nullable()
});

export const RiskItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  severity: SeverityEnum,
  clause_reference: z.string().nullable(),
  quote: z.string(),
  explanation: z.string(),
  why_it_matters: z.string(),
  suggested_question: z.string()
});

export type RiskItem = z.infer<typeof RiskItemSchema>;

export const AnalysisResultSchema = z.object({
  is_contract: z.boolean(),
  contract_confidence: z.number().min(0).max(100),
  contract_type: z.string(),
  jurisdiction_detected: z.string().nullable(),
  summary: z.string(),
  parties: z.array(PartySchema),
  key_terms: KeyTermsSchema,
  risk_score: z.number().min(0).max(100),
  risk_level: RiskLevelEnum,
  risks: z.array(RiskItemSchema),
  missing_or_unclear_items: z.array(z.string()),
  disclaimer: z.string()
});

export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export interface AnalysisRecord {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'docx';
  createdAt: string;
  result: AnalysisResult;
  isDemo?: boolean;
}

// JSON Schema passed to OpenAI Structured Outputs (Responses API).
// Keep in sync with AnalysisResultSchema above.
export const analysisJsonSchema = {
  name: 'contract_analysis',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      is_contract: { type: 'boolean' },
      contract_confidence: { type: 'number' },
      contract_type: { type: 'string' },
      jurisdiction_detected: { type: ['string', 'null'] },
      summary: { type: 'string' },
      parties: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            role: { type: 'string' }
          },
          required: ['name', 'role']
        }
      },
      key_terms: {
        type: 'object',
        additionalProperties: false,
        properties: {
          effective_date: { type: ['string', 'null'] },
          end_date: { type: ['string', 'null'] },
          payment_amount: { type: ['string', 'null'] },
          payment_schedule: { type: ['string', 'null'] },
          auto_renewal: { type: ['string', 'null'] },
          termination: { type: ['string', 'null'] },
          governing_law: { type: ['string', 'null'] }
        },
        required: [
          'effective_date',
          'end_date',
          'payment_amount',
          'payment_schedule',
          'auto_renewal',
          'termination',
          'governing_law'
        ]
      },
      risk_score: { type: 'number' },
      risk_level: { type: 'string', enum: ['high', 'medium', 'low'] },
      risks: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            severity: { type: 'string', enum: ['high', 'medium', 'low'] },
            clause_reference: { type: ['string', 'null'] },
            quote: { type: 'string' },
            explanation: { type: 'string' },
            why_it_matters: { type: 'string' },
            suggested_question: { type: 'string' }
          },
          required: [
            'id',
            'title',
            'severity',
            'clause_reference',
            'quote',
            'explanation',
            'why_it_matters',
            'suggested_question'
          ]
        }
      },
      missing_or_unclear_items: { type: 'array', items: { type: 'string' } },
      disclaimer: { type: 'string' }
    },
    required: [
      'is_contract',
      'contract_confidence',
      'contract_type',
      'jurisdiction_detected',
      'summary',
      'parties',
      'key_terms',
      'risk_score',
      'risk_level',
      'risks',
      'missing_or_unclear_items',
      'disclaimer'
    ]
  }
} as const;
