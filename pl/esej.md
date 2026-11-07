# Niewidzialna Architektura: esej

> Esej w 13 rozdziałach o tym, jak działa internet (DNS, API, GitHub, kontenery, bazy, serwery, serverless, CDN, MCP i AI), oraz 15 poradników vibecodingu po polsku.

Mapa usług, protokołów i warstw, na których stoi internet. Dla vibecoderów, budowniczych i ciekawych.

Stan na: 7.11.2026

Każde wczytanie strony to zakład: że DNS odpowie, szyfrowanie się dogada, CDN ma kopię, baza odpowie, a API Cię nie zablokuje. Ten esej pokazuje, kto po drodze pracuje.

## Pełna mapa warstw

- Domena: Cloudflare Registrar, Porkbun, Route 53
- DNS: Cloudflare DNS, Route 53, Vercel DNS
- TLS: Let's Encrypt, Cloudflare, Vercel
- CDN i brzeg: Cloudflare, Fastly, CloudFront, Bunny
- Kod: GitHub, GitLab, Bitbucket, Codeberg
- CI/CD: GitHub Actions, GitLab CI, Vercel
- Frontend: Vercel, Netlify, Cloudflare Pages
- Backend i PaaS: Railway, Render, Fly.io
- Serwery: Hetzner, DigitalOcean, Linode (Akamai), Lightsail
- Kontenery: Docker, Kubernetes
- Backend jako usługa: Supabase, Firebase, Appwrite, PocketBase
- Baza SQL: PostgreSQL, Neon, Turso, PlanetScale
- Klucz-wartość: Redis, Valkey, Upstash, Cloudflare KV
- Wektory: pgvector, Pinecone, Qdrant, Weaviate
- Logowanie: Supabase Auth, Clerk, Auth.js, Better Auth
- Pliki: S3, Cloudflare R2, Supabase Storage
- Zadania w tle: Inngest, Trigger.dev, Upstash QStash
- Płatności: Stripe, Paddle, Lemon Squeezy
- E-mail: Resend, Postmark
- Analityka i błędy: PostHog, Plausible, Sentry
- Modele AI: Anthropic, OpenAI, Google, Mistral
- Narzędzia AI: MCP, rejestr MCP, Agent Skills, Composio
- Piaskownice agentów: E2B, Browserbase, Modal
- AI do kodu: Claude Code, Codex, GitHub Copilot, Cursor

## 01. Akt nadania nazwy (DNS)

*Domeny i DNS*

> Zanim pojawiły się nazwy, były tylko liczby. Potem ktoś powiedział: niech będą słowa. I internet stał się miejscem, które da się znaleźć.

DNS (Domain Name System) działa jak książka telefoniczna internetu. Wpisujesz nazwę, np. `tukamil.com`, a DNS znajduje adres IP, którego używają komputery. Dzieje się to przy każdym adresie, zanim zobaczysz stronę.

**Rejestrator** sprzedaje domenę, jak operator numer telefonu. **Dostawca DNS** prowadzi samą książkę i odpowiada na pytania o adres. To mogą być dwie różne firmy.

Typy rekordów: **A** to adres IPv4, **AAAA** to IPv6, **CNAME** to alias innej nazwy, **MX** to poczta, **TXT** to weryfikacja i zasady poczty (np. SPF), **NS** to serwery nazw domeny.

**Rozwiąż nazwę krok po kroku**

1. Pamięć przeglądarki: Czy przeglądarka już zna tukamil.com? Nie.
2. Pamięć systemu: Czy system operacyjny ma tukamil.com w pamięci? Nie.
3. Resolver: Pytanie idzie do resolvera, np. 1.1.1.1 od Cloudflare albo resolvera dostawcy internetu.
4. Serwer główny: Resolver pyta serwer główny (root): kto obsługuje domenę .com?
5. Serwer domeny najwyższego poziomu: Serwer .com odpowiada: o tukamil.com zapytaj serwery nazw tej domeny.
6. Serwer autorytatywny: Serwer nazw domeny podaje rekord A dla tukamil.com.
7. Odpowiedź: Adres: 203.0.113.10 (przykład z puli dokumentacyjnej). Przeglądarka łączy się z serwerem.

Oficjalne strony: [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) · [Porkbun](https://porkbun.com/) · [Route 53](https://aws.amazon.com/route53/)

## 02. Język obcych (API)

*Interfejsy programistyczne*

> Dwa systemy, które nigdy się nie spotkały, wymieniają wartość, bo umówiły się na wspólną gramatykę. Cywilizacja ściśnięta do HTTP.

API to umowa, jak jeden program prosi drugi o dane albo działanie. Najczęściej przez HTTP: metoda mówi, co chcesz zrobić, adres mówi, z czym, a odpowiedź wraca jako JSON z kodem statusu.

**REST** jest prosty, dobrze się cache’uje i używa zwykłego HTTP, ale czasem pobiera za dużo albo za mało. **GraphQL** to jeden adres i dokładnie te pola, o które prosisz, za to trudniej z cache i więcej pracy po stronie serwera.

**Wybierz metodę i zobacz zapytanie**

- GET: Pobierz dane.

```text
GET /uzytkownicy/42

200 OK
{ "id": 42, "imie": "Ala" }
```

- POST: Utwórz nowy zasób.

```text
POST /uzytkownicy
{ "imie": "Bartek" }

201 Created
{ "id": 43, "imie": "Bartek" }
```

- PUT: Zmień zasób.

```text
PUT /uzytkownicy/42
{ "imie": "Alicja" }

200 OK
{ "id": 42, "imie": "Alicja" }
```

- DELETE: Usuń zasób.

```text
DELETE /uzytkownicy/42

204 No Content
```

- GraphQL: Jeden adres, dokładnie te pola, które chcesz.

```text
POST /graphql
{ uzytkownik(id: 42) { imie, wpisy { tytul } } }

200 OK
{ "data": { "uzytkownik": { "imie": "Ala", "wpisy": [] } } }
```


Oficjalne strony: [OpenAPI](https://www.openapis.org/) · [GraphQL](https://graphql.org/) · [Hoppscotch](https://hoppscotch.io/)

## 03. Rynek kodu (GitHub)

*Kontrola wersji i CI/CD*

> Każda linia ma historię. Każdą decyzję da się cofnąć. Każda współpraca zostaje w commitach i diffach.

GitHub przechowuje kod i jego historię. Pomyśl o historii zmian w dokumencie, tylko dla programów: każda zmiana ma autora, opis i da się ją cofnąć, a zespół przegląda swoją pracę w pull requestach. GitHub podaje na swojej stronie ponad 225 mln programistów i ponad 800 mln repozytoriów.

**CI/CD** znaczy, że kod sam się testuje i wdraża po każdym wysłaniu. GitHub Actions uruchamia testy, a Vercel albo Netlify po pushu budują i publikują stronę.

Alternatywy: GitLab, Bitbucket i Codeberg, prowadzony przez organizację non-profit.

**Od commita do strony**

1. Komputer: `git commit` zapisuje zmianę lokalnie, `git push` wysyła ją na GitHuba.
2. GitHub: Repozytorium dostaje nowy commit. Pull request pokazuje diff do przeglądu.
3. GitHub Actions: Uruchamiają się testy. Czerwony wynik zatrzymuje wdrożenie.
4. Vercel: Po scaleniu Vercel buduje projekt i publikuje nową wersję.
5. Użytkownik: Odświeża stronę i widzi zmianę. Stara wersja zostaje do cofnięcia.

Oficjalne strony: [GitHub](https://github.com/) · [GitHub Actions](https://github.com/features/actions) · [GitLab](https://about.gitlab.com/) · [Codeberg](https://codeberg.org/)

## 04. Tożsamość w walizce (Docker)

*Kontenery i Docker*

> Kontener niesie wszystko, czego potrzebuje, żeby być sobą, gdziekolwiek wyląduje. Nie jesteś swoim otoczeniem. Jesteś tym, co ze sobą przynosisz.

Docker pakuje aplikację razem ze wszystkim, czego potrzebuje, w **kontener**. Jak kontener na statku: działa tak samo, bez względu na to, który statek (serwer) go wiezie.

Większe systemy dzieli się na usługi: logowanie, płatności, wyszukiwarka. Każda działa w osobnym kontenerze. Plik `docker-compose.yml` opisuje kilka kontenerów naraz i uruchamia je jednym poleceniem. Kubernetes zarządza setkami kontenerów: skaluje je, rozkłada ruch i podnosi te, które padły.

**Kontener a maszyna wirtualna**

|  | Kontener | Maszyna wirtualna |
|---|---|---|
| Co wirtualizuje | system (dzieli jądro z gospodarzem) | sprzęt (pełny system gościa) |
| Start | szybki | wolniejszy |
| Rozmiar | mniejszy | większy |
| Na jednym serwerze | wiele | mniej |

Oficjalne strony: [Docker](https://www.docker.com/) · [Kubernetes](https://kubernetes.io/) · [Fly.io](https://fly.io/) · [Railway](https://railway.com/)

## 05. Gdzie mieszka pamięć (Bazy)

*Relacyjne, dokumentowe, klucz-wartość, wektorowe*

> Każda aplikacja potrzebuje miejsca, w którym pamięta. Baza to pamięć maszyny. Wybierz złą, a maszyna zapomni.

**Relacyjne (SQL):** tabele, wiersze, złączenia i transakcje. PostgreSQL to otwarta baza z rozszerzeniami, m.in. pgvector do wektorów. MySQL napędza mnóstwo stron. SQLite mieści całą bazę w jednym pliku.

**Dokumentowe:** dokumenty JSON z elastycznym schematem, np. MongoDB i Firestore w Firebase. **Klucz-wartość:** bardzo szybkie, w pamięci, do cache, sesji i kolejek, np. Redis i Valkey (otwarta licencja BSD, pod opieką Linux Foundation). **Wektorowe:** wyszukiwanie po znaczeniu dla AI, np. pgvector i Pinecone.

**Bez serwera:** Neon (Postgres od Databricks z gałęziami i skalowaniem do zera), Turso (na bazie SQLite) i Cloudflare D1 (SQLite na brzegu sieci, do 10 GB na bazę w planie płatnym).

**Problem połączeń:** funkcje serverless otwierają połączenie przy każdym żądaniu. Tysiąc żądań to tysiąc połączeń i zadyszka bazy. Pule połączeń, np. PgBouncer, trzymają połączenia gotowe do ponownego użycia.

**Co przechowujesz?**

- Klientów i faktury: Dane powiązane, liczy się spójność.
  Relacyjna: PostgreSQL (np. Supabase albo Neon). Transakcje i złączenia pilnują, żeby faktura zawsze miała klienta.
- Sesje i cache: Krótko żyjące dane, liczy się szybkość.
  Klucz-wartość: Redis, Valkey albo Upstash. Odczyt z pamięci zamiast z dysku.
- Różne formularze: Każdy rekord ma inne pola.
  Dokumentowa: MongoDB albo Firestore. Albo kolumna JSONB w Postgresie, jeśli reszta danych jest relacyjna.
- Dokumenty dla AI: Szukasz po znaczeniu, nie po słowach.
  Wektorowa: pgvector w Postgresie na start, osobna baza przy bardzo dużej skali.
- Aplikację w telefonie: Dane lokalnie, czasem bez sieci.
  SQLite: cała baza w jednym pliku na urządzeniu.

Oficjalne strony: [PostgreSQL](https://www.postgresql.org/) · [SQLite](https://www.sqlite.org/) · [Valkey](https://valkey.io/) · [Neon](https://neon.com/) · [Cloudflare D1](https://developers.cloudflare.com/d1/)

Poradnik: [Bazy wektorowe i RAG](https://tukamil.com/niewidzialna-architektura/bazy-wektorowe/)

## 06. Pokój na własność (VPS)

*Serwery wirtualne i własna chmura*

> Hosting współdzielony to akademik. VPS to własne mieszkanie. Ceną niezależności jest odpowiedzialność.

VPS to wynajęty komputer w chmurze. Masz pełną kontrolę: instalujesz, co chcesz, i uruchamiasz, co chcesz, przez całą dobę. Tu mieszka wszystko, co ma działać stale: boty, zadania cykliczne, bazy.

Kontrola kosztuje czas: aktualizacje systemu, zapora, kopie zapasowe i monitoring robisz sam. Dlatego na start lepsza bywa platforma zarządzana, a VPS dopiero wtedy, gdy wiesz, po co Ci on.

**Gdzie postawić aplikację**

|  | Kontrola | Kto utrzymuje | Najlepsze do |
|---|---|---|---|
| Hosting współdzielony | panel | dostawca | blog, prosta strona |
| VPS | pełna, root przez SSH | Ty | aplikacje, API, boty |
| Duża chmura (AWS, Google Cloud) | pełna i usługi zarządzane | Ty i dostawca | firmy z zespołem infrastruktury |
| Platforma (Vercel, Railway, Render) | kod i konfiguracja | dostawca | szybkie wdrożenia bez administracji |

Oficjalne strony: [Hetzner Cloud](https://www.hetzner.com/cloud) · [DigitalOcean](https://www.digitalocean.com/) · [Linode (Akamai Cloud)](https://www.linode.com/) · [Lightsail](https://aws.amazon.com/lightsail/)

## 07. Znikający serwer (Serverless)

*Wdrożenia bez serwera*

> Infrastruktura powinna być niewidzialna. Myśl o tym, co robi Twój kod, a nie o tym, gdzie działa.

Serverless znaczy: piszesz kod, a platforma zajmuje się serwerami. Vercel to wzorcowy przykład: wysyłasz kod do Gita i po chwili strona działa. Vercel stworzył Next.js, popularny framework React.

Funkcje Vercela działają m.in. w Node.js, Pythonie i Go, skalują się same i znikają do zera, gdy nie ma ruchu. Fluid compute pozwala jednej instancji obsłużyć kilka żądań naraz, co zmniejsza zimne starty i koszty. Domyślnie funkcje działają w jednym regionie, a region warto ustawić blisko bazy danych.

Na brzegu sieci działają Cloudflare Workers: kod wykonuje się w centrum danych najbliżej użytkownika.

**Gdzie uruchomić kod?**

- Funkcja: Vercel Functions, AWS Lambda.
  Pełne środowisko, np. Node.js albo Python. Region blisko bazy. Dobre do API, webhooków i strumieniowania odpowiedzi AI.
- Brzeg sieci: Cloudflare Workers.
  Kod działa blisko użytkownika na całym świecie. Dobre do przekierowań, autoryzacji, prostych API i stron bez ciężkiej bazy.
- Kontener: Railway, Render, Fly.io.
  Długo działający proces z własnym obrazem Dockera. Dobre do botów, kolejek i aplikacji, które muszą stale słuchać.

Oficjalne strony: [Vercel Functions](https://vercel.com/docs/functions) · [Cloudflare Workers](https://www.cloudflare.com/developer-platform/products/workers/) · [Netlify](https://www.netlify.com/) · [Render](https://render.com/) · [Fly.io](https://fly.io/)

## 08. Stara baza na nowo (Supabase)

*Backend jako usługa*

> Relacyjna baza sprzed dekad wciąż jest najlepszym fundamentem. Potrzebujesz tylko lepszego otoczenia wokół niej.

Supabase daje w jednym projekcie: **bazę** Postgres, **logowanie** (e-mail, telefon, konta społecznościowe, MFA), **API** REST i GraphQL generowane ze schematu, **Realtime** (zmiany w bazie, broadcast i obecność przez websockety), **pliki** z przekształcaniem obrazów i CDN, **Edge Functions** w TypeScripcie na Deno, **wektory** do AI i **cron**.

**Row Level Security (RLS)** zapisuje uprawnienia w SQL: „użytkownik czyta tylko wiersze ze swoim user_id”. Baza pilnuje tego bez względu na to, którędy przyszło zapytanie.

Alternatywy: Firebase (platforma Google), Appwrite, Convex (reaktywny backend) i PocketBase (otwarty backend w jednym pliku).

**Zaloguj się jako i zobacz, co widzi baza**

```sql
create policy "tylko swoje" on faktury
  for select using (auth.uid() = user_id);
```

| Faktura | user_id | Status |
|---|---|---|
| FV/1 | Ala | opłacona |
| FV/2 | Bartek | po terminie |
| FV/3 | Ala | wysłana |
| FV/4 | Celina | opłacona |
| FV/5 | Bartek | wysłana |

Bez polityki każdy zalogowany widzi wszystkie wiersze. Z polityką baza zwraca tylko faktury osoby, która pyta.

Oficjalne strony: [Supabase](https://supabase.com/docs/guides/getting-started/features) · [Firebase](https://firebase.google.com/) · [Appwrite](https://appwrite.io/) · [PocketBase](https://pocketbase.io/) · [Convex](https://www.convex.dev/)

## 09. Niewidzialny strażnik (CDN)

*CDN, ochrona przed DDoS, brzeg sieci*

> Większość ludzi nigdy o nim nie słyszała, a przez jego ręce płynie spora część internetu.

**CDN** trzyma kopie Twojej strony na serwerach na całym świecie, więc użytkownik pobiera najbliższą. **Ochrona przed DDoS** zatrzymuje ataki, które zalewają stronę sztucznym ruchem.

Cloudflare robi jedno i drugie. Jego sieć obejmuje 348 miast i ponad 13 tysięcy połączeń z innymi sieciami. Stoi między użytkownikiem a Twoim serwerem jak bramkarz.

Do tego: **Workers** (kod na brzegu), **KV** (globalne klucz-wartość), **D1** (SQLite, do 10 GB na bazę w planie płatnym), **R2** (pliki bez opłat za transfer wychodzący) i **Cloudflare One** (ochrona dostępu ludzi, agentów AI i infrastruktury w modelu Zero Trust).

**Użytkownik w Lublinie, serwer w Waszyngtonie**

- Bez CDN: Każde żądanie leci przez ocean.
  Lublin → serwer w USA → Lublin. Każdy obrazek, skrypt i arkusz pokonuje tę drogę, a pierwsze wczytanie wyraźnie się wlecze.
- Z CDN: Kopia czeka w pobliskim mieście.
  Lublin → najbliższe centrum danych CDN → Lublin. Pliki statyczne przychodzą z bliska, do serwera w USA trafiają tylko zapytania dynamiczne.
- Z CDN i atakiem: Ktoś zalewa stronę ruchem.
  Sztuczny ruch rozbija się na brzegu sieci CDN. Twój serwer widzi tylko prawdziwych użytkowników.

Oficjalne strony: [Sieć Cloudflare](https://www.cloudflare.com/network/) · [Cloudflare R2](https://developers.cloudflare.com/r2/pricing/) · [Fastly](https://www.fastly.com/) · [Bunny](https://bunny.net/)

## 10. Ręce dla inteligencji (MCP)

*Model Context Protocol*

> Umysł bez możliwości działania to tylko głos w pokoju. MCP pozwala AI sięgnąć przez ekran do systemów, w których dzieje się prawdziwa praca.

MCP to sposób, w jaki AI łączy się ze światem. Jak USB-C to jedno złącze do wszystkich urządzeń, tak MCP to jeden standard, przez który AI używa narzędzi: czyta pliki, pyta bazę, przegląda sieć, pisze do systemów.

Stworzył go Anthropic w listopadzie 2024 roku. Od grudnia 2025 roku opiekuje się nim Agentic AI Foundation w Linux Foundation. Komunikaty mają format JSON-RPC 2.0, a aktualna specyfikacja pochodzi z 28 lipca 2026 roku.

**Jedno pytanie przez MCP**

1. Ty: „Ile mam otwartych zgłoszeń na GitHubie?”
2. Host: Claude Code zna listę narzędzi z podłączonych serwerów i wybiera `list_issues`.
3. Klient MCP: Wysyła żądanie JSON-RPC: `{"method": "tools/call", "params": {"name": "list_issues"}}`.
4. Serwer MCP: Serwer GitHuba pyta API GitHuba i zwraca listę jako treść.
5. Model: Czyta wynik i odpowiada: „Masz 3 otwarte zgłoszenia, najstarsze z października”.

Oficjalne strony: [Specyfikacja MCP](https://modelcontextprotocol.io/specification/latest) · [Rejestr MCP](https://registry.modelcontextprotocol.io/) · [Serwery referencyjne](https://github.com/modelcontextprotocol/servers)

Poradnik: [MCP po polsku](https://tukamil.com/niewidzialna-architektura/mcp/)

## 11. Mózg już nie w słoiku (AI)

*Jak AI łączy się z internetem*

> AI bez narzędzi to mózg w słoiku. Narzędzia łączą inteligencję z działaniem. Każde narzędzie, które jej dajemy, to głos zaufania.

Model językowy sam z siebie tylko pisze tekst. Wywołanie narzędzi (tool use) daje mu ręce: programista opisuje narzędzia, model decyduje, którego użyć, aplikacja je uruchamia, a model składa odpowiedź z wyniku.

Rodzina Claude 5 od Anthropic: Claude Fable 5.1 do wymagającego rozumowania, Claude Opus 5.5 na start do większości zadań, Claude Sonnet 5.5 jako połączenie szybkości i inteligencji, Claude Haiku 5.5 do dużego ruchu. Wszystkie mają okno kontekstu 1 mln tokenów. Modele oferują też OpenAI, Google, Mistral, DeepSeek i inni.

**Pętla wywołania narzędzi**

1. Opis: Programista podaje modelowi narzędzia ze schematem: `czytaj_plik(sciezka)`.
2. Decyzja: Model zwraca wywołanie: `{ "narzedzie": "czytaj_plik", "sciezka": "/src/app.ts" }`.
3. Wykonanie: Aplikacja uruchamia funkcję i odsyła modelowi wynik.
4. Synteza: Model wplata wynik w odpowiedź albo prosi o kolejne narzędzie.

Oficjalne strony: [Modele Claude](https://platform.claude.com/docs/en/about-claude/models/overview) · [Modele OpenAI](https://developers.openai.com/api/docs/models) · [Gemini API](https://ai.google.dev/) · [Mistral](https://mistral.ai/)

Poradnik: [Modele AI i dostawcy](https://tukamil.com/niewidzialna-architektura/modele-ai/)

## 12. Katedra budowana przez obcych (Stos)

*Nowoczesny stos sieci*

> Nikt jej nie zaprojektował w całości. Każda warstwa ufa tej pod spodem. Infrastruktura stała się niewidzialna, żeby pomysły mogły stać się widoczne.

Od adresu w przeglądarce do odpowiedzi modelu AI prowadzi kilkanaście warstw. Każdą prowadzi inna firma, a żadna nie widzi całości.

**Warstwy od użytkownika do GitHuba**

1. Użytkownik: przeglądarka albo aplikacja, wpisuje adres, żądanie HTTPS
2. DNS: nazwa na adres IP: Cloudflare, Route 53
3. CDN: cache, ochrona przed DDoS, TLS: Cloudflare, Fastly
4. Hosting: brzeg i funkcje: Vercel, Netlify, Cloudflare Pages
5. Backend: baza, logowanie, Realtime: Supabase, Firebase
6. Baza: PostgreSQL, Redis, SQLite
7. Pliki: S3, R2, Supabase Storage
8. API: Stripe, Resend, Claude
9. Obliczenia: VPS, Railway: boty, cron, workery
10. AI i MCP: API modeli, serwery MCP, agenci
11. GitHub: źródło prawdy, CI/CD, tu wszystko się zaczyna

Poradnik: [Wybór stosu](https://tukamil.com/niewidzialna-architektura/wybor-stosu/)

## 13. Czego nie widzi większość (Ukryte)

*Usługi za usługami*

> Klikasz przycisk. Budzi się kilkanaście usług. Widzisz stronę. Nie masz pojęcia, co się właśnie stało.

„Prosta” aplikacja dotyka kilkunastu z tych usług. Nowoczesny internet to system rozproszony, który trzyma się na API, zaufaniu i plikach YAML.

Agenci AI potrzebują jeszcze kilku warstw: modelu, narzędzi przez MCP, pamięci, piaskownicy do uruchamiania kodu i orkiestracji. Opisuje je poradnik o agentach.

**Kliknij i obudź usługi**

- Domena: Porkbun
- DNS: Cloudflare DNS
- TLS: Let's Encrypt
- CDN: Cloudflare
- Hosting: Vercel
- Baza: Supabase
- Logowanie: Supabase Auth
- Pliki: Cloudflare R2
- E-mail: Resend
- Płatności: Stripe
- Analityka: PostHog
- Błędy: Sentry
- CI/CD: GitHub Actions
- AI: Claude
- Narzędzia AI: MCP
- Kolejka: Inngest

Poradnik: [Agenci AI w firmie](https://tukamil.com/niewidzialna-architektura/agenci/)

## Jak to robię u siebie

Claude Code z plikiem CLAUDE.md w każdym repozytorium, statyczne strony na Vercel, ścisłe CSP i testy Playwright na trzech szerokościach. Ta strona powstała dokładnie tak.

- [Cały rozdział: jak to robię u siebie](https://tukamil.com/niewidzialna-architektura/jak-to-robie/)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)

### Moje aplikacje

- [wezmezadarmo.com](https://www.wezmezadarmo.com/): Kalkulator świadczeń, ulg i dotacji, bez konta i za darmo.
- [yesno.events](https://yesno.events/): Szanse wydarzeń z rynków prognostycznych i co zmieniają w firmie.
- [thePolacy](https://thepolacy.com/): Muzeum kolekcji 2137 pikselowych Polaków: historia, obrazy i gra.
- [Dwie Strony](https://dwiestrony.wezmezadarmo.com/): Umowa budowlana, kupno auta albo najem na dwóch telefonach.
- [Cyfrowy Pomocnik](https://www.cyfrowypomocnik.com/): Wdrożenie agentów AI na Claude w firmie w jednej sesji.
- [Należy się](https://nalezysie.wezmezadarmo.com/): Sprawdzenie firmy po NIP i zmiany od 1 stycznia 2027.
- [Asystent Firmy](https://asystent24.com/): Czat AI na stronie firmy odpowiada klientom z wiedzy firmy.
- [Brand Agent](https://brand.cyfrowypomocnik.com/): Wizytówka z agentem AI, który odpowiada wyłącznie wiedzą marki.
- [Claude Start](https://start.cyfrowypomocnik.com/): Przewodnik krok po kroku: instalacja Claude, połączenia i pierwsze polecenie.
- [pixelkamil](https://pixel.tukamil.com/galeria/): Gry w pikselach, studio pixel artu, syntezator lo-fi i widżety.
- [DogInvoice](https://doginvoice.com/): Pilnuje faktur z KSeF i banku i mówi mailem, kto zapłacił.
- [DogAnswer](https://doganswer.com/): Asystent głosowy AI odbiera telefon i umawia spotkania w Kalendarzu Google.

## Co zmieniłem w tłumaczeniu

Oryginał po angielsku powstał w lutym 2026 roku. Każdy fakt o narzędziach, modelach, limitach i cenach sprawdziłem 7.11.2026 na oficjalnych stronach.

- Było: Modele Claude Opus 4.6, Sonnet 4.6, Haiku 4.5, kontekst 200 tys. tokenów. Jest: Rodzina Claude 5: Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5, kontekst 1 mln tokenów. [Źródło](https://platform.claude.com/docs/en/about-claude/models/overview)
- Było: MCP pod „AI Alliance for Interoperability Foundation” od 2025. Jest: MCP w Agentic AI Foundation (Linux Foundation) od grudnia 2025, razem z AGENTS.md i goose. [Źródło](https://www.infoq.com/news/2025/12/agentic-ai-foundation)
- Było: Specyfikacja MCP z listopada 2025, transporty stdio, SSE, Streamable HTTP. Jest: Specyfikacja z 28.07.2026: stdio i Streamable HTTP, żądania samodzielne; SSE przestarzałe w Claude Code. [Źródło](https://modelcontextprotocol.io/specification/latest)
- Było: Serwery referencyjne github, postgres, sqlite, brave-search, puppeteer, slack. Jest: W repozytorium referencyjnym zostało 7 serwerów, reszta w archiwum; GitHub ma własny serwer github/github-mcp-server. [Źródło](https://github.com/modelcontextprotocol/servers)
- Było: Globalna konfiguracja MCP w ~/.claude/mcp.json. Jest: claude mcp add z zasięgiem local, project (.mcp.json) albo user (~/.claude.json). [Źródło](https://code.claude.com/docs/en/mcp)
- Było: Karpathy ukuł „vibecoding” na początku 2024. Jest: Wpis Karpathy’ego na X z lutego 2025; słowo roku 2025 słownika Collinsa. [Źródło](https://www.questera.ai/blogs/history-of-vibe-coding-karpathy-tweet)
- Było: .cursorrules i .windsurfrules jako pliki instrukcji. Jest: Cursor: .cursor/rules i AGENTS.md; Copilot: .github/copilot-instructions.md, AGENTS.md, CLAUDE.md; Claude Code może czytać AGENTS.md. [Źródło](https://cursor.com/docs/context/rules)
- Było: Agent Skills v1.0 „w drugiej połowie 2026”, liczby gwiazdek na GitHubie. Jest: Agent Skills jako otwarty format na agentskills.io; liczby gwiazdek usunięte (zmieniają się codziennie). [Źródło](https://agentskills.io/)
- Było: A2A w wersji 0.3. Jest: A2A w wersji 1.0, dołączył do Agentic AI Foundation. [Źródło](https://a2a-protocol.org/latest/)
- Było: GitHub: 100 mln programistów, 420 mln repozytoriów. Jest: Ponad 225 mln programistów i ponad 800 mln repozytoriów. [Źródło](https://github.com/about)
- Było: Cloudflare: 330+ centrów danych w 120+ krajach. Jest: Sieć w 348 miastach, ponad 13 tys. połączeń z innymi sieciami. [Źródło](https://www.cloudflare.com/network/)
- Było: Neon jako niezależny serverless Postgres. Jest: Neon jako oferta Databricks, z gałęziami i skalowaniem do zera. [Źródło](https://neon.com/docs/introduction)
- Było: PlanetScale jako serverless MySQL. Jest: PlanetScale hostuje Vitess i Postgres. [Źródło](https://www.planetscale.com/)
- Było: Smithery jako niezależny rynek MCP. Jest: Smithery jest częścią Arcade. [Źródło](https://smithery.ai/)
- Było: Gemini CLI jako darmowe narzędzie dla każdego. Jest: Gemini CLI dla organizacji z Gemini Code Assist; darmowy dostęp indywidualny w Antigravity CLI od 18.06.2026. [Źródło](https://github.com/google-gemini/gemini-cli)
- Było: Windsurf jako edytor Codeium. Jest: Windsurf kupiony przez Cognition w lipcu 2025, dziś nazywa się Devin Desktop. [Źródło](https://devin.ai/desktop)

### Co usunąłem

- Wszystkie ceny i limity darmowych planów (hosting, bazy, narzędzia AI, modele, wektory): zmieniają się co kilka miesięcy, przy usługach są linki do cenników.
- Liczby gwiazdek repozytoriów i liczby serwerów w katalogach MCP i skilli: zmieniają się codziennie i nie mają jednego źródła.
- Porównania szybkości baz wektorowych i tabela kosztów modeli na 1000 wywołań: liczby z różnych testów, bez potwierdzenia u producentów.
- Nazwy i parametry modeli innych dostawców niż Anthropic (Llama, Qwen, Gemma, Phi i inne): bez jednego oficjalnego źródła na 7.11.2026, zostały linki.
- Platforma Zo (rozdział o personal cloud, poradnik zo-platform.md, mikrousługi na Zo, strony React pod Zo): poza zakresem działu.
- Google Domains (sprzedane), Quirrel, Glama, LanceDB, Turbopuffer, Augment Code, Vultr, Namecheap i licznik odwiedzin: oficjalna strona nie dała się sprawdzić albo pozycja nie wnosi treści.
- Opis Lucia Auth, WorkOS, BetterStack, Payload i Replicate ze starego dziennika zmian: bez potwierdzenia na stronach producentów.

## Gdzie dalej

- [Strona](https://tukamil.com/niewidzialna-architektura/)
- [llms.txt](https://tukamil.com/llms.txt)
- [Oryginał po angielsku](https://github.com/exhuman777/invisible-architecture)

Wersja na stronie z interakcjami: https://tukamil.com/niewidzialna-architektura/
