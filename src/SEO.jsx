import { useEffect } from "react";

function upsertMeta(name, content, isProperty = false) {
  const attribute = isProperty ? "property" : "name";
  const selector = isProperty
    ? `meta[property="${name}"]`
    : `meta[name="${name}"]`;

  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel, href, extraAttributes = {}) {
  let selector = `link[rel="${rel}"]`;

  if (extraAttributes.hreflang) {
    selector += `[hreflang="${extraAttributes.hreflang}"]`;
  }

  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);

  Object.entries(extraAttributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertJsonLd(id, data) {
  let script = document.getElementById(id);

  if (!script) {
    script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export default function SEO({
  title,
  description,
  canonicalPath = "/",
  ogImage = "/images/hero1.jpg",
}) {
  useEffect(() => {
    document.title = title;

    const SITE_URL = "https://taroversereadings.com";
    const pageUrl = `${SITE_URL}${canonicalPath}`;
    const imageUrl = `${SITE_URL}${ogImage}`;
    const logoUrl = `${SITE_URL}/images/logo.jpeg`;

    // Basic SEO
    upsertMeta("description", description);

    upsertMeta(
      "robots",
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    upsertMeta("author", "TaroVerse Readings");

    upsertMeta(
      "keywords",
      "online tarot reading, tarot reading India, tarot card reading, love tarot reading, career tarot reading, spiritual guidance, tarot sessions"
    );

    upsertMeta("theme-color", "#6B21A8");
    upsertMeta("application-name", "TaroVerse Readings");
    upsertMeta("apple-mobile-web-app-title", "TaroVerse");
    upsertMeta("format-detection", "telephone=no");

    // Open Graph
    upsertMeta("og:site_name", "TaroVerse Readings", true);
    upsertMeta("og:type", "website", true);
    upsertMeta("og:locale", "en_IN", true);
    upsertMeta("og:title", title, true);
    upsertMeta("og:description", description, true);
    upsertMeta("og:url", pageUrl, true);
    upsertMeta("og:image", imageUrl, true);
    upsertMeta(
      "og:image:alt",
      "Professional Tarot Reading by TaroVerse",
      true
    );
    upsertMeta("og:image:width", "1200", true);
    upsertMeta("og:image:height", "630", true);

    // Twitter
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:image", imageUrl);
    upsertMeta("twitter:site", "@taroverse5");
    upsertMeta("twitter:creator", "@taroverse5");

    // Canonical
    upsertLink("canonical", pageUrl);

    // Alternate language
    upsertLink("alternate", SITE_URL, {
      hreflang: "en-IN",
    });

    // Favicon
    upsertLink("icon", `${SITE_URL}/favicon.ico`);

    // Business Schema
    upsertJsonLd("taroverse-business", {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "TaroVerse Readings",
      url: SITE_URL,
      description,
      image: imageUrl,
      logo: logoUrl,

      sameAs: [
        "https://www.instagram.com/taroverse.readings",
        "https://www.linkedin.com/company/taroverse-readings/",
        "https://www.facebook.com/taroverse.readings",
        "https://x.com/taroverse5",
        "https://www.youtube.com/@TaroVerse.readings",
      ],

      areaServed: {
        "@type": "Country",
        name: "India",
      },

      serviceType: "Online Tarot Reading",

      email: "taroverse.readings@gmail.com",

      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Tarot Reading Services",

        itemListElement: [
          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",
              name: "Single Card Insight",
            },
          },

          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",
              name: "Three Card Reading",
            },
          },

          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",
              name: "Love & Relationship Reading",
            },
          },

          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",
              name: "Career Reading",
            },
          },

          {
            "@type": "Offer",

            itemOffered: {
              "@type": "Service",
              name: "Personal Guidance Session",
            },
          },
        ],
      },
    });

    // Website Schema
    upsertJsonLd("taroverse-website", {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "TaroVerse Readings",
      url: SITE_URL,
      inLanguage: "en-IN",
      publisher: {
        "@type": "Organization",
        name: "TaroVerse Readings",
      },
    });

    // Organization Schema
    upsertJsonLd("taroverse-organization", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "TaroVerse Readings",
      url: SITE_URL,
      logo: logoUrl,

      sameAs: [
        "https://www.instagram.com/taroverse.readings",
        "https://www.linkedin.com/company/taroverse-readings/",
        "https://www.facebook.com/taroverse.readings",
        "https://x.com/taroverse5",
        "https://www.youtube.com/@TaroVerse.readings",
      ],
    });

    // Breadcrumbs (helps search engines understand site structure)
    upsertJsonLd("taroverse-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Services",
          "item": `${SITE_URL}/manifestations`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Schedule",
          "item": `${SITE_URL}/schedule`
        }
      ]
    });
  }, [title, description, canonicalPath, ogImage]);

  return null;
}