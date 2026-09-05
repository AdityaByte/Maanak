export interface Citation {
  standard_number: string;
  relevance: string;
}

export type Confidence = "high" | "medium" | "low" | string;

export interface ChatRequest {
  message: string;
  session_id?: string | null;
}

export interface ChatResponse {
  session_id: string;
  answer: string;
  citations: Citation[];
  confidence: Confidence;
  limitations: string | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: Confidence;
  limitations?: string | null;
  timestamp: number;
  isError?: boolean;
}
