import { RouteShorthandOptions } from 'fastify';
import S from 'fluent-json-schema';

import { QueryStringSchema } from '../../shared/schema';

// const tags = ['Topic'];

const TopicSchema = S.object().prop('topic_name', S.string().required());

const TopicSchemaUpdate = S.object().prop('topic_name', S.string());

const TopicSchemaWithId = TopicSchema.prop('id', S.number().required());

export const GetAllTopicSchema: RouteShorthandOptions = {
  schema: {
    querystring: QueryStringSchema,
    response: {
      200: S.array().items(TopicSchemaWithId)
    }
  }
};

export const GetTopicSchema: RouteShorthandOptions = {
  schema: {
    params: S.object().prop('id', S.number()),
    response: {
      200: TopicSchemaWithId
    }
  }
};

export const CreateTopicSchema: RouteShorthandOptions = {
  schema: {
    body: TopicSchema,
    response: {
      200: TopicSchemaWithId
    }
  }
};

export const UpdateTopicSchema: RouteShorthandOptions = {
  schema: {
    body: TopicSchemaUpdate,
    response: {
      200: TopicSchemaWithId
    }
  }
};

export const DeleteTopicSchema: RouteShorthandOptions = {
  schema: {
    params: S.object().prop('id', S.number()),
    response: {
      200: S.object().prop('message', S.string().required())
    }
  }
};
