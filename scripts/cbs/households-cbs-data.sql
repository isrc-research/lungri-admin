-- Create the household_cbs table if it doesn't exist
CREATE TABLE IF NOT EXISTS household_cbs (
  id VARCHAR(48) PRIMARY KEY NOT NULL,
  ward_no INTEGER,
  total_households INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Clear existing data (optional)
-- TRUNCATE TABLE household_cbs;

-- Insert ward-wise household data
INSERT INTO household_cbs (id, ward_no, total_households, created_at) 
VALUES 
  ('house_ward_1', 1, 1108, NOW()),
  ('house_ward_2', 2, 894, NOW()),
  ('house_ward_3', 3, 548, NOW()),
  ('house_ward_4', 4, 825, NOW()),
  ('house_ward_5', 5, 699, NOW()),
  ('house_ward_6', 6, 841, NOW()),
  ('house_ward_7', 7, 571, NOW());
 
