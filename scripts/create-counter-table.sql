-- Create a table to track total generations across all users
CREATE TABLE IF NOT EXISTS generation_counter (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total_generations INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert the initial row
INSERT INTO generation_counter (id, total_generations) 
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;
