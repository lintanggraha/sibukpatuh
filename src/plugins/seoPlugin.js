/**
 * seoPlugin.js — Vue Plugin untuk auto-inject per-page SEO schema
 *
 * Plugin ini mendengarkan router.afterEach dan otomatis inject:
 * 1. BreadcrumbList schema (breadcrumb di Google SERP)
 * 2. TechArticle / SoftwareApplication schema (rich results)
 *
 * Tidak perlu modifikasi per-view — cukup daftarkan di main.js
 */

const ROUTE_SEO_CONFIG = {
  '/': {
    type: 'WebPage',
    breadcrumb: null, // Homepage tidak perlu breadcrumb
  },
  '/about': {
    type: 'AboutPage',
    breadcrumb: ['Beranda', 'Tentang SibukPatuh'],
  },
  '/contact': {
    type: 'ContactPage',
    breadcrumb: ['Beranda', 'Kontak'],
  },
  '/privacy-policy': {
    type: 'WebPage',
    breadcrumb: ['Beranda', 'Kebijakan Privasi'],
  },
  '/panduan-praktis': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Panduan Praktis'],
    keywords: 'panduan kepatuhan siber, evidence audit, baseline kontrol, GRC Indonesia',
    dateModified: '2026-08-15',
  },
  '/frameworks/iso27001': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Framework Internasional', 'ISO 27001:2022'],
    keywords: 'ISO 27001, ISO 27001:2022, SMKI, keamanan informasi, Annex A, sertifikasi ISO',
    dateModified: '2026-08-04',
  },
  '/frameworks/iso37001': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Framework Internasional', 'ISO 37001:2016'],
    keywords: 'ISO 37001, anti penyuapan, ABMS, anti bribery management system',
    dateModified: '2026-08-04',
  },
  '/frameworks/nist-csf-2': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Framework Internasional', 'NIST CSF 2.0'],
    keywords: 'NIST CSF 2.0, NIST Cybersecurity Framework, framework keamanan siber',
    dateModified: '2026-08-04',
  },
  '/frameworks/cobit-2019': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Framework Internasional', 'COBIT 2019'],
    keywords: 'COBIT 2019, tata kelola TI, IT governance, ISACA, GRC',
    dateModified: '2026-08-04',
  },
  '/frameworks/owasp-top-10': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Framework Internasional', 'OWASP Top 10'],
    keywords: 'OWASP Top 10, kerentanan web, web application security, SQL injection, XSS',
    dateModified: '2026-08-04',
  },
  '/frameworks/owasp-asvs': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Framework Internasional', 'OWASP ASVS 5.0.0'],
    keywords: 'OWASP ASVS, application security verification, standar keamanan aplikasi',
    dateModified: '2026-08-04',
  },
  '/frameworks/seojk': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Regulasi Nasional', 'SEOJK 29/2022'],
    keywords: 'SEOJK 29 2022, ketahanan siber perbankan, OJK cybersecurity, regulasi bank Indonesia',
    dateModified: '2026-08-04',
  },
  '/frameworks/pojk-11-2022': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Regulasi Nasional', 'POJK 11/2022'],
    keywords: 'POJK 11 2022, POJK 11 POJK.03 2022, penyelenggaraan teknologi informasi bank umum, tata kelola TI bank, ketahanan siber bank, pelaporan TI OJK',
    dateModified: '2026-08-12',
  },
  '/frameworks/pbi-02-2024': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Regulasi Nasional', 'PBI 02/2024'],
    keywords: 'PBI 02 2024, keamanan siber Bank Indonesia, KKS, ketahanan siber BI',
    dateModified: '2026-08-04',
  },
  '/frameworks/padk-1-2026': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Regulasi Nasional', 'PADK 1/2026'],
    keywords: 'PADK 1 2026, penyelenggaraan TI bank umum, OJK 2026, regulasi teknologi informasi bank',
    dateModified: '2026-08-04',
  },
  '/frameworks/padg-32-2025': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Regulasi Nasional', 'PADG 32/2025'],
    keywords: 'PADG 32 2025, sistem pembayaran Bank Indonesia, regulasi fintech BI',
    dateModified: '2026-08-04',
  },
  '/frameworks/panduan-resiliensi-ojk': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Regulasi Nasional', 'Panduan Resiliensi Digital OJK'],
    keywords: 'resiliensi digital OJK, ketahanan operasional bank, BCP, DRP',
    dateModified: '2026-08-04',
  },
  '/frameworks/uu-pdp-27-2022': {
    type: 'TechArticle',
    breadcrumb: ['Beranda', 'Regulasi Nasional', 'UU PDP 27/2022'],
    keywords: 'UU PDP, UU PDP 27 2022, perlindungan data pribadi, PDPA Indonesia',
    dateModified: '2026-08-04',
  },
  '/checklist-tools': {
    type: 'SoftwareApplication',
    breadcrumb: ['Beranda', 'Alat Interaktif', 'Checklist Tools'],
    keywords: 'gap analysis kepatuhan, checklist compliance, evaluasi kepatuhan siber',
    dateModified: '2026-08-04',
  },
  '/compliance-simulator': {
    type: 'SoftwareApplication',
    breadcrumb: ['Beranda', 'Alat Interaktif', 'Compliance Simulator'],
    keywords: 'compliance simulator, what-if analysis, skenario kepatuhan siber',
    dateModified: '2026-08-04',
  },
  '/cross-mapping': {
    type: 'SoftwareApplication',
    breadcrumb: ['Beranda', 'Alat Interaktif', 'Cross-Mapping Framework'],
    keywords: 'cross mapping compliance, framework comparison, pemetaan regulasi',
    dateModified: '2026-08-04',
  },
  '/framework-analysis': {
    type: 'SoftwareApplication',
    breadcrumb: ['Beranda', 'Alat Interaktif', 'Framework Analysis'],
    keywords: 'perbandingan framework kepatuhan, compliance comparison, ISO vs NIST',
    dateModified: '2026-08-04',
  },
  '/intel/intelligence-center': {
    type: 'SoftwareApplication',
    breadcrumb: ['Beranda', 'Alat Interaktif', 'Intelligence Center'],
    keywords: 'threat intelligence, OSINT, OTX AlienVault, CISA KEV, breach checker',
    dateModified: '2026-08-04',
  },
};

function removeSchema(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function injectSchema(id, schema) {
  removeSchema(id);
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

function buildBreadcrumbSchema(breadcrumbNames, path) {
  const baseUrl = 'https://sibukpatuh.net';
  const pathSegments = path.split('/').filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbNames.map((name, index) => {
      let url = baseUrl + '/';
      if (index === breadcrumbNames.length - 1) {
        url = `${baseUrl}${path}`;
      }
      return {
        '@type': 'ListItem',
        'position': index + 1,
        'name': name,
        'item': url,
      };
    }),
  };
}

function buildArticleSchema(route, config) {
  const canonicalUrl = `https://sibukpatuh.net${route.path}`;
  const title = route.meta?.title || 'SibukPatuh';
  const description = route.meta?.description || '';

  if (config.type === 'TechArticle') {
    return {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      'headline': title,
      'description': description,
      'url': canonicalUrl,
      'inLanguage': 'id-ID',
      'dateModified': config.dateModified || '2026-08-04',
      'datePublished': '2026-01-01',
      'keywords': config.keywords || '',
      'author': {
        '@type': 'Person',
        '@id': 'https://sibukpatuh.net/#person',
        'name': 'Lintang',
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
      'educationalLevel': 'Professional',
      'learningResourceType': 'Reference',
      'audience': {
        '@type': 'Audience',
        'audienceType': 'IT Professionals, Compliance Officers, Auditors',
      },
    };
  }

  if (config.type === 'SoftwareApplication') {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': title,
      'description': description,
      'url': canonicalUrl,
      'applicationCategory': 'BusinessApplication',
      'operatingSystem': 'Web Browser',
      'inLanguage': 'id-ID',
      'isAccessibleForFree': true,
      'dateModified': config.dateModified || '2026-08-04',
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
  }

  return null;
}

export const seoPlugin = {
  install(app, { router }) {
    router.afterEach((to) => {
      const config = ROUTE_SEO_CONFIG[to.path];
      if (!config) return;

      const safeId = to.path.replace(/\//g, '-').replace(/^-/, '') || 'home';

      // Inject BreadcrumbList
      if (config.breadcrumb && config.breadcrumb.length > 0) {
        const breadcrumbSchema = buildBreadcrumbSchema(config.breadcrumb, to.path);
        injectSchema(`seo-breadcrumb-${safeId}`, breadcrumbSchema);
      }

      // Inject Article / SoftwareApplication schema
      const articleSchema = buildArticleSchema(to, config);
      if (articleSchema) {
        injectSchema(`seo-article-${safeId}`, articleSchema);
      }
    });
  },
};
