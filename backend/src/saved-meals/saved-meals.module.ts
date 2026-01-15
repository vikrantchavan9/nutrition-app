import { Module } from '@nestjs/common';
import { SavedMealsService } from './saved-meals.service';
import { SavedMealsController } from './saved-meals.controller';

@Module({
    controllers: [SavedMealsController],
    providers: [SavedMealsService],
    exports: [SavedMealsService],
})
export class SavedMealsModule { }
