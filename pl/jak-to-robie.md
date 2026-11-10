# Jak to robię u siebie

> Claude Code, statyczne strony na Vercel, ścisłe CSP i testy Playwright.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Mój zestaw

Wszystko poniżej pochodzi z repozytoriów, na których pracuję codziennie: z ich plików `AGENTS.md`, README i testów. Bez teorii, tylko to, co działa u mnie.

| Warstwa | Co używam |
|---|---|
| Agent do kodu | Claude Code |
| Instrukcje | `AGENTS.md` w każdym repozytorium, `CLAUDE.md` z jedną linią `@AGENTS.md` |
| Kod | GitHub, jedna gałąź na zadanie, pull request |
| Hosting | Vercel |
| Strony | statyczny HTML, CSS i JS, bez frameworka, gdzie się da |
| Testy | Playwright: 1280, 390 i 360 px |
| SEO i modele AI | `llms.txt`, wersja `.md` każdej strony, JSON-LD, sitemap |

## AGENTS.md w każdym repozytorium

Każde moje repozytorium i każdy folder firmy klienta trzyma instrukcje w jednym pliku: [`AGENTS.md`](https://agents.md/). `CLAUDE.md` ma jedną linię `@AGENTS.md`, więc Claude Code czyta to samo co Codex, Cursor czy Copilot. Dlaczego import, a nie samo `AGENTS.md`: [CLAUDE.md i AGENTS.md](https://tukamil.com/niewidzialna-architektura/claude-md/#agents-md-jeden-plik-dla-wszystkich-agentow).

W `AGENTS.md` są zasady, których agent ma się trzymać zawsze, np.:

- teksty po polsku z pełnymi znakami, bez długich myślników i sloganów;
- fakty tylko ze źródeł, a czego nie da się potwierdzić, tego nie ma;
- sekrety nigdy w repozytorium;
- lista poleceń, które muszą przejść przed commitem.

Podkatalog z innymi zasadami (np. prezentacja w osobnym katalogu) ma własny `AGENTS.md`. Działa najbliższy plik.

Agenci w moich projektach piszą szkice. Wysyła człowiek. Mam też własne skille Claude do sprzedaży, na których pracuję codziennie: plan dnia, lista telefonów, notatka po rozmowie, oferta, mailing jako szkice w Gmailu.

## Agencja Agentów: ta sama metoda u klientów

[Agencja Agentów](https://www.cyfrowypomocnik.com/#agenci) to mój katalog gotowych agentów Claude pod branżę: plan dnia, zapytania, marketing, finanse, oferty. Klient dostaje folder firmy w prywatnym repozytorium na GitHubie i zatrudnia agentów z katalogu. Folder jest zbudowany na otwartych standardach, więc nie zależy od jednego narzędzia AI.

| Plik | Co w nim jest | Standard |
|---|---|---|
| `AGENTS.md` | rola agenta, zasady, mapa plików | [AGENTS.md](https://agents.md/) |
| `CLAUDE.md` | jedna linia `@AGENTS.md` | [pamięć Claude Code](https://code.claude.com/docs/en/memory) |
| `FIRMA.md`, `DECYZJE.md`, `STYL.md` | kim jest firma, reguły z datą i powodem, jak piszemy | zwykły Markdown |
| `ZESPOL.md`, `OBSZARY/` | zatrudnieni agenci, cel i metoda każdego | zwykły Markdown |
| `WIEDZA/` | książki, notatki, kursy właściciela ze spisem | zwykły Markdown |
| `skills/<nazwa>/SKILL.md` w pakietach | umiejętności agentów (polecenia) | [Agent Skills](https://agentskills.io/) |
| `.claude-plugin/plugin.json` | pakiet agenta do zatrudnienia | [pluginy Claude Code](https://code.claude.com/docs/en/plugins) |
| `.claude/settings.json` | blokady i hooki: bez wysyłania, bez kasowania | [ustawienia](https://code.claude.com/docs/en/settings) i [hooki](https://code.claude.com/docs/en/hooks) |
| konektory Claude (poczta, kalendarz, dysk) | dostęp do narzędzi firmy | [MCP](https://modelcontextprotocol.io/) |

Dlaczego tak:

- **Jedno źródło instrukcji.** Zasady są w `AGENTS.md`, nie w kilku plikach, które się rozjeżdżają.
- **Dane osobno od zasad.** `AGENTS.md` mówi, gdzie co leży i kiedy to czytać. Fakty o firmie są w `FIRMA.md`, reguły w `DECYZJE.md`.
- **Instrukcja to kontekst, blokada to ustawienie.** To, czego agent nie może zrobić nigdy (wysłać maila, skasować pliku), pilnują uprawnienia i hooki, nie samo zdanie w pliku.
- **Wiedza zostaje w firmie.** Zwykłe pliki w repozytorium klienta działają w Claude Code, Codex, Cursor i Gemini CLI. Zmiana narzędzia AI nie kasuje wiedzy.
- **Nic nie ginie przy zmianie.** Starsze foldery z instrukcjami w `CLAUDE.md` przechodzą na `AGENTS.md` 1:1 przy aktualizacji agentów.

## Strony statyczne

Tukamil.com, przewodniki i ta strona to czysty HTML, CSS i JavaScript. Treść leży w jednym pliku z danymi, a mały skrypt Node składa z niego:

- stronę HTML;
- wersję Markdown dla modeli AI;
- JSON-LD z opisem strony;
- wpisy w `sitemap.xml`, `llms.txt` i `llms-full.txt`.

Jedno źródło, więc strona, Markdown i dane strukturalne się nie rozjeżdżają. Tryb `--sprawdz` w testach wykrywa, że ktoś poprawił HTML ręcznie zamiast źródła.

Pracownia gier pixelkamil idzie dalej: zero kroku budowania i zero zależności w działaniu, same moduły ES. Cała losowość przechodzi przez jeden generator z ziarnem, więc ten sam seed daje ten sam obraz.

Wyjątki są tam, gdzie potrzeba serwera i bazy. Kalkulator świadczeń wezmezadarmo.com działa na Next.js 16.

## Bezpieczeństwo w nagłówkach

`vercel.json` ustawia ścisłe nagłówki:

```json
{ "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self'; ..." }
```

`script-src 'self'` znaczy: żadnych skryptów wpisanych w HTML i żadnych atrybutów `onclick`. Cała interakcja żyje w zewnętrznych plikach JS. Do tego HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy` i `Permissions-Policy`.

Lokalny serwer testowy czyta te same reguły z `vercel.json`, więc test łapie naruszenie CSP, zanim strona trafi na produkcję.

## Testy Playwright

Każda strona ma test, który otwiera ją w prawdziwej przeglądarce przy kilku szerokościach (1280, 390 i 360 px) i sprawdza:

- brak przewijania w poziomie;
- zero błędów w konsoli i zero naruszeń CSP;
- cele dotyku co najmniej 44 px na telefonie;
- linki wewnętrzne odpowiadają 200;
- brak gradientów, rozmyć i pasków z lewej (styl tuKamil);
- brak danych osobowych w HTML;
- pliki SEO aktualne wobec źródła.

Agent uruchamia testy sam i poprawia, aż wszystko przejdzie. Dopiero potem commit.

## Wdrożenie

- Gałąź na zadanie, commit, pull request.
- Push na główną gałąź wdraża produkcję przez integrację Vercela z GitHubem, a gdzie jej nie ma, `vercel --prod`.
- Grafika, skrypty i arkusze mają w adresie wersję pliku (`?v=hash`), więc mogą mieć cache na rok, a telefon i tak dostaje nową wersję po zmianie.
- Strony z panelem treści zapisują zmiany jako commit w repozytorium, a Vercel buduje nową wersję.

## Zacznij od tego

1. [Claude Start](https://start.cyfrowypomocnik.com/): instalacja Claude krok po kroku, połączenia i pierwsze polecenie.
2. [Vibecoding: poradnik](https://tukamil.com/niewidzialna-architektura/vibecoding/): pętla pracy z AI.
3. [CLAUDE.md i AGENTS.md](https://tukamil.com/niewidzialna-architektura/claude-md/): pierwszy plik w repozytorium.

Chcesz to u siebie w firmie? [4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/): mózg firmy na GitHubie, podpięte narzędzia i pierwszy agent.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: nowy rozdział, fakty z repozytoriów Kamila (AGENTS.md, README, testy) z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/jak-to-robie/
