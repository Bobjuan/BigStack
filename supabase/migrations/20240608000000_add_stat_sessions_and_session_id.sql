-- Migration: Add stat_sessions table and session_id column to player_stats

-- Create stat_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS stat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(player_id, name)
);

-- Add session_id column to player_stats if it doesn't exist
ALTER TABLE player_stats ADD COLUMN IF NOT EXISTS session_id UUID REFERENCES stat_sessions(id); 