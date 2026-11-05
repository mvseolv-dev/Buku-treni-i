# BUKI — basketbola treniņu plānotājs

Telefonam un datoram pielāgota tīmekļa lietotne latviešu valodā, kas darbojas bez servera datubāzes un ārējām API atslēgām.

- Treniņa plāns 1–20 spēlētājiem ar 30, 45, 60 vai 90 minūšu ilgumu.
- Iesildīšanās, metieni, dribls, aizsardzība un fiziskā sagatavotība.
- 100 vingrinājumi ar soļiem un animētām SVG laukuma shēmām. Tās ir kustības virziena ilustrācijas, nevis video vai GIF demonstrācijas ar cilvēkiem.
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

39 metienu, 22 dribla, 16 aizsardzības, 11 iesildīšanās, 6 fiziskās sagatavotības un 6 stiepšanās vingrinājumi. Pievienoti Knockout, Mikan, HORSE, Apkārt pasaulei, piespēļu un metienu varianti. Meklēšana darbojas kopā ar kategoriju un minimālā spēlētāju skaita filtriem. Treniņa plāns izvēlas 4–8 vingrinājumus atkarībā no ilguma un dažādo izvēli katrā ģenerēšanā.

Astoņiem fiziskajiem/stiepšanās vingrinājumiem ir īstu cilvēku foto demonstrējumi no Free Exercise DB ar piesaisti izpildes soļiem. Attēli un licence glabājas lokāli. Pārējiem 92 vingrinājumiem shēma ir redzama uzreiz gan kartītē, gan vingrinājuma skatā līdzās izpildes ceļvedim. Shēmas nav paslēptas izvērsnē. Tie nav nepārtraukti GIF vai video demonstrējumi. Pilns treniņš noslēdzas ar piecām stiepšanās minūtēm.

Avotu lasīšanu šajā vidē bloķēja tīkla politika. Jaunie teksti ir patstāvīgi BUKI treniņu varianti. 5–4–3–2–1 seko lietotāja pēdējam precizējumam; iepriekšējais patvaļīgais skaitīšanas variants ir noņemts. Tam ir sākuma kadrs un pieci darbības posmi: divsolis no kreisās, apkārt konusam 0 un divsolis no labās, metiens pie stūra 3, metiens pie stūra 2, tad metiens loka augšā pie 1. Izpētes statuss un saites ir `SOURCES.md`.

## Pārbaudes

`npm test` pārbauda visus 20 spēlētāju skaitus, 4 ilgumus un 6 fokusa variantus: precīzu kopējo laiku, individuāliem treniņiem piemērotus vingrinājumus un ievades validāciju. Chromium pārbaudītas arī plāna izveide, vingrinājumu soļi, automātiska soļu maiņa, taimeris, pauze, nākamais vingrinājums, lejupielāde, filtri, iestatījumu saglabāšana un telefona izkārtojums.

## Resursi

Logo: BK BUKI, lietotāja nodrošināts materiāls. Barlow fonti: SIL Open Font License, skatīt `assets/Barlow-LICENSE.txt`. Fonti glabājas projektā; lietotnes darbībai nav ārēju tīkla pieprasījumu.

## Vizuāļu un teksta saskaņošana

`guides.js` un `additional-drills.js` glabā katru norādi kopā ar tās konkrēto izvietojumu un maršrutiem. `training.js` izmanto tieši šo norāžu secību. Metieni un piespēles ir dzeltenas pārtrauktas līnijas; spēlētāju pārvietošanās ir zila. Piespēle un nākamais metiens tiek atskaņoti secīgi. Konusi paliek vienā vietā visos konkrētā vingrinājuma posmos. Daudzvirzienu vingrinājumiem izmanto laukuma skatu; piespēlei ar atsitienu — sānskatu; stājas darbam — tehnikas ilustrāciju. “Visa secība” rāda visus posmus vienlaikus.

Automātiskās pārbaudes pārbauda 100 ierakstus, katra maršruta sākumu pie pareizā spēlētāja, foto failu esamību, visu laika budžetu kombinācijas un lietotāja 5–4–3–2–1 maršruta konkrētos punktus. Pārlūka pārbaudes apliecina renderēšanu un vadību; tās neaizstāj kvalificēta trenera biomehānikas novērtējumu.

## Stiepšanās foto

Visiem sešiem stiepšanās vingrinājumiem ir vizuāli pārskatīts, lokāli glabāts cilvēka foto. Stiepšanās sadaļa parāda visus sešus uzreiz. Tie ir darba pozas piemēri; lietotne tiem neizdomā sākuma/beigu fotopāri, ja avots to nepiedāvā. Teksta soļi paliek atsevišķi. Pārbaudot bibliotēku, nevienam stiepšanās vingrinājumam nav atļauts palikt bez foto.

## Visi izvēlētie dalībnieki strādā

`participation.js` katram plāna ierakstam veido pilnu darba sadalījumu. Katrs dalībnieks ir tieši vienā grupā ar konkrētu lomu; neviens netiek atstāts pāri. Četri dalībnieki pāru darbā veido 2 pārus. Pieci dalībnieki piemērotos metienu vingrinājumos veido 3 + 2 grupas. Fiksēti trīs cilvēku vingrinājumi četriem netiek atlasīti. “Uzbrūc aizsarga pieejai” atbalsta arī četru lomu variantu, pievienojot atsevišķu savācēju gan shēmā, gan darba sadalījumā. Individuālajiem nepārtrauktā maršruta metienu vingrinājumiem katram vajadzīgs savs grozs; savācēja loma tiem netiek izdomāta.

Inventāra sadaļā norāda grozus un bumbas. Noklusējums: 2 grozi un bumbu skaits pēc spēlētāju skaita; pēc bumbu lauka manuālas maiņas saglabā reālo daudzumu. Plāns ņem vērā šos ierobežojumus un skaidri paziņo, ja izvēlētajam fokusam nav atbilstoša formāta. Rindas/izslēgšanas spēles paliek apskatāmas pilnajā bibliotēkā, bet netiek ieliktas plānā, kas sola vienlaicīgu iesaisti. Bibliotēkas filtrs sākotnēji seko plānotāja spēlētāju skaitam; visus formātus var ieslēgt atsevišķi. Plāna atvēršana un eksports saglabā tieši ģenerētās grupas, nevis atver sākotnējo vispārīgo piemēru.

Zilie ģeometriskie cilvēciņi izņemti. Piemērotām pozām izmantoti cilvēku foto; bumbas/pēdu kustībām — atsevišķas kustības shēmas, tās netiek sauktas par foto demonstrējumiem.

## Ikona telefonā

Pārlūka ikona, Apple sākuma ekrāna ikona un `manifest.webmanifest` norāda uz lietotāja BUKI logo `assets/buki-logo.png`. Vecā B monogramma izņemta. Sākuma ekrāna pievienošana izmanto pārlūkprogrammas iespējas; bezsaistes darbība nav pievienota.
