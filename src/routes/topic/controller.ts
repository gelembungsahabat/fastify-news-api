import { TopicModel } from '../../database/models';
import { QueryString } from '../../shared/interface';
import { TopicBodyCreate, TopicBodyUpdate } from './interface';

export async function getTopicName(topicName: string): Promise<TopicModel> {
  return await TopicModel.query().where('topic_name', topicName).first();
}

export async function getAllController(params: QueryString): Promise<TopicModel[]> {
  const query = TopicModel.query();

  query.where('status', 'publish');
  query.orderBy('created_at');

  if (params.get_all) {
    return await query;
  } else {
    // objection page start at 0
    const page = Number(params.page) - 1 || 0;
    const topicPaged = await query.page(page, params.size || 10);
    return topicPaged.results;
  }
}

export async function getByIdController(id: number): Promise<TopicModel> {
  return await TopicModel.query().findById(id);
}

export async function createTopicController(payload: TopicBodyCreate): Promise<TopicModel | null> {
  const findTopic = await getTopicName(payload.topic_name);
  if (findTopic) {
    return null;
  } else {
    return await TopicModel.query().insert(payload);
  }
}

export async function updateTopicController(
  id: number,
  payload: TopicBodyUpdate
): Promise<TopicModel | null> {
  if (payload.topic_name) {
    const findTopic = await getTopicName(payload.topic_name);
    if (findTopic) {
      return null;
    }
  }
  return await TopicModel.query().patchAndFetchById(id, payload);
}

export async function removeTopicController(id: number): Promise<number> {
  const update = await TopicModel.query().deleteById(id);

  return update;
}
