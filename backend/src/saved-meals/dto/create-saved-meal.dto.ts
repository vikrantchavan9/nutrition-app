import { IsString, IsEnum, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SavedMealItemDto {
    @IsString()
    foodName: string;

    @IsNumber()
    calories: number;

    @IsNumber()
    protein: number;

    @IsNumber()
    carbs: number;

    @IsNumber()
    fats: number;

    @IsString()
    @IsOptional()
    portion?: string;

    @IsEnum(['exact', 'estimated', 'rough'])
    @IsOptional()
    confidenceLevel?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    qualityTags?: string[];

    @IsString()
    @IsOptional()
    emoji?: string;
}

export class CreateSavedMealDto {
    @IsString()
    name: string;

    @IsEnum(['breakfast', 'lunch', 'dinner', 'snacks'])
    mealType: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SavedMealItemDto)
    items: SavedMealItemDto[];
}
