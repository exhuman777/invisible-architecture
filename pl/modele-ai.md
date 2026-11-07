# Modele AI i dostawcy

> Aktualne modele Claude, inni dostawcy i platformy do uruchamiania modeli.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Jak czytać tę stronę

Modele zmieniają się co kilka miesięcy, a ceny jeszcze częściej. Dlatego tu są tylko nazwy i parametry potwierdzone na oficjalnych stronach 7 listopada 2026 roku. Kwot nie ma, przy każdym dostawcy jest link do cennika.

## Claude (Anthropic): rodzina Claude 5

Aktualne modele według strony z przeglądem modeli Anthropic:

| Model | Identyfikator API | Do czego |
|---|---|---|
| Claude Fable 5.1 | `claude-fable-5-1` | wymagające rozumowanie i długa praca agentowa |
| Claude Opus 5.5 | `claude-opus-5-5` | długa praca agentowa przy kodzie i pracy z wiedzą, zalecany start dla większości zadań |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | najlepsze połączenie szybkości i inteligencji |
| Claude Haiku 5.5 | `claude-haiku-5-5` | duży ruch i niskie opóźnienia: klasyfikacja, ekstrakcja, routing |

Wspólne cechy aktualnych modeli:

- okno kontekstu 1 mln tokenów;
- do 128 tys. tokenów odpowiedzi w zwykłym API wiadomości;
- wejście tekst i obraz, wielojęzyczność, wywołania narzędzi;
- myślenie adaptacyjne: model sam decyduje, ile myśleć, a parametr effort tym steruje;
- wiarygodna wiedza do czerwca 2026 roku.

Jak oszczędzać według dokumentacji Anthropic:

- **Batch API:** zapytania wsadowe kosztują o połowę mniej;
- **pamięć podręczna promptów:** odczyt z cache kosztuje ułamek ceny zwykłego wejścia;
- **mniejszy model do prostych zadań:** Haiku do klasyfikacji, większy model do trudnej analizy.

Modele Claude są też dostępne w Amazon Bedrock, Google Cloud i Microsoft Foundry.

- [Przegląd modeli](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Cennik](https://platform.claude.com/docs/en/about-claude/pricing)
- [Wybór modelu](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model)

## Inni dostawcy modeli

Nazw ich modeli tu nie wymieniam, bo zmieniają się szybciej niż ta strona. Aktualną listę i ceny sprawdzisz u źródła.

| Dostawca | Co oferuje | Gdzie sprawdzić |
|---|---|---|
| OpenAI | modele GPT przez API | [developers.openai.com](https://developers.openai.com/api/docs/models) |
| Google | modele Gemini i otwarte Gemma przez Gemini API i AI Studio | [ai.google.dev](https://ai.google.dev/) |
| Mistral | modele z otwartymi wagami, wdrożenie także na własnych serwerach | [mistral.ai](https://mistral.ai/) |
| DeepSeek | otwarte modele, m.in. DeepSeek-V4 i R1 | [deepseek.com](https://www.deepseek.com/) |

## Platformy do uruchamiania modeli

| Platforma | Co robi |
|---|---|
| [OpenRouter](https://openrouter.ai/) | jeden interfejs do wielu modeli, porównanie cen |
| [Groq](https://groq.com/) | szybka inferencja |
| [Together AI](https://www.together.ai/) | chmura do modeli AI |
| [Fireworks](https://fireworks.ai/) | trenowanie i inferencja modeli otwartych |
| [Hugging Face](https://huggingface.co/) | społeczność i repozytorium otwartych modeli |
| [Ollama](https://ollama.com/) | modele otwarte lokalnie na macOS, Windows i Linuksie albo w chmurze |
| [Modal](https://modal.com/) | infrastruktura do trenowania i serwowania aplikacji AI |

## Jak wybierać

1. **Zacznij od jednego modelu z górnej półki.** Dla Claude dokumentacja radzi zacząć od Opus 5.5.
2. **Zrób własny test.** Dziesięć prawdziwych zadań z Twojej firmy powie więcej niż ranking.
3. **Przenieś proste zadania do mniejszego modelu.** Klasyfikacja i ekstrakcja rzadko potrzebują największego.
4. **Strumieniuj odpowiedzi.** Użytkownik widzi tekst od razu.
5. **Ogranicz długość odpowiedzi** parametrem `max_tokens`.
6. **Sprawdź, gdzie trafiają dane.** Przy danych firmy czytaj warunki dostawcy i wybierz region.

## Zgodność API

Wszyscy duzi dostawcy mają API w JSON przez HTTPS, strumieniowanie przez SSE i wywołania narzędzi, ale każdy z nieco innym schematem. Biblioteki takie jak [AI SDK](https://ai-sdk.dev/) albo [Pydantic AI](https://pydantic.dev/docs/ai/overview/) ukrywają te różnice, więc zmiana modelu to często zmiana jednej nazwy.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: reference/ai-inference-providers.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/modele-ai/
