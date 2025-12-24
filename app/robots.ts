import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.grahadventures.co.ke'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/account/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
