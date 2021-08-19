import { Model } from 'objection';

import { TableName } from '../tablename';
import { BaseModel } from './base.model';
// import { TopicModel } from './topic.model';

export class TopicModel extends BaseModel {
  title!: string;
  body!: string;
  status!: string;
  created_at!: Date;
  updated_at!: Date;

  static tableName = TableName.TOPIC;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static relationMappings = (): any => ({
    topic: {
      modelClass: TopicModel,
      relation: Model.HasManyRelation,
      join: {
        from: `${TableName.TOPIC}.id`,
        to: `${TableName.NEWS}.topic_id`
      }
    }
  });
}
