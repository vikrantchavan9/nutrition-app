import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query,
} from '@nestjs/common';
import { SavedMealsService } from './saved-meals.service';
import { CreateSavedMealDto } from './dto/create-saved-meal.dto';
import { UpdateSavedMealDto } from './dto/update-saved-meal.dto';
import { ApplySavedMealDto } from './dto/apply-saved-meal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('saved-meals')
// @UseGuards(JwtAuthGuard)  // Temporarily disabled for testing
export class SavedMealsController {
    constructor(private readonly savedMealsService: SavedMealsService) { }

    @Post()
    create(@Request() req, @Body() createDto: CreateSavedMealDto) {
        const userId = req?.user?.sub || 'demo-user';
        return this.savedMealsService.create(userId, createDto);
    }

    @Get()
    findAll(@Request() req, @Query('mealType') mealType?: string) {
        const userId = req?.user?.sub || 'demo-user';
        return this.savedMealsService.findAll(userId, mealType);
    }

    @Get(':id')
    findOne(@Request() req, @Param('id') id: string) {
        const userId = req?.user?.sub || 'demo-user';
        return this.savedMealsService.findOne(userId, id);
    }

    @Patch(':id')
    update(
        @Request() req,
        @Param('id') id: string,
        @Body() updateDto: UpdateSavedMealDto
    ) {
        const userId = req?.user?.sub || 'demo-user';
        return this.savedMealsService.update(userId, id, updateDto);
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        const userId = req?.user?.sub || 'demo-user';
        return this.savedMealsService.remove(userId, id);
    }

    @Post(':id/apply')
    apply(
        @Request() req,
        @Param('id') id: string,
        @Body() applyDto: ApplySavedMealDto
    ) {
        const userId = req?.user?.sub || 'demo-user';
        return this.savedMealsService.apply(userId, id, applyDto);
    }
}
