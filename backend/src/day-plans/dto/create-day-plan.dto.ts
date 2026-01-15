import { IsString, IsObject, IsOptional } from 'class-validator';

export class CreateDayPlanDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsObject()
    meals: {
        breakfast?: string; // saved_meal_id or null
        lunch?: string;
        dinner?: string;
        snacks?: string;
    };
}
