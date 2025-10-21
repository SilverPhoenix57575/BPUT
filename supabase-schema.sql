-- Run this in Supabase SQL Editor

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contents table
CREATE TABLE contents (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  filename TEXT,
  content_type TEXT,
  file_url TEXT,
  extracted_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress table
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  competency_id TEXT,
  mastery_level FLOAT DEFAULT 0.1,
  interactions JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Study sessions table
CREATE TABLE study_sessions (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  activity_type TEXT,
  topic TEXT,
  duration INTEGER,
  score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  badge_id TEXT,
  badge_name TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_contents_user ON contents(user_id);
CREATE INDEX idx_progress_user ON progress(user_id);
CREATE INDEX idx_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_achievements_user ON achievements(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can view own data" ON contents
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own data" ON contents
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view own progress" ON progress
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own progress" ON progress
  FOR ALL USING (auth.uid()::text = user_id);
