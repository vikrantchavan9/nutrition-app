import { Module } from '@nestjs/common';
import { DayPlansService } from './day-plans.service';
import { DayPlansController } from './day-plans.controller';

@Module({
    controllers: [DayPlansController],
    providers: [DayPlansService],
    exports: [DayPlansService],
})
export class DayPlansModule { }
