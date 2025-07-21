import { UUID } from "../types/uuid";

export interface Project {
  id: UUID;
  name: string;
  tags: string[] | [];
  description: string | "";
  researcher_id: UUID;
  created_at: Date;
  updated_at: Date;
}

export type CreateProject = Omit<Project, "id" | "created_at" | "updated_at">;

export type UpdateProject = Partial<CreateProject> & {
  updated_at: Date;
};
