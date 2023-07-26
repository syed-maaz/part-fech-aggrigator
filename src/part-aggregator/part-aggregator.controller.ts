import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AggregatedPart } from './part-aggregator.modal';
import { PartAggregatorService } from './part-aggregator.service';

export class ApiResponse<T> {
  data: T | null;
  error: string | null;

  constructor(data: T | null = null, error: string | null = null) {
    this.data = data;
    this.error = error;
  }
}

@Controller('parts')
export class PartAggregatorController {
  constructor(private readonly partAggregatorService: PartAggregatorService) {}

  @Get()
  async getAggregatedPart(
    @Query('part') partNumber: string,
  ): Promise<ApiResponse<AggregatedPart>> {
    const aggregatedPart = await this.partAggregatorService.aggregatePartData(
      partNumber,
    );

    if (!aggregatedPart) {
      throw new HttpException('Part number not found', HttpStatus.NOT_FOUND);
    }

    return new ApiResponse(aggregatedPart);
  }
}
