import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { SavedMealsModule } from './saved-meals/saved-meals.module';
import { DayPlansModule } from './day-plans/day-plans.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, SavedMealsModule, DayPlansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
