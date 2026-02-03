export type Category = {
  id: number;
  name: string;
  slug: string;
};

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export type ToolRole = {
  id: number;
  role: string;
};

export type ToolCreator = {
  id: number;
  name?: string | null;
  email?: string | null;
};

export type Tool = {
  id: number;
  name: string;
  created_by?: number | null;
  creator?: ToolCreator | null;
  video_url?: string | null;
  difficulty?: "beginner" | "intermediate" | "advanced" | null;
  resource_links?: string[] | null;
  status?: "pending" | "approved" | "rejected";
  link?: string | null;
  documentation_url?: string | null;
  documentation?: string | null;
  description?: string | null;
  how_to_use?: string | null;
  examples?: string[] | null;
  categories?: Category[];
  tags?: Tag[];
  role_assignments?: ToolRole[];
};
