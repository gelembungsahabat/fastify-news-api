import S from 'fluent-json-schema';

export const QueryStringSchema = S.object()
  .prop('get_all', S.boolean())
  .prop('size', S.number())
  .prop('page', S.number())
  .prop('status', S.string());
