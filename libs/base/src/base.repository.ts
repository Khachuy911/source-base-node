import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { IPageOptions } from './paging/page.interface';
import { IFilter, IOtherOptions } from './filter/filter.interface';

export class BaseRepository<T> extends Repository<T> {
  private entity: EntityTarget<T>;

  constructor(target: EntityTarget<T>, manager: EntityManager) {
    super(target, manager);
    this.entity = target;
  }

  async getOneById(id: string) {
    return this.manager.findOneBy(this.entity, {
      id: id as any,
    } as FindOptionsWhere<T>);
  }

  async getManyAndCount({
    filters = {},
    pageOptions = {},
    otherOptions = {},
  }: {
    filters?: IFilter<T>;
    pageOptions?: IPageOptions;
    otherOptions?: IOtherOptions;
  }) {
    const { skip, take, order = 'DESC', orderBy = 'createdAt' } = pageOptions;
    const { relations, selects } = otherOptions;
    const params: FindManyOptions<T> = {
      where: filters as FindOptionsWhere<T>,
      order: { [orderBy]: order } as FindOptionsOrder<T>,
    };

    if (skip) {
      params.skip = skip;
    }

    if (take) {
      params.take = take;
    }

    if (relations?.length) {
      params.relations = Object.fromEntries(
        relations.map((relation) => [relation, true]),
      ) as FindOptionsRelations<T>;
    }

    if (selects?.length) {
      params.select = Object.fromEntries(
        selects.map((select) => [select, true]),
      ) as FindOptionsSelect<T>;
    }
    return this.manager.findAndCount(this.entity, params);
  }

  async getMany({
    filters = {},
    pageOptions = {},
    otherOptions = {},
  }: {
    filters?: IFilter<T>;
    pageOptions?: IPageOptions;
    otherOptions?: IOtherOptions;
  }) {
    const { skip, take, order = 'DESC', orderBy = 'createdAt' } = pageOptions;
    const { relations, selects } = otherOptions;
    const params: FindManyOptions<T> = {
      where: filters as FindOptionsWhere<T>,
      order: { [orderBy]: order } as FindOptionsOrder<T>,
    };

    if (skip) {
      params.skip = skip;
    }

    if (take) {
      params.take = take;
    }

    if (relations?.length) {
      params.relations = Object.fromEntries(
        relations.map((relation) => [relation, true]),
      ) as FindOptionsRelations<T>;
    }

    if (selects?.length) {
      params.select = Object.fromEntries(
        selects.map((select) => [select, true]),
      ) as FindOptionsSelect<T>;
    }

    return this.manager.find(this.entity, params);
  }

  async getAll({
    pageOptions = {},
    otherOptions = {},
  }: {
    filters?: IFilter<T>;
    pageOptions?: IPageOptions;
    otherOptions?: IOtherOptions;
  } = {}) {
    const { order = 'DESC', orderBy = 'createdAt' } = pageOptions;

    const { relations, selects } = otherOptions;

    const params: FindManyOptions<T> = {
      order: { [orderBy]: order } as FindOptionsOrder<T>,
    };

    if (relations?.length) {
      params.relations = Object.fromEntries(
        relations.map((relation) => [relation, true]),
      ) as FindOptionsRelations<T>;
    }

    if (selects?.length) {
      params.select = Object.fromEntries(
        selects.map((select) => [select, true]),
      ) as FindOptionsSelect<T>;
    }

    return this.manager.find(this.entity, params);
  }

  getOne({
    filters = {},
    otherOptions = {},
  }: {
    filters?: IFilter<T>;
    otherOptions?: IOtherOptions;
  }) {
    const { relations, selects } = otherOptions;

    const params: FindOneOptions<T> = {
      where: filters as FindOptionsWhere<T>,
    };

    if (relations?.length) {
      params.relations = Object.fromEntries(
        relations.map((relation) => [relation, true]),
      ) as FindOptionsRelations<T>;
    }

    if (selects?.length) {
      params.select = Object.fromEntries(
        selects.map((select) => [select, true]),
      ) as FindOptionsSelect<T>;
    }

    return this.manager.findOne(this.entity, params);
  }

  async getRepository() {
    return this.manager.getRepository(this.entity);
  }
}
