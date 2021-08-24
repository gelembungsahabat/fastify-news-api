import { RouteShorthandOptions } from 'fastify';
import S from 'fluent-json-schema';

import { QueryStringSchema } from '../../shared/schema';

// const tags = ['news'];

const NewsSchema = S.object()
  .prop('title', S.string().required())
  .prop('body', S.string().required())
  .prop('status', S.string().required());

const NewsSchemaUpdate = S.object()
  .prop('title', S.string())
  .prop('body', S.string())
  .prop('status', S.string());

const NewsSchemaWithId = NewsSchema.prop('id', S.number().required());

export const GetAllNewsSchema: RouteShorthandOptions = {
  schema: {
    querystring: QueryStringSchema,
    response: {
      200: S.array().items(NewsSchemaWithId)
    }
  }
};

export const GetNewsSchema: RouteShorthandOptions = {
  schema: {
    params: S.object().prop('id', S.number()),
    response: {
      200: NewsSchemaWithId
    }
  }
};

export const CreateNewsSchema: RouteShorthandOptions = {
  schema: {
    body: NewsSchema,
    response: {
      200: NewsSchemaWithId
    }
  }
};

export const UpdateNewsSchema: RouteShorthandOptions = {
  schema: {
    body: NewsSchemaUpdate,
    response: {
      200: NewsSchemaWithId
    }
  }
};

export const DeleteNewsSchema: RouteShorthandOptions = {
  schema: {
    params: S.object().prop('id', S.number()),
    response: {
      200: S.object().prop('message', S.string().required())
    }
  }
};
