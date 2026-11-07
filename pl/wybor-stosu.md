# Wybór stosu

> Domyślny wybór dla siedmiu typów projektów i pięć rad, jak nie przekombinować.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Jak czytać ten poradnik

Znajdź typ projektu. Przy każdym dostajesz domyślny wybór, powód i alternatywy. Wszystko ustawione pod szybkość vibecodingu, proste wdrożenie i małą skalę. Duże firmy mają inne potrzeby.

Kwot tu nie ma, bo cenniki zmieniają się co kilka miesięcy. Przy każdej usłudze sprawdź aktualny cennik na jej stronie, linki są w [katalogu usług](https://tukamil.com/niewidzialna-architektura/uslugi/).

## 1. Strona wizytówka albo portfolio

**Stos:** statyczny HTML albo Astro, hosting Vercel albo Cloudflare Pages.

**Dlaczego:** strona statyczna działa szybko i tanio. Astro opisuje się jako framework do stron z treścią i domyślnie nie wysyła JavaScriptu do przeglądarki. Interaktywne „wyspy” dokładasz tylko tam, gdzie trzeba.

**Kiedy Next.js:** gdy wiesz, że za chwilę dojdzie logowanie i trasy API.

| Opcja | Kiedy |
|---|---|
| Czysty HTML i CSS | jedna strona, bez kroku budowania |
| Astro | blog, dokumentacja, strona marketingowa |
| Next.js na Vercel | planujesz funkcje dynamiczne |

## 2. Pierwsza wersja SaaS

**Stos:** Next.js, Supabase, Stripe i Resend, hosting Vercel.

**Dlaczego:** Supabase daje w jednym projekcie Postgresa, logowanie, gotowe API, Realtime, pliki i funkcje. Stripe obsługuje płatności i subskrypcje, Resend wysyła maile transakcyjne, a Vercel wdraża po każdym pushu. Modele AI znają ten zestaw bardzo dobrze.

| Opcja | Kiedy |
|---|---|
| Next.js, Clerk i Neon | wolisz gotowe ekrany logowania i bazę Postgres bez serwera |
| Laravel | zespół zna PHP |
| Rails | zespół zna Ruby |

## 3. Aplikacja z AI

**Stos:** Next.js, AI SDK, API modelu (np. Claude), Supabase z wektorami, zadania w tle w Inngest albo Trigger.dev.

**Dlaczego:** AI SDK od Vercela daje jedno API do generowania tekstu, obiektów i wywołań narzędzi u wielu dostawców. Wektory obok reszty danych w Postgresie wystarczą do RAG na start. Długie zadania AI przenosisz do kolejki z ponawianiem.

Decyzje:

- **wektory w Postgresie czy osobna baza:** zacznij od pgvector, osobną bazę wybierz przy bardzo dużej skali, więcej w [bazach wektorowych](https://tukamil.com/niewidzialna-architektura/bazy-wektorowe/);
- **strumieniowanie:** odpowiedzi modelu zawsze strumieniuj, żeby użytkownik od razu widział tekst;
- **wybór modelu:** zobacz [modele AI](https://tukamil.com/niewidzialna-architektura/modele-ai/).

## 4. Usługa API

**Stos:** Hono, Postgres (Neon albo Supabase), Upstash Redis do pamięci podręcznej i limitów.

**Dlaczego:** Hono to mały framework na standardach Web, który działa m.in. na Cloudflare Workers, Deno, Bun, Vercel, AWS Lambda i Node.js. Neon daje Postgresa z gałęziami i skalowaniem do zera.

| Opcja | Kiedy |
|---|---|
| Fastify albo Express | zespół zna już Node.js |
| Go | bardzo duży ruch, niskie opóźnienia |
| Cloudflare Workers i D1 | wszystko na brzegu sieci, mała baza SQLite |

## 5. Aplikacja mobilna

**Stos:** React Native z Expo, backend Supabase albo Firebase.

**Dlaczego:** jedna baza kodu na iOS i Androida, a model komponentów jest taki sam jak w React, więc AI pisze go dobrze. Supabase wybierz dla Postgresa i otwartego kodu, Firebase dla ekosystemu Google.

## 6. Sklep internetowy

- **Produkty fizyczne, standardowy koszyk:** Shopify.
- **Własny proces zakupu, subskrypcje, marketplace:** sklep headless, np. Next.js z Medusą i Stripe.
- **Kilka produktów cyfrowych:** Stripe Checkout bez platformy sklepowej.

## 7. Aplikacja czasu rzeczywistego

**Stos:** Next.js z Supabase Realtime.

**Dlaczego:** Realtime wysyła przez websockety zmiany w Postgresie, wiadomości broadcast i obecność użytkowników. Nie stawiasz osobnego serwera websocketów. Pasuje do czatu, pulpitów na żywo i wspólnej edycji.

## Macierz decyzji

| Sytuacja | Wybór |
|---|---|
| Budżet zero | strona statyczna albo darmowe plany Vercel i Supabase |
| Wdrożenie w tydzień | Next.js i Supabase |
| Prototyp w jeden dzień | Bolt, v0, Lovable albo Replit Agent |
| Jedna osoba | wszystko zarządzane, jak najmniej utrzymania |
| Mały zespół | jedno repozytorium, wspólny projekt Vercel i Supabase |
| Produkt z AI | AI SDK, strumieniowanie, wywołania narzędzi |

## Pięć rad

1. **Wybieraj nudną technologię.** Model widział Next.js i Postgresa miliony razy, a nowy framework prawie wcale.
2. **Mniej usług.** Każda usługa to konfiguracja, kontekst dla AI i kolejne miejsce awarii.
3. **Najpierw darmowe plany.** Płać dopiero, gdy dojdziesz do limitu.
4. **Bez przedwczesnej architektury.** Jeden monolit wytrzymuje więcej, niż myślisz. Dziel go, gdy masz konkretny powód.
5. **Dopasuj się do wiedzy modelu.** Jeśli AI pisze słaby kod w Twoim stosie, stos może być zbyt niszowy.

Gotowe przepisy krok po kroku: [gotowe stosy](https://tukamil.com/niewidzialna-architektura/stosy/).

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: guides/stack-selection.md, .agent/stack-decisions.yml z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/wybor-stosu/
