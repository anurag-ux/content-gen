export type ContentType = 'Article' | 'Guide' | 'Opinion' | 'Trend Analysis';

export type ToneType = 'Professional' | 'Casual' | 'Inspirational';
export type ImageStyleType = 'Photographic' | 'Minimalist' | '3D Render';

export interface GenerateRequest {
  topic: string;
  contentType: ContentType;
  tone: ToneType;
  imageStyle: ImageStyleType;
}

export interface GenerationMetrics {
  promptTokens: number;
  outputTokens: number;
  totalTokens: number;
  textCostINR: number;
  imageCostINR: number;
  totalCostINR: number;
}

export interface GenerateResponse {
  text: string;
  imageUrl?: string;
  metrics?: GenerationMetrics;
}

export interface SavedArticle {
  id: string;
  topic: string;
  contentType: ContentType;
  tone: ToneType;
  imageStyle: ImageStyleType;
  text: string;
  imageUrl?: string;
  savedAt: string;
  generationTime?: number;
  metrics?: GenerationMetrics;
}
