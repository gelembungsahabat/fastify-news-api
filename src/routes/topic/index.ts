import { FastifyPluginAsync } from 'fastify';

import { QueryString } from '../../shared/interface';
import { TopicBodyCreate, TopicBodyUpdate } from './interface';
import {
  CreateTopicSchema,
  DeleteTopicSchema,
  GetAllTopicSchema,
  GetTopicSchema,
  UpdateTopicSchema
} from './schema';
import { create, getAll, getById, remove, update } from './service';

const topic: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get<{ Querystring: QueryString }>(
    '/',
    GetAllTopicSchema,
    async function (request, reply) {
      const query = Object.assign({}, request.query);
      const [err, topic] = await fastify.to(getAll(query));
      if (err) {
        fastify.log.error(err);
        reply.internalServerError(err.message);
      }
      return topic;
    }
  );

  fastify.get<{ Params: { id: string } }>('/:id', GetTopicSchema, async function (request, reply) {
    const id = +request.params.id;
    const [err, topic] = await fastify.to(getById(id));
    if (err) {
      fastify.log.error(err);
      reply.internalServerError(err.message);
    }
    return topic;
  });

  fastify.post<{ Body: TopicBodyCreate }>('/', CreateTopicSchema, async function (request, reply) {
    const [err, topic] = await fastify.to(create(request.body));
    if (err) {
      fastify.log.error(err);
      reply.internalServerError(err.message);
    }
    if (topic) {
      reply.send(topic);
    } else {
      reply.badRequest('topic already exist');
    }
  });

  fastify.put<{ Params: { id: string }; Body: TopicBodyUpdate }>(
    '/:id',
    UpdateTopicSchema,
    async function (request, reply) {
      const id = +request.params.id;
      const [err, topic] = await fastify.to(update(id, request.body));
      if (err) {
        fastify.log.error(err);
        reply.internalServerError(err.message);
      }
      if (topic) {
        return topic;
      } else {
        reply.badRequest('topic already exist');
      }
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    DeleteTopicSchema,
    async function (request, reply) {
      const id = +request.params.id;
      const [errGet, topic] = await fastify.to(getById(id));
      if (errGet) {
        fastify.log.error(errGet);
        reply.internalServerError(errGet.message);
      }
      if (!topic) {
        reply.badRequest('topic not found');
      }
      const [err, removed] = await fastify.to(remove(id));
      if (err) {
        fastify.log.error(err);
        reply.internalServerError(err.message);
      }
      if (removed) {
        reply.send({
          message: 'success delete topic'
        });
      } else {
        reply.badRequest('topic not found');
      }
    }
  );
};

export default topic;
