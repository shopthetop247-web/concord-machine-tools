import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '@/lib/sanityClient'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

interface BlogPost {
  title: string
  excerpt?: string
  publishedAt: string
  body: any[]
  mainImage?: {
    asset: {
      url: string
    }
    alt?: string
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

// Fetch single post by slug
async function getPost(slug: string): Promise<BlogPost | null> {
  return client.fetch(
    `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      excerpt,
      publishedAt,
      body,
      seo {
        metaTitle,
        metaDescription
      },
      mainImage {
        asset->{
          url
        },
        alt
      }
    }
  `,
    { slug }
  )
}

// Dynamic SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) return {}

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {post.title}
        </h1>

        <p className="text-sm text-slate-500">
          {new Date(post.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </header>

      {post.mainImage?.asset?.url && (
        <div className="relative w-full h-[400px] mb-10 rounded-lg overflow-hidden">
          <Image
            src={post.mainImage.asset.url}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-slate max-w-none prose-p:my-5">
        <PortableText value={post.body} />
      </div>
    </article>
  )
}
