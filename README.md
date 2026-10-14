# Kwiatboxy — kwiaty, które nie więdną

Statyczna strona (HTML + CSS + JS, bez budowania) promująca ręcznie układane boxy ze sztucznych kwiatów Emilii.
Wszystkie przyciski zakupu prowadzą do OLX.

## Uruchomienie

Otwórz `index.html` w przeglądarce albo wrzuć repozytorium na Vercel / Netlify / GitHub Pages — bez konfiguracji.

## Link do OLX

W pliku `main.js` na samej górze:

```js
const OLX_URL = 'https://www.olx.pl/';
```

Wklej tam adres profilu Emilii na OLX — wszystkie przyciski „OLX” go użyją.
Jeśli konkretny box ma prowadzić do swojego ogłoszenia, dodaj w `index.html` przy tym boxie
`data-olx="https://www.olx.pl/d/oferta/..."`.

## Struktura

- `index.html` — treść strony
- `styles.css` — wygląd (kolory i fonty jako zmienne w `:root`)
- `main.js` — link do OLX, menu, paralaksa dekoracji, animacje wejścia
- `assets/logo.svg` — logo (box z kwiatem), też jako favicon
- `assets/img/` — zdjęcia boxów (kadry ze zdjęć Emilii)
- `assets/deco/` — dekoracje ze zdjęć Emilii: box i bukiety wycięte z tła, narożniki z prawdziwego bukietu,
  pojedyncze kwiaty wycięte po konturze płatków (`one-*.webp`) i wygenerowane z kwiatów tło bokeh (`bg-cta.webp`)

## Do uzupełnienia przed publikacją

- Adres OLX (patrz wyżej).
- Nazwy boxów (Len i koronka, Pudrowy róż, Wrzos, Brzoskwinia, Oliwka) i ich opisy — robocze.
- Tekst „O mnie” i odpowiedzi w pytaniach — napisane przykładowo, warto przepisać własnymi słowami.
