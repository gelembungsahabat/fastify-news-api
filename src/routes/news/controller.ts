import { NewsModel } from '../../database/models';
import { QueryString } from '../../shared/interface';
import { NewsBodyCreate, NewsBodyUpdate } from './interface';

export async function getNewsByTopicId(topicName: string, body: string): Promise<NewsModel> {
  const findNews = await NewsModel.query()
    .where({
      topic_name: topicName,
      body: body
    })
    .first();
  return findNews;
}

export async function getAllController(params: QueryString): Promise<NewsModel[]> {
  const query = NewsModel.query();
  if (params.topic) {
    query.where('topic_name', params.topic);
  }
  if (params.status) {
    query.where('status', params.status);
    query.orderBy('created_at');
  }
  if (!params.status && !params.topic) {
    query.where('status', 'draft');
    query.orWhere('status', 'publish');
    query.orderBy('created_at');
  }
  if (params.get_all) {
    return await query;
  } else {
    // objection page start at 0
    const page = Number(params.page) - 1 || 0;
    const newsPaged = await query.page(page, params.size || 10);
    return newsPaged.results;
  }
}

export async function getByIdController(id: number): Promise<NewsModel> {
  return await NewsModel.query().findById(id);
}

export async function createNewsController(payload: NewsBodyCreate): Promise<NewsModel | null> {
  const findNews = await getNewsByTopicId(payload.topic_name, payload.body);
  if (findNews) {
    return null;
  } else {
    return await NewsModel.query().insert(payload);
  }
}

export async function updateNewsController(
  id: number,
  payload: NewsBodyUpdate
): Promise<NewsModel | null> {
  if (payload.body) {
    const find = await getByIdController(id);
    const findNews = await getNewsByTopicId(payload.topic_name || find.topic_name, payload.body);
    if (findNews) {
      return null;
    }
  }
  return await NewsModel.query().patchAndFetchById(id, payload);
}

export async function removeNewsController(id: number): Promise<number> {
  return await NewsModel.query().where('id', id).patch({ status: 'deleted' });
}
