import { getBestsellers, getNewArrivals } from '@/data/products'
import { HomeHero } from '@/components/catalog/HomeHero'
import { CredibilityStrip } from '@/components/catalog/CredibilityStrip'
import { CategoryTiles } from '@/components/catalog/CategoryTiles'
import { ProductSection } from '@/components/catalog/ProductSection'
import { BrewFinder } from '@/components/catalog/BrewFinder'
import { StorySection } from '@/components/catalog/StorySection'
import { Testimonials } from '@/components/catalog/Testimonials'
import { ClosingCta } from '@/components/catalog/ClosingCta'

export default function Home() {
  return (
    <>
      <HomeHero />
      <CredibilityStrip />
      <CategoryTiles />

      <ProductSection
        eyebrow="Bestsellers"
        title="The ones we keep re-stocking."
        description="The bags and tools our regulars come back for, roasted in small batches every Tuesday."
        products={getBestsellers(4)}
        ctaLabel="Shop all coffee"
        ctaHref="/shop?category=coffee"
      />

      <ProductSection
        eyebrow="Just landed"
        title="New this harvest."
        description="Fresh crop, new gear and a few quiet additions to the shelf."
        products={getNewArrivals(3)}
        ctaLabel="Browse the shop"
        ctaHref="/shop"
        columns={3}
        tone="surface"
      />

      <BrewFinder />
      <StorySection />
      <Testimonials />
      <ClosingCta />
    </>
  )
}
