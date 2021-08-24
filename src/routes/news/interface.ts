import { ModelObject } from 'objection';

import { NewsModel } from '../../database/models/news.model';

export type NewsEntity = ModelObject<NewsModel>;

export type NewsBodyCreate = Pick<NewsEntity, 'title' | 'body' | 'status'> & { topic_id: number[] };

export type NewsBodyUpdate = Partial<NewsBodyCreate>;
