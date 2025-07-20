import { UUID } from "../types/uuid";

export interface Visit {
  id: UUID;
  participant_id: UUID | null;
  visit_number: number | 0;
  notes: string | "";
  dataset_id: UUID;
  dirty_storage_url: URL | null;
  cleaned_storage_url: URL | null;
  approx_visit_timestamp: Date | null;
  created_at: Date;
  updated_at: Date;
  researcher_id: UUID;
}

export type CreateVisit = Omit<Visit, 'id' | 'created_at' | 'updated_at'>;
