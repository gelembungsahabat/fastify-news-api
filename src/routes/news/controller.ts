import { NewsModel, NewsTopicModel, TopicModel } from '../../database/models';
import { QueryString } from '../../shared/interface';
import { NewsBodyCreate, NewsBodyUpdate } from './interface';

export async function getNewsByTitle(title: string): Promise<NewsModel> {
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
  const findNews = await getNewsByTitle(payload.title); // find news that already created
  const findTopic = await TopicModel.query().whereNotNull('topic_name').orderBy('created_at');
  if (findNews) {
    return null;
  } else {
    try {
      const transactions = await NewsModel.transaction(async (trx) => {
        await NewsModel.query(trx).insert({
          title: payload.title,
          body: payload.body,
          status: payload.status
        });

        // find created topics
        const findCreatedTopics = findTopic
          .filter((topic) => payload.topics.includes(topic.topic_name))
          .map((topicName) => topicName.topic_name);

        // distinguish created topics with new topics
        const findNewTopic = payload.topics.filter((topic) => !findCreatedTopics.includes(topic));

        // create topics
        await TopicModel.query(trx).insert(
          findNewTopic.map((topic) => {
            return { topic_name: topic };
          })
        );
        const newsId = await NewsModel.query(trx).select('id').where('title', payload.title);
        const topicId = payload.topics.map((topicName) =>
          TopicModel.query(trx).select('id').where('topic_name', topicName)
        );

        // create news_topic
        await NewsTopicModel.query(trx).insert(
          topicId.map((topicId) => {
            return { topic_id: topicId, news_id: newsId[0].id };
          })
        );
      });
      transactions;
    } catch (err) {
      console.error(err);
    }
    // create news
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
    const findNews = await getNewsByTitle(payload.title);
    if (findNews) {
      return null;
    }
  }
  if (Array.isArray(payload.topics)) {
    await NewsTopicModel.query().delete().where('news_id', id);
    const topicId = await TopicModel.query().select('id').where('topic_name', payload.topics);
    await NewsTopicModel.query().insert(
      topicId.map((topicId) => {
        return {
          news_id: id,
          topic_id: topicId.id
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
