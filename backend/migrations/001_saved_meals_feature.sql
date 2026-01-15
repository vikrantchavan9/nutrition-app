-- Migration: Saved Meals + Full Day Plans Feature
-- Description: Creates tables for saved meal templates and day plan templates
-- Author: Antigravity
-- Date: 2026-01-08

BEGIN;

-- Create saved_meals table
CREATE TABLE IF NOT EXISTS saved_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
    total_calories DECIMAL(10, 2) DEFAULT 0,
    total_protein DECIMAL(10, 2) DEFAULT 0,
    total_carbs DECIMAL(10, 2) DEFAULT 0,
    total_fats DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_saved_meals_user_id ON saved_meals(user_id);
CREATE INDEX idx_saved_meals_meal_type ON saved_meals(meal_type);

-- Create saved_meal_items table
CREATE TABLE IF NOT EXISTS saved_meal_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saved_meal_id UUID NOT NULL REFERENCES saved_meals(id) ON DELETE CASCADE,
    food_name VARCHAR(255) NOT NULL,
    calories DECIMAL(10, 2) NOT NULL,
    protein DECIMAL(10, 2) NOT NULL,
    carbs DECIMAL(10, 2) NOT NULL,
    fats DECIMAL(10, 2) NOT NULL,
    portion VARCHAR(100),
    confidence_level VARCHAR(20) CHECK (confidence_level IN ('exact', 'estimated', 'rough')),
    quality_tags TEXT[],
    emoji VARCHAR(10),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_saved_meal_items_saved_meal_id ON saved_meal_items(saved_meal_id);

-- Create day_plans table
CREATE TABLE IF NOT EXISTS day_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    total_calories DECIMAL(10, 2) DEFAULT 0,
    total_protein DECIMAL(10, 2) DEFAULT 0,
    total_carbs DECIMAL(10, 2) DEFAULT 0,
    total_fats DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_day_plans_user_id ON day_plans(user_id);

-- Create day_plan_meals table (links day plans to saved meals)
CREATE TABLE IF NOT EXISTS day_plan_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_plan_id UUID NOT NULL REFERENCES day_plans(id) ON DELETE CASCADE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snacks')),
    saved_meal_id UUID REFERENCES saved_meals(id) ON DELETE SET NULL,
    sort_order INT DEFAULT 0,
    UNIQUE(day_plan_id, meal_type)
);

CREATE INDEX idx_day_plan_meals_day_plan_id ON day_plan_meals(day_plan_id);

COMMIT;
