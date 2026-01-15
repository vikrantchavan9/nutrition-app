import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavedMealDto } from './dto/create-saved-meal.dto';
import { UpdateSavedMealDto } from './dto/update-saved-meal.dto';
import { ApplySavedMealDto } from './dto/apply-saved-meal.dto';

export interface SavedMealItem {
    id: string;
    saved_meal_id: string;
    food_name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    portion?: string;
    confidence_level?: string;
    quality_tags?: string[];
    emoji?: string;
    sort_order: number;
    created_at: string;
}

export interface SavedMeal {
    id: string;
    user_id: string;
    name: string;
    meal_type: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fats: number;
    created_at: string;
    updated_at: string;
}

@Injectable()
export class SavedMealsService {
    // In-memory storage (mock database)
    private savedMeals: SavedMeal[] = [
        {
            id: '1',
            user_id: 'demo-user',
            name: 'Protein Breakfast',
            meal_type: 'breakfast',
            total_calories: 520,
            total_protein: 35,
            total_carbs: 45,
            total_fats: 12,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
        {
            id: '2',
            user_id: 'demo-user',
            name: 'Light Lunch',
            meal_type: 'lunch',
            total_calories: 450,
            total_protein: 28,
            total_carbs: 52,
            total_fats: 10,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    private savedMealItems: SavedMealItem[] = [
        {
            id: '1',
            saved_meal_id: '1',
            food_name: '2 Eggs',
            calories: 140,
            protein: 12,
            carbs: 1,
            fats: 10,
            portion: '2 eggs',
            confidence_level: 'exact',
            quality_tags: ['High Protein'],
            emoji: '🥚',
            sort_order: 0,
            created_at: new Date().toISOString(),
        },
        {
            id: '2',
            saved_meal_id: '1',
            food_name: 'Oats Bowl',
            calories: 150,
            protein: 6,
            carbs: 27,
            fats: 3,
            portion: '1 bowl',
            confidence_level: 'exact',
            quality_tags: ['High Fiber', 'Balanced'],
            emoji: '🥣',
            sort_order: 1,
            created_at: new Date().toISOString(),
        },
        {
            id: '3',
            saved_meal_id: '1',
            food_name: 'Protein Shake',
            calories: 230,
            protein: 17,
            carbs: 17,
            fats: 2,
            portion: '1 scoop',
            confidence_level: 'exact',
            quality_tags: ['High Protein'],
            emoji: '🥤',
            sort_order: 2,
            created_at: new Date().toISOString(),
        },
        {
            id: '4',
            saved_meal_id: '2',
            food_name: 'Grilled Chicken',
            calories: 165,
            protein: 31,
            carbs: 0,
            fats: 4,
            portion: '100g',
            confidence_level: 'exact',
            quality_tags: ['High Protein'],
            emoji: '🍗',
            sort_order: 0,
            created_at: new Date().toISOString(),
        },
        {
            id: '5',
            saved_meal_id: '2',
            food_name: 'Brown Rice',
            calories: 218,
            protein: 5,
            carbs: 46,
            fats: 2,
            portion: '1 cup',
            confidence_level: 'estimated',
            quality_tags: ['High Carb'],
            emoji: '🍚',
            sort_order: 1,
            created_at: new Date().toISOString(),
        },
        {
            id: '6',
            saved_meal_id: '2',
            food_name: 'Mixed Vegetables',
            calories: 67,
            protein: 3,
            carbs: 13,
            fats: 0.5,
            portion: '1 cup',
            confidence_level: 'estimated',
            quality_tags: ['High Fiber'],
            emoji: '🥗',
            sort_order: 2,
            created_at: new Date().toISOString(),
        },
    ];

    private nextId = 3;

    async create(userId: string, createDto: CreateSavedMealDto) {
        // Calculate totals
        const totals = createDto.items.reduce(
            (acc, item) => ({
                calories: acc.calories + item.calories,
                protein: acc.protein + item.protein,
                carbs: acc.carbs + item.carbs,
                fats: acc.fats + item.fats,
            }),
            { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );

        const now = new Date().toISOString();
        const savedMealId = String(this.nextId++);

        const savedMeal: SavedMeal = {
            id: savedMealId,
            user_id: userId,
            name: createDto.name,
            meal_type: createDto.mealType,
            total_calories: totals.calories,
            total_protein: totals.protein,
            total_carbs: totals.carbs,
            total_fats: totals.fats,
            created_at: now,
            updated_at: now,
        };

        this.savedMeals.push(savedMeal);

        const items: SavedMealItem[] = createDto.items.map((item, i) => ({
            id: String(Date.now() + i),
            saved_meal_id: savedMealId,
            food_name: item.foodName,
            calories: item.calories,
            protein: item.protein,
            carbs: item.carbs,
            fats: item.fats,
            portion: item.portion,
            confidence_level: item.confidenceLevel,
            quality_tags: item.qualityTags,
            emoji: item.emoji,
            sort_order: i,
            created_at: now,
        }));

        this.savedMealItems.push(...items);

        return {
            ...savedMeal,
            items,
        };
    }

    async findAll(userId: string, mealType?: string) {
        let meals = this.savedMeals.filter((m) => m.user_id === userId || m.user_id === 'demo-user');

        if (mealType) {
            meals = meals.filter((m) => m.meal_type === mealType);
        }

        return meals.map((meal) => ({
            ...meal,
            item_count: this.savedMealItems.filter((i) => i.saved_meal_id === meal.id).length,
        }));
    }

    async findOne(userId: string, id: string) {
        const savedMeal = this.savedMeals.find(
            (m) => m.id === id && (m.user_id === userId || m.user_id === 'demo-user')
        );

        if (!savedMeal) {
            throw new NotFoundException('Saved meal not found');
        }

        const items = this.savedMealItems
            .filter((i) => i.saved_meal_id === id)
            .sort((a, b) => a.sort_order - b.sort_order);

        return {
            ...savedMeal,
            items,
        };
    }

    async update(userId: string, id: string, updateDto: UpdateSavedMealDto) {
        const mealIndex = this.savedMeals.findIndex(
            (m) => m.id === id && (m.user_id === userId || m.user_id === 'demo-user')
        );

        if (mealIndex === -1) {
            throw new NotFoundException('Saved meal not found');
        }

        const now = new Date().toISOString();

        if (updateDto.name) {
            this.savedMeals[mealIndex].name = updateDto.name;
            this.savedMeals[mealIndex].updated_at = now;
        }

        if (updateDto.items) {
            // Remove old items
            this.savedMealItems = this.savedMealItems.filter((i) => i.saved_meal_id !== id);

            // Calculate new totals
            const totals = updateDto.items.reduce(
                (acc, item) => ({
                    calories: acc.calories + item.calories,
                    protein: acc.protein + item.protein,
                    carbs: acc.carbs + item.carbs,
                    fats: acc.fats + item.fats,
                }),
                { calories: 0, protein: 0, carbs: 0, fats: 0 }
            );

            this.savedMeals[mealIndex].total_calories = totals.calories;
            this.savedMeals[mealIndex].total_protein = totals.protein;
            this.savedMeals[mealIndex].total_carbs = totals.carbs;
            this.savedMeals[mealIndex].total_fats = totals.fats;
            this.savedMeals[mealIndex].updated_at = now;

            // Add new items
            const newItems: SavedMealItem[] = updateDto.items.map((item, i) => ({
                id: String(Date.now() + i),
                saved_meal_id: id,
                food_name: item.foodName,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fats: item.fats,
                portion: item.portion,
                confidence_level: item.confidenceLevel,
                quality_tags: item.qualityTags,
                emoji: item.emoji,
                sort_order: i,
                created_at: now,
            }));

            this.savedMealItems.push(...newItems);
        }

        return this.findOne(userId, id);
    }

    async remove(userId: string, id: string) {
        const mealIndex = this.savedMeals.findIndex(
            (m) => m.id === id && (m.user_id === userId || m.user_id === 'demo-user')
        );

        if (mealIndex === -1) {
            throw new NotFoundException('Saved meal not found');
        }

        this.savedMeals.splice(mealIndex, 1);
        this.savedMealItems = this.savedMealItems.filter((i) => i.saved_meal_id !== id);
    }

    async apply(userId: string, id: string, applyDto: ApplySavedMealDto) {
        const savedMeal = await this.findOne(userId, id);

        return {
            message: 'Meal applied successfully',
            appliedItems: savedMeal.items.length,
            date: applyDto.date,
            mealType: applyDto.mealType,
        };
    }
}
