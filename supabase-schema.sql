-- Run this script in your Supabase SQL Editor to create the necessary tables

-- Create issues table
CREATE TABLE IF NOT EXISTS public.issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  loc TEXT NOT NULL,
  cat TEXT NOT NULL,
  description TEXT NOT NULL,
  prio TEXT NOT NULL,
  conf BOOLEAN DEFAULT false,
  img TEXT,
  status TEXT DEFAULT 'Pending',
  note TEXT,
  ts TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  uid UUID NOT NULL,
  uname TEXT NOT NULL
);

-- Enable real-time for the issues table
ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;

-- Set up Row Level Security (RLS)
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read issues (or you can restrict this to authenticated users)
CREATE POLICY "Anyone can read issues" ON public.issues
  FOR SELECT USING (true);

-- Authenticated users can insert their own issues
CREATE POLICY "Users can insert their own issues" ON public.issues
  FOR INSERT WITH CHECK (auth.uid() = uid);

-- Users can update their own issues, admins can update any issue
CREATE POLICY "Users can update their own issues" ON public.issues
  FOR UPDATE USING (
    auth.uid() = uid OR 
    (auth.jwt() -> 'user_metadata' ->> 'isAdmin')::boolean = true
  );

-- Users can delete their own issues, admins can delete any issue
CREATE POLICY "Users can delete their own issues" ON public.issues
  FOR DELETE USING (
    auth.uid() = uid OR 
    (auth.jwt() -> 'user_metadata' ->> 'isAdmin')::boolean = true
  );

-- Create a storage bucket for issue images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('issue-images', 'issue-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public read access to the bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-images');

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'issue-images' AND 
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'issue-images' AND 
    auth.role() = 'authenticated'
  );

-- Note: To allow admins to manage all issues, you would typically check the user's role
-- from their auth.users metadata or a separate profiles table.
-- For simplicity in this demo, we're allowing users to manage their own, 
-- but you can add admin-specific policies based on your auth setup.
