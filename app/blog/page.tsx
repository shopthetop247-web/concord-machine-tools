import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/lib/sanityClient'

export const metadata: Metadata = {
  title: 'Blog | Concord Machine Tools',
  description:
    'Insights, guides, and industry knowledge on CNC and metalworking machinery from Concord Machine Tools.',
}

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  publishedAt: string
  mainImage?: {
    asset?: {
      url: string
    }
  }
}

async function getPosts(): Promise<BlogPost[]> {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      publishedAt,
      tags[]->{
        title,
        slug
      },
      mainImage {
        asset->{
          url
        }
      }
    }
  `)
}

export default async function BlogIndexPage() {
  const posts = await getPosts()

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Blog</h1>

      <p className="text-slate-700 mb-12 max-w-3xl">
        Industry insights, machine guides, and expert perspectives on CNC and
        metalworking equipment from Concord Machine Tools.
      </p>

      {posts.length === 0 && (
        <p className="text-slate-600">No blog posts published yet.</p>
      )}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post._id}
            className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {post.mainImage?.asset?.url && (
              <Link href={`/blog/${post.slug.current}`}>
                <div className="relative h-48 w-full">
                  <Image
                    src={post.mainImage.asset.url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            )}

            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">
                <Link
                  href={`/blog/${post.slug.current}`}
                  className="hover:text-brandBlue transition"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-500 mb-3">
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>

              {post.excerpt && (
                <p className="text-slate-700 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
