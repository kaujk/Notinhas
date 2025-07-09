export interface Size {
  id: string;
  name: string;
  order: number;
}

export interface ColorSizeQuantity {
  sizeId: string;
  sizeName: string;
  quantity: number;
}

export interface ColorEntry {
  color: string;
  sizeQuantities: ColorSizeQuantity[];
}

export interface Note {
  id: string;
  op: number;
  client: string;
  product: string;
  colors: ColorEntry[];
  date: string;
  isConfirmed: boolean;
  createdAt: string;
  confirmedAt?: string;
}

export type UserRole = 'soft-clean' | 'amil';

export interface User {
  role: UserRole;
  name: string;
}

export interface LoginConfig {
  requirePassword: boolean;
  password: string;
}

export interface AppSettings {
  loginConfig: {
    'soft-clean': LoginConfig;
    'amil': LoginConfig;
  };
  logo?: string; // Base64 encoded logo
}