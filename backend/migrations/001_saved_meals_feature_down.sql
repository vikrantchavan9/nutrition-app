-- Rollback Migration: Saved Meals + Full Day Plans Feature
-- Description: Drops all tables created by the saved meals feature migration
-- Author: Antigravity
-- Date: 2026-01-08

BEGIN;

DROP TABLE IF EXISTS day_plan_meals CASCADE;
DROP TABLE IF EXISTS day_plans CASCADE;
DROP TABLE IF EXISTS saved_meal_items CASCADE;
DROP TABLE IF EXISTS saved_meals CASCADE;

COMMIT;
