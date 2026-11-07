# Bazy wektorowe i RAG

> Wyszukiwanie po znaczeniu: od pgvector w Postgresie do usług zarządzanych.

Stan na: 7.11.2026. Część działu [Niewidzialna Architektura](https://tukamil.com/niewidzialna-architektura/).

## Po co wektory

Model AI zamienia tekst na wektor, czyli listę liczb, która oddaje znaczenie. Teksty o podobnym sensie mają bliskie wektory. Baza wektorowa szuka „najbliższych” wektorów, więc znajduje akapity o tym samym, nawet gdy użyto innych słów.

Na tym stoi RAG (retrieval-augmented generation): zanim model odpowie, aplikacja wyszukuje w Twoich dokumentach pasujące fragmenty i dokleja je do pytania. Model odpowiada z Twojej wiedzy, a nie tylko z treningu.

## Porównanie

| Baza | Rodzaj | Co wyróżnia |
|---|---|---|
| [pgvector](https://github.com/pgvector/pgvector) | rozszerzenie Postgresa | wektory obok reszty danych, indeksy HNSW i IVFFlat |
| [Pinecone](https://docs.pinecone.io/guides/get-started/overview) | usługa zarządzana | wyszukiwanie semantyczne, wektory gęste i rzadkie, wektory z tekstu po stronie serwera, reranking |
| [Qdrant](https://qdrant.tech/documentation/overview/) | otwarty kod albo chmura | platforma wyszukiwania wektorowego, chmura zarządzana, hybrydowa i prywatna |
| [Weaviate](https://docs.weaviate.io/weaviate) | otwarty kod | wyszukiwanie hybrydowe: znaczenie i słowa kluczowe naraz |
| [Chroma](https://docs.trychroma.com/docs/overview/introduction) | otwarty kod (Apache 2.0) albo chmura | lokalnie, na własnym serwerze albo jako Chroma Cloud |
| [Upstash Vector](https://upstash.com/docs/vector/overall/getstarted) | usługa serverless | w pakiecie z Redis i kolejkami Upstash |

## pgvector: zacznij tutaj

Jeśli masz już Postgresa (Supabase, Neon, własny serwer), nie potrzebujesz osobnej bazy. pgvector obsługuje:

- typy: `vector` (pojedyncza precyzja), `halfvec` (połowa precyzji), `bit` (binarne) i `sparsevec` (rzadkie);
- odległości: L2, iloczyn skalarny, cosinusową, L1, Hamminga i Jaccarda (dwie ostatnie dla wektorów binarnych);
- indeksy przybliżone HNSW i IVFFlat; bez indeksu wyszukiwanie jest dokładne.

```sql
create extension if not exists vector;

create table dokumenty (
  id bigserial primary key,
  tresc text not null,
  wektor vector(1024)
);

create index on dokumenty using hnsw (wektor vector_cosine_ops);

-- pięć akapitów najbliższych pytaniu
select tresc from dokumenty
order by wektor <=> $1
limit 5;
```

Wymiar wektora (tu 1024) musi pasować do modelu, który liczy wektory. Sprawdź go w dokumentacji modelu.

## Miary odległości

| Miara | Operator w pgvector | Kiedy |
|---|---|---|
| cosinusowa | `<=>` | domyślny wybór dla tekstu |
| iloczyn skalarny | `<#>` | wektory znormalizowane, gdy liczy się szybkość |
| L2 (euklidesowa) | `<->` | gdy liczy się też długość wektora |

## Typowy RAG

```text
1. Podziel dokumenty na fragmenty (np. akapity).
2. Policz wektor każdego fragmentu i zapisz go w bazie.
3. Policz wektor pytania użytkownika.
4. Znajdź kilka najbliższych fragmentów.
5. Doklej je do polecenia dla modelu z prośbą o odpowiedź tylko z nich.
6. Pokaż odpowiedź ze źródłami.
```

Dobre praktyki:

- dziel tekst w sensownych miejscach, z małą zakładką między fragmentami;
- zapisuj obok wektora źródło i datę, żeby model mógł cytować;
- łącz wyszukiwanie wektorowe z filtrem po metadanych (klient, rok, typ dokumentu);
- przy dużych zbiorach dołóż reranking najlepszych wyników;
- mierz jakość na zestawie prawdziwych pytań.

## Szybki wybór

- **Masz Postgresa:** pgvector.
- **Chcesz usługę bez utrzymania:** Pinecone albo Chroma Cloud.
- **Chcesz otwarty kod na własnym serwerze:** Qdrant, Weaviate albo Chroma.
- **Potrzebujesz wyszukiwania po znaczeniu i słowach naraz:** Weaviate albo hybryda w Postgresie.

Wersja angielska porównywała też szybkość i ceny baz. Te liczby pochodziły z różnych testów i nie dało się ich potwierdzić na stronach producentów, więc je usunąłem.

## Gdzie dalej

- [Spis treści](https://tukamil.com/niewidzialna-architektura/#spis)
- [Zacznij od tego: Claude Start](https://start.cyfrowypomocnik.com/)
- [Chcesz to u siebie w firmie? 4 godziny wdrożenia](https://tukamil.com/wdrozenie-ai/)
- [llms.txt](https://tukamil.com/llms.txt)

Na podstawie: reference/vector-databases.md z [The Invisible Architecture](https://github.com/exhuman777/invisible-architecture).

Wersja na stronie: https://tukamil.com/niewidzialna-architektura/bazy-wektorowe/
