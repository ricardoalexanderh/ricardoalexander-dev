import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const SITE_URL = 'https://www.ricardoalexander.dev'

interface PageMeta {
  path: string
  title: string
  description: string
  image: string
  imageAlt: string
}

const HOME: PageMeta = {
  path: '/',
  title: 'Ricardo Alexander - Software Architect & Technology Entrepreneur',
  description: 'Software Architect & Full-Stack Developer with 20+ years of experience. Co-Founder at SparkWorks, serving Fortune 500 companies.',
  image: '/og/home.jpg',
  imageAlt: 'Ricardo Alexander — Technology Entrepreneur & Software Architect',
}

const NOW_IMAGE = { image: '/og/now.jpg', imageAlt: 'Now — a pixel companion widget showing the time and progress bars' }

// Extra HTML files, keyed by output file. vercel.json rewrites each path to its file.
const PAGES: Record<string, PageMeta> = {
  'products/now.html': {
    path: '/products/now',
    title: 'Now — Your Desktop Pixel Companion',
    description: 'A tiny pixel companion that sits on your screen, always present and never demanding. Clock, progress bars, pomodoro, and notes, with 6 companions to choose from. One-time purchase.',
    ...NOW_IMAGE,
  },
  'products/now/terms.html': {
    path: '/products/now/terms',
    title: 'Terms of Service · Now',
    description: 'Terms for buying and using Now, the desktop pixel companion by XANDR.',
    ...NOW_IMAGE,
  },
  'products/now/privacy.html': {
    path: '/products/now/privacy',
    title: 'Privacy Policy · Now',
    description: 'How Now and its website handle your data.',
    ...NOW_IMAGE,
  },
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function metaTags(p: PageMeta) {
  const [title, description, alt] = [escape(p.title), escape(p.description), escape(p.imageAlt)]
  const url = SITE_URL + p.path
  const image = SITE_URL + p.image
  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Ricardo Alexander" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${alt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />`
}

// Link previews (WhatsApp, X, LinkedIn…) read the raw HTML without running JS, so each
// shareable page needs its own HTML file with its title and preview tags baked in.
function pageMeta(): Plugin {
  const homeTags = metaTags(HOME)
  return {
    name: 'page-meta',
    enforce: 'post',
    transformIndexHtml: (html) => html.replace('<!-- page-meta -->', homeTags),
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (index?.type !== 'asset') return
      const html = String(index.source)
      for (const [fileName, page] of Object.entries(PAGES)) {
        this.emitFile({ type: 'asset', fileName, source: html.replace(homeTags, metaTags(page)) })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pageMeta()],
})
