# ![Logo](../icons/icon48.png) Phoebe - Intelligenter Content-Sammler

*Andere Sprachversionen: [中文](../README.md) | [English](README_en.md) | [日本語](README_ja.md) | [한국어](README_ko.md)*

## 🌍 Unterstützte Sprachen

- 🇨🇳 简体中文
- 🇺🇸 English
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇩🇪 Deutsch

## 📖 Über Phoebe

Phoebe ist eine intelligente Chrome-Erweiterung, die nach einem klugen Hündchen benannt wurde. Sie kann Ihnen dabei helfen, ausgewählte Inhalte von Webseiten schnell in Notion zu sammeln und unterstützt zwei Modi (Notion-Seiten und Datenbanken), Schnellnotizen, Tag-Management und mehrsprachige Benutzeroberflächen.

## ✨ Hauptfunktionen

### ⚡ Schnellnotizen-Funktion (v1.0.3 vollständige Optimierung)
- 🎯 **Unabhängige Schnellnotizen**: Unterstützt reine Gedankenaufzeichnung unabhängig von Webseiteninhalten
- ⌨️ **Benutzerdefinierte Tastenkombinationen**: Konfigurierbare Tastenkombinationen für schnellen Aufruf des Notizen-Dialogs
- 🎨 **Schlichtes UI-Design**: Fokus auf Inhaltseingabe, Entfernung unnötiger Oberflächenelemente
- 💾 **Intelligente Speicherlogik**: Automatische Anpassung an Seiten- und Datenbankmodus

### 🎯 Intelligente Modusauswahl (v1.0.2)
- 📄 **Normaler Dokumentenmodus**: Inhalte werden direkt zur ausgewählten Seite hinzugefügt, geeignet für einfache Sammlung
- 🗄️ **Datenbankmodus**: Unterstützt Seitenauswahl oder Erstellung neuer Seiten, geeignet für strukturierte Verwaltung

### 💫 Benutzererfahrung-Optimierung (v1.0.3 Schwerpunkt-Verbesserung)
- 🎨 **Marken-UI**: Schönes Phoebe-Logo-Dialog-Design
- 🔄 **Intelligentes Laden**: Echtzeit-Statusanzeige für Erstellungs- und Speicherprozesse
- 🛡️ **Fehlerbehandlung-Optimierung**: Verbesserung der Validierungsaufforderung und Dialog-Verhalten
- ⚡ **Doppelte Operationen verhindern**: Automatische Deaktivierung von Buttons während Operationen für bessere Stabilität
- 🏷️ **Einstellungsseiten-Optimierung**: Korrektur der Position der Tag-Management-Statusanzeige

### 🔧 Kernfunktionen
- 🔍 **Intelligente Auswahl**: Beliebigen Webseitentext auswählen und per Rechtsklick speichern
- 📝 **Notizfunktion**: Persönliche Notizen zu gesammelten Inhalten hinzufügen
- 🏷️ **Tag-Management**: Intelligente Tag-Vorschläge und Verlaufsaufzeichnungen, Ein-Klick-Löschung unterstützt
- 🌍 **Mehrsprachiger Support**: Chinesisch, Englisch, Japanisch, Koreanisch, Deutsch
- ⚡ **Schnelle Synchronisation**: Direkte Speicherung in Ihren Notion-Bereich

## 🚀 Installationsschritte

1. Laden Sie die `phoebe-v1.0.3.zip` Datei herunter
2. Öffnen Sie die Chrome-Erweiterungsseite (`chrome://extensions/`)
3. Aktivieren Sie den "Entwicklermodus"
4. Klicken Sie auf "Entpackte Erweiterung laden" und wählen Sie den entpackten Ordner
5. Konfigurieren Sie Ihren Notion-API-Schlüssel und Verwendungsmodus in den Erweiterungseinstellungen

## ⚙️ Konfigurationsleitfaden

### Schritt 1: Notion-Integration erstellen
1. Besuchen Sie die [Notion-Integrationsseite](https://www.notion.so/my-integrations)
2. Klicken Sie auf die Schaltfläche "Neue Integration"
3. Geben Sie den Integrationsnamen ein (z.B.: Phoebe)
4. Wählen Sie den zugehörigen Arbeitsbereich
5. Kopieren Sie den generierten API-Schlüssel (geheimes Token)

### Schritt 2: Verwendungsmodus auswählen

#### 📄 Normaler Dokumentenmodus
- Geeignet für: Einfache Inhaltssammlung, tagebuchartiges Hinzufügen, Schnellnotizen
- Merkmal: Ein Zielseite auswählen, Inhalte werden direkt am Ende der Seite hinzugefügt
- Vorteil: Einfache Konfiguration, zeitliche Ordnung der Inhalte

#### 🗄️ Datenbankmodus
- Geeignet für: Strukturierte Inhaltsverwaltung, kategorisierte Sammlung
- Merkmal: Eine Datenbank auswählen, bei jeder Speicherung Seitenauswahl oder neue Seitenerstellung möglich
- Vorteil: Flexible Verwaltung, Unterstützung für Kategorisierung und Suche

### Schritt 3: Intelligente Konfiguration
1. Klicken Sie auf das Phoebe-Erweiterungssymbol im Browser
2. Klicken Sie auf die Schaltfläche "Einstellungen"
3. Geben Sie den "Notion-API-Schlüssel" ein
4. Wählen Sie den Verwendungsmodus (Normales Dokument/Datenbank)
5. **Intelligenter Abruf**: Phoebe ruft automatisch die verfügbaren Seiten- und Datenbanklisten ab
6. Wählen Sie die Zielseite oder Datenbank aus der Liste
7. Klicken Sie auf "Verbindung testen" zur Validierung der Konfiguration
8. Speichern Sie die Einstellungen

### Schritt 4: Tastenkombinationen-Konfiguration (v1.0.3 neu hinzugefügt)
1. Im Bereich "Tastenkombinationen-Einstellungen" der Einstellungsseite
2. Klicken Sie auf die Schaltfläche "Tastenkombination ändern"
3. Stellen Sie Ihre bevorzugte Tastenkombination auf der geöffneten Chrome-Erweiterungs-Tastenkombinationsseite ein

### 💡 Berechtigungskonfiguration-Tipp
Wenn Phoebe während der Nutzung unzureichende Berechtigungen anzeigt:
1. Öffnen Sie die entsprechende Notion-Seite oder Datenbank
2. Klicken Sie auf die Schaltfläche "Teilen" oben rechts
3. Suchen und laden Sie Ihre Integration ein (z.B.: Phoebe)
4. Gewähren Sie "Bearbeiten"-Berechtigung
5. Kehren Sie zur Erweiterung zurück und aktualisieren Sie die Ressourcenliste

## 📱 Verwendung

### 📝 Schnellnotizen (v1.0.3 empfohlene Funktion)
1. Verwenden Sie Tastenkombinationen, um den Notizen-Dialog schnell aufzurufen
2. Im aufgetauchten schlichten Dialog:
   - Überprüfen Sie die Zielseiten-/Datenbankinformationen
   - Geben Sie Ihre Ideen, Inspirationen oder Notizeninhalte ein
   - Fügen Sie Tags hinzu (optional)
3. Klicken Sie auf die Schaltfläche "Speichern", um in Notion zu speichern

### 🔍 Webseiteninhalt sammeln
1. Wählen Sie auf einer beliebigen Webseite den Text aus, den Sie sammeln möchten
2. Klicken Sie mit der rechten Maustaste und wählen Sie "In Notizen speichern"
3. Im aufgetauchten Phoebe-Dialog:
   - Überprüfen Sie den ausgewählten Inhalt
   - Fügen Sie Notizen hinzu (optional)
   - Fügen Sie Tags hinzu (optional)
   - **Datenbankmodus**: Wählen Sie eine Zielseite oder erstellen Sie eine neue Seite
4. Klicken Sie auf die Schaltfläche "Speichern"

### 🗄️ Besondere Funktionen des Datenbankmodus
- **Seitenauswahl**: Auswahl aus vorhandenen Seiten in der Datenbank
- **Ein-Klick-Erstellung**: Schnelle Erstellung neuer Seiten in der Datenbank
- **Namensgleichheit-Erkennung**: Automatische Erkennung doppelter Seitennamen mit freundlichen Hinweisen
- **Echtzeit-Laden**: Anzeige von "Phoebe arbeitet hart an der Erstellung..." während des Erstellungsprozesses

### 📄 Besondere Funktionen des normalen Dokumentenmodus
- **Direktes Hinzufügen**: Inhalte werden automatisch am Ende der voreingestellten Seite hinzugefügt
- **Zeitmarkierung**: Zeitstempel wird bei jeder Speicherung hinzugefügt
- **Seiteninformationen**: Anzeige des Zielseitennamens zur Bestätigung
- **Schnellnotizen-Unterstützung**: Perfekte Unterstützung für schnelle Gedankenaufzeichnung

### 🏷️ Tag-Management-Tipps (v1.0.3 Erfahrungsoptimierung)
- **Neue Tags eingeben**: Direkte Eingabe im Tag-Eingabefeld, Enter zum Hinzufügen
- **Verlaufs-Tags auswählen**: Klicken Sie auf das Eingabefeld, um Verlaufs-Tag-Vorschläge anzuzeigen
- **Tags suchen**: Geben Sie Schlüsselwörter ein, um Tag-Vorschläge zu filtern
- **Tags löschen**: Klicken Sie auf die ×-Schaltfläche neben hinzugefügten Tags
- **Ein-Klick-Verlauf löschen**: Löschen Sie alle Tag-Verläufe auf der Einstellungsseite
- **Statusanzeige-Optimierung**: Lösch- und Entfernungsoperationen werden im Tag-Management-Bereich angezeigt

## 🛠️ Projektstruktur

```
phoebe/
├── manifest.json           # Erweiterungs-Manifest-Datei
├── _locales/              # Internationalisierungs-Übersetzungsdateien
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
├── content_script.js      # Inhalts-Skript
└── i18n.js               # Internationalisierungs-Tool
```

## 🚫 Häufig gestellte Fragen

### Können Schnellnotizen nicht gespeichert werden?
1. Überprüfen Sie, ob die Zielseite oder Datenbank korrekt konfiguriert ist
2. Bestätigen Sie, dass der Notizinhalt nicht leer ist (Pflichtfeld)
3. Überprüfen Sie Netzwerkverbindung und Notion-API-Berechtigungen

### Zielseiten-Name wird leer angezeigt?
- Dies ist normalerweise ein Berechtigungskonfigurationsproblem. Bitte bestätigen Sie, dass Sie die Integration zur Zielressource eingeladen und Bearbeitungsberechtigungen gewährt haben

### Was tun bei Verbindungsfehlern?
1. Überprüfen Sie, ob der API-Schlüssel korrekt kopiert wurde
2. Bestätigen Sie, dass das Seiten-/Datenbank-ID-Format korrekt ist (32-stellige Zeichenfolge)
3. Überprüfen Sie, ob die Integration zur Zielressource eingeladen wurde
4. Stellen Sie sicher, dass "Bearbeiten"-Berechtigungen gewährt wurden

### Modusauswahl-Empfehlungen
- **Für Schnellnotizen-Benutzer empfohlen**: Normaler Dokumentenmodus, einfach und direkt
- **Für Inhaltsammler empfohlen**: Datenbankmodus, praktisch für kategorisierte Verwaltung
- **Jederzeit wechselbar**: Modus kann jederzeit in den Einstellungen geändert werden

### Seitenerstellung schlägt fehl?
1. Überprüfen Sie, ob bereits eine Seite mit demselben Namen existiert
2. Bestätigen Sie, dass die Datenbankberechtigungen korrekt konfiguriert sind
3. Überprüfen Sie die Stabilität der Netzwerkverbindung

## 📋 Versionsgeschichte

Detaillierte Versionsaktualisierungsaufzeichnungen finden Sie hier: **[CHANGELOG_de.md](CHANGELOG_de.md)**

**Aktuelle Version**: v1.0.3 🎉
- ⚡ Vollständige Optimierung der Schnellnotizen-Funktion
- 🎨 UI-Struktur-Optimierung, Fehlerbehandlung-Verbesserung
- 💾 Speicherlogik-Korrektur, 400-Fehler-Behebung
- 🏷️ Tag-Management-Erfahrungsverbesserung

## 🤝 Beitrag

Fehlermeldungen und Funktionsvorschläge sind willkommen!

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz open source.

## 🐕 Über die Namensgebung

Phoebe ist nach einem klugen und liebenswerten Hündchen benannt. Wie sie ist diese Erweiterung intelligent, praktisch und zuverlässig konzipiert, um Ihnen beim Sammeln wertvoller Webseiteninhalte und beim Aufzeichnen von Inspirationen zu helfen.

---

*Mit ❤️ für Inhaltsammler und Gedankenaufzeichner erstellt* 