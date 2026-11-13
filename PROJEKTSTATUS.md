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
