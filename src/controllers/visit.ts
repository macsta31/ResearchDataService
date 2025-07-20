import { db } from "../db";

import { CreateVisit, Visit } from "../models/visit";

import {
  buildCreateVisitQuery,
  buildGetVisitByIdQuery,
} from "../queries/visit";

interface VisitController {
  create: (visit: CreateVisit) => Promise<Visit>;
  getById: (id: string) => Promise<Visit | null>;
}

export const visitController: VisitController = {
  async create(visitData: CreateVisit) {
    const { query, values } = buildCreateVisitQuery(
      visitData.researcher_id,
      visitData.visit_number,
      visitData.notes,
      visitData.dataset_id,
      visitData.dirty_storage_url,
      visitData.cleaned_storage_url,
      visitData.approx_visit_timestamp,
      visitData.participant_id
    );
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Failed to create visit");
    }
    return result.rows[0] as Visit;
  },

  async getById(id) {
    const { query, values } = buildGetVisitByIdQuery(id);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as Visit;
  },
};
