# Static Site Stack

For portfolios, landing pages, documentation, blogs. Zero ongoing cost, maximum performance.

## The Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Astro 5 | Ships zero JS by default, content-focused |
| Hosting | Cloudflare Pages | Free, unlimited bandwidth, global CDN |
| Styling | Tailwind CSS | Utility-first, purges unused CSS |
| CMS | MDX files or Sanity | MDX: git-based. Sanity: visual editing |
| Analytics | CF Web Analytics (free) or Plausible ($9/mo) | Privacy-friendly, lightweight |
| Forms | Formspree or Resend | No backend needed |
| Domain | Cloudflare Registrar | At-cost pricing, no markup |

## Monthly Cost

| Component | Cost |
|-----------|------|
| Hosting | $0 (CF Pages free tier) |
| Domain | $10-15/year |
| Analytics | $0 (CF) or $9/mo (Plausible) |
| **Total** | **$0-9/mo** |

## Why Astro

Astro ships zero JavaScript to the browser by default. Pages load instantly. Perfect for content-heavy sites where interactivity concentrations around specific components.

Need a React component? Use island architecture:

```astro
---
// src/pages/index.astro
import Header from '../components/Header.astro'
import ContactForm from '../components/ContactForm' // React
---

<Header />
<main>
  <h1>My Site</h1>
  <p>Static content, no JS shipped for this part.</p>

  <!-- Only this component ships JavaScript -->
  <ContactForm client:visible />
</main>
```

`client:visible` loads JS only when the component scrolls into view. Other options: `client:load` (immediately), `client:idle` (after page loads), `client:media` (at breakpoint).

For fully static sites with no interactivity, zero JS reaches the browser. Lighthouse 100 across the board.

## Why Cloudflare Pages

- **Free tier:** unlimited sites, unlimited bandwidth, 500 builds/month
- **Global CDN:** 300+ edge locations, pages load fast everywhere
- **Preview deploys:** every branch gets a URL
- **Custom domains:** free SSL, automatic HTTPS
- **Web Analytics:** free, privacy-friendly, no cookie banner needed

## Setup

### 1. Create Project

```bash
npm create astro@latest my-site
# Choose: blog template (or empty)
cd my-site
npx astro add tailwind
```

### 2. Project Structure

```
src/
  pages/         - Routes (.astro or .md files)
  content/       - Blog posts, projects (MDX/MD)
  components/    - .astro components (zero JS)
  layouts/       - Page layouts
  styles/        - Global CSS
public/          - Static assets (images, fonts)
astro.config.mjs - Astro configuration
```

### 3. Content Collections

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
})

export const collections = { posts }
```

### 4. Deploy to Cloudflare Pages

```bash
# Option A: Cloudflare Dashboard
# Connect GitHub repo → Build command: npm run build → Output: dist/

# Option B: Wrangler CLI
npm i -D wrangler
npx wrangler pages deploy dist/
```

### 5. Custom Domain

In Cloudflare Pages dashboard:
1. Custom domains → Add domain
2. Point DNS to Pages (automatic if domain uses Cloudflare DNS)
3. SSL activates automatically

## When to Use Next.js Instead

Astro wins for content sites. Next.js wins when you need:

- Heavy client-side interactivity (dashboards, apps)
- API routes / server logic
- Authentication
- Database access

For a marketing site with a contact form, Astro. For a marketing site with a login area and user dashboard, Next.js.

## Adding a Blog

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content'
import Layout from '../../layouts/Layout.astro'

const posts = (await getCollection('posts'))
  .filter(p => !p.data.draft)
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
---

<Layout title="Blog">
  <h1>Blog</h1>
  {posts.map(post => (
    <article>
      <a href={`/blog/${post.id}`}>
        <h2>{post.data.title}</h2>
        <time>{post.data.date.toLocaleDateString()}</time>
        <p>{post.data.description}</p>
      </a>
    </article>
  ))}
</Layout>
```

## Adding a Contact Form

No backend needed. Use Formspree:

```astro
---
// src/components/ContactForm.astro
---
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <label>Email<input type="email" name="email" required /></label>
  <label>Message<textarea name="message" required></textarea></label>
  <button type="submit">Send</button>
</form>
```

Or use Resend with an Astro API endpoint (requires SSR adapter):

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData()
  await resend.emails.send({
    from: 'site@yourdomain.com',
    to: 'you@email.com',
    subject: `Contact from ${data.get('email')}`,
    text: String(data.get('message')),
  })
  return Response.json({ ok: true })
}
```

## Performance Checklist

```
[ ] Images: use Astro's <Image> component (auto-optimized)
[ ] Fonts: self-host, use font-display: swap
[ ] CSS: Tailwind purges unused classes automatically
[ ] No unnecessary client:load directives
[ ] Test with Lighthouse (target: 100/100/100/100)
```
