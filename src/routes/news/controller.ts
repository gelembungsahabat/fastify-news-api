import { NewsModel, NewsTopicModel } from '../../database/models';
import { QueryString } from '../../shared/interface';
import { NewsBodyCreate, NewsBodyUpdate } from './interface';

export async function getNewsByTopicId(title: string): Promise<NewsModel> {
  const findNews = await NewsModel.query()
    .where({
      title: title
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
    query.orderBy('created_at').withGraphFetched('topic');
  }
  if (!params.status && !params.topic) {
    query.where('status', 'draft');
    query.orWhere('status', 'publish');
    query.orderBy('created_at').withGraphFetched('topic');
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
  return await NewsModel.query().findById(id).withGraphFetched('topic');
}

export async function createNewsController(
  payload: NewsBodyCreate
): Promise<NewsModel | NewsTopicModel[] | null> {
  const findNews = await getNewsByTopicId(payload.title);
  if (findNews) {
    return null;
  } else {
    await NewsModel.query().insert({
      title: payload.title,
      body: payload.body,
      status: payload.status
    });
    const newsId = await NewsModel.query().select('id').where('title', payload.title);
    await NewsTopicModel.query().insert(
      payload.topic_id.map((topicId) => {
        return { topic_id: topicId, news_id: newsId[0].id };
      })
    );
    const response = await NewsModel.query().where({
      title: payload.title,
      body: payload.body,
      status: payload.status
    });
    return await response[0];
  }
}

export async function updateNewsController(
  id: number,
  payload: NewsBodyUpdate
): Promise<NewsModel | null> {
  if (payload.body) {
    // const find = await getByIdController(id);
    const findNews = await getNewsByTopicId(payload.body);
    if (findNews) {
      return null;
    }
  }
  return await NewsModel.query().patchAndFetchById(id, { updated_at: new Date(), ...payload });
}

export async function removeNewsController(id: number): Promise<number> {
  return await NewsModel.query().where('id', id).patch({ status: 'deleted' });
}
