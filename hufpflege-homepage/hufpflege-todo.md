# Hufpflege-Projekt – Ideen & Planung

## Projektübersicht

Homepage für eine selbstständige Huf- und Klauenpflegerin.
Deployment via Docker + Nginx. Modern, responsiv, mit Bildern.

---

## Entscheidungen (getroffen)

| Thema | Entscheidung |
|---|---|
| Inhaberin-Benachrichtigung | E-Mail |
| Bestätigung durch Inhaberin | Ja/Nein-Link in E-Mail |
| Routenoptimierung | PLZ-Gruppierung (kein API-Key) |
| Frontend-Stack | Einfaches HTML/CSS/JS |
| Containerisierung | Docker + Nginx |
| Texte | Platzhalter zunächst |

---

## Website-Struktur

### Seiten
- [ ] **Startseite** (einseitig scrollend, mit Sektionen)
  - [ ] Hero-Bereich (Name, Slogan, CTA-Button)
  - [ ] Sektion: Über mich
  - [ ] Sektion: Dienstleistungen & Preise
  - [ ] Sektion: Terminanfrage (Formular)
- [ ] **Impressum** (eigene Seite)
- [ ] **Datenschutz** (eigene Seite)

### Design
- [ ] Modern & responsiv (Mobile First)
- [ ] Erdige Farben (Grün, Braun, Crème)
- [ ] Platzhalterbilder (Hufpflege, Tiere, Portrait)
- [ ] Navigation mit Anker-Links + Impressum/Datenschutz

---

## Terminanfrage-Formular

Felder:
- [ ] Vorname, Nachname
- [ ] E-Mail-Adresse
- [ ] Telefonnummer (optional)
- [ ] PLZ + Ort
- [ ] Anzahl der Tiere
- [ ] Art der Tiere (Mehrfachauswahl: Pferd, Rind, Ziege, Schaf, Sonstiges)
- [ ] Wunschzeitraum / bevorzugte Tageszeit (optional)
- [ ] Nachricht / Anmerkungen (optional)
- [ ] Datenschutz-Checkbox (Pflicht)

---

## n8n-Workflow: Terminanfrage

### Ablauf
1. Formular abschicken → Webhook-Node (POST)
2. Code-Node: Daten aufbereiten + Bestätigungs-Token generieren
3. Google Calendar-Node: freie Slots der nächsten Wochen lesen
4. Code-Node: Slot-Auswahl nach PLZ-Region priorisieren
5. E-Mail an Inhaberin mit Terminvorschlag + Ja/Nein-Links
6. Warte-Webhook: Inhaberin klickt "Ja" oder "Nein"
7a. Bei "Ja": Google Calendar-Node → Termin anlegen
     → E-Mail-Node → Bestätigung an Kunden
7b. Bei "Nein": E-Mail-Node → Absage/Alternativnachricht an Kunden

### Workflow-Nodes
- [ ] Webhook (Formular-Eingang)
- [ ] Code-Node (Daten aufbereiten, Token generieren)
- [ ] Google Calendar (freie Slots lesen)
- [ ] Code-Node (PLZ-Gruppierung / Slot-Priorisierung)
- [ ] E-Mail (Inhaberin benachrichtigen, Ja/Nein-Links)
- [ ] Webhook (Bestätigungs-Eingang)
- [ ] IF-Node (Ja vs. Nein)
- [ ] Google Calendar (Termin erstellen)
- [ ] E-Mail (Kundenbestätigung)

### Noch offen
- [ ] Wie viele Terminvorschläge pro E-Mail? (1 oder 3?)
- [ ] Pufferzeit zwischen Terminen (z. B. 30 min Fahrt)?
- [ ] Stornierungsprozess?
- [ ] Google-Kalender OAuth in n8n einrichten

---

## Projektstruktur

```
hufpflege-homepage/
├── hufpflege-todo.md
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── src/
    ├── index.html
    ├── impressum.html
    ├── datenschutz.html
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        └── (Platzhalter)
```

---

## Offene Punkte

- [ ] Echter Name der Inhaberin für Impressum
- [ ] Adresse, Telefon, E-Mail für Impressum
- [ ] Google-Kalender-Zugang einrichten (OAuth in n8n)
- [ ] Domain & Hosting klären (wo läuft Docker?)
- [ ] Echte Texte & Bilder liefern
- [ ] n8n-Webhook-URL in `main.js` eintragen
