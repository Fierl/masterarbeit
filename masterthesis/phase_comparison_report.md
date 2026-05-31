# Phasenvergleich Phase 1 vs. Phase 2

## Gesamtueberblick

- Phase 1: 82 Artikel, 72 Matches, 10 offene Zuordnungen.
- Phase 2: 103 Artikel, 85 regulaere Matches, 10 `filtered_low_score`, 8 ohne Match.
- Gewichtete durchschnittliche Gesamtzeit: Phase 1 = 128.97 Minuten, Phase 2 = 75.23 Minuten.
- Gewichtete durchschnittliche Textzeit: Phase 1 = 121.36 Minuten, Phase 2 = 72.69 Minuten.
- Gewichtete durchschnittliche Zusatzzeit: Phase 1 = 7.6 Minuten, Phase 2 = 3.63 Minuten.
- Gewichtete durchschnittliche Komplexitaet: Phase 1 = 2.91, Phase 2 = 3.26
- Gewichtete durchschnittliche qualitative Bewertung: Phase 1 = 3.37, Phase 2 = 3.5
- Gewichtete durchschnittliche KI-Zufriedenheit in Phase 2 = 3.79
- Chat-Aktionen in Phase 2 insgesamt: 468 (458 Generate, 10 Edit).

## Phase-2-Nutzungsmuster gesamt

- In der CSV deklarierte verwendete Felder: text: 90, headline: 68, roofline: 50, teaser: 47, subline: 41, subheadings: 40
- Feldkombinationen aus der CSV: text,subheadings,roofline,headline,subline,teaser: 36, text: 20, text,headline: 13, none/0: 9, text,headline,roofline: 7, roofline,headline,teaser,subheadings: 3, text,subline: 3, text,teaser: 3, text,headline,roofline,teaser: 2, text,headline,teaser: 2, headline: 1, text,headline,subline: 1, text,headline,subline,teaser: 1, text,roofline,headline: 1, text,roofline,headline,subheadings: 1
- Tatsachliche Generate-Aktionen pro Feld: subheadings: 80, headline: 79, text: 67, roofline: 61, teaser: 61, subline: 59, tags: 51
- Tatsachliche Edit-Aktionen pro Feld: text: 6, headline: 4
- Alle Chat-Aktionen pro Feld: headline: 83, subheadings: 80, text: 73, roofline: 61, teaser: 61, subline: 59, tags: 51

## Vergleich pro Person

| Person | Phase1 Artikel | Phase2 Artikel | Delta | P1 Avg Zeit | P2 Avg Zeit | Delta | P1 Qualitaet | P2 Qualitaet |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| P04 | 12 | 9 | -3 | 74.58 | 87.78 | 13.2 | 3.17 | 3.56 |
| P17 | 25 | 42 | 17 | 7.21 | 7.58 | 0.37 | 3.0 | 3.0 |
| P19 | 13 | 16 | 3 | 79.62 | 11.0 | -68.62 | 2.08 | 3.25 |
| P20 | 32 | 36 | 4 | 264.53 | 179.58 | -84.95 | 4.25 | 4.17 |

## P04

### Phase 1

- Artikel in CSV: 12
- Gematchte Artikel: 12
- Ungematchte Artikel: 0
- Match-Abdeckung: 100.0%
- Durchschnittliche Textzeit: 64.17 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 10.42 Minuten
- Durchschnittliche Gesamtzeit: 74.58 Minuten
- Median der Gesamtzeit: 65.0 Minuten
- Gesamte Schreibzeit: 895.0 Minuten
- Durchschnittliche Komplexitaet: 2.83
- Durchschnittliche qualitative Bewertung: 3.17
- Recherchearten: ER: 12
- Genauigkeitsangaben: (G): 12
- Nicht gematchte IDs: keine

### Phase 2

- Artikel in CSV: 9
- Regulaer gematchte Artikel: 1
- Filtered-low-score-Artikel: 0
- Ungematchte Artikel: 8
- Match-Abdeckung nur regulaer: 11.1%
- Match-Abdeckung inkl. filtered-low-score: 11.1%
- Durchschnittliche Textzeit: 80.56 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 7.22 Minuten
- Durchschnittliche Gesamtzeit: 87.78 Minuten
- Median der Gesamtzeit: 80.0 Minuten
- Gesamte Schreibzeit: 790.0 Minuten
- Durchschnittliche Komplexitaet: 3.33
- Durchschnittliche qualitative Bewertung: 3.56
- Durchschnittliche KI-Zufriedenheit: 0.67
- Recherchearten: (ER): 7, (AS): 1, (ER/AS): 1
- Genauigkeitsangaben: (G): 9
- Laut CSV verwendete Felder: keine
- Laut CSV verwendete Feldkombinationen: none/0: 9
- Chat-Aktionen nach Typ: generate: 7
- Generate-Aktionen pro Feld: headline: 1, roofline: 1, subheadings: 1, subline: 1, tags: 1, teaser: 1, text: 1
- Edit-Aktionen pro Feld: keine
- Alle Chat-Aktionen pro Feld: headline: 1, roofline: 1, subheadings: 1, subline: 1, tags: 1, teaser: 1, text: 1
- Finale Felder in den Matches: headline: 1, roofline: 1, subheadings: 1, subline: 1, tags: 1, teaser: 1, text: 1
- Artikel mit irgendeinem Chat: 1
- Artikel mit Generate: 1
- Artikel mit Edit: 0
- Durchschnittliche Chats pro beruecksichtigtem Artikel: 7
- Durchschnittliche Generate-Aktionen pro beruecksichtigtem Artikel: 7
- Durchschnittliche Edit-Aktionen pro beruecksichtigtem Artikel: 0
- Durchschnittlicher Match-Score: 2.74

### Kommentare aus Phase 2

- Paywallteaser bspw zu offen getextet, Titel zu "nachrichtlich"
- eigenen Titel verwendet

## P17

### Phase 1

- Artikel in CSV: 25
- Gematchte Artikel: 25
- Ungematchte Artikel: 0
- Match-Abdeckung: 100.0%
- Durchschnittliche Textzeit: 5.87 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 1.34 Minuten
- Durchschnittliche Gesamtzeit: 7.21 Minuten
- Median der Gesamtzeit: 7.3 Minuten
- Gesamte Schreibzeit: 180.22 Minuten
- Durchschnittliche Komplexitaet: 2.2
- Durchschnittliche qualitative Bewertung: 3.0
- Recherchearten: ER: 6, WS: 2
- Genauigkeitsangaben: 5: 13, 4: 12
- Nicht gematchte IDs: keine

### Phase 2

- Artikel in CSV: 42
- Regulaer gematchte Artikel: 39
- Filtered-low-score-Artikel: 3
- Ungematchte Artikel: 0
- Match-Abdeckung nur regulaer: 92.9%
- Match-Abdeckung inkl. filtered-low-score: 100.0%
- Durchschnittliche Textzeit: 6.16 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 1.41 Minuten
- Durchschnittliche Gesamtzeit: 7.58 Minuten
- Median der Gesamtzeit: 6.41 Minuten
- Gesamte Schreibzeit: 318.18 Minuten
- Durchschnittliche Komplexitaet: 2.71
- Durchschnittliche qualitative Bewertung: 3.0
- Durchschnittliche KI-Zufriedenheit: 4.26
- Recherchearten: ER: 12
- Genauigkeitsangaben: 4: 25, 5: 17
- Laut CSV verwendete Felder: text: 41, headline: 28, roofline: 11, teaser: 8, subline: 5, subheadings: 1
- Laut CSV verwendete Feldkombinationen: text,headline: 12, text: 8, text,headline,roofline: 7, text,subline: 3, text,teaser: 3, text,headline,roofline,teaser: 2, text,headline,teaser: 2, headline: 1, text,headline,subline: 1, text,headline,subline,teaser: 1, text,roofline,headline: 1, text,roofline,headline,subheadings: 1
- Chat-Aktionen nach Typ: generate: 172, edit: 5
- Generate-Aktionen pro Feld: subheadings: 44, text: 44, headline: 32, roofline: 16, teaser: 16, subline: 14, tags: 6
- Edit-Aktionen pro Feld: headline: 4, text: 1
- Alle Chat-Aktionen pro Feld: text: 45, subheadings: 44, headline: 36, roofline: 16, teaser: 16, subline: 14, tags: 6
- Finale Felder in den Matches: text: 41, subheadings: 40, headline: 29, teaser: 16, roofline: 15, subline: 13, tags: 6
- Artikel mit irgendeinem Chat: 42
- Artikel mit Generate: 42
- Artikel mit Edit: 5
- Durchschnittliche Chats pro beruecksichtigtem Artikel: 4.21
- Durchschnittliche Generate-Aktionen pro beruecksichtigtem Artikel: 4.1
- Durchschnittliche Edit-Aktionen pro beruecksichtigtem Artikel: 0.12
- Durchschnittlicher Match-Score: 2.37

### Kommentare aus Phase 2

- Text gut, Überschrift/Dachzeile noch nicht ausgereift
- Inhaltliche Doppelungen, aber teils gute Ergänzungen z.B. Erklärung für "Fliegende Holländer"; Blöd, dass immer gleiche Vorschläge, wenn z.B. Titelgenerierung gedrückt
- Promt nicht wie gewünscht umgesetzt
- Aus Stichpunkten schön zusammengefasst; nur 1. Absatz habe ich umformuliert.
- bisschen zu viel dazugeschrieben für meinen Geschmack und teils Doppelungen, aber war an sich nix Falsch
- Text in Ordnung, Überschrift noch nicht ausgereift
- schöne Erklärung zum Fettbrand
- Artikel noch einmal neu geschrieben mit KI mit neuen Infos
- Artikelanfang meist sehr eintönig; Überschriften auch
- leichte inhaltliche Doppelung
- langweiliger Artikeleinstieg
- Wochentag falsch ausgedacht
- Artikelteaser zu lang, dadurch inhaltliche Doppelung
- Teaser zu lang, verrät zu viel.
- Unnötige inhaltliche Doppelungen; Verortungen teils inkorrekt bzw durcheinandergebracht
- Artikel später aktualisiert, als Vermisster wiedergefunden
- etwas zu viel "Polizeisprache" übernommen
- Messerstich erfunden in Überschrift (ist falsch); Detail zu "Der Vorfall ereignete sich nach Polizeiangaben inmitten des Festgeschehens" auch.
- wieder zu viel inhaltliche Doppelung durch langen Teaser, Titel und DZ zu langweilig
- bisschen zu viel geschwafelt/erfunden
- zu vie dazuerfunden; Artikel später ergänzt und ausgeweitet ohne Tool

## P19

### Phase 1

- Artikel in CSV: 13
- Gematchte Artikel: 5
- Ungematchte Artikel: 8
- Match-Abdeckung: 38.5%
- Durchschnittliche Textzeit: 68.46 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 11.15 Minuten
- Durchschnittliche Gesamtzeit: 79.62 Minuten
- Median der Gesamtzeit: 30.0 Minuten
- Gesamte Schreibzeit: 1035.0 Minuten
- Durchschnittliche Komplexitaet: 2.15
- Durchschnittliche qualitative Bewertung: 2.08
- Recherchearten: ER: 6, PM: 4, PM/ER: 2, PM (Pressemitteilung): 1
- Genauigkeitsangaben: E: 6, I: 6, i: 1
- Nicht gematchte IDs: 29-135242750, 29-135325175, 29-135425444, 29-135472241, 29-135625805, 29-135915016, 29-135976066, 29-136038182

### Phase 2

- Artikel in CSV: 16
- Regulaer gematchte Artikel: 11
- Filtered-low-score-Artikel: 5
- Ungematchte Artikel: 0
- Match-Abdeckung nur regulaer: 68.8%
- Match-Abdeckung inkl. filtered-low-score: 100.0%
- Durchschnittliche Textzeit: 10.07 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 5.0 Minuten
- Durchschnittliche Gesamtzeit: 11.0 Minuten
- Median der Gesamtzeit: 5.0 Minuten
- Gesamte Schreibzeit: 176.0 Minuten
- Durchschnittliche Komplexitaet: 3.25
- Durchschnittliche qualitative Bewertung: 3.25
- Durchschnittliche KI-Zufriedenheit: 3.31
- Recherchearten: PM (Pressemitteilung): 9, Teilnahme an Stadtratssitzung: 2, Mitarbeitertext (Print nach Online): 1, Text von Print nach Online: 1, eigenes Interview nach Online: 1
- Genauigkeitsangaben: I: 14, E: 1
- Laut CSV verwendete Felder: text: 13, headline: 4, roofline: 3, subheadings: 3, teaser: 3
- Laut CSV verwendete Feldkombinationen: text: 12, roofline,headline,teaser,subheadings: 3, text,headline: 1
- Chat-Aktionen nach Typ: generate: 69, edit: 5
- Generate-Aktionen pro Feld: subheadings: 14, text: 13, headline: 10, roofline: 8, subline: 8, tags: 8, teaser: 8
- Edit-Aktionen pro Feld: text: 5
- Alle Chat-Aktionen pro Feld: text: 18, subheadings: 14, headline: 10, roofline: 8, subline: 8, tags: 8, teaser: 8
- Finale Felder in den Matches: subheadings: 14, text: 13, headline: 9, roofline: 8, subline: 8, tags: 8, teaser: 8
- Artikel mit irgendeinem Chat: 16
- Artikel mit Generate: 16
- Artikel mit Edit: 4
- Durchschnittliche Chats pro beruecksichtigtem Artikel: 4.62
- Durchschnittliche Generate-Aktionen pro beruecksichtigtem Artikel: 4.31
- Durchschnittliche Edit-Aktionen pro beruecksichtigtem Artikel: 0.31
- Durchschnittlicher Match-Score: 1.87

### Kommentare aus Phase 2

- Text auf vernünftige Länge zusammengefasst, Überschrift nicht verwendet. Kürzen auf eine bestimmte Anzahl von Wörter ist oft unbrauchbar, wenn man um z.B. 10 Wörter küzren möchte
- Dachzeile und Teil der Hauptzeile identisch. Zwischentitel nicht verwendet
- Zufriedenheit gilt jeweils nur für die erzeugten Felder!!
- Textvorschläge nicht (bzw. Teaser sehr abgewandelt) verwendet
- Nur Teaser sehr stark abgewandelt übernommen
- Text wurde nicht erzeugt

## P20

### Phase 1

- Artikel in CSV: 32
- Gematchte Artikel: 30
- Ungematchte Artikel: 2
- Match-Abdeckung: 93.8%
- Durchschnittliche Textzeit: 254.53 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 10.0 Minuten
- Durchschnittliche Gesamtzeit: 264.53 Minuten
- Median der Gesamtzeit: 270.0 Minuten
- Gesamte Schreibzeit: 8465.0 Minuten
- Durchschnittliche Komplexitaet: 3.81
- Durchschnittliche qualitative Bewertung: 4.25
- Recherchearten: WS, AS, ER: 10, AS, ER, WS: 7, AS, WS: 3, AS, WS, ER: 3, WS, AS: 3, AS: 2, AS, ER: 1, AS, EWS, ER: 1, WS, ER: 1, WS, ER, AS: 1
- Genauigkeitsangaben: 4: 31, 5: 1
- Nicht gematchte IDs: 29-135385975, 29-135385976

### Phase 2

- Artikel in CSV: 36
- Regulaer gematchte Artikel: 34
- Filtered-low-score-Artikel: 2
- Ungematchte Artikel: 0
- Match-Abdeckung nur regulaer: 94.4%
- Match-Abdeckung inkl. filtered-low-score: 100.0%
- Durchschnittliche Textzeit: 174.44 Minuten
- Durchschnittliche Zeit fuer weitere Felder: 5.14 Minuten
- Durchschnittliche Gesamtzeit: 179.58 Minuten
- Median der Gesamtzeit: 185.0 Minuten
- Gesamte Schreibzeit: 6465.0 Minuten
- Durchschnittliche Komplexitaet: 3.89
- Durchschnittliche qualitative Bewertung: 4.17
- Durchschnittliche KI-Zufriedenheit: 3.72
- Recherchearten: ER: 14, ER, WS, AS: 11, ER, WS: 5, ER, AS: 1, ER, AS, WS: 1, ER, S, WS: 1, ER. AS: 1, WS, AS, ER: 1, WS, ER: 1
- Genauigkeitsangaben: I: 36
- Laut CSV verwendete Felder: headline: 36, roofline: 36, subheadings: 36, subline: 36, teaser: 36, text: 36
- Laut CSV verwendete Feldkombinationen: text,subheadings,roofline,headline,subline,teaser: 36
- Chat-Aktionen nach Typ: generate: 210
- Generate-Aktionen pro Feld: headline: 36, roofline: 36, subline: 36, tags: 36, teaser: 36, subheadings: 21, text: 9
- Edit-Aktionen pro Feld: keine
- Alle Chat-Aktionen pro Feld: headline: 36, roofline: 36, subline: 36, tags: 36, teaser: 36, subheadings: 21, text: 9
- Finale Felder in den Matches: headline: 34, roofline: 34, subline: 34, tags: 34, teaser: 34, subheadings: 20, text: 3
- Artikel mit irgendeinem Chat: 36
- Artikel mit Generate: 36
- Artikel mit Edit: 0
- Durchschnittliche Chats pro beruecksichtigtem Artikel: 5.83
- Durchschnittliche Generate-Aktionen pro beruecksichtigtem Artikel: 5.83
- Durchschnittliche Edit-Aktionen pro beruecksichtigtem Artikel: 0
- Durchschnittlicher Match-Score: 2.56

### Kommentare aus Phase 2

- Kommentar
- Kommentar
