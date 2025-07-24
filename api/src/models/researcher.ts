import { UUID } from '@mack/shared/types/uuid';

export interface Researcher {
  id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  lab_name: string;
  school_name: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateResearcher = Omit<Researcher, 'id' | 'created_at' | 'updated_at'>;

export type UpdateResearcher = Partial<CreateResearcher> & {
  updated_at: Date;
};

