import { Model } from 'objection';

import { TableName } from '../tablename';
import { BaseModel } from './base.model';
// import { TopicModel } from './topic.model';

export class TopicModel extends BaseModel {
  topic_name!: string;
  created_at!: Date;
  updated_at!: Date;

  static tableName = TableName.TOPIC;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static relationMappings = (): any => ({
    topic: {
      modelClass: TopicModel,
      relation: Model.ManyToManyRelation,
      join: {
        from: `${TableName.TOPIC}.id`,
        through: {
          from: `${TableName.NEWS_TOPIC}.topic_id`,
          to: `${TableName.NEWS_TOPIC}.news_id`
        },
        to: `${TableName.NEWS}.id`
      }
    }
  });
}
