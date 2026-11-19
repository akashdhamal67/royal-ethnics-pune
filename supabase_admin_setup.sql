-- ==============================================================================
-- Royal Ethnics Pune: Product Management RLS & Storage Configuration
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Table RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read of all products
DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" 
ON products 
FOR SELECT 
TO anon, authenticated 
USING (true);

-- Allow authenticated users (admin) to insert products
DROP POLICY IF EXISTS "Allow authenticated insert products" ON products;
DROP POLICY IF EXISTS "Allow public insert products" ON products;
CREATE POLICY "Allow authenticated insert products" 
ON products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow authenticated users (admin) to update products
DROP POLICY IF EXISTS "Allow authenticated update products" ON products;
DROP POLICY IF EXISTS "Allow public update products" ON products;
CREATE POLICY "Allow authenticated update products" 
ON products 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Allow authenticated users (admin) to delete products
DROP POLICY IF EXISTS "Allow authenticated delete products" ON products;
DROP POLICY IF EXISTS "Allow public delete products" ON products;
CREATE POLICY "Allow authenticated delete products" 
ON products 
FOR DELETE 
TO authenticated 
USING (true);


-- 2. Storage Bucket Policies for "product-images"
-- Ensures authenticated admin can upload, read, update and delete images,
-- while the public can view and download product images.

-- Ensure bucket is public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product-images';

-- Allow public read for product-images bucket
DROP POLICY IF EXISTS "Allow public read product-images" ON storage.objects;
CREATE POLICY "Allow public read product-images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

-- Allow authenticated admin to upload to product-images bucket
DROP POLICY IF EXISTS "Allow authenticated insert product-images" ON storage.objects;
CREATE POLICY "Allow authenticated insert product-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated admin to update images in product-images bucket
DROP POLICY IF EXISTS "Allow authenticated update product-images" ON storage.objects;
CREATE POLICY "Allow authenticated update product-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

-- Allow authenticated admin to delete images in product-images bucket
DROP POLICY IF EXISTS "Allow authenticated delete product-images" ON storage.objects;
CREATE POLICY "Allow authenticated delete product-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
