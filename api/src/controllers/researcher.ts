import { db } from "../db";

import {
  CreateResearcher,
  Researcher,
  UpdateResearcher,
} from "../models/researcher";

import {
  buildCreateResearcherQuery,
  buildGetResearcherByIdQuery,
  buildGetResearchers,
  buildUpdateResearcherQuery,
} from "../queries/researcher";

interface ResearcherController {
  create: (researcher: CreateResearcher) => Promise<Researcher>;
  getById: (id: string) => Promise<Researcher | null>;
  get: () => Promise<Researcher[]>;
  update: (id: string, data: UpdateResearcher) => Promise<Researcher>;
}

export const researcherController: ResearcherController = {
  async create(researcherData: CreateResearcher) {
    const { query, values } = buildCreateResearcherQuery(
      researcherData.first_name,
      researcherData.last_name,
      researcherData.email,
      researcherData.lab_name,
      researcherData.school_name
    );
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Failed to create researcher");
    }
    return result.rows[0] as Researcher;
  },

  async getById(id) {
    const { query, values } = buildGetResearcherByIdQuery(id);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0] as Researcher;
  },

  async get() {
    const { query, values } = buildGetResearchers();
    const result = await db.query(query, values);
    return result.rows as Researcher[];
  },

  async update(id, data) {
    if (!id) {
      throw new Error("ID is required for updating a researcher");
    }
    const updated_at = new Date();
    const { query, values } = buildUpdateResearcherQuery(id, {
      ...data,
      updated_at,
    } as UpdateResearcher);
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new Error("Failed to update researcher");
    }
    return result.rows[0] as Researcher;
  },
};
