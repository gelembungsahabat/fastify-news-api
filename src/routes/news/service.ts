import { NewsModel, NewsTopicModel } from '../../database/models';
import { QueryString } from '../../shared/interface';
import {
  createNewsController,
  getAllController,
  getByIdController,
  removeNewsController,
  updateNewsController
} from './controller';
import { NewsBodyCreate, NewsBodyUpdate } from './interface';

export async function create(
  payload: NewsBodyCreate
): Promise<NewsModel | NewsTopicModel[] | null> {
  return await createNewsController(payload);
}

export async function update(id: number, payload: NewsBodyUpdate): Promise<NewsModel | null> {
  return await updateNewsController(id, payload);
}

export async function getAll(params: QueryString): Promise<NewsModel[]> {
  return await getAllController(params);
}

export async function getById(id: number): Promise<NewsModel> {
  return await getByIdController(id);
}

export async function remove(id: number): Promise<number> {
  return await removeNewsController(id);
}
