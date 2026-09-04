export interface Citation {
  standard_number: string;
  relevance: string;
}

export type Confidence = "high" | "medium" | "low";

export interface SearchResponse {
  answer: string;
  citations: Citation[];
  confidence: Confidence;
  limitations: string | null;
}