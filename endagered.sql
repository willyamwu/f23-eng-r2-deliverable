-- Add the 'endangered' column to the 'species' table
ALTER TABLE species
ADD COLUMN endangered BOOLEAN;

-- Update the 'endangered' column based on the 'total_population' value
UPDATE species
SET endangered = CASE
    WHEN total_population < 2500 AND total_population IS NOT NULL THEN TRUE
    ELSE FALSE
  END;
