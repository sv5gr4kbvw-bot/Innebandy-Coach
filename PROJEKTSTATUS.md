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
