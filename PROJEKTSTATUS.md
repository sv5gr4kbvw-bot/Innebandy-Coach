# Projektstatus – Innebandy Coach PRO

Senast upprättad: 2026-11-13

## Gemensam arbetsmetod
Den här filen är projektets överlämning mellan röst- och textchattar. Läs denna fil och kontrollera GitHubs aktuella kod/commits innan du föreslår nya ändringar. GitHub är källa för kodens faktiska tillstånd; konversationen är källa för önskemål och beslut. Ändra inte produktionsgrenen utan uttryckligt godkännande.

## Kända projektfakta
- Repository: sv5gr4kbvw-bot/Innebandy-Coach
- Utvecklingsgren: develop-29-9
- Testprojekt: https://innebandy-coach-test.pages.dev (Cloudflare Pages, kopplat till GitHub-grenen develop-29-9)
- Ordinarie projekt: https://innebandy-coach-pro.pages.dev (ska skyddas)
- Version 29.9 laddades upp från ZIP till GitHub; ikonerna i icons/ laddades upp separat.
- Användaren bekräftade att testappen fungerade på iPhone.
- Match+-knappen på planen skulle tas bort och ersättas av menyval i höger- och nederkantsmenyerna; kodändring gjord på utvecklingsgrenen.
- Användaren har begärt en fullständig kvalitetsgenomgång med förbättringar av användbarhet, plan, ritverktyg, animationer, match, statistik, samarbete och iPhone-stöd.

## Nästa arbetssteg
1. Läs senaste commits och kontrollera att ändringarna verkligen finns i aktuell gren; kontrollera eventuell utveckling som gjorts sedan senaste samtal.
2. Granska kod och användarflöden; dokumentera konkreta fel och prioriteringar.
3. Genomför små verifierbara ändringar på develop-29-9, aldrig på main.
4. Låt Cloudflare publicera testprojektet och be användaren testa på iPhone.
5. Uppdatera denna fil efter varje större arbetspass: genomfört, ej testat, kvarstående och senaste commit.

## Viktiga begränsningar
- Denna fil synkroniserar inte automatiskt talade önskemål; sådana måste skrivas in här efter samtalet.
- Att kod är committad betyder inte att funktionaliteten är testad.
- Den återskapade matchstatistiken använder lokal lagring; exportera säkerhetskopior och utgå inte från att Firebase synkar dessa uppgifter.
