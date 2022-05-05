export interface SettingsModel {
  Port: number;
  ApiAuthOptions: {
    Authority: string;
    JwksCerts: string;
    TokenUrl: string;
    Audience: string;
    ClientId: string;
    Scopes: string[];
  };
  ExternalCatalogs: string[];
  ExternalModels: string[];
}
