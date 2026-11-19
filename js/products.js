/**
 * Royal Ethnics - Products Loader & Dynamic Renderer
 * Fetches products from Supabase (with instant static fallback)
 * Renders homepage featured cards, collections catalog, and product detail.
 */

// Global catalog cache for fast fallback
const DEFAULT_PRODUCTS = [
  {
    slug: 'sherwani-01',
    code: 'RE-SH-01',
    name: 'Maharaja Deep Velvet Sherwani',
    category: 'sherwani',
    category_label: 'Sherwani Collection',
    description: 'Royal maroon micro velvet with hand zardozi floral vines, antique dabka work and brocade stole.',
    fabric: 'Micro Velvet',
    work: 'Zardozi Handwork & Gold Tilla',
    includes: 'Sherwani, Churidar & Regal Velvet Stole',
    badge: 'Groom Choice',
    badge_type: 'gold',
    image_urls: [
      'assets/products/sherwani-01.jpg',
      'assets/products/sherwani-02.jpg',
      'assets/products/nawabi-01.jpg',
      'assets/products/occasion-groom.jpg'
    ],
    is_featured: true,
    in_stock: true
  },
  {
    slug: 'sherwani-02',
    code: 'RE-SH-02',
    name: 'Ivory & Gold Zari Sherwani',
    category: 'sherwani',
    category_label: 'Sherwani Collection',
    description: 'Pure raw silk woven with fine gold zari lattice patterns, paired with a tissue chanderi stole.',
    fabric: 'Pure Raw Silk',
    work: 'Tone-on-tone Resham, Pearls & Moti',
    includes: 'Sherwani, Silk Trousers & Tissue Stole',
    badge: 'Best Seller',
    badge_type: '',
    image_urls: [
      'assets/products/sherwani-02.jpg',
      'assets/products/sherwani-01.jpg',
      'assets/products/nawabi-02.jpg'
    ],
    is_featured: true,
    in_stock: true
  },
  {
    slug: 'nawabi-01',
    code: 'RE-NW-01',
    name: 'Imperial Emerald Nawabi Achkan',
    category: 'nawabi',
    category_label: 'Nawabi Collection',
    description: 'Deep forest matka silk achkan with antique brass filigree buttons and understated collar resham.',
    fabric: 'Matka Silk',
    work: 'Vintage Cast Brass Buttons, Minimalist Collar Threadwork',
    includes: 'Nawabi Achkan, Churidar & Pocket Square',
    badge: 'Regal Heritage',
    badge_type: 'gold',
    image_urls: [
      'assets/products/nawabi-01.jpg',
      'assets/products/nawabi-02.jpg'
    ],
    is_featured: true,
    in_stock: true
  },
  {
    slug: 'nawabi-02',
    code: 'RE-NW-02',
    name: 'Royal Crimson Angrakha Ensemble',
    category: 'nawabi',
    category_label: 'Nawabi Collection',
    description: 'Flared royal angrakha with gotta patti accents, handmade latkans, and woven chanderi borders.',
    fabric: 'Chanderi Brocade',
    work: 'Gotta Patti Borders, Handcrafted Latkans',
    includes: 'Flared Angrakha, Churidar & Silk Sash',
    badge: 'Exclusive',
    badge_type: '',
    image_urls: [
      'assets/products/nawabi-02.jpg',
      'assets/products/nawabi-01.jpg'
    ],
    is_featured: true,
    in_stock: true
  },
  {
    slug: 'indowestern-01',
    code: 'RE-IW-01',
    name: 'Asymmetric Charcoal Indo Western',
    category: 'indowestern',
    category_label: 'Indo Western',
    description: 'Contemporary structured drape with satin lapel accents, metallic buttons, and matching slim trousers.',
    fabric: 'Italian Blend',
    work: 'Satin Tuxedo Lapel Trim, Metallic Button Cuff',
    includes: 'Asymmetric Jacket, Kurta & Slim Trousers',
    badge: 'Modern Cut',
    badge_type: '',
    image_urls: [
      'assets/products/indowestern-01.jpg',
      'assets/products/indowestern-02.jpg'
    ],
    is_featured: true,
    in_stock: true
  },
  {
    slug: 'indowestern-02',
    code: 'RE-IW-02',
    name: 'Rose Gold Brocade Jodhpur',
    category: 'indowestern',
    category_label: 'Indo Western',
    description: 'Woven metallic jacquard brocade bandhgala paired with pleated breeches for sangeet & cocktail events.',
    fabric: 'Jacquard Brocade',
    work: 'Metallic Thread Brocade Weave',
    includes: 'Short Bandhgala Jacket, Breeches & Stole',
    badge: 'Cocktail Star',
    badge_type: 'gold',
    image_urls: [
      'assets/products/indowestern-02.jpg',
      'assets/products/indowestern-01.jpg'
    ],
    is_featured: true,
    in_stock: true
  },
  {
    slug: 'boys-01',
    code: 'RE-BY-01',
    name: 'Little Prince Maroon Sherwani',
    category: 'boys',
    category_label: "Boys' Collection",
    description: 'Soft velvet with itch-free inner lining, subtle gold zari borders, and pre-stitched dhoti pyjama.',
    fabric: 'Comfort Velvet',
    age_range: '2 to 14 Years',
    work: 'Lightweight Gold Embroidery & Brooch',
    includes: 'Boys Sherwani, Ready-Made Dhoti & Dupatta',
    badge: 'Boys Special',
    badge_type: '',
    image_urls: [
      'assets/products/boys-01.jpg',
      'assets/products/boys-02.jpg'
    ],
    is_featured: true,
    in_stock: true
  },
  {
    slug: 'boys-02',
    code: 'RE-BY-02',
    name: "Boys' Royal Blue Indo Western",
    category: 'boys',
    category_label: "Boys' Collection",
    description: 'Asymmetric silk blend kurta jacket set tailored for celebration, comfort, and festive ease.',
    fabric: 'Silk Blend & Brocade',
    age_range: '1 to 12 Years',
    work: 'Asymmetric Cut with Designer Brooch',
    includes: 'Jacket, Inner Kurta & Pyjama',
    badge: 'Festive Hit',
    badge_type: '',
    image_urls: [
      'assets/products/boys-02.jpg',
      'assets/products/boys-01.jpg'
    ],
    is_featured: true,
    in_stock: true
  }
];

// Helper to resolve image paths whether in root or subpage (pages/...)
function resolveProductImage(imgPath, isSubpage) {
  if (!imgPath) return '';
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  // Strip leading slash or dot slashes
  const clean = imgPath.replace(/^(\.\.\/|\.\/|\/)/, '');
  return isSubpage ? `../${clean}` : clean;
}

// Helper to resolve product detail link
function resolveDetailLink(slug, isSubpage) {
  return isSubpage ? `product-detail.html?id=${slug}` : `pages/product-detail.html?id=${slug}`;
}

// Category display name formatter
function getCategoryDisplayName(cat) {
  switch ((cat || '').toLowerCase()) {
    case 'sherwani': return 'Sherwani Collection';
    case 'nawabi': return 'Nawabi Collection';
    case 'indowestern': return 'Indo Western';
    case 'boys': return "Boys' Collection";
    default: return cat || 'Ethnic Collection';
  }
}

// Fetch all products from Supabase with graceful fallback
async function fetchSupabaseProducts() {
  if (typeof window.supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
    try {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
      if (error) {
        console.warn('Supabase fetch error, using fallback catalog:', error.message);
      }
    } catch (err) {
      console.warn('Supabase initialization failed, using fallback catalog:', err);
    }
  }
  return DEFAULT_PRODUCTS;
}

// Fetch single product by slug
async function fetchSupabaseProductBySlug(slug) {
  if (typeof window.supabase !== 'undefined' && typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
    try {
      const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase fetch single product error:', err);
    }
  }
  return DEFAULT_PRODUCTS.find(p => p.slug === slug) || DEFAULT_PRODUCTS[0];
}

// Render a single product card HTML
function createProductCardHTML(prod, isSubpage) {
  const detailUrl = resolveDetailLink(prod.slug, isSubpage);
  const rawImg = (Array.isArray(prod.image_urls) && prod.image_urls.length > 0) ? prod.image_urls[0] : (prod.img || '');
  const imgSrc = resolveProductImage(rawImg, isSubpage);
  const isGoldBadge = (prod.badge_type === 'gold' || ['Groom Choice', 'Regal Heritage', 'Cocktail Star', 'Sangeet Hit'].includes(prod.badge));
  const badgeClass = isGoldBadge ? 'product-badge gold' : 'product-badge';
  const categoryLabel = prod.category_label || getCategoryDisplayName(prod.category);
  const metaDetail = prod.age_range ? `Ages: ${prod.age_range}` : `Fabric: ${prod.fabric || 'Premium Silk'}`;
  const whatsappMsg = `Hello Royal Ethnics, inquiring about ${prod.name} (${prod.code}).`;
  const whatsappUrl = `https://wa.me/917768882288?text=${encodeURIComponent(whatsappMsg)}`;

  return `
    <div class="product-card" data-category="${prod.category || 'sherwani'}">
      <a href="${detailUrl}" class="product-card-img-link">
        ${prod.badge ? `<span class="${badgeClass}">${prod.badge}</span>` : ''}
        <img src="${imgSrc}" alt="${prod.name}" class="product-card-img" loading="lazy">
      </a>
      <div class="product-card-body">
        <span class="product-category-name">${categoryLabel}</span>
        <h3 class="product-card-title">
          <a href="${detailUrl}">${prod.name}</a>
        </h3>
        <p class="product-card-desc">${prod.description || ''}</p>
        <div class="product-card-meta">
          <span>Code: ${prod.code || 'RE'}</span>
          <span>${metaDetail}</span>
        </div>
        <div class="product-card-actions">
          <a href="${detailUrl}" class="btn btn-outline-maroon">View Details</a>
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" title="WhatsApp Enquiry">Enquire</a>
        </div>
      </div>
    </div>
  `;
}

// 1. Initialize Homepage Featured Products
async function loadHomepageProducts() {
  const grid = document.querySelector('.featured-section .product-grid, section:not(.collections-page) .product-grid');
  if (!grid) return;

  const products = await fetchSupabaseProducts();
  const featured = products.filter(p => p.is_featured !== false);
  const toRender = featured.length > 0 ? featured : products;

  grid.innerHTML = toRender.map(p => createProductCardHTML(p, false)).join('');
}

// 2. Initialize Collections Page Products
async function loadCollectionsProducts() {
  const grid = document.querySelector('.collections-page .product-grid, .collections-container .product-grid, .collections-section .product-grid');
  if (!grid) return;

  const products = await fetchSupabaseProducts();
  grid.innerHTML = products.map(p => createProductCardHTML(p, true)).join('');

  // Re-run collection filters after DOM injection
  if (typeof initCollectionFilters === 'function') {
    initCollectionFilters();
  }
}

// 3. Initialize Product Detail Page from Supabase
async function loadProductDetailPage() {
  const detailTitle = document.getElementById('product-title');
  if (!detailTitle) return; // Not on product detail page

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('id') || 'sherwani-01';
  const prod = await fetchSupabaseProductBySlug(slug);

  if (!prod) return;

  // Title & breadcrumb
  detailTitle.textContent = prod.name;
  const breadcrumb = document.getElementById('breadcrumb-current');
  if (breadcrumb) breadcrumb.textContent = prod.name;
  document.title = `${prod.name} | Royal Ethnics Pune`;

  // Details
  const catEl = document.getElementById('product-category');
  if (catEl) catEl.textContent = prod.category_label || getCategoryDisplayName(prod.category);

  const skuEl = document.getElementById('product-sku');
  if (skuEl) skuEl.textContent = prod.code;

  const fabricEl = document.getElementById('product-fabric');
  if (fabricEl) fabricEl.textContent = prod.fabric || 'Royal Silk Blend';

  const workEl = document.getElementById('product-work');
  if (workEl) workEl.textContent = prod.work || 'Handcrafted Zari & Dabka Embroidery';

  const incEl = document.getElementById('product-includes');
  if (incEl) incEl.textContent = prod.includes || 'Complete Custom Tailored Ensemble';

  const taglineEl = document.getElementById('product-tagline');
  if (taglineEl) taglineEl.textContent = prod.description || '';

  // Main Image
  const mainImg = document.getElementById('main-product-img');
  const imgs = Array.isArray(prod.image_urls) && prod.image_urls.length > 0 ? prod.image_urls : [prod.img || 'assets/products/sherwani-01.jpg'];
  const firstImgSrc = resolveProductImage(imgs[0], true);
  if (mainImg) {
    mainImg.src = firstImgSrc;
    mainImg.alt = prod.name;
  }

  // Thumbnails gallery
  const galleryThumbsContainer = document.querySelector('.product-gallery-thumbs');
  if (galleryThumbsContainer && imgs.length > 1) {
    galleryThumbsContainer.innerHTML = imgs.map((imgUrl, index) => {
      const src = resolveProductImage(imgUrl, true);
      return `
        <button class="gallery-thumb ${index === 0 ? 'active' : ''}" data-full-src="${src}" aria-label="${prod.name} view ${index + 1}">
          <img src="${src}" alt="${prod.name} view ${index + 1}">
        </button>
      `;
    }).join('');

    // Re-bind thumbnail click events
    if (typeof initProductDetail === 'function') {
      initProductDetail();
    }
  }

  // Update WhatsApp Enquire button with exact product details
  const whatsappBtn = document.querySelector('#btn-whatsapp-enquire');
  if (whatsappBtn) {
    const msg = `Hello Royal Ethnics Pune, I am interested in inquiring about "${prod.name}" (Code: ${prod.code}). Please share pricing and availability.`;
    whatsappBtn.href = `https://wa.me/917768882288?text=${encodeURIComponent(msg)}`;
  }
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('collections.html')) {
    loadCollectionsProducts();
  } else if (path.includes('product-detail.html')) {
    loadProductDetailPage();
  } else {
    loadHomepageProducts();
  }
});
