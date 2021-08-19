import { ModelObject } from 'objection';

import { TopicModel } from '../../database/models/topic.model';

export type TopicEntity = ModelObject<TopicModel>;

export type TopicBodyCreate = Pick<TopicEntity, 'topic_name'>;

export type TopicBodyUpdate = Partial<TopicBodyCreate>;
