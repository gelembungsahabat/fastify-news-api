import { Model } from 'objection';
import { TableName } from '../tablename';
import { BaseModel } from './base.model';
import { TopicModel } from './topic.model';

export class NewsModel extends BaseModel {
  title!: string;
  body!: string;
  status!: string;
  created_at!: Date;
  updated_at!: Date;

  static tableName = TableName.NEWS;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static relationMappings = (): any => ({
    topic: {
      modelClass: TopicModel,
      relation: Model.BelongsToOneRelation,
      join: {
        from: `${TableName.NEWS}.topic_id`,
        to: `${TableName.TOPIC}.id`
      }
    }
  });
}
