export interface Realisation {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  is_confidential: boolean;
  created_at: string;
}

export interface Stat {
  id: string;
  value: number;
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
  created_at: string;
}
