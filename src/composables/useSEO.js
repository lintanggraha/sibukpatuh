/**
 * useSEO.js — Composable untuk inject per-page structured data
 *
 * Digunakan di setiap view untuk menambahkan:
 * - BreadcrumbList schema (untuk breadcrumb di Google SERP)
 * - Article/TechArticle schema (untuk rich results)
 * - Per-page canonical URL
 */

/**
 * Inject JSON-LD script tag ke head
 * @param {Object} schema - Schema.org object
 * @param {string} id - Unique ID untuk script tag (agar tidak duplikat)
 */
function injectSchema(schema, id) {
  // Hapus yang lama jika ada
  const existing = document.getElementById(`schema-${id}`);
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = `schema-${id}`;
  script.textContent = JSON.stringify(schema, null, 2);
  document.head.appendChild(script);
}

/**
 * Setup SEO untuk halaman framework/regulasi
 * @param {Object} options
 * @param {string} options.title - Judul halaman
 * @param {string} options.description - Deskripsi halaman
 * @param {string} options.path - URL path (e.g. '/frameworks/iso27001')
 * @param {string} options.category - Kategori (e.g. 'Framework Internasional')
 * @param {string} options.breadcrumbName - Nama untuk breadcrumb (e.g. 'ISO 27001:2022')
 * @param {string[]} [options.keywords] - Array kata kunci
 * @param {string} [options.dateModified] - Tanggal terakhir dimodifikasi (ISO 8601)
 */
export function usePageSEO(options) {
  const {
    title,
    description,
    path,
    category,
    breadcrumbName,
    keywords = [],
    dateModified = '2026-08-04',
  } = options;

  const canonicalUrl = `https://sibukpatuh.net${path}`;

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Beranda',
        'item': 'https://sibukpatuh.net/',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': category,
        'item': `https://sibukpatuh.net/`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': breadcrumbName,
        'item': canonicalUrl,
      },
    ],
  };

  // TechArticle Schema untuk konten edukatif
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': title,
    'description': description,
    'url': canonicalUrl,
    'inLanguage': 'id-ID',
    'dateModified': dateModified,
    'datePublished': '2026-01-01',
    'author': {
      '@type': 'Person',
      '@id': 'https://sibukpatuh.net/#person',
      'name': 'Lintang',
      'url': 'https://sibukpatuh.net/about',
    },
    'publisher': {
      '@type': 'Organization',
      '@id': 'https://sibukpatuh.net/#organization',
      'name': 'SibukPatuh',
      'url': 'https://sibukpatuh.net/',
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    'keywords': keywords.join(', '),
    'articleSection': category,
    'educationalLevel': 'Professional',
    'learningResourceType': 'Reference',
    'audience': {
      '@type': 'Audience',
      'audienceType': 'IT Professionals, Compliance Officers, Auditors',
    },
  };

  // Inject schemas
  if (typeof document !== 'undefined') {
    injectSchema(breadcrumbSchema, `breadcrumb-${path.replace(/\//g, '-')}`);
    injectSchema(articleSchema, `article-${path.replace(/\//g, '-')}`);
  }
}

/**
 * Setup SEO untuk halaman tools (Gap Analysis, Simulator, dll)
 */
export function useToolSEO(options) {
  const {
    title,
    description,
    path,
    toolName,
    dateModified = '2026-08-04',
  } = options;

  const canonicalUrl = `https://sibukpatuh.net${path}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Beranda',
        'item': 'https://sibukpatuh.net/',
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Alat Interaktif',
        'item': 'https://sibukpatuh.net/',
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': toolName,
        'item': canonicalUrl,
      },
    ],
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': toolName,
    'description': description,
    'url': canonicalUrl,
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web Browser',
    'inLanguage': 'id-ID',
    'isAccessibleForFree': true,
    'dateModified': dateModified,
    'author': {
      '@type': 'Person',
      '@id': 'https://sibukpatuh.net/#person',
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'IDR',
    },
  };

  if (typeof document !== 'undefined') {
    injectSchema(breadcrumbSchema, `breadcrumb-${path.replace(/\//g, '-')}`);
    injectSchema(softwareSchema, `software-${path.replace(/\//g, '-')}`);
  }
}
