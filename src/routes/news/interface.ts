import { ModelObject } from 'objection';

import { NewsModel } from '../../database/models/news.model';

export type NewsEntity = ModelObject<NewsModel>;

export type NewsBodyCreate = Pick<NewsEntity, 'title' | 'body' | 'status'> & { topics: string[] };

export type NewsBodyUpdate = Partial<NewsBodyCreate>;
