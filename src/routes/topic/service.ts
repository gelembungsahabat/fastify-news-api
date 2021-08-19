import { TopicModel } from '../../database/models';
import { QueryString } from '../../shared/interface';
import {
  createTopicController,
  getAllController,
  getByIdController,
  removeTopicController,
  updateTopicController
} from './controller';
import { TopicBodyCreate, TopicBodyUpdate } from './interface';

export async function create(payload: TopicBodyCreate): Promise<TopicModel | null> {
  return await createTopicController(payload);
}

export async function update(id: number, payload: TopicBodyUpdate): Promise<TopicModel | null> {
  return await updateTopicController(id, payload);
}

export async function getAll(params: QueryString): Promise<TopicModel[]> {
  return await getAllController(params);
}

export async function getById(id: number): Promise<TopicModel> {
  return await getByIdController(id);
}

export async function remove(id: number): Promise<number> {
  return await removeTopicController(id);
}
