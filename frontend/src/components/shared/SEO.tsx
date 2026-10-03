import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  publishedAt?: string;
  modifiedAt?: string;
  author?: string;
  section?: string;
}

export function SEO({
  title,
  description = "Analyze food labels and get detailed nutritional information instantly",
  keywords = "food analysis, nutrition facts, food scanner, health score, allergens, ingredients",
  image = "/placeholder.svg",
  url = window.location.href,
  type = "website",
  publishedAt,
  modifiedAt,
  author = "Wellness AI Lens Team",
  section = "Wellness AI Lens",
}: SEOProps) {
  const siteName = "Wellness AI Lens";
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: siteName,
          description: description,
          url: url,
          applicationCategory: "HealthApplication",
          operatingSystem: "Web",
          author: {
            "@type": "Organization",
            name: author,
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          screenshot: image,
          datePublished: publishedAt,
          dateModified: modifiedAt,
          provider: {
            "@type": "Organization",
            name: "Wellness AI Lens",
            description:
              "AI-powered food analysis and nutrition tracking platform",
          },
        })}
      </script>

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Additional SEO tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={author} />
      {publishedAt && (
        <meta name="article:published_time" content={publishedAt} />
      )}
      {modifiedAt && <meta name="article:modified_time" content={modifiedAt} />}
      <meta name="article:section" content={section} />

      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === "article" ? "Article" : "WebSite",
          headline: title,
          description: description,
          image: image,
          author: {
            "@type": "Organization",
            name: author,
          },
          publisher: {
            "@type": "Organization",
            name: siteName,
            logo: {
              "@type": "ImageObject",
              url: "/favicon.ico",
            },
          },
          ...(publishedAt && { datePublished: publishedAt }),
          ...(modifiedAt && { dateModified: modifiedAt }),
          url: url,
        })}
      </script>
    </Helmet>
  );
}
