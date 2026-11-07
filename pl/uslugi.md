# Katalog usług

> Usługi w dwunastu kategoriach, każda z jednym zdaniem i linkiem do źródła.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Jak czytać katalog

Każda pozycja ma jedno zdanie oparte na opisie z oficjalnej strony usługi (stan 7.11.2026). Kwot nie ma: cenniki zmieniają się często, więc sprawdzaj je u źródła. Wersja angielska z lutego 2026 roku podawała ceny i limity darmowych planów, ale nie dało się ich wszystkich potwierdzić, więc je usunąłem.

## Hosting i wdrożenie

| Usługa | Co robi |
|---|---|
| [Vercel](https://vercel.com/) | wdrożenia stron i funkcji serwerowych, twórca Next.js; Fluid compute zmniejsza zimne starty |
| [Netlify](https://www.netlify.com/) | wdrażanie stron i aplikacji, z AI albo z kodu |
| [Cloudflare Pages](https://pages.cloudflare.com/) | serwerless platforma do aplikacji frontendowych i pełnych |
| [Cloudflare Workers](https://www.cloudflare.com/developer-platform/products/workers/) | funkcje na brzegu sieci Cloudflare |
| [Railway](https://railway.com/) | aplikacje, funkcje i zadania w tle z zarządzanymi bazami (Postgres, MySQL, Redis, MongoDB) |
| [Fly.io](https://fly.io/) | aplikacje, agenci i bazy na izolowanych maszynach wirtualnych, płatność za sekundy pracy |
| [Render](https://render.com/) | chmura do aplikacji i agentów |
| [Hetzner Cloud](https://www.hetzner.com/cloud) | serwery w chmurze, zgodność z RODO |
| [DigitalOcean](https://www.digitalocean.com/) | chmura dla aplikacji, agentów i inferencji AI |

Szybki wybór: aplikacja Next.js na Vercel, strona statyczna na Vercel albo Cloudflare Pages, aplikacja z bazą na Railway albo Fly.io, własny serwer na Hetznerze.

## Bazy danych

| Usługa | Co robi |
|---|---|
| [Supabase](https://supabase.com/) | Postgres z logowaniem, gotowym API, Realtime, funkcjami, plikami i wektorami |
| [Neon](https://neon.com/) | Postgres od Databricks z gałęziami, autoskalowaniem i skalowaniem do zera |
| [PlanetScale](https://www.planetscale.com/) | hosting baz Vitess (MySQL) i Postgres |
| [Turso](https://turso.tech/) | baza na bazie SQLite dla nowoczesnych aplikacji |
| [Upstash](https://upstash.com/) | serverless Redis, Vector, QStash, Workflow i Search |
| [MongoDB Atlas](https://www.mongodb.com/) | baza dokumentowa w chmurze |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | SQLite na brzegu sieci, do 10 GB na bazę w planie płatnym |

Szybki wybór: start z wszystkim w jednym Supabase, sam Postgres bez serwera Neon, pamięć podręczna i kolejki Upstash.

## Logowanie

| Usługa | Co robi |
|---|---|
| [Supabase Auth](https://supabase.com/docs/guides/auth) | logowanie e-mailem, telefonem, kontami społecznościowymi i z MFA, w pakiecie Supabase |
| [Clerk](https://clerk.com/) | gotowe logowanie i zarządzanie użytkownikami dla React i Next.js |
| [Better Auth](https://better-auth.com/) | framework do logowania |
| [Auth.js](https://authjs.dev/) | logowanie dla aplikacji webowych |

## Płatności

| Usługa | Co robi |
|---|---|
| [Stripe](https://stripe.com/) | płatności, subskrypcje i rozliczenia |
| [Paddle](https://www.paddle.com/) | płatności, subskrypcje i podatki dla SaaS i aplikacji mobilnych |
| [Lemon Squeezy](https://www.lemonsqueezy.com/) | płatności, podatki i subskrypcje dla firm z oprogramowaniem |

## E-mail

| Usługa | Co robi |
|---|---|
| [Resend](https://resend.com/) | wysyłka maili transakcyjnych i marketingowych dla programistów |
| [Postmark](https://postmarkapp.com/) | szybka wysyłka maili przez SMTP i API |

## Pliki i CDN

| Usługa | Co robi |
|---|---|
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | magazyn plików bez opłat za transfer wychodzący, dostęp m.in. przez API S3 |
| [Supabase Storage](https://supabase.com/docs/guides/storage) | pliki z przekształceniami obrazów i CDN |
| [Vercel Blob](https://vercel.com/docs/vercel-blob) | pliki w projekcie Vercel |
| [Fastly](https://www.fastly.com/) | chmura brzegowa i CDN |
| [Bunny](https://bunny.net/) | globalna platforma brzegowa |

## Monitoring i analityka

| Usługa | Co robi |
|---|---|
| [Sentry](https://sentry.io/) | śledzenie błędów i wydajności aplikacji |
| [PostHog](https://posthog.com/) | analityka produktu |
| [Plausible](https://plausible.io/) | lekka, otwarta analityka bez śledzenia użytkowników |

## Zadania w tle i kolejki

| Usługa | Co robi |
|---|---|
| [Inngest](https://www.inngest.com/) | trwałe wykonanie zadań, przepływów i agentów z ponawianiem |
| [Trigger.dev](https://trigger.dev/) | otwarta platforma do długich zadań i agentów w TypeScripcie |
| [Upstash QStash](https://upstash.com/docs/qstash/overall/getstarted) | kolejka wiadomości przez HTTP |

## Backend jako usługa

| Usługa | Co robi |
|---|---|
| [Firebase](https://firebase.google.com/) | platforma Google do aplikacji mobilnych i webowych |
| [Convex](https://www.convex.dev/) | reaktywny backend |
| [PocketBase](https://pocketbase.io/) | otwarty backend w jednym pliku: baza z realtime, logowanie, pliki i panel |

## Infrastruktura AI dla agentów

| Usługa | Co robi |
|---|---|
| [E2B](https://e2b.dev/) | izolowana maszyna dla każdego agenta: kod, przeglądarka, narzędzia |
| [Browserbase](https://www.browserbase.com/) | przeglądarki w chmurze dla agentów |
| [Mem0](https://mem0.ai/) | warstwa pamięci dla agentów i aplikacji |
| [Composio](https://composio.dev/) | narzędzia AI w ponad 1500 aplikacjach |

## Zmiany od lutego 2026

| Co | Stan na 7.11.2026 |
|---|---|
| Neon | strona opisuje Neona jako ofertę Databricks |
| PlanetScale | oprócz Vitess hostuje też Postgres |
| Smithery | katalog serwerów MCP jest dziś częścią Arcade |
| Serwery referencyjne MCP | GitHub, PostgreSQL, Slack i inne trafiły do archiwum |
| Redis i Valkey | Valkey to otwarta (BSD) baza klucz-wartość pod opieką Linux Foundation, zgodna z dawnym Redis OSS |

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: reference/services-catalog.md, .agent/services.yml z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/uslugi/
