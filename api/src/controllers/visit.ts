import { db } from "@mack/shared/db/db";

import { CreateVisit, UpdateVisit, Visit } from "../models/visit";

import {
  buildCreateVisitQuery,
  buildGetVisitByIdQuery,
  buildGetVisits,
  buildGetVisitsByResearcherIdQuery,
  buildUpdateVisitQuery,
} from "../queries/visit";

interface VisitController {
  create: (visit: CreateVisit) => Promise<Visit>;
  getById: (id: string) => Promise<Visit | null>;
  get: () => Promise<Visit[]>;
  update: (id: string, data: UpdateVisit) => Promise<Visit>;
  getByResearcherId: (researcherId: string) => Promise<Visit[]>;
}

export const visitController: VisitController = {
  async create(visitData: CreateVisit) {
    const { query, values } = buildCreateVisitQuery(
      visitData.researcher_id,
      visitData.visit_number,
      visitData.notes,
      visitData.dataset_id,
      visitData.dirty_storage_url,
      visitData.temp_storage_url,
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

  async update(id, data) {
    if (!id) {
      throw new Error("ID is required for updating a visit");
    }

    const updated_at = new Date();
    const { query, values } = buildUpdateVisitQuery(id, {
      ...data,
      updated_at,
    } as UpdateVisit);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Failed to update visit");
    }
    return result.rows[0] as Visit;
  },

  async get() {
    const { query, values } = buildGetVisits();
    const result = await db.query(query, values);
    return result.rows as Visit[];
  },

  async getByResearcherId(researcherId) {
    const { query, values } = buildGetVisitsByResearcherIdQuery(researcherId);
    const result = await db.query(query, values);
    return result.rows as Visit[];
  },
};
