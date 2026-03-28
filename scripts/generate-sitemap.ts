import { bouquetProducts } from '../src/lib/catalogData';
import { landingPages } from '../src/lib/landingPagesData';
import { blogArticles } from '../src/lib/blogData';
import { roomDecorPackages } from '../src/lib/roomDecorData';
import { writeFileSync } from 'fs';

const BASE = 'https://www.charlsflowers.com';
const today = new Date().toISOString().split('T')[0];

interface SitemapEntry {
  loc: string;
  changefreq: string;
  priority: string;
}

const entries: SitemapEntry[] = [
  // Homepage
  { loc: '/', changefreq: 'daily', priority: '1.0' },
  
  // Collections
  { loc: '/bouquets', changefreq: 'weekly', priority: '0.9' },
  { loc: '/room-decors', changefreq: 'weekly', priority: '0.9' },
  { loc: '/bouquets/personalizar', changefreq: 'monthly', priority: '0.8' },
  
  // Products - Bouquets
  ...bouquetProducts.map(p => ({
    loc: `/bouquets/all/${p.shopifyHandle}`,
    changefreq: 'weekly',
    priority: '0.8',
  })),
  
  // Products - Room Decors
  ...roomDecorPackages.map(p => ({
    loc: `/room-decors/${p.id}`,
    changefreq: 'weekly',
    priority: '0.8',
  })),
  
  // Landing pages
  ...landingPages.map(p => ({
    loc: `/${p.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
  })),
  
  // Blog
  { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
  ...blogArticles.map(a => ({
    loc: `/blog/${a.slug}`,
    changefreq: 'monthly',
    priority: '0.7',
  })),
  
  // Static pages
  ...['/delivery', '/about', '/contact', '/faq', '/sitemap'].map(path => ({
    loc: path,
    changefreq: 'monthly' as const,
    priority: '0.6',
  })),
  
  // Legal
  ...['/privacy-policy', '/terms-of-service', '/refund-policy', '/shipping-policy', '/cookie-policy'].map(path => ({
    loc: path,
    changefreq: 'yearly' as const,
    priority: '0.3',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(e => `  <url>
    <loc>${BASE}${e.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('public/sitemap.xml', xml);
console.log(`✅ Generated sitemap.xml with ${entries.length} URLs`);
