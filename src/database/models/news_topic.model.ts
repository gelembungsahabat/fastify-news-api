import { Model } from 'objection';

import { TableName } from '../tablename';
import { BaseModel } from './base.model';
import { NewsModel } from './news.model';
import { TopicModel } from './topic.model';
export class NewsTopicModel extends BaseModel {
  topic_id!: number;
  news_id!: number;

  topic!: TopicModel;
  news!: NewsModel;
  static tableName = TableName.NEWS_TOPIC;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static relationMappings = (): any => ({
    topic: {
      modelClass: TopicModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: `${TableName.NEWS_TOPIC}.topic_id`,
        to: `${TableName.TOPIC}.id`
      }
    },
    news: {
      modelClass: NewsModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: `${TableName.NEWS_TOPIC}.news_id`,
        to: `${TableName.NEWS}.id`
      }
    }
  });
}
