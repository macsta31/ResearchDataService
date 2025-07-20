import { db } from "../db";
import { Dataset, CreateDataset } from "../models/dataset";

import {
  buildCreateDatasetQuery,
  buildGetDatasetByIdQuery,
} from "../queries/dataset";

/**
 * DatasetController handles operations related to datasets.
 * It provides methods to create a dataset and retrieve a dataset by its ID.
 */
interface IDatasetController {
  create(data: CreateDataset): Promise<string>;
  getById(id: string): Promise<Dataset | null>;
}

/**
 * DatasetController implementation
 * This controller uses the dataset queries to interact with the database.
 * It provides methods to create a dataset and retrieve a dataset by its ID.
 */
export const DatasetController: IDatasetController = {
  create: createDataset,
  getById: getDatasetById,
};

/**
 *
 * @param data - The dataset data to create.
 * @param data.display_name - The display name of the dataset.
 * @param data.tags - The tags associated with the dataset.
 * @param data.project_id - The ID of the project the dataset belongs to.
 * @param data.researcher_id - The ID of the researcher who created the dataset.
 * @returns {Promise<string>} - The ID of the created dataset.
 * @throws {Error} - If the dataset creation fails.
 */
async function createDataset(data: CreateDataset): Promise<string> {
  const { query, values } = buildCreateDatasetQuery(
    data.display_name,
    data.tags,
    data.project_id,
    data.researcher_id
  );

  const result = await db.query(query, values);
  if (result.rows.length === 0) {
    throw new Error("Failed to create dataset");
  }

  return result.rows[0].id;
}

/**
 *
 * @param id - The ID of the dataset to retrieve.
 * @returns {Dataset | null} - The dataset if found, otherwise null.
 * This function retrieves a dataset by its ID from the database.
 */
async function getDatasetById(id: string): Promise<Dataset | null> {
  const { query, values } = buildGetDatasetByIdQuery(id);
  const result = await db.query(query, values);
  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0] as Dataset;
}
