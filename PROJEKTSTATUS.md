# Projektstatus – Innebandy Coach PRO

Senast uppdaterad: 2026-11-13

## Publicering
- Användaren har godkänt uppdateringar av både test och ordinarie app.
- Båda Cloudflare-projekten publicerar automatiskt från develop-29-9.
- main är en Preview-gren i nuvarande Cloudflare-inställningar.
- Röd/vit plan testades och användaren bekräftade att automatisk publicering fungerar.

## Version 30.1
- Full backup inkluderar coach294_data_v1 (matchstatistik).
- Matchimport validerar ID, referenser, laguppställningar, händelsetyper och perioder före ersättning.
- Separat matchimport skriver till lagringen innan aktiv data ersätts.
- Äldre säkerhetskopior utan säsong eller matchperiod migreras.
- Matchperiod sparas per match.
- Offline-cache innehåller nya plan-, animations- och valideringsfiler.
- Sidtitel visar 30.1.

## Verifiering
- Syntaxkontroll av ändrade JS-filer och samtliga 27 inbäddade skript godkänd.
- Test av äldre backup, nio felaktiga importfall, oförändrade data vid fel/lagringsfel godkänd.
- Full test av iPhone-gester, offline i flygplansläge och animationsflöden återstår.
- Matchstatistik är lokal på respektive adress/enhet och synkas inte automatiskt.

## Nästa steg
- Samordna animationens inspelning och flerspelarläge.
- Förbättra versionsvisning och verifiering av ny publicering vid behov.

## Version 30.2
- Träningspanelen har synkroniserat val En/Flera och + Steg för grupperade förflyttningar.
- En spelare: automatisk bildruta efter varje flytt. Flera: manuell bildruta efter önskade flyttar.
- Sista väntande gruppsteget sparas vid stopp, uppspelning och växling av läge.
- Rensning av bildrutor avslutar inspelningen. Räknaren följer befintliga bildrutor.
- Automatiska flödestester för inspelning, gruppsteg, stopp, uppspelning, lägesbyte och rensning godkända. iPhone-gester återstår att testa.

## Version 30.3
- Planens passning till skärmen pausas under aktivt drag; objektens koordinater använder dragets ursprungliga skärmtransformation.
- Träningspanelen ligger i en egen bottenrad. Planens tillgängliga höjd räknar bort panelen.
- Stor Ångra steg-knapp återställer en osparad grupp eller tar bort senaste sparade steg och återställer föregående positioner.
- Flera spelare per steg är standard. Tryck + Steg efter gruppens förflyttningar.
- Test av två spelare samtidigt i faktisk uppspelningskod och båda ångrafallen godkänt. iPhone-dragning behöver användarverifieras.

## Version 30.4
- Explicit Spela in ett steg / Spara steget-flöde. Alla förflyttningar mellan dessa tryck lagras i en destination och spelas samtidigt.
- Ingen begränsning till två spelare; test med åtta förflyttningar sparar en gemensam bildruta.
- En kompakt rad utan radbrytning: stäng, spela in/spara steg, ångra, spela och stegräknare. Gamla En/Flera-valet tas bort.

## Version 30.5
- Träningskontroller flyttade till 58 px bred högerpanel; planens bredd reserverar panelens utrymme, utan bottenrad.
- Spela in/spara steg, ångra, spela, stopp och Fler val i sidopanelen.
- Fler val innehåller paus/fortsätt, hastighet, spara/öppna film, start/slutläge och rensa steg.
- Inspelningar sparas i befintligt filmbibliotek (ib-coach-storyboards-v7) som ingår i full backup.
- Syntax och faktisk uppspelning av åtta spelare samt paus/fortsätt testade.

## Version 30.6–30.7
- 42 px symbolpanel med röd inspelningsknapp och En/Flera.
- Dragning flyttar befintligt SVG-objekt i stället för att ersätta alla SVG-noder vid varje pekrörelse.
- Direkta träffar på spelares grafik/namn prioriteras och den indirekta träffytan har minst 22 skärmpixlars radie.
- Dubbeltrycksmenyn reagerar inte på spelare/objekt.
- Planens mått följer inte längre höjdändringar från Safaris adressfält. Rotation och verklig breddändring uppdaterar måtten.
- Test av faktisk pointermove-kod visar förflyttning utan DOM-ombyggnad och bibehållen begränsning till planen. iPhone/Safari behöver användarverifieras.

## Version 30.8
- Reserverar samma högermarginal från start så planen inte krymper/flyttas när träning öppnas eller inspelning startar.
- Döljer duplicerad högerflik medan träningspanelen är öppen; fliken flyttas inte in över planen.
- Samordnade SVG-ikoner, mörk panel, röd inspelning och grön uppspelning. Symbolvalet En/Flera kvar.

## Version 30.9 – delning
- Eget tillgängligt delningsfönster ovanpå helplansläget för Dela, Chatt och Matchcenter.
- Rättar konflikten mellan tavlans history-array och webbläsarens window.history.replaceState.
- Deltagarcallback deklareras före Firebase-prenumerationerna för att tåla tidiga svar.
- Delad anslutningsinitiering, vänteläge för knappar och återförsök efter auth-fel.
- Inbjudningslänk rensas från versionsparametrar. Mottagare bekräftar namn och Gå med; börjar som åskådare.
- Matchchatten och länken rensas vid Lämna. Chattprenumerationen avslutas på samma query som startades.
- Mocktester av rumsskapande, tidiga Firebase-callbacks, ren länk, lämna och manuell anslutning godkända. Verklig synk mellan två enheter återstår att verifiera.

## Version 30.10
- Rättar ReferenceError i delning: match.js använder coachMatchBoard.getItems/setItems i stället för privata items/render i tavlans IIFE.
- Testmiljön saknar nu globala items/render, så samma åtkomstfel upptäcks av testet.

## Version 30.11
- Namn krävs före anslutning; kan sparas/ändras även efter anslutning. Chatt visar avsändarnamn, även för egna meddelanden.
- Flerradigt skrivfält med förhandsvisning och teckenräknare. Endast Skicka publicerar; Enter ger ny rad.
- Gå till tavlan-knapp i delningsfönstrets fasta sidhuvud.
- Ägaren ger automatiskt inbjudna redigeringsrätt via befintliga editors-regler när ägaren är ansluten. Kan stängas av; uttryckligt återkallade gäster återgodkänns inte automatiskt i sessionen.
- Separat tangentbordsanpassning för delningsfönstret via visualViewport, utan ändring av tavlans fasta layout.
- Två simulerade klienter testade med behörighetskontroller: namn, automatisk redigeringsrätt, gästritning till ägare och meddelandeutkast före explicit skickning.

## Version 30.12
- Rotation samplar viewportmåtten under 1,6 sekunder så fördröjd Safari-höjd inte fastnar.
- Den frysta arbetsytans höjd uppdateras samtidigt med planens mått.
- Helplan/halvplan behålls. Vanliga höjdändringar från adressfält utanför rotationsfönstret ignoreras fortfarande.
- Simulerad stående–liggande–stående rotation med försenad höjduppdatering återställer ursprunglig storlek i halvplansläget.

## Version 30.13
- Huvudmenyn har Sidläge med scroll / Byt till planläge.
- Sidläget visar tavla, verktyg och öppna funktionspaneler i normalt dokumentflöde. Sidnavigeringens tidigare dolda vyer visas tillsammans.
- Fast sidverktygsfält med Huvudmeny och Planläge. Läget sparas lokalt (coach-layout-v1), standard är planläge.
- Återgång till planläge återställer tidigare fokus-/navigeringsklasser och expanderade paneler. Tavlans objekt och inspelningar byts inte ut.

## Version 30.14 – helhetskontroll 2026-11-14
- Menyvalen Ändra spelare och Rotera objekt söker även i sidverktygen; de saknades i den äldre verktygsraden och gick därför inte att aktivera från menyerna.
- Fördröjd placering avbryts om redigeringsrätt försvinner före placeringen.
- Mottagen tavla stoppar pågående enkel uppspelning, avbryter väntande placering och rensar Ångra/Gör om så en äldre tavla inte återställs över den delade.
- Spelarredigeraren kan inte spara om redigeringsrätten återkallats medan den var öppen.
- Planens storlek räknas om efter släppt/avbrutet drag, även efter rotation under draget.
- Rumsbyte rensar behörighetscache; en gammal skickbekräftelse raderar inte utkast i ett nytt rum.
- Offlineversion och ändrade skriptadresser uppdaterade tillsammans.

### Verifierat i denna kontroll
- Syntax för samtliga inbäddade och externa JS-filer, JSON och lokala skriptreferenser.
- DOM-tester av uppstart, plan/sidläge, halvplansval, namn och flerradigt utkast.
- Reproducerat före rättning: fördröjd placering efter återkallad rätt; Ångra återställer tidigare tavla efter mottagen fjärrtavla. Samma fall klarar rättningarna.
- Simulerad rotation i helplan och halvplan, fryst storlek under drag samt omräkning efter släpp.
- Åtta spelare i ett gemensamt animationssteg, faktisk interpolering, filmsparning och träningspassparning.
- Äldre matchdata migreras; felaktiga ID, matchreferenser, laguppställning, period och händelsetyp avvisas.
- Tre simulerade tränarklienter med delad Firebase-mock: automatisk redigeringsrätt, gästritning till övriga, utkast före Skicka, namn/radbrytning i chatt och städning efter Lämna.

### Återstår / begränsningar
- Ingen riktig iPhone/iPad eller Safari har testats här. Lokal Chromium kunde inte starta på grund av miljöns socketbegränsning. DOM-tester verifierar inte visuell layout.
- Firebase-testet använder en mock. Verklig anslutning, publicerade serverregler, nätavbrott och synk mellan fysiska enheter återstår.
- Samtidiga ändringar skickar fortfarande hela tavlan; överlappande redigeringar är inte konfliktfria.
- Offline-cachefilerna har granskats; verkligt flygplansläge återstår.
- Arbetet ligger på audit-30-14 för separat granskning. develop-29-9 har inte uppdaterats av denna kontroll eftersom projektstatus uppger att både test- och ordinarie adress publicerar från den.

## Version 30.15 – enklare statistik, chattnotiser och 5 mot 5
- Tryck på en spelare i Match+ och registrera mål, assist eller 2/5/10 utvisningsminuter utan inmatningsdialog. Vald spelare behålls efter registrering.
- Matchval visar resultat samt spelartabell för vald match. Tabellen kan växlas till säsong eller alla matcher och visar mål, assist, poäng (mål + assist), antal utvisningar och summerade utvisningsminuter, även för spelare utan poäng.
- Säsongskort visar hela lagets gjorda mål, assist, spelarpoäng, utvisningsminuter och insläppta mål. Saknade insläppta mål markeras som ofullständig summa.
- Eget resultat räknas från målregistreringar men kan anges manuellt. Motståndarens mål anges per match. Manuella resultat ändrar inte spelarstatistiken. CSV följer vald statistikvy och har en totalrad.
- Matchresultat ingår i befintlig säkerhetskopiering och importvalideras. Lagringsfel återställer senaste sparade matchdata.
- Nya meddelanden från andra tränare visar en liten notis. Läs och svara öppnar chatten; Läs senare stänger notisen men behåller knappen med antal olästa. Gamla meddelanden vid anslutning och egna meddelanden ger ingen notis. Detta är notiser inne i appen när anslutningen är aktiv, inte systempush.
- 5×5 i träningspanelen ställer upp fem blå och fem röda spelare samt en boll. Flytta alla spelare mellan start och spara av samma steg; alla spelas upp samtidigt. Tydlig instruktion visas under inspelning. Befintliga sparade filmer behålls.
- Offlinecachen och de ändrade filernas versionsadresser har uppdaterats tillsammans.

### Testat
- tests/statistics.cjs: separata spelare och matcher, mål/assist/poäng, 2+5+10=17 minuter, nollpoängsspelare, manuella/automatiska resultat, säsongssummor, saknade resultat, ogiltig import och lagringsfel.
- tests/sharing.cjs: tre simulerade tränare, gästritning, namn, utkast, olästa meddelanden, läs senare, läs/svara och inga notiser för egna eller historiska meddelanden. Firebase är simulerad.
- tests/runtime.cjs: verkliga tavlans drag- och uppspelningskod med tio spelare i ett steg, film- och träningspassparning samt regressionstester från 30.14.
- tests/rotation.cjs: hel- och halvplan, rotation under drag, omräkning efter släpp.
- DOM-tester bekräftar funktion men ersätter inte visuell testning på iPhone/iPad eller verifiering av verklig Firebase-anslutning.

### Snabbval för namngivna femmor
- Huvudmenyn och Alla verktyg har Första, Andra, Tredje och Fjärde femman → plan.
- Namn, nummer och positioner hämtas från befintlig spelartrupp. Vald femma ersätter egna blå spelare; motståndare, boll och ritningar behålls. Ifylld ordinarie målvakt följer med.
- Nya femmor placeras i grundpositioner (tre forwards, två backar). Därefter går de att flytta och animera. Gamla animationssteg rensas först efter bekräftelse; sparade filmer behålls. Tom femma eller visningsbehörighet ändrar inte tavlan.
