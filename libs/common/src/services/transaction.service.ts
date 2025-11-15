import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { WinstonService } from './winston/winston.service';
import { Logger } from './winston/winston.decorator';

@Injectable()
export class TransactionalService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @Logger('Transaction') private readonly logger: WinstonService,
  ) {}

  async performTransaction<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);

      // If everything succeeds, commit the transaction
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      this.logger.error(error);
      // If any error occurs, rollback the transaction
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the queryRunner
      await queryRunner.release();
    }
  }
}
