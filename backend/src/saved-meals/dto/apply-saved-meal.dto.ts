import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';

export class ApplySavedMealDto {
    @IsString()
    date: string; // Format: YYYY-MM-DD

    @IsEnum(['breakfast', 'lunch', 'dinner', 'snacks'])
    mealType: string;

    @IsBoolean()
    @IsOptional()
    replaceExisting?: boolean = true;
}
