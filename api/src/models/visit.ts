import { UUID } from "../types/uuid";

export interface Visit {
  id: UUID;
  participant_id: string | null;
  visit_number: number | 1;
  notes: string | "";
  dataset_id: UUID;
  dirty_storage_url: URL | null;
  temp_storage_url: URL | null;
  cleaned_storage_url: URL | null;
  approx_visit_timestamp: Date | null;
  created_at: Date;
  updated_at: Date;
  researcher_id: UUID;
}

export type CreateVisit = Omit<Visit, 'id' | 'created_at' | 'updated_at'>;

export type UpdateVisit = Partial<CreateVisit> & {
  updated_at: Date;
};
