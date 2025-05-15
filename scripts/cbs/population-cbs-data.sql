-- Create the population_gender_wise_cbs table if it doesn't exist
CREATE TABLE IF NOT EXISTS population_gender_wise_cbs (
  id VARCHAR(48) PRIMARY KEY NOT NULL,
  ward_no INTEGER,
  total_population INTEGER,
  total_male INTEGER,
  total_female INTEGER
);

-- Clear existing data (optional)
-- TRUNCATE TABLE population_gender_wise_cbs;

-- Insert ward-wise population data
INSERT INTO population_gender_wise_cbs (id, ward_no, total_population, total_male, total_female)
VALUES 
  ('pop_ward_1', 1, 5451, 2619, 2832),
  ('pop_ward_2', 2, 3885, 1718, 2167),
  ('pop_ward_3', 3, 2950, 1385, 1565),
  ('pop_ward_4', 4, 3794, 1653, 2141),
  ('pop_ward_5', 5, 3314, 1480, 1834),
  ('pop_ward_6', 6, 4389, 2025, 2364),
  ('pop_ward_7', 7, 2542, 1205, 1337);
