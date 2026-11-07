# Gotowe stosy

> Cztery przepisy z poleceniami, kluczowym kodem i szablonem CLAUDE.md.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Cztery przepisy

Każdy przepis to stos, polecenia na start, kluczowy wzorzec i szablon `CLAUDE.md`. Ceny sprawdzisz w [katalogu usług](https://tukamil.com/niewidzialna-architektura/uslugi/). Jak wybrać przepis: [wybór stosu](https://tukamil.com/niewidzialna-architektura/wybor-stosu/).

## 1. Strona statyczna

| Warstwa | Wybór |
|---|---|
| Treść | czysty HTML albo Astro |
| Styl | jeden arkusz CSS |
| Hosting | Vercel albo Cloudflare Pages |
| Formularz | funkcja serwerowa albo zewnętrzny formularz |

Astro opisuje się jako framework do stron z treścią, z zasadą „zero JS domyślnie” i architekturą wysp. Gdy strona ma kilka podstron, możesz też pisać czysty HTML i mały skrypt Node, który składa strony z jednego pliku z danymi. Tak powstała ta strona.

```bash
npm create astro@latest moja-strona
cd moja-strona
npm run dev
```

Lista kontrolna wydajności:

- obrazy z wymiarami (`width`, `height`) i `loading="lazy"` poniżej pierwszego ekranu;
- fonty przycięte do potrzebnych znaków i wczytywane z własnej domeny;
- skrypty zewnętrzne zamiast wpisanych w HTML, co pozwala na ścisłe CSP;
- wersja pliku w adresie (np. `styl.css?v=hash`) i długi cache;
- test na 390 px: bez przewijania w poziomie.

Szablon `CLAUDE.md`:

```markdown
# Strona firmy
Statyczny HTML i CSS, hosting Vercel. Bez frameworka.
- Treść tylko w dane.js, HTML składa `node zbuduj.js`.
- Bez skryptów w HTML (CSP: script-src 'self').
- Przed commitem: `node testy.js` (Playwright, 1280 i 390 px).
```

## 2. SaaS jednej osoby

| Warstwa | Wybór |
|---|---|
| Framework | Next.js (App Router) |
| Baza i logowanie | Supabase |
| Płatności | Stripe |
| E-mail | Resend |
| Hosting | Vercel |

```bash
npx create-next-app@latest moj-saas
cd moj-saas
npm i @supabase/supabase-js @supabase/ssr stripe resend
```

Kluczowy wzorzec: webhook Stripe sprawdza podpis, zanim cokolwiek zapisze.

```typescript
// app/api/stripe/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const podpis = req.headers.get('stripe-signature')!;
  let zdarzenie: Stripe.Event;
  try {
    zdarzenie = stripe.webhooks.constructEvent(body, podpis, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response('Zły podpis', { status: 400 });
  }
  if (zdarzenie.type === 'checkout.session.completed') {
    // zapisz subskrypcję w bazie (idempotentnie, po zdarzenie.id)
  }
  return new Response('ok');
}
```

Co zbudować najpierw: logowanie, jedna funkcja, za którą ktoś zapłaci, płatność, mail powitalny. Panel admina i ustawienia później.

Szablon `CLAUDE.md`:

```markdown
# Projekt: [nazwa]
Next.js, Supabase, Stripe, Resend na Vercel.
## Zasady
- dostęp do danych zawsze przez RLS w Supabase
- webhooki Stripe: sprawdzaj podpis, przetwarzaj idempotentnie
- klucze tylko w zmiennych środowiskowych Vercel
## Polecenia
- `npm run dev`, `npm test`, `npm run build`
```

## 3. Aplikacja z AI

| Warstwa | Wybór |
|---|---|
| Framework | Next.js |
| Model | Claude przez AI SDK |
| Wiedza | Supabase z wektorami (pgvector) |
| Zadania w tle | Inngest albo Trigger.dev |
| Limity zapytań | Upstash Redis |

```bash
npx create-next-app@latest moja-ai
cd moja-ai
npm i ai @ai-sdk/anthropic @supabase/supabase-js
```

Kluczowy wzorzec: strumieniowanie odpowiedzi.

```typescript
// app/api/czat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const wynik = streamText({
    model: anthropic('claude-sonnet-5-5'),
    system: 'Odpowiadasz krótko, po polsku, tylko z podanych źródeł.',
    prompt,
  });
  return wynik.toTextStreamResponse();
}
```

RAG krok po kroku opisuje strona [bazy wektorowe](https://tukamil.com/niewidzialna-architektura/bazy-wektorowe/).

Kontrola kosztów:

- mniejszy model do prostych zadań, większy do trudnych;
- `maxOutputTokens` albo limit długości odpowiedzi;
- limit zapytań na użytkownika (np. Upstash Ratelimit);
- pamięć podręczna promptów u dostawcy dla stałych instrukcji;
- zadania nocne przez Batch API.

## 4. Usługa API

| Warstwa | Wybór |
|---|---|
| Framework | Hono |
| Baza | Postgres w Neon albo D1 na Cloudflare |
| Walidacja | Zod |
| Hosting | Cloudflare Workers, Railway albo Fly.io |

```bash
npm create hono@latest moje-api
cd moje-api
npm i zod
```

Kluczowy wzorzec: walidacja wejścia i jeden format błędu.

```typescript
import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono();
const NowaFaktura = z.object({ klient: z.string().min(1), kwota: z.number().positive() });

app.post('/faktury', async (c) => {
  const dane = NowaFaktura.safeParse(await c.req.json());
  if (!dane.success) return c.json({ error: 'Złe dane', szczegoly: dane.error.issues }, 400);
  // zapis w bazie
  return c.json({ ok: true }, 201);
});

export default app;
```

Szablon `CLAUDE.md`:

```markdown
# API: [nazwa]
Hono, Zod, Postgres.
## Konwencje
- każda trasa waliduje wejście schematem Zod
- błędy: { error, szczegoly } i właściwy kod HTTP
- trasy w src/routes/, jeden plik na zasób
## Nie rób
- nie używaj modułów Node tam, gdzie działa Web API
```

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: stacks/static-site.md, stacks/solo-saas.md, stacks/ai-app.md, stacks/api-service.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/stosy/
