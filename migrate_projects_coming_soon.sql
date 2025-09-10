-- Migration script to add "coming_soon" status to projects table
-- Execute this script in Supabase SQL Editor

-- First, update the existing constraint to include the new status
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_status_check;
ALTER TABLE projects ADD CONSTRAINT projects_status_check
    CHECK (status IN ('draft', 'published', 'coming_soon'));

-- Update the RLS policy to allow public access to coming soon projects
DROP POLICY IF EXISTS "projects_select_policy" ON projects;
CREATE POLICY "projects_select_policy" ON projects
    FOR SELECT USING (status IN ('published', 'coming_soon') OR auth.uid() IS NOT NULL);

-- Optional: Update any existing projects that might have invalid status
UPDATE projects SET status = 'draft' WHERE status NOT IN ('draft', 'published', 'coming_soon');

-- Verify the changes
SELECT
    id,
    title,
    status,
    created_at
FROM projects
ORDER BY created_at DESC
LIMIT 10;
