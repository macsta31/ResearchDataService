import { UUID } from "@mack/shared/types/uuid";

export interface Dataset {
  id: UUID;
  display_name: string;
  tags: string[] | [];
  project_id: UUID;
  researcher_id: UUID;
  created_at: Date;
  updated_at: Date;
}

export type CreateDataset = Omit<Dataset, "id" | "created_at" | "updated_at">;

export type UpdateDataset = Partial<CreateDataset> & {
  updated_at: Date;
};
