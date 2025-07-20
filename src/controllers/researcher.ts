import { db } from "../db";

import { CreateResearcher, Researcher } from "../models/researcher";

import {
  buildCreateResearcherQuery,
  buildGetResearcherByIdQuery,
} from "../queries/researcher";

interface ResearcherController {
  create: (researcher: CreateResearcher) => Promise<Researcher>;
  getById: (id: string) => Promise<Researcher | null>;
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
};