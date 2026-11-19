-- ==============================================================================
-- Royal Ethnics Pune: Product & Appointments Management RLS & Storage
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Table RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" 
ON products 
FOR SELECT 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert products" ON products;
DROP POLICY IF EXISTS "Allow public insert products" ON products;
CREATE POLICY "Allow authenticated insert products" 
ON products 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update products" ON products;
DROP POLICY IF EXISTS "Allow public update products" ON products;
CREATE POLICY "Allow authenticated update products" 
ON products 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated delete products" ON products;
DROP POLICY IF EXISTS "Allow public delete products" ON products;
CREATE POLICY "Allow authenticated delete products" 
ON products 
FOR DELETE 
TO authenticated 
USING (true);


-- 2. Table RLS for appointments
-- Allow public insert (storefront booking form)
-- Allow authenticated admin to read appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert appointments" ON appointments;
CREATE POLICY "Allow public insert appointments"
ON appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read appointments" ON appointments;
DROP POLICY IF EXISTS "Allow public read appointments" ON appointments;
CREATE POLICY "Allow authenticated read appointments"
ON appointments
FOR SELECT
TO authenticated, anon
USING (true);


-- 3. Storage Bucket Policies for "product-images"
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product-images';

DROP POLICY IF EXISTS "Allow public read product-images" ON storage.objects;
CREATE POLICY "Allow public read product-images"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow authenticated insert product-images" ON storage.objects;
CREATE POLICY "Allow authenticated insert product-images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow authenticated update product-images" ON storage.objects;
CREATE POLICY "Allow authenticated update product-images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Allow authenticated delete product-images" ON storage.objects;
CREATE POLICY "Allow authenticated delete product-images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
