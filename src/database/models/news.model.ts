import { Model } from 'objection';

import { TableName } from '../tablename';
import { BaseModel } from './base.model';
import { TopicModel } from './topic.model';

export class NewsModel extends BaseModel {
  title!: string;
  body!: string;
  status!: 'draft' | 'publish' | 'deleted';
  created_at!: Date;
  updated_at!: Date;

  topic!: TopicModel;

  static tableName = TableName.NEWS;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static relationMappings = (): any => ({
    topic: {
      modelClass: TopicModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: `${TableName.NEWS}.id`,
        through: {
          from: `${TableName.NEWS_TOPIC}.news_id`,
          to: `${TableName.NEWS_TOPIC}.topic_id`
        },
        to: `${TableName.TOPIC}.id`
      }
    }
  });
}
