export interface Vocabulary {
  name: string;
  tags?: string[];
  issuer?: string;
  issuerURL?: string;
  documentationURL?: string;
  references: string[];
}
