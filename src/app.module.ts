import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PartAggregatorController } from './part-aggregator/part-aggregator.controller';
import { PartAggregatorService } from './part-aggregator/part-aggregator.service';
import { PartAggregatorModule } from './part-aggregator/part-aggregator.module';

@Module({
  imports: [PartAggregatorModule],
  controllers: [AppController, PartAggregatorController],
  providers: [AppService, PartAggregatorService],
})
export class AppModule {}
