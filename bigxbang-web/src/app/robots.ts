import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Ne pas indexer les routes API
        },
        sitemap: 'https://bigxbang.studio/sitemap.xml',
    }
}
