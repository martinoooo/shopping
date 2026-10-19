import { useParams } from 'react-router-dom'
import { getProductBySlug } from '@/data/products'
import { usePageTitle } from '@/lib/hooks'
import { ProductNotFound } from '@/components/product/ProductNotFound'
import { ProductView } from '@/components/product/ProductView'

export default function Product() {
  const { slug } = useParams<{ slug: string }>()
  const product = getProductBySlug(slug)

  usePageTitle(product ? product.name : 'Product not found')

  if (!product) return <ProductNotFound />

  return <ProductView key={product.id} product={product} />
}
