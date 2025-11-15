import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { IPageOptions } from './page.interface';
import { OrderType, OrderTypeKeys } from './page.enum';

export class PageDto<T> {
  readonly items: T[];

  readonly page: number;

  readonly take: number;

  readonly itemCount: number;

  readonly pageCount: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor({
    items = [],
    itemCount = 0,
    pageOptionsDto,
  }: {
    items?: T[];
    itemCount?: number;
    pageOptionsDto: PageOptionsDto;
  }) {
    this.items = items;
    this.page = Number(pageOptionsDto.page);
    this.take = Number(pageOptionsDto.take);
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}

export class PageOptionsDto implements IPageOptions {
  @ApiPropertyOptional({ enum: OrderType, default: OrderType.DESC })
  @IsEnum(OrderType)
  @IsOptional()
  readonly order?: keyof typeof OrderType = OrderType.DESC;

  @ApiPropertyOptional({
    default: 'createdAt',
  })
  @IsOptional()
  readonly orderBy?: string = 'createdAt';

  @ApiPropertyOptional({
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  readonly page?: number = 1;

  @ApiPropertyOptional({
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  readonly take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take || 0;
  }
}

export class PageOptionsOmitOrderDto extends OmitType(PageOptionsDto, [
  'orderBy',
  'order',
] as const) {
  get skip(): number {
    return (this.page - 1) * this.take || 0;
  }
}
