import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDayPlanDto } from './dto/create-day-plan.dto';
import { UpdateDayPlanDto } from './dto/update-day-plan.dto';
import { ApplyDayPlanDto } from './dto/apply-day-plan.dto';
import { ApplyYesterdayDto } from './dto/apply-yesterday.dto';

interface DayPlan {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    total_calories: number;
    total_protein: number;
    total_carbs: number;
    total_fats: number;
    created_at: string;
    updated_at: string;
}

interface DayPlanMeal {
    id: string;
    day_plan_id: string;
    meal_type: string;
    saved_meal_id?: string | null;
    sort_order: number;
}

@Injectable()
export class DayPlansService {
    // In-memory storage (mock database)
    private dayPlans: DayPlan[] = [
        {
            id: '1',
            user_id: 'demo-user',
            name: 'High Protein Day',
            description: 'Optimized for muscle building',
            total_calories: 1970,
            total_protein: 163,
            total_carbs: 97,
            total_fats: 22,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        },
    ];

    private dayPlanMeals: DayPlanMeal[] = [
        {
            id: '1',
            day_plan_id: '1',
            meal_type: 'breakfast',
            saved_meal_id: '1', // References Protein Breakfast from saved-meals mock data
            sort_order: 0,
        },
        {
            id: '2',
            day_plan_id: '1',
            meal_type: 'lunch',
            saved_meal_id: '2', // References Light Lunch
            sort_order: 1,
        },
        {
            id: '3',
            day_plan_id: '1',
            meal_type: 'dinner',
            saved_meal_id: '2', // References Light Lunch
            sort_order: 2,
        },
        {
            id: '4',
            day_plan_id: '1',
            meal_type: 'snacks',
            saved_meal_id: '1', // References Protein Breakfast
            sort_order: 3,
        },
    ];

    private nextId = 2;

    async create(userId: string, createDto: CreateDayPlanDto) {
        // Mock: Calculate totals from referenced saved meals
        const totalCalories = 2100;
        const totalProtein = 140;
        const totalCarbs = 180;
        const totalFats = 60;

        const now = new Date().toISOString();
        const dayPlanId = String(this.nextId++);

        const dayPlan: DayPlan = {
            id: dayPlanId,
            user_id: userId,
            name: createDto.name,
            description: createDto.description,
            total_calories: totalCalories,
            total_protein: totalProtein,
            total_carbs: totalCarbs,
            total_fats: totalFats,
            created_at: now,
            updated_at: now,
        };

        this.dayPlans.push(dayPlan);

        // Link saved meals to day plan
        const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];
        mealTypes.forEach((mealType, index) => {
            const savedMealId = createDto.meals[mealType] || null;
            this.dayPlanMeals.push({
                id: String(Date.now() + index),
                day_plan_id: dayPlanId,
                meal_type: mealType,
                saved_meal_id: savedMealId,
                sort_order: index,
            });
        });

        return this.findOne(userId, dayPlanId);
    }

    async findAll(userId: string) {
        const plans = this.dayPlans.filter((p) => p.user_id === userId || p.user_id === 'demo-user');

        return plans.map((plan) => ({
            ...plan,
            meal_count: this.dayPlanMeals.filter(
                (m) => m.day_plan_id === plan.id && m.saved_meal_id !== null
            ).length,
        }));
    }

    async findOne(userId: string, id: string) {
        const dayPlan = this.dayPlans.find(
            (p) => p.id === id && (p.user_id === userId || p.user_id === 'demo-user')
        );

        if (!dayPlan) {
            throw new NotFoundException('Day plan not found');
        }

        // Get all meal links
        const mealLinks = this.dayPlanMeals
            .filter((m) => m.day_plan_id === id)
            .sort((a, b) => a.sort_order - b.sort_order);

        // Structure meals object (mock data - would need to join with saved_meals in real DB)
        const meals = {};
        const mockMealData = {
            '1': {
                id: '1',
                name: 'Protein Breakfast',
                totalCalories: 520,
                totalProtein: 35,
                totalCarbs: 45,
                totalFats: 12,
                itemCount: 3,
            },
            '2': {
                id: '2',
                name: 'Light Lunch',
                totalCalories: 450,
                totalProtein: 28,
                totalCarbs: 52,
                totalFats: 10,
                itemCount: 3,
            },
        };

        for (const link of mealLinks) {
            if (link.saved_meal_id && mockMealData[link.saved_meal_id]) {
                meals[link.meal_type] = mockMealData[link.saved_meal_id];
            } else {
                meals[link.meal_type] = null;
            }
        }

        return {
            ...dayPlan,
            meals,
        };
    }

    async update(userId: string, id: string, updateDto: UpdateDayPlanDto) {
        const planIndex = this.dayPlans.findIndex(
            (p) => p.id === id && (p.user_id === userId || p.user_id === 'demo-user')
        );

        if (planIndex === -1) {
            throw new NotFoundException('Day plan not found');
        }

        const now = new Date().toISOString();

        if (updateDto.name) {
            this.dayPlans[planIndex].name = updateDto.name;
        }
        if (updateDto.description !== undefined) {
            this.dayPlans[planIndex].description = updateDto.description;
        }
        this.dayPlans[planIndex].updated_at = now;

        if (updateDto.meals) {
            const mealTypes = ['breakfast', 'lunch', 'dinner', 'snacks'];

            for (const mealType of mealTypes) {
                if (updateDto.meals[mealType] !== undefined) {
                    const linkIndex = this.dayPlanMeals.findIndex(
                        (m) => m.day_plan_id === id && m.meal_type === mealType
                    );

                    if (linkIndex !== -1) {
                        this.dayPlanMeals[linkIndex].saved_meal_id = updateDto.meals[mealType] || null;
                    }
                }
            }
        }

        return this.findOne(userId, id);
    }

    async remove(userId: string, id: string) {
        const planIndex = this.dayPlans.findIndex(
            (p) => p.id === id && (p.user_id === userId || p.user_id === 'demo-user')
        );

        if (planIndex === -1) {
            throw new NotFoundException('Day plan not found');
        }

        this.dayPlans.splice(planIndex, 1);
        this.dayPlanMeals = this.dayPlanMeals.filter((m) => m.day_plan_id !== id);
    }

    async apply(userId: string, id: string, applyDto: ApplyDayPlanDto) {
        const dayPlan = await this.findOne(userId, id);

        const totalItemsAdded = 10;
        const mealsApplied = {
            breakfast: 3,
            lunch: 3,
            dinner: 2,
            snacks: 2,
        };

        return {
            message: 'Day plan applied successfully',
            date: applyDto.date,
            mealsApplied,
            totalItemsAdded,
        };
    }

    async applyYesterday(userId: string, applyDto: ApplyYesterdayDto) {
        const targetDate = new Date(applyDto.targetDate);
        const sourceDate = new Date(targetDate);
        sourceDate.setDate(sourceDate.getDate() - 1);

        return {
            message: "Yesterday's meals applied successfully",
            sourceDate: sourceDate.toISOString().split('T')[0],
            targetDate: applyDto.targetDate,
            totalItemsAdded: 8,
        };
    }
}
