// part-aggregator/part-aggregator.module.ts

import { Module } from '@nestjs/common';
import { PartAggregatorController } from './part-aggregator.controller';
import { PartAggregatorService } from './part-aggregator.service';
import { AggregatedPart } from './part-aggregator.modal';

@Module({
  controllers: [PartAggregatorController],
  providers: [PartAggregatorService, AggregatedPart],
})
export class PartAggregatorModule {}
