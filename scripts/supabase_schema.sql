-- Run this in your Supabase SQL Editor to update the blog table

ALTER TABLE blog 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS categories TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seo_metadata JSONB,
ADD COLUMN IF NOT EXISTS reading_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Optional: create an index on views and published_at for sorting
CREATE INDEX IF NOT EXISTS idx_blog_views ON blog(views DESC);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON blog(published_at DESC);
