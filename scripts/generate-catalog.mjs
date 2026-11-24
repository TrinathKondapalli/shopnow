// Generates src/data/products.json from the compact definitions below.
// Stock is simulated with a seeded random generator, so the output is the same every run.
// Run with: node scripts/generate-catalog.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const C = {
  offwhite: ['Off-White', '#F1EEE6', 'white'],
  white: ['White', '#F4F4F6', 'white'],
  cream: ['Cream', '#EDE3CF', 'neutral'],
  sand: ['Sand', '#D9C7A6', 'neutral'],
  stone: ['Stone', '#B9AD94', 'neutral'],
  black: ['Black', '#1F1F25', 'black'],
  charcoal: ['Charcoal', '#3C3C4A', 'grey'],
  grey: ['Heather Grey', '#9C9CA8', 'grey'],
  slate: ['Slate', '#4A4C5C', 'grey'],
  lavender: ['Lavender', '#C2B0FA', 'purple'],
  lilac: ['Lilac', '#D6C9FF', 'purple'],
  electric: ['Electric Purple', '#7B2FF7', 'purple'],
  midnight: ['Midnight', '#1F2447', 'blue'],
  navy: ['Navy', '#222B55', 'blue'],
  indigo: ['Indigo', '#3F5C96', 'blue'],
  washed: ['Washed Blue', '#7FA0CC', 'blue'],
  olive: ['Olive', '#62684A', 'green'],
  forest: ['Forest', '#3E5A4B', 'green'],
};

const CLOTH = ['XS', 'S', 'M', 'L', 'XL'];
const WAIST = ['28', '30', '32', '34', '36'];
const SHOE = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];
const ONE = ['One Size'];

// id, name, gender, type, art, price, compareAt, colours, sizes, createdAt, collections, tags, description, details
const DEFS = [
  ['essential-tee', 'Essential Tee', 'men', 'T-Shirts', 'tee', 899, null, ['offwhite', 'black', 'lavender'], CLOTH, '2026-08-02', ['essentials'], ['cotton', 'basic', 'crew neck'],
    'The tee you reach for first. Heavy 220 GSM cotton with a relaxed body and a collar that keeps its shape wash after wash.', ['220 GSM combed cotton', 'Relaxed fit, true to size', 'Ribbed crew neck', 'Machine wash cold']],
  ['everyday-hoodie', 'Everyday Hoodie', 'men', 'Hoodies', 'hoodie', 1699, null, ['lavender', 'charcoal', 'sand'], CLOTH, '2026-09-10', ['essentials', 'move'], ['fleece', 'pullover', 'drawstring'],
    'Brushed-back fleece with a double-layer hood and a roomy kangaroo pocket. Built for cold mornings and late nights.', ['330 GSM brushed fleece', 'Regular fit with dropped shoulder', 'Double-layer hood', 'Kangaroo pocket']],
  ['cargo-pants', 'Cargo Pants', 'men', 'Bottoms', 'cargo', 1499, null, ['olive', 'black', 'stone'], WAIST, '2026-07-21', ['essentials', 'move'], ['utility', 'pockets', 'relaxed'],
    'Six-pocket cargos in a soft cotton twill. Relaxed through the thigh with adjustable cuffs you can wear long or stacked.', ['100% cotton twill', 'Relaxed tapered leg', 'Six pockets', 'Toggle cuffs']],
  ['zip-overshirt', 'Zip Overshirt', 'men', 'Jackets', 'jacket', 1999, null, ['midnight', 'olive', 'sand'], CLOTH, '2026-10-04', ['move'], ['layer', 'zip', 'overshirt'],
    'A structured overshirt that layers over tees and hoodies. Two chest pockets and a full-length zip.', ['Cotton-nylon blend', 'Boxy fit', 'Two patch pockets', 'Metal zip']],
  ['boxy-graphic-tee', 'Boxy Graphic Tee', 'men', 'T-Shirts', 'tee', 999, 1299, ['black', 'electric', 'white'], CLOTH, '2026-06-18', [], ['graphic', 'oversized', 'cotton'],
    'An oversized tee cut wide and short, with a small chest print. Pairs with cargos or wide-leg denim.', ['240 GSM cotton', 'Boxy oversized fit', 'Screen-printed chest graphic', 'Machine wash cold']],
  ['relaxed-jeans', 'Relaxed Straight Jeans', 'men', 'Bottoms', 'jeans', 1899, null, ['indigo', 'washed', 'black'], WAIST, '2026-05-30', ['essentials'], ['denim', 'straight leg'],
    'Rigid-look denim with a touch of stretch. A straight leg that sits just above the shoe.', ['98% cotton, 2% elastane', 'Relaxed straight fit', 'Five-pocket styling', 'Button fly']],
  ['track-jacket', 'Track Jacket', 'men', 'Jackets', 'bomber', 2299, null, ['black', 'lavender', 'navy'], CLOTH, '2026-11-08', ['move'], ['sport', 'zip', 'retro'],
    'A lightweight track jacket with ribbed cuffs and hem. Throw it on for training or over a tee for the street.', ['Recycled polyester shell', 'Regular fit', 'Ribbed cuffs and hem', 'Zip side pockets']],
  ['heavyweight-crew', 'Heavyweight Crew', 'men', 'Sweatshirts', 'sweat', 1399, null, ['grey', 'black', 'forest'], CLOTH, '2026-09-25', ['essentials'], ['fleece', 'crew neck'],
    'A dense crew-neck sweatshirt with ribbed trims and a clean front. Holds its shape season after season.', ['380 GSM loopback cotton', 'Regular fit', 'Ribbed cuffs and hem', 'Pre-shrunk']],
  ['retro-runner', 'Retro Runner Sneakers', 'unisex', 'Footwear', 'shoe', 2499, 3199, ['white', 'black', 'lilac'], SHOE, '2026-08-15', ['move'], ['sneakers', 'shoes', 'running'],
    'A 90s-inspired runner with a cushioned sole and suede overlays. Light enough for all-day wear.', ['Suede and mesh upper', 'EVA cushioned midsole', 'Rubber outsole', 'True to size']],
  ['dad-cap', 'Classic Dad Cap', 'unisex', 'Accessories', 'cap', 599, null, ['slate', 'navy', 'lavender'], ONE, '2026-04-12', ['essentials'], ['cap', 'hat'],
    'A soft six-panel cap with a curved brim and an adjustable strap.', ['Washed cotton twill', 'Adjustable back strap', 'Embroidered eyelets', 'One size fits most']],
  ['tech-joggers', 'Tech Cargo Joggers', 'men', 'Bottoms', 'cargo', 1799, null, ['black', 'stone'], WAIST, '2026-11-12', ['move'], ['joggers', 'stretch', 'utility'],
    'Four-way stretch joggers with zip cargo pockets. Made to move from the gym to the street.', ['Nylon-elastane stretch', 'Slim tapered fit', 'Zip cargo pockets', 'Elastic cuffs']],
  ['zip-utility-hoodie', 'Zip Utility Hoodie', 'men', 'Hoodies', 'hoodie', 2099, 2599, ['black', 'olive'], CLOTH, '2026-07-02', [], ['zip', 'fleece'],
    'A full-zip hoodie with a structured hood and hidden phone pocket.', ['340 GSM fleece', 'Regular fit', 'Two-way zip', 'Hidden phone pocket']],
  ['cropped-hoodie', 'Cropped Hoodie', 'women', 'Hoodies', 'cropped-hoodie', 1599, null, ['lavender', 'cream', 'black'], CLOTH, '2026-11-02', ['move'], ['cropped', 'fleece'],
    'A cropped hoodie that hits right at the waist. Soft fleece, wide sleeves, made to pair with high-rise bottoms.', ['320 GSM brushed fleece', 'Cropped boxy fit', 'Wide sleeves', 'Raw-edge hem']],
  ['wide-leg-jeans', 'Wide-Leg Jeans', 'women', 'Bottoms', 'wide', 1899, 2599, ['indigo', 'washed'], WAIST, '2026-06-08', [], ['denim', 'high rise', 'wide leg'],
    'High-rise jeans with a full wide leg that skims the floor.', ['100% cotton denim', 'High rise, wide leg', 'Five-pocket styling', 'Zip fly']],
  ['fitted-baby-tee', 'Fitted Baby Tee', 'women', 'T-Shirts', 'tee', 699, null, ['white', 'black', 'lilac'], CLOTH, '2026-05-14', ['essentials'], ['fitted', 'rib', 'basic'],
    'A fitted tee in stretch rib cotton. Short sleeves and a slightly cropped length.', ['Stretch rib cotton', 'Fitted, slightly cropped', 'Crew neck', 'Machine wash cold']],
  ['oversized-sweatshirt', 'Oversized Sweatshirt', 'women', 'Sweatshirts', 'sweat', 1299, null, ['cream', 'charcoal', 'lavender'], CLOTH, '2026-09-01', ['essentials'], ['oversized', 'fleece', 'crew neck'],
    'An oversized crew with dropped shoulders and a long body. Wear it alone or over a shirt.', ['330 GSM fleece', 'Oversized fit', 'Dropped shoulders', 'Ribbed trims']],
  ['satin-bomber', 'Satin Bomber', 'women', 'Jackets', 'bomber', 2799, null, ['black', 'electric'], CLOTH, '2026-11-15', ['move'], ['bomber', 'satin', 'statement'],
    'A glossy satin bomber with a padded lining and ribbed trims. The statement layer of the season.', ['Satin shell, padded lining', 'Relaxed fit', 'Ribbed collar, cuffs and hem', 'Two-way zip']],
  ['parachute-pants', 'Parachute Pants', 'women', 'Bottoms', 'cargo', 1599, null, ['stone', 'black', 'lavender'], WAIST, '2026-10-20', ['move'], ['parachute', 'nylon', 'toggle'],
    'Light nylon pants with a drawcord waist and toggle hems you can cinch or leave loose.', ['Crinkle nylon', 'Relaxed wide fit', 'Drawcord waist', 'Toggle hems']],
  ['rib-knit-tee', 'Rib Knit Tee', 'women', 'T-Shirts', 'tee', 799, 999, ['sand', 'black'], CLOTH, '2026-03-28', [], ['rib', 'fitted'],
    'A soft rib tee with a scoop neck and a close fit.', ['Modal-cotton rib', 'Close fit', 'Scoop neck', 'Hand wash recommended']],
  ['platform-sneakers', 'Platform Sneakers', 'women', 'Footwear', 'platform', 2699, null, ['white', 'lilac'], SHOE, '2026-10-28', [], ['sneakers', 'platform', 'shoes'],
    'Leather court sneakers on a 4 cm platform sole.', ['Leather upper', '4 cm platform', 'Padded collar', 'Runs half a size large']],
  ['bucket-hat', 'Bucket Hat', 'unisex', 'Accessories', 'bucket', 699, null, ['black', 'lavender'], ONE, '2026-06-30', [], ['hat', 'bucket'],
    'A soft cotton bucket hat with a short, structured brim.', ['Cotton twill', 'Short brim', 'Stitched crown', 'One size fits most']],
  ['canvas-tote', 'Canvas Tote', 'unisex', 'Accessories', 'tote', 799, null, ['offwhite', 'black'], ONE, '2026-02-11', ['essentials'], ['bag', 'tote', 'canvas'],
    'A heavy canvas tote that fits a laptop, a hoodie and lunch.', ['16 oz cotton canvas', 'Inside zip pocket', 'Reinforced handles', '40 x 38 cm']],
  ['denim-trucker', 'Denim Trucker Jacket', 'women', 'Jackets', 'jacket', 2499, 3199, ['indigo', 'black'], CLOTH, '2026-04-04', [], ['denim', 'jacket', 'trucker'],
    'A classic trucker jacket in mid-weight denim, cut slightly boxy.', ['100% cotton denim', 'Boxy fit', 'Chest flap pockets', 'Shank buttons']],
  ['graphic-longsleeve', 'Graphic Long Sleeve', 'unisex', 'T-Shirts', 'longsleeve', 1099, null, ['black', 'white'], CLOTH, '2026-10-10', [], ['long sleeve', 'graphic'],
    'A long-sleeve tee with a sleeve print and a relaxed body.', ['220 GSM cotton', 'Relaxed fit', 'Sleeve print', 'Ribbed cuffs']],
];

function hash(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

const products = DEFS.map(([id, name, gender, type, art, price, compareAt, colours, sizes, createdAt, collections, tags, description, details], i) => {
  const r = rng(hash(id));
  const stock = {};
  const colors = colours.map((k) => { const [n, hex, family] = C[k]; return { name: n, hex, family }; });
  for (const c of colors) {
    stock[c.name] = {};
    for (const s of sizes) {
      const x = r();
      stock[c.name][s] = x < 0.1 ? 0 : x < 0.26 ? 1 + Math.floor(r() * 3) : 4 + Math.floor(r() * 14);
    }
    if (Object.values(stock[c.name]).every((n) => n === 0)) stock[c.name][sizes[0]] = 6;
  }
  const isNew = createdAt >= '2026-10-01';
  return {
    id, name, gender, type, art, price, ...(compareAt ? { compareAt } : {}),
    rating: Math.round((4.2 + r() * 0.75) * 10) / 10,
    reviewCount: 24 + Math.floor(r() * 460),
    popularity: Math.round(40 + r() * 60),
    trending: Math.round((isNew ? 55 : 20) + r() * 45),
    featured: i,
    createdAt, isNew, collections, tags, description, details,
    colors, sizes, stock,
  };
});

const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'products.json');
writeFileSync(out, JSON.stringify(products, null, 2) + '\n');
console.log(`Wrote ${products.length} products to ${out}`);
