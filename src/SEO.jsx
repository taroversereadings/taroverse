import { useEffect } from 'react';

function upsertMeta(name, content, isProperty = false) {
  const attribute = isProperty ? 'property' : 'name';
  const selector = `${isProperty ? 'meta[property="' : 'meta[name="'}${name}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let script = document.getElementById(id);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export default function SEO({ title, description, canonicalPath = '/', ogImage = '/images/hero1.jpg' }) {
  useEffect(() => {
    document.title = title;

    const url = `${window.location.origin}${canonicalPath}`;

    upsertMeta('description', description);
    upsertMeta('robots', 'index, follow');
    upsertMeta('og:site_name', 'TaroVerse Readings', true);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:title', title, true);
    upsertMeta('og:description', description, true);
    upsertMeta('og:url', url, true);
    upsertMeta('og:image', `${window.location.origin}${ogImage}`, true);
    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', `${window.location.origin}${ogImage}`);
    upsertLink('canonical', url);

    upsertJsonLd('taroverse-schema', {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'TaroVerse Readings',
      url: window.location.origin,
      description,
      image: `${window.location.origin}${ogImage}`,
      logo: `${window.location.origin}/images/logo.jpeg`,
      sameAs: [
        'https://www.instagram.com/taroverse.readings',
        'https://www.linkedin.com/company/taroverse-readings/',
        'https://www.facebook.com/taroverse.readings',
        'https://x.com/taroverse5',
        'https://www.youtube.com/@taroverse'
      ],
      areaServed: 'IN',
      serviceType: 'Tarot Reading',
      providerMobility: 'dynamic'
    });
  }, [title, description, canonicalPath, ogImage]);

  return null;
}
