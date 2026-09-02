import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jyut.hk';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          'zh-HK': baseUrl,
          'zh-Hant': baseUrl,
          'zh-Hans': baseUrl,
          'x-default': baseUrl,
        },
      },
    },
  ];
}
