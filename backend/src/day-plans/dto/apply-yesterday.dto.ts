import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class ApplyYesterdayDto {
    @IsString()
    targetDate: string; // Format: YYYY-MM-DD

    @IsBoolean()
    @IsOptional()
    replaceExisting?: boolean = true;
}
