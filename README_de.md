# ![Logo](icons/icon48.png) Phoebe - Intelligenter Content-Sammler

*Andere Sprachen: [简体中文](README.md) | [English](README_en.md) | [日本語](README_ja.md) | [한국어](README_ko.md)*

## 🌍 Unterstützte Sprachen

- 🇩🇪 Deutsch
- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어

## 📖 Über Phoebe

Phoebe ist eine intelligente Chrome-Browser-Erweiterung, benannt nach einem klugen kleinen Hund. Sie hilft Ihnen dabei, wertvolle Webinhalte schnell in Notion zu sammeln, mit intelligenter Modusauswahl, Tag-Management und mehrsprachiger Benutzeroberfläche.

## ✨ Hauptfunktionen

### 🎯 Intelligente Modusauswahl (v1.0.2 Neu)
- 📄 **Seitenmodus**: Inhalte werden direkt zu ausgewählten Seiten hinzugefügt, perfekt für einfache Sammlung
- 🗄️ **Datenbankmodus**: Unterstützung für Seitenauswahl oder Erstellung neuer Seiten, ideal für strukturiertes Management

### 💫 Benutzererfahrung-Optimierung (v1.0.2 Neu)
- 🎨 **Marken-UI**: Schönes Phoebe-Logo-Dialog-Design
- 🔄 **Intelligentes Laden**: Echtzeit-Statusindikatoren für Erstellungs- und Speicherprozesse
- 🛡️ **Duplikatserkennung**: Automatische Erkennung doppelter Seitennamen zur Verwirrungsvermeidung
- ⚡ **Doppelklick-Vermeidung**: Schaltflächen werden während Operationen automatisch deaktiviert für verbesserte Stabilität

### 🔧 Kernfunktionen
- 🔍 **Intelligente Auswahl**: Beliebigen Webtext auswählen und mit Rechtsklick speichern
- 📝 **Notiz-Funktion**: Persönliche Notizen zu gesammelten Inhalten hinzufügen
- 🏷️ **Tag-Management**: Intelligente Tag-Vorschläge und Verlauf
- 🌍 **Mehrsprachiger Support**: Chinesisch, Englisch, Japanisch, Koreanisch, Deutsch
- ⚡ **Schnelle Synchronisation**: Direkt in Ihren Notion-Arbeitsbereich speichern

## 🚀 Installationsschritte

1. Laden Sie die `phoebe-v1.0.2.zip` Datei herunter
2. Öffnen Sie die Chrome-Erweiterungsseite (`chrome://extensions/`)
3. Aktivieren Sie den "Entwicklermodus"
4. Klicken Sie auf "Entpackte Erweiterung laden" und wählen Sie den entpackten Ordner
5. Konfigurieren Sie Ihren Notion API-Schlüssel und Verwendungsmodus in den Plugin-Einstellungen

## ⚙️ Konfigurationsanleitung

### Schritt 1: Notion-Integration erstellen
1. Besuchen Sie die [Notion-Integrationsseite](https://www.notion.so/my-integrations)
2. Klicken Sie auf "Neue Integration"
3. Geben Sie einen Integrationsnamen ein (z.B. Phoebe)
4. Wählen Sie den zugehörigen Arbeitsbereich
5. Kopieren Sie den generierten API-Schlüssel (Secret Token)

### Schritt 2: Verwendungsmodus wählen (v1.0.2 Neu)

#### 📄 Seitenmodus
- Geeignet für: Einfache Inhaltssammlung, tagebuchartiges Anhängen
- Funktionen: Zielseite auswählen, Inhalte werden direkt am Ende der Seite hinzugefügt
- Vorteile: Einfache Konfiguration, chronologische Inhaltsorganisation

#### 🗄️ Datenbankmodus
- Geeignet für: Strukturiertes Content-Management, kategorisierte Sammlung
- Funktionen: Datenbank auswählen, beim Speichern Seiten wählen oder neue erstellen
- Vorteile: Flexibles Management mit Unterstützung für Kategorisierung und Suche

### Schritt 3: Intelligente Konfiguration (v1.0.2 Neu)
1. Klicken Sie auf das Phoebe-Plugin-Symbol in Ihrem Browser
2. Klicken Sie auf die "Einstellungen"-Schaltfläche
3. Geben Sie den "Notion API-Schlüssel" ein
4. Wählen Sie den Verwendungsmodus (Seite/Datenbank)
5. **Intelligente Abfrage**: Phoebe holt automatisch Ihre zugänglichen Seiten und Datenbanken
6. Wählen Sie die Zielseite oder Datenbank aus der Liste
7. Klicken Sie auf "Verbindung testen", um die Konfiguration zu überprüfen
8. Einstellungen speichern

### 💡 Berechtigung-Konfigurationstipps
Falls Phoebe während der Nutzung unzureichende Berechtigungen meldet:
1. Öffnen Sie die entsprechende Notion-Seite oder Datenbank
2. Klicken Sie auf die "Teilen"-Schaltfläche oben rechts
3. Suchen und laden Sie Ihre Integration ein (z.B. Phoebe)
4. Gewähren Sie "Bearbeiten"-Berechtigungen
5. Kehren Sie zum Plugin zurück und aktualisieren Sie die Ressourcenliste

## 📱 Verwendung

### Grundlegende Verwendung
1. Wählen Sie den Text aus, den Sie auf einer beliebigen Webseite sammeln möchten
2. Rechtsklick und "In Notion speichern" auswählen
3. Im erscheinenden Phoebe-Dialog:
   - Überprüfen Sie den ausgewählten Inhalt
   - Notizen hinzufügen (optional)
   - Tags hinzufügen (optional)
   - **Datenbankmodus**: Zielseite auswählen oder neue Seite erstellen
4. Klicken Sie auf "Speichern"

### 🗄️ Datenbankmodus-Features
- **Seitenauswahl**: Aus vorhandenen Seiten in der Datenbank wählen
- **Ein-Klick-Erstellung**: Schnell neue Seiten in der Datenbank erstellen
- **Duplikatserkennung**: Automatische Erkennung doppelter Seitennamen mit freundlichen Eingabeaufforderungen
- **Echtzeit-Laden**: Erstellungsprozess zeigt "Phoebe arbeitet hart daran, für Sie zu erstellen..."

### 📄 Seitenmodus-Features
- **Direktes Anhängen**: Inhalte werden automatisch am Ende der voreingestellten Seite hinzugefügt
- **Zeitstempel**: Jede Speicherung fügt einen Zeitstempel hinzu
- **Seiteninformationen**: Anzeige des Zielseitennamens zur Bestätigung

### 🏷️ Tag-Management-Tipps
- **Neue Tags hinzufügen**: Direkt in die Tag-Eingabebox eingeben und Enter drücken
- **Verlaufs-Tags auswählen**: Eingabebox anklicken, um Verlaufs-Tag-Vorschläge zu sehen
- **Tags suchen**: Schlüsselwörter eingeben, um Tag-Vorschläge zu filtern
- **Tags entfernen**: × -Schaltfläche neben hinzugefügten Tags anklicken

## 🛠️ Projektstruktur

```
phoebe/
├── manifest.json           # Erweiterungs-Manifest-Datei
├── _locales/              # Internationalisierungsdateien
│   ├── zh_CN/messages.json  # Vereinfachtes Chinesisch
│   ├── en/messages.json     # Englisch
│   ├── ja/messages.json     # Japanisch
│   ├── ko/messages.json     # Koreanisch
│   └── de/messages.json     # Deutsch
├── icons/                 # Erweiterungssymbole
├── popup_page.html        # Popup-Seite
├── popup_script.js        # Popup-Funktions-Skript
├── options_page.html      # Einstellungsseite
├── options_script.js      # Einstellungs-Funktions-Skript
├── background_script.js   # Hintergrund-Service-Skript
├── content_script.js      # Content-Skript
└── i18n.js               # Internationalisierungs-Utilities
```

## 🚫 Fehlerbehebung

### Verbindung fehlgeschlagen?
1. Überprüfen Sie, ob der API-Schlüssel korrekt kopiert wurde
2. Bestätigen Sie, dass das Seiten-/Datenbank-ID-Format korrekt ist (32-Zeichen-String)
3. Bestätigen Sie, dass die Integration zur Zielressource eingeladen wurde
4. Stellen Sie sicher, dass "Bearbeiten"-Berechtigung gewährt wurde

### Modusauswahl-Empfehlungen
- **Neue Benutzer**: Probieren Sie zuerst den Seitenmodus, einfach und benutzerfreundlich
- **Fortgeschrittene Benutzer**: Verwenden Sie den Datenbankmodus für leistungsfähigere Funktionen
- **Flexibles Umschalten**: Sie können den Modus jederzeit in den Einstellungen ändern

### Seitenerstellung fehlgeschlagen?
1. Überprüfen Sie, ob bereits eine Seite mit demselben Namen existiert
2. Bestätigen Sie, dass die Datenbankberechtigungen korrekt konfiguriert sind
3. Überprüfen Sie, ob die Netzwerkverbindung stabil ist

## 📋 Versionshistorie

### v1.0.2 (Neueste Version) 🎉
**Intelligente Modusauswahl + Große UI-Erfahrungsverbesserungen**
- 🎯 **Dual-Modus-Support**: Seitenmodus + Datenbankmodus für verschiedene Bedürfnisse
- ✨ **Marken-UI**: Neue Phoebe-Logo-Dialoge für bessere visuelle Erfahrung
- 🔄 **Intelligente Ladezustände**: Echtzeit-Indikatoren für Erstellungs- und Speicherprozesse
- 🛡️ **Duplikatseitenerkennung**: Automatische Erkennung doppelter Namen zur Verwirrungsvermeidung
- 🎨 **Schaltflächen-Zustand-Optimierung**: Intelligente Deaktivierung während Operationen zur Vermeidung doppelter Übermittlungen
- 💬 **Warme Benutzernachrichten**: Menschliche Benutzerführung und Feedback
- 🔧 **CORS-Problem-Behebung**: Lösung technischer Probleme beim Abrufen von Seiteninformationen

### v1.0.1
**Datenbankmodus-Support**
- 🗃️ Notion-Datenbank-API-Support, ersetzt einfache Seitenverbindungen
- 📋 Seitenauswahl-Funktionalität aus Datenbanken
- ➕ Schnelle neue Seitenerstellungs-Funktion
- 🏷️ Tag-Eigenschafts-Konfiguration-Support
- 🌍 Vollständiger mehrsprachiger Support (5 Sprachen)

### v1.0.0
**Grundfunktionen**
- 📝 Grundlegende Inhaltssammlung und -speicherung
- 🏷️ Tag-Management-System
- 🌍 Mehrsprachiger Interface-Support
- ⚙️ Notion API-Integration

## 🤝 Mitwirken

Willkommen bei der Einreichung von Problemberichten und Funktionsvorschlägen!

## 📄 Lizenz

Dieses Projekt ist Open Source unter der MIT-Lizenz.

## 🐕 Über den Namen

Phoebe ist nach einem klugen und liebenswerten kleinen Hund benannt. Genau wie sie ist diese Erweiterung so konzipiert, dass sie intelligent, praktisch und zuverlässig ist und Ihnen beim Sammeln wertvoller Webinhalte hilft.

---

*Mit ❤️ für Content-Sammler gemacht* 