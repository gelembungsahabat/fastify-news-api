import { NewsModel, NewsTopicModel, TopicModel } from '../../database/models';
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

export async function getAllController(params: QueryString): Promise<NewsModel[] | TopicModel[]> {
  const query = NewsModel.query();
  const topicQuery = TopicModel.query();
  if (params.topic) {
    topicQuery.where('topic_name', params.topic).withGraphFetched('news');
  }
  if (params.status) {
    query.where('status', params.status);
    if (params.status !== 'deleted') {
      query.orderBy('created_at').withGraphFetched('topic').whereNot('status', 'deleted');
    }
  }
  if (!params.status && !params.topic) {
    query.where('status', 'draft');
    query.orWhere('status', 'publish');
    query.orderBy('created_at').withGraphFetched('topic').whereNot('status', 'deleted');
  }
  if (params.get_all) {
    return await query;
  } else {
    // objection page start at 0
    const page = Number(params.page) - 1 || 0;
    const newsPaged = params.topic
      ? await topicQuery.page(page, params.size || 10)
      : await query.page(page, params.size || 10);
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
): Promise<NewsModel | NewsTopicModel[] | null> {
  if (payload.title) {
    const findNews = await getNewsByTopicId(payload.title);
    if (findNews) {
      return null;
    }
  }
  if (Array.isArray(payload.topic_id)) {
    await NewsTopicModel.query().delete().where('news_id', id);
    await NewsTopicModel.query().insert(
      payload.topic_id.map((topicId) => {
        return {
          news_id: id,
          topic_id: topicId
        };
      })
    );
  }
  return await NewsModel.query().patchAndFetchById(id, {
    updated_at: new Date(),
    title: payload.title,
    body: payload.body,
    status: payload.status
  });
}

export async function removeNewsController(id: number): Promise<number> {
  return await NewsModel.query().where('id', id).patch({ status: 'deleted' });
}
