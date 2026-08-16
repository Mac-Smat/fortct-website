-- FortCT Services Catalogue — Import
-- 9 categories + 58 products
-- (57 products from src/data/services.js + Billboard Construction & Installation)

-- ================= CATEGORIES (9) =================
insert into public.categories (name, slug, description, status, sort_order)
values
  ('Business Printing',        'business-printing',        null, 'published', 1),
  ('Marketing & Promotional',  'marketing-promotional',    null, 'published', 2),
  ('Branding & Large Format',  'branding-large-format',    null, 'published', 3),
  ('Packaging',                'packaging',                null, 'published', 4),
  ('Apparel & Merchandise',    'apparel-merchandise',      null, 'published', 5),
  ('Event & Wedding',          'event-wedding',            null, 'published', 6),
  ('Educational & Office',     'educational-office',       null, 'published', 7),
  ('Photo & Creative',         'photo-creative',           null, 'published', 8),
  ('Industrial & Specialised', 'industrial-specialised',   null, 'published', 9)
on conflict (slug) do nothing;

-- ================= PRODUCTS (58) =================
insert into public.products
  (category_id, name, slug, description, price, pricing_type, pricing_unit, status, featured, sort_order)
values
  -- Business Printing (9)
  ((select id from public.categories where slug = 'business-printing'), 'Business Cards', 'business-cards', null, 20000, 'per_unit', '100 pcs', 'published', false, 1),
  ((select id from public.categories where slug = 'business-printing'), 'Letterheads', 'letterheads', null, 13000, 'per_unit', '100 pcs', 'published', false, 2),
  ((select id from public.categories where slug = 'business-printing'), 'Envelopes', 'envelopes', null, 10000, 'per_unit', '100 pcs', 'published', false, 3),
  ((select id from public.categories where slug = 'business-printing'), 'Invoice Books', 'invoice-books', null, 7000, 'per_unit', 'book', 'published', false, 4),
  ((select id from public.categories where slug = 'business-printing'), 'Receipt Books', 'receipt-books', null, 7000, 'per_unit', 'book', 'published', false, 5),
  ((select id from public.categories where slug = 'business-printing'), 'ID Cards', 'id-cards', null, 5000, 'per_unit', 'pc', 'published', false, 6),
  ((select id from public.categories where slug = 'business-printing'), 'Thank You Cards', 'thank-you-cards', null, 6000, 'per_unit', '50 pcs', 'published', false, 7),
  ((select id from public.categories where slug = 'business-printing'), 'Stamp', 'stamp', null, null, 'custom_quote', null, 'published', false, 8),
  ((select id from public.categories where slug = 'business-printing'), 'Iron Seal', 'iron-seal', null, null, 'custom_quote', null, 'published', false, 9),

  -- Marketing & Promotional (7)
  ((select id from public.categories where slug = 'marketing-promotional'), 'Flyers & Handbills (A5)', 'flyers-handbills', null, 8000, 'per_unit', '50 pcs', 'published', false, 1),
  ((select id from public.categories where slug = 'marketing-promotional'), 'Posters', 'posters', null, 3000, 'per_unit', 'pc', 'published', false, 2),
  ((select id from public.categories where slug = 'marketing-promotional'), 'Brochures', 'brochures', null, 10000, 'per_unit', '50 pcs', 'published', false, 3),
  ((select id from public.categories where slug = 'marketing-promotional'), 'Trifold Flyer', 'trifold-flyer', null, 9000, 'per_unit', '50 pcs', 'published', false, 4),
  ((select id from public.categories where slug = 'marketing-promotional'), 'Roll-up Banners', 'roll-up-banners', null, 85000, 'per_unit', 'pc', 'published', false, 5),
  ((select id from public.categories where slug = 'marketing-promotional'), 'SAV Stickers', 'sav-stickers', null, 4500, 'per_unit', '50 pcs', 'published', false, 6),
  ((select id from public.categories where slug = 'marketing-promotional'), 'Transparent Stickers (UV Stickers)', 'transparent-stickers', null, 12000, 'per_unit', 'A3 size', 'published', false, 7),

  -- Branding & Large Format (5, incl. Billboard)
  ((select id from public.categories where slug = 'branding-large-format'), 'Flex Banners', 'flex-banners', null, null, 'custom_quote', null, 'published', false, 1),
  ((select id from public.categories where slug = 'branding-large-format'), 'Vehicle Branding', 'vehicle-branding', null, null, 'custom_quote', null, 'published', false, 2),
  ((select id from public.categories where slug = 'branding-large-format'), 'Window Graphics', 'window-graphics', null, null, 'custom_quote', null, 'published', false, 3),
  ((select id from public.categories where slug = 'branding-large-format'), 'Acrylic 3D Signage', 'acrylic-3d-signage', null, null, 'custom_quote', null, 'published', false, 4),
  ((select id from public.categories where slug = 'branding-large-format'), 'Billboard Construction & Installation', 'billboard-construction-installation', null, null, 'custom_quote', null, 'published', false, 5),

  -- Packaging (6)
  ((select id from public.categories where slug = 'packaging'), 'Custom Carton/Box', 'custom-carton-box', null, null, 'custom_quote', null, 'published', false, 1),
  ((select id from public.categories where slug = 'packaging'), 'Paper Bags', 'paper-bags', null, null, 'custom_quote', null, 'published', false, 2),
  ((select id from public.categories where slug = 'packaging'), 'Nylon Bags', 'nylon-bags', null, null, 'custom_quote', null, 'published', false, 3),
  ((select id from public.categories where slug = 'packaging'), 'Courier Bags', 'courier-bags', null, null, 'custom_quote', null, 'published', false, 4),
  ((select id from public.categories where slug = 'packaging'), 'Wrist Tags', 'wrist-tags', null, null, 'custom_quote', null, 'published', false, 5),
  ((select id from public.categories where slug = 'packaging'), 'Neck Tags', 'neck-tags', null, null, 'custom_quote', null, 'published', false, 6),

  -- Apparel & Merchandise (10)
  ((select id from public.categories where slug = 'apparel-merchandise'), 'T-Shirt Printing (DTF Print)', 't-shirt-printing', null, 15000, 'per_unit', 'pc', 'published', false, 1),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Hoodie Printing (DTF Print)', 'hoodie-printing', null, 25000, 'per_unit', 'pc', 'published', false, 2),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Face Cap Branding (DTF Print)', 'face-cap-branding', null, 6500, 'per_unit', 'pc', 'published', false, 3),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Tote Bag Printing', 'tote-bag-printing', null, null, 'custom_quote', null, 'published', false, 4),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Mug Printing', 'mug-printing', null, 6000, 'per_unit', 'pc', 'published', false, 5),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Pen Branding', 'pen-branding', null, 1000, 'per_unit', 'pc', 'published', false, 6),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Keyholder Branding', 'keyholder-branding', null, 1000, 'per_unit', 'pc', 'published', false, 7),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Water Bottle Branding', 'water-bottle-branding', null, null, 'custom_quote', null, 'published', false, 8),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Reflective/Construction Jackets', 'reflective-jackets', null, null, 'custom_quote', null, 'published', false, 9),
  ((select id from public.categories where slug = 'apparel-merchandise'), 'Towel Branding', 'towel-branding', null, null, 'custom_quote', null, 'published', false, 10),

  -- Event & Wedding (7)
  ((select id from public.categories where slug = 'event-wedding'), 'Invitation Cards', 'invitation-cards', null, 6000, 'per_unit', '50 pcs', 'published', false, 1),
  ((select id from public.categories where slug = 'event-wedding'), 'Event Programs', 'event-programs', null, 8000, 'per_unit', '50 pcs', 'published', false, 2),
  ((select id from public.categories where slug = 'event-wedding'), 'Event Tickets', 'event-tickets', null, 5000, 'per_unit', '50 pcs', 'published', false, 3),
  ((select id from public.categories where slug = 'event-wedding'), 'Award Plaque', 'award-plaque', null, null, 'custom_quote', null, 'published', false, 4),
  ((select id from public.categories where slug = 'event-wedding'), 'Table Tags', 'table-tags', null, 4000, 'per_unit', '20 pcs', 'published', false, 5),
  ((select id from public.categories where slug = 'event-wedding'), 'Clothing Tags', 'clothing-tags', null, 3500, 'per_unit', '20 pcs', 'published', false, 6),
  ((select id from public.categories where slug = 'event-wedding'), 'Event Backdrops', 'event-backdrops', null, null, 'custom_quote', null, 'published', false, 7),

  -- Educational & Office (5)
  ((select id from public.categories where slug = 'educational-office'), 'Exercise Books', 'exercise-books', null, null, 'custom_quote', null, 'published', false, 1),
  ((select id from public.categories where slug = 'educational-office'), 'Jotter', 'jotter', null, null, 'custom_quote', null, 'published', false, 2),
  ((select id from public.categories where slug = 'educational-office'), 'Journals', 'journals', null, null, 'custom_quote', null, 'published', false, 3),
  ((select id from public.categories where slug = 'educational-office'), 'Calendars', 'calendars', null, null, 'custom_quote', null, 'published', false, 4),
  ((select id from public.categories where slug = 'educational-office'), 'Certificates', 'certificates', null, 1000, 'per_unit', 'pc', 'published', false, 5),

  -- Photo & Creative (3)
  ((select id from public.categories where slug = 'photo-creative'), 'Photo Books', 'photo-books', null, null, 'custom_quote', null, 'published', false, 1),
  ((select id from public.categories where slug = 'photo-creative'), 'Canvas Printing', 'canvas-printing', null, 12000, 'per_unit', 'pc', 'published', false, 2),
  ((select id from public.categories where slug = 'photo-creative'), 'Photo Frames', 'photo-frames', null, null, 'custom_quote', null, 'published', false, 3),

  -- Industrial & Specialised (6)
  ((select id from public.categories where slug = 'industrial-specialised'), 'Screen Printing', 'screen-printing', null, null, 'custom_quote', null, 'published', false, 1),
  ((select id from public.categories where slug = 'industrial-specialised'), 'Digital Printing', 'digital-printing', null, null, 'custom_quote', null, 'published', false, 2),
  ((select id from public.categories where slug = 'industrial-specialised'), 'UV Printing', 'uv-printing', null, null, 'custom_quote', null, 'published', false, 3),
  ((select id from public.categories where slug = 'industrial-specialised'), 'Sublimation Printing', 'sublimation-printing', null, null, 'custom_quote', null, 'published', false, 4),
  ((select id from public.categories where slug = 'industrial-specialised'), 'Embroidery Branding', 'embroidery-branding', null, null, 'custom_quote', null, 'published', false, 5),
  ((select id from public.categories where slug = 'industrial-specialised'), 'Laser Engraving', 'laser-engraving', null, null, 'custom_quote', null, 'published', false, 6)
on conflict (slug) do nothing;