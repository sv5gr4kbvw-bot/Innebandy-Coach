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
