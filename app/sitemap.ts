import { MetadataRoute } from 'next'
import { productsApi } from '@/lib/api/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://grahadventures.co.ke'

    // Static routes
    const routes = [
        '',
        '/search',
        '/contact',
        '/cart',
        '/wishlist',
        '/pages/returns',
        '/pages/support',
        '/pages/privacy',
        '/pages/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    try {
        // Fetch categories for sitemap
        const categories = await productsApi.getCategories()
        const categoryRoutes = categories.map((category) => ({
            url: `${baseUrl}/categories/${category.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        // Fetch products for sitemap (limit to 100 for now to keep sitemap manageable)
        const productsData = await productsApi.searchProducts({ limit: 100 })
        const productRoutes = productsData.products.map((product) => ({
            url: `${baseUrl}/products/${product.slug || product.ID}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        return [...routes, ...categoryRoutes, ...productRoutes]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return routes
    }
}
