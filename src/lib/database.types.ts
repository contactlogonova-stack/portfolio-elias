export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Realisation {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  stack: string[];
  live_url: string | null;
  github_url: string | null;
  is_confidential: boolean;
  created_at: string;
}

export interface Stat {
  id: string;
  value: string;
  label_fr: string;
  label_en: string;
  label_de: string;
  icon: string;
  order_index: number;
}

export interface Avis {
  id: string;
  client_name: string;
  client_role: string;
  content: string;
  rating: number;
  avatar_url?: string | null;
  created_at: string;
}

export interface PushSubscriptionData {
  id: string;
  user_id: string;
  subscription: any;
  updated_at: string;
}
