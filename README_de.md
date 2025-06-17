# ![Logo](icons/icon48.png) Phoebe - Intelligenter Content-Collector
git 
*Andere Sprachen: [中文](README.md) | [English](README_en.md) | [日本語](README_ja.md) | [한국어](README_ko.md)*

---

## 📖 Über Phoebe

Phoebe ist eine intelligente Chrome-Erweiterung, benannt nach einem klugen kleinen Hund. Sie hilft dabei, Webinhalte schnell in Notion zu sammeln, mit Tag-Management und mehrsprachiger Benutzeroberfläche.

## ✨ Hauptfunktionen

- 🔍 **Intelligente Auswahl**: Webtext markieren und per Rechtsklick speichern
- 📝 **Notiz-Funktion**: Persönliche Notizen zu gesammelten Inhalten hinzufügen
- 🏷️ **Tag-Management**: Intelligente Tag-Vorschläge und Historie
- 🌍 **Mehrsprachig**: Chinesisch, Englisch, Japanisch, Koreanisch, Deutsch
- ⚡ **Schnelle Synchronisation**: Direkt in Notion-Seiten speichern
- 🎨 **Schöne Benutzeroberfläche**: Modernes Design mit einfacher Bedienung

## 🚀 Installation

1. `phoebe-v1.0.1.zip` Datei herunterladen
2. Chrome-Erweiterungsseite öffnen (`chrome://extensions/`)
3. "Entwicklermodus" aktivieren
4. "Entpackte Erweiterung laden" anklicken
5. Notion API-Token und Seiten-ID in den Einstellungen konfigurieren

## ⚙️ Einrichtungsanleitung

### Schritt 1: Notion-Integration erstellen
1. [Notion-Integrationen](https://www.notion.so/my-integrations) besuchen
2. "Neue Integration" Button klicken
3. Integrationsnamen eingeben (z.B. Phoebe)
4. Zugehörigen Arbeitsbereich auswählen
5. Generierten API-Token (Secret) kopieren

### Schritt 2: Zielseite einrichten
1. In Notion eine Seite als Sammelziel erstellen oder auswählen
2. "Teilen"-Button oben rechts auf der Seite klicken
3. "Einladen" klicken und nach dem soeben erstellten Integrationsnamen suchen
4. Der Integration "Bearbeiten"-Berechtigung erteilen
5. Seiten-ID aus der Seiten-URL kopieren (32-stellige Zeichenkette)
   ```
   Beispiel: https://notion.so/workspace/page-title-123abc456def789...
   Seiten-ID ist die letzte 32-stellige Zeichenkette: 123abc456def789...
   ```

### Schritt 3: Erweiterung konfigurieren
1. Phoebe-Erweiterungssymbol im Browser anklicken
2. "Einstellungen"-Button klicken
3. API-Token aus Schritt 1 in "Notion API-Token" einfügen
4. Seiten-ID aus Schritt 2 in "Seiten-ID" einfügen
5. "Verbindung testen" klicken, um Konfiguration zu überprüfen
6. Nach erfolgreicher Konfiguration "Einstellungen speichern" klicken

## 📱 Verwendung

### Grundlegende Nutzung
1. Text auf einer beliebigen Webseite markieren
2. Rechtsklick und "In Notion speichern" wählen
3. Im Popup-Dialog:
   - Ausgewählten Inhalt überprüfen
   - Notizen hinzufügen (optional)
   - Tags hinzufügen (optional)
4. "Speichern"-Button klicken

### Tag-Management Tipps
- **Neue Tags hinzufügen**: In das Tag-Eingabefeld tippen und Enter drücken
- **Aus Historie auswählen**: Eingabefeld anklicken, um Tag-Vorschläge zu sehen
- **Tags suchen**: Stichwörter eingeben, um Tag-Vorschläge zu filtern
- **Tags entfernen**: × Button neben hinzugefügten Tags klicken
- **Historie verwalten**: Alle Tag-Historie auf der Einstellungsseite anzeigen und verwalten

## 🏷️ Tag-Management Funktionen

Phoebe bietet leistungsstarke Tag-Management-Funktionalität:

- **Intelligente Vorschläge**: Bietet Tag-Vorschläge basierend auf Nutzungshistorie
- **Auto-Vervollständigung**: Sucht automatisch passende historische Tags beim Tippen
- **Historie-Aufzeichnung**: Speichert automatisch alle verwendeten Tags
- **Batch-Verwaltung**: Tag-Historie auf der Einstellungsseite anzeigen und löschen
- **Sofortige Synchronisation**: Neu hinzugefügte Tags erscheinen sofort in der Vorschlagsliste

## 🌍 Mehrsprachige Unterstützung

Phoebe unterstützt die folgenden Sprachen und wechselt automatisch basierend auf Ihrer Browsersprache:

- 🇨🇳 Vereinfachtes Chinesisch
- 🇺🇸 Englisch
- 🇯🇵 Japanisch
- 🇰🇷 Koreanisch
- 🇩🇪 Deutsch

## 🛠️ Projektstruktur

```
phoebe/
├── manifest.json           # Erweiterungs-Manifest
├── _locales/              # Internationalisierungsdateien
│   ├── zh_CN/messages.json  # Vereinfachtes Chinesisch
│   ├── en/messages.json     # Englisch
│   ├── ja/messages.json     # Japanisch
│   ├── ko/messages.json     # Koreanisch
│   └── de/messages.json     # Deutsch
├── icons/                 # Erweiterungssymbole
├── popup_page.html        # Popup-Seite
├── popup_script.js        # Popup-Funktionalität
├── options_page.html      # Einstellungsseite
├── options_script.js      # Einstellungsfunktionalität
├── background_script.js   # Hintergrund-Service-Worker
├── content_script.js      # Inhaltsskript
└── i18n.js               # Internationalisierungs-Hilfsprogramme
```

## 🚫 Fehlerbehebung

### Verbindung fehlgeschlagen?
1. Prüfen, ob API-Token korrekt kopiert wurde
2. Seiten-ID-Format überprüfen (32-stellige Zeichenkette)
3. Bestätigen, dass Integration zur Zielseite eingeladen wurde
4. Sicherstellen, dass "Bearbeiten"-Berechtigung erteilt wurde

### Tags werden nicht angezeigt?
1. Erweiterungsstatus aktualisieren versuchen
2. Browser-Konsole auf Fehler überprüfen
3. Speicher-Dialog erneut öffnen

### Inhalt speichern fehlgeschlagen?
1. Netzwerkverbindung prüfen
2. Überprüfen, ob Notion-Seite zugänglich ist
3. API-Token-Berechtigungen bestätigen

## 🤝 Mitwirken

Wir begrüßen Fehlerberichte und Funktionsvorschläge!

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz als Open Source veröffentlicht.

## 🐕 Über den Namen

Phoebe ist nach einem klugen und liebenswerten Hund benannt. Genau wie sie ist diese Erweiterung darauf ausgelegt, intelligent, praktisch und zuverlässig zu sein und Ihnen beim Sammeln wertvoller Webinhalte zu helfen.

---

*Mit ❤️ für Content-Sammler überall gemacht* 