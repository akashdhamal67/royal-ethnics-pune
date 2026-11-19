-- ==============================================================================
-- Royal Ethnics Pune: Products Table RLS & Seed Data
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. Enable Row Level Security and configure public access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read products" ON products;
CREATE POLICY "Allow public read products" 
ON products 
FOR SELECT 
TO anon, authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow public insert products" ON products;
CREATE POLICY "Allow public insert products" 
ON products 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update products" ON products;
CREATE POLICY "Allow public update products" 
ON products 
FOR UPDATE 
TO anon, authenticated 
USING (true)
WITH CHECK (true);

-- 2. Clean existing seeds if present
DELETE FROM products WHERE slug IN (
  'sherwani-01', 'sherwani-02', 'nawabi-01', 'nawabi-02',
  'indowestern-01', 'indowestern-02', 'boys-01', 'boys-02'
);

-- 3. Insert the 8 royal ethnic wear products
INSERT INTO products (slug, code, name, category, description, fabric, age_range, badge, image_urls, is_featured, in_stock)
VALUES 
(
  'sherwani-01',
  'RE-SH-01',
  'Maharaja Deep Velvet Sherwani',
  'sherwani',
  'Royal maroon micro velvet with hand zardozi floral vines, antique dabka work and brocade stole.',
  'Micro Velvet',
  NULL,
  'Groom Choice',
  ARRAY['assets/products/sherwani-01.jpg', 'assets/products/sherwani-02.jpg', 'assets/products/nawabi-01.jpg', 'assets/products/occasion-groom.jpg'],
  true,
  true
),
(
  'sherwani-02',
  'RE-SH-02',
  'Ivory & Gold Zari Sherwani',
  'sherwani',
  'Pure raw silk woven with fine gold zari lattice patterns, paired with a tissue chanderi stole.',
  'Pure Raw Silk',
  NULL,
  'Best Seller',
  ARRAY['assets/products/sherwani-02.jpg', 'assets/products/sherwani-01.jpg', 'assets/products/nawabi-01.jpg', 'assets/products/occasion-groom.jpg'],
  true,
  true
),
(
  'nawabi-01',
  'RE-NW-01',
  'Imperial Emerald Nawabi Achkan',
  'nawabi',
  'High-collar structured achkan with hand-casted vintage buttons and matched silk pocket square.',
  'Matka Silk',
  NULL,
  'Regal Heritage',
  ARRAY['assets/products/nawabi-01.jpg', 'assets/products/nawabi-02.jpg', 'assets/products/sherwani-01.jpg', 'assets/products/occasion-groom.jpg'],
  true,
  true
),
(
  'nawabi-02',
  'RE-NW-02',
  'Royal Crimson Angrakha Ensemble',
  'nawabi',
  'Asymmetrical side-tie angrakha with gold gotta patti and banarasi silk inner lining.',
  'Chanderi Brocade',
  NULL,
  'Exclusive',
  ARRAY['assets/products/nawabi-02.jpg', 'assets/products/nawabi-01.jpg', 'assets/products/sherwani-01.jpg', 'assets/products/occasion-groom.jpg'],
  true,
  true
),
(
  'indowestern-01',
  'RE-IW-01',
  'Asymmetric Charcoal Indo Western',
  'indowestern',
  'Modern angular overlapping front with satin trimmed notch collar and tailored straight trousers.',
  'Italian Blend',
  NULL,
  'Modern Cut',
  ARRAY['assets/products/indowestern-01.jpg', 'assets/products/indowestern-02.jpg', 'assets/products/sherwani-01.jpg', 'assets/products/occasion-sangeet.jpg'],
  true,
  true
),
(
  'indowestern-02',
  'RE-IW-02',
  'Rose Gold Brocade Jodhpur',
  'indowestern',
  'Bespoke short bandhgala jacket in metallic rose gold weave, paired with royal breeches.',
  'Jacquard Brocade',
  NULL,
  'Cocktail Star',
  ARRAY['assets/products/indowestern-02.jpg', 'assets/products/indowestern-01.jpg', 'assets/products/sherwani-01.jpg', 'assets/products/occasion-sangeet.jpg'],
  true,
  true
),
(
  'boys-01',
  'RE-BY-01',
  'Little Prince Maroon Sherwani',
  'boys',
  'Child-friendly soft lining, gold brocade embroidery, and comfortable ready-to-wear dhoti.',
  'Comfort Velvet',
  '2 to 14 Years',
  'Boys Special',
  ARRAY['assets/products/boys-01.jpg', 'assets/products/boys-02.jpg', 'assets/products/sherwani-01.jpg', 'assets/products/occasion-festive.jpg'],
  true,
  true
),
(
  'boys-02',
  'RE-BY-02',
  'Boys'' Royal Blue Indo Western',
  'boys',
  'Royal blue asymmetric Indo Western jacket with brooch and tailored silk pyjama.',
  'Silk Blend & Brocade',
  '1 to 12 Years',
  'Festive Hit',
  ARRAY['assets/products/boys-02.jpg', 'assets/products/boys-01.jpg', 'assets/products/indowestern-01.jpg', 'assets/products/occasion-festive.jpg'],
  true,
  true
);
