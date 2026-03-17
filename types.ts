export interface Measurement {
  bust?: number;
  waist?: number;
  hip?: number;
  shoulder?: number;
  armLength?: number;
  totalLength?: number;
  neck?: number;
  backWidth?: number;
}

export interface ClientMember {
  id: string;
  name: string;
  measurements: Measurement;
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  notes?: string;
  measurements: Measurement;
  members?: ClientMember[];
  photos: string[];
  createdAt: string;
}

export type OrderStatus = 'corte' | 'costura' | 'ajuste' | 'finalizado' | 'entregue';

export interface OrderHistory {
  status: OrderStatus;
  date: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  memberId?: string;
  patternId?: string; // Link to a product/pattern
  customPatternName?: string;
  deliveryDate: string;
  value: number;
  status: OrderStatus;
  history?: OrderHistory[];
  notes?: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  photoUrl: string;
  clientId?: string;
  patternId?: string;
  description?: string;
  createdAt: string;
}

export interface FinancialRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface UserStats {
  completedLessons: string[]; // Array of lesson IDs
  totalSales: number;
  monthlySales: SaleData[];
  financialRecords: FinancialRecord[];
  clients: Client[];
  orders: Order[];
  portfolio: PortfolioItem[];
  goals: {
    monthly: number;
    current: number;
  };
}

export interface SaleData {
  month: string;
  amount: number;
}

export interface User {
  cpf: string; // Used as ID and Username
  name: string;
  active: boolean;
  plan?: 'basic' | 'diamond';
  stats?: UserStats;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: string; // e.g., "15:30"
  videoEmbedId?: string; // Google Drive File ID
  videoUrl?: string; // Link direto MP4
  youtubeId?: string; // ID do vídeo do YouTube (Novo)
  materialLink?: string; // External link for PDF/Resource
  locked?: boolean;
}

export interface Module {
  id: string;
  title: string;
  label?: string; // Optional custom label (e.g. "Bônus", "Exclusivo") instead of "Módulo X"
  description?: string;
  lessons: Lesson[];
}

export interface AppConfig {
  platformName: string;
  supportEmail: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  suggestedPrice?: number;
  unit?: string; // Optional unit (e.g., "/peça", "/kit")
  image: string;
  category: string;
  features: string[];
}