import { FastifyPluginAsync } from 'fastify';

import { QueryString } from '../../shared/interface';
import { NewsBodyCreate, NewsBodyUpdate } from './interface';
import {
  CreateNewsSchema,
  DeleteNewsSchema,
  GetAllNewsSchema,
  GetNewsSchema,
  UpdateNewsSchema
} from './schema';
import { create, getAll, getById, remove, update } from './service';

const news: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get<{ Querystring: QueryString }>('/', GetAllNewsSchema, async function (request, reply) {
    const query = Object.assign({}, request.query);
    const [err, news] = await fastify.to(getAll(query));
    if (err) {
      fastify.log.error(err);
      reply.internalServerError(err.message);
    }
    return news;
  });

  fastify.get<{ Params: { id: string } }>('/:id', GetNewsSchema, async function (request, reply) {
    const id = +request.params.id;
    const [err, news] = await fastify.to(getById(id));
    if (err) {
      fastify.log.error(err);
    }
    return news;
  });

  fastify.post<{ Body: NewsBodyCreate }>('/', CreateNewsSchema, async function (request, reply) {
    const [err, news] = await fastify.to(create(request.body));
    if (err) {
      fastify.log.error(err);
      reply.internalServerError(err.message);
    }
    if (news) {
      reply.send(news);
    } else {
      reply.badRequest('news already exist');
    }
  });

  fastify.put<{ Params: { id: string }; Body: NewsBodyUpdate }>(
    '/:id',
    UpdateNewsSchema,
    async function (request, reply) {
      const id = +request.params.id;
      const [err, news] = await fastify.to(update(id, request.body));
      if (err) {
        fastify.log.error(err);
        reply.internalServerError(err.message);
      }
      if (news) {
        return news;
      } else {
        reply.badRequest('news already exist');
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    DeleteNewsSchema,
    async function (request, reply) {
      const id = +request.params.id;
      const [errGet, news] = await fastify.to(getById(id));
      if (errGet) {
        fastify.log.error(errGet);
        reply.internalServerError(errGet.message);
      }
      if (!news) {
        reply.badRequest('news not found');
      }
      const [err, removed] = await fastify.to(remove(id));
      if (err) {
        fastify.log.error(err);
        reply.internalServerError(err.message);
      }
      if (removed) {
        reply.send({
          message: 'success delete news'
        });
      } else {
        reply.badRequest('news not found');
      }
    }
  );
};

export default news;
