# BUKI — basketbola treniņu plānotājs

Telefonam un datoram pielāgota tīmekļa lietotne latviešu valodā, kas darbojas bez servera datubāzes un ārējām API atslēgām.

- Treniņa plāns 1–20 spēlētājiem ar 30, 45, 60 vai 90 minūšu ilgumu.
- Iesildīšanās, metieni, dribls, aizsardzība un fiziskā sagatavotība.
- 49 vingrinājumi ar soļiem un animētām SVG laukuma shēmām. Tās ir kustības virziena ilustrācijas, nevis video vai GIF demonstrācijas ar cilvēkiem.
- Treniņa taimeris ar pauzi un pāreju uz nākamo vingrinājumu; plāna eksports teksta failā.
- Izvēles saglabājas tikai konkrētās pārlūkprogrammas localStorage. Konts nav nepieciešams.
- Lietotāja nodrošinātais BK BUKI logo. PDF pārvērsts caurspīdīgā PNG; oriģinālais logo nav pārveidots.

## Lokālā izstrāde

Nepieciešams Node.js 24 un Python 3. Nav instalējamu projekta atkarību.

```sh
cd /workspace/Buku-treni-i
npm test
npm run build
npm run dev
```

`npm run dev` palaiž izstrādes serveri portā 5173. Produkcijas failus izveido `npm run build` mapē `dist/`; pārbaudei lieto `python3 -m http.server 5173 --bind 0.0.0.0 --directory dist`.

## GitHub Pages

1. Saglabā projekta failus repozitorija `main` zarā un nosūti tos uz GitHub.
2. Repozitorijā atver **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Darbplūsma `.github/workflows/pages.yml` pēc izmaiņām `main` zarā automātiski pārbauda un publicē `dist/`. Pēc Pages aktivizēšanas to var palaist arī manuāli sadaļā Actions.
4. Publicētā vietne būs pieejama GitHub Pages norādītajā adresē. Projekta apakšceļu atbalstam izmantoti relatīvi resursu ceļi.

Šī ir tīmekļa lietotne, nevis App Store vai Google Play pakotne. Vietne tiek publicēta ar GitHub Actions pēc izmaiņu nosūtīšanas `main` zarā, ja repozitorijā ir aktivizēts Pages. Faktisko publicēšanas rezultātu pārbaudi Actions un Settings → Pages.

## Paplašinātā bibliotēka

19 metienu, 10 dribla, 8 aizsardzības, 6 iesildīšanās un 6 fiziskās sagatavotības vingrinājumi. Pievienoti Knockout, Mikan, HORSE, Apkārt pasaulei, piespēļu un metienu varianti. Meklēšana darbojas kopā ar kategoriju un minimālā spēlētāju skaita filtriem. Treniņa plāns izvēlas 4–8 vingrinājumus atkarībā no ilguma un dažādo izvēli katrā ģenerēšanā.

Katram vingrinājumam ir piesaistīts sākuma izvietojums un katram apraksta solim noteikti kustības ceļi. Plankam, pietupieniem un līdzsvaram ir ķermeņa shēmas, nevis basketbola laukums. Shēmas ir ilustratīvas; tās nav video demonstrācijas vai biomehānikas analīze.

Avotu lasīšanu šajā vidē bloķēja tīkla politika. Jaunie teksti ir patstāvīgi BUKI treniņu varianti. Lietotāja ieteiktā Nike 5–4–3–2–1 saite ir pievienota kā nepārbaudīts saistītais raksts; BUKI variants nav apgalvojums par Nike raksta noteikumiem. Izpētes statuss un saites ir `SOURCES.md`.

## Pārbaudes

`npm test` pārbauda visus 20 spēlētāju skaitus, 4 ilgumus un 6 fokusa variantus: precīzu kopējo laiku, individuāliem treniņiem piemērotus vingrinājumus un ievades validāciju. Chromium pārbaudītas arī plāna izveide, vingrinājumu soļi, automātiska soļu maiņa, taimeris, pauze, nākamais vingrinājums, lejupielāde, filtri, iestatījumu saglabāšana un telefona izkārtojums.

## Resursi

Logo: BK BUKI, lietotāja nodrošināts materiāls. Barlow fonti: SIL Open Font License, skatīt `assets/Barlow-LICENSE.txt`. Fonti glabājas projektā; lietotnes darbībai nav ārēju tīkla pieprasījumu.
