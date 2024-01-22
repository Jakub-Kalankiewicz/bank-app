# Opis Projektu: Internetowa Bankowość

## Cel Projektu
Celem jest zbudowanie interfejsu użytkownika bankowości internetowej.

## Funkcjonalności
- Logowanie za pomocą hasła z implementacją logowania opartego o wybrane znaki hasła.
- Przeglądanie listy przelewów.
- Wykonywanie przelewów na wybrane konta (co najmniej jedno konto testowe).
- Przeglądanie danych wrażliwych (numer karty i dokumentu tożsamości użytkownika).
- Zmiana hasła.
- Przelewy charakteryzują się kwotą, tytułem i danymi adresata.

## Bezpieczeństwo
- Dane wrażliwe są przechowywane bezpiecznie i niedostępne dla innych użytkowników.
- Walidacja danych wejściowych z negatywnym nastawieniem.
- Opoźnienia i limity prób logowania do zapobiegania atakom brute-force.
- Ograniczone informowanie o błędach, np. przyczynie odmowy uwierzytelnienia.
- Bezpieczne przechowywanie hasła z wykorzystaniem funkcji mieszających, soli, wielokrotnego hashowania.
- Kontrola siły hasła.
- Zarządzanie uprawnieniami do zasobów.

## Technologie i Architektura
- Dokumentacja technologiczna i architektoniczna dołączona w ISODzie.
- Krótka prezentacja (5 min.) z bibliografią na końcu.

## Wymagania
- Skonteneryzowanie przy użyciu Docker (`docker-compose up`).
- Baza danych SQL (może być SQLite).
- Szyfrowane połączenie z aplikacją przez serwer WWW (NGINX lub Apache HTTPd) jako proxy.
- Walidacja danych wejściowych z negatywnym nastawieniem.
- Weryfikacja dostępu użytkowników do zasobów i liczby nieudanych prób logowania.
- Sprawdzanie jakości hasła (np. jego entropii).
- Dodanie opóźnienia podczas logowania.
- Szczegółowa znajomość implementacji szkieletu aplikacji (lub modułu).

## Elementy Dodatkowe
- Zabezpieczenie przeciwko Cross-Site Request Forgery (żetony CSRF/XSRF) dla logowania.
- Możliwość odzyskania dostępu w przypadku utraty hasła.
- Wyłączenie nagłówka Server.

## Technologie
- Next.js
- NextAuth
- NGINX jako proxy
- Szyfrowanie HTTPS z użyciem certyfikatu podpisanego własnoręcznie
