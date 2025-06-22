# ![Logo](../icons/icon48.png) Phoebe - Versionsgeschichte

*Andere Sprachversionen: [中文](CHANGELOG.md) | [English](CHANGELOG_en.md) | [日本語](CHANGELOG_ja.md) | [한국어](CHANGELOG_ko.md)*

## 📋 Änderungsprotokoll

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

---

## [1.0.3] 🎉

### Hinzugefügt (Added)
- ⚡ **Vollständige Neukonstruktion der Schnellnotizen-Funktion**: Vervollständigung der Konfigurationsabruf-Logik, Behebung des Problems mit der Anzeige von Zielseitennamen
- ⌨️ **Vervollständigung der Tastenkombinationen-Unterstützung**: Verbesserung der Tastenkombinations-Konfigurationsfunktion, Unterstützung für benutzerdefinierte Tastenkombinationen
- 🏷️ **Dedizierte Tag-Management-Statusanzeige**: Hinzufügung eines unabhängigen Status-Benachrichtigungsbereichs für den Tag-Management-Bereich

### Geändert (Changed)
- 🎨 **Optimierung der Schnellnotizen-UI-Struktur**: Entfernung der irrelevanten aktuellen Webseiteninformationsanzeige für eine sauberere, fokussierte Benutzeroberfläche
- 💾 **Verbesserung der Speicherlogik**: Schnellnotizen enthalten keine Quell-URL-Informationen mehr, perfekte Anpassung für reine Gedankenaufzeichnungsszenarien
- 🛡️ **Optimierung der Fehlerbehandlung**: Verbesserung des Dialog-Verhaltens bei Validierungsfehlern, Gewährleistung einer konsistenten Benutzererfahrung

### Behoben (Fixed)
- 🔧 **Behebung des Schnellnotizen-Konfigurationsabruf-Problems**: Hinzufügung des fehlenden notionToken-Parameters, Lösung der Grundursache für das Unvermögen, Seiteninformationen abzurufen
- 💥 **Behebung des 400-Fehlers**: Lösung des Notion-API-Fehlers durch leere URL beim Speichern von Schnellnotizen
- 📍 **Behebung der Tag-Management-Benachrichtigungsposition**: Erfolgsbenachrichtigungen für das Löschen von Tags werden nun korrekt im Tag-Management-Bereich angezeigt
- 🔄 **Behebung inkonsistenter Dialog-Verhalten**: Vereinheitlichung der Validierungsfehler-Behandlungslogik für Rechtsklick-Speichern und Schnellnotizen

### Technische Verbesserungen (Technical)
- 🔄 **Refaktorierung der showQuickNoteDialog-Funktion**: Vervollständigung des Konfigurationsabrufs, Optimierung der UI-Struktur
- 🛠️ **Optimierung des Background-Scripts**: Verbesserung der URL-Behandlungslogik in appendToPage- und createPageInDatabase-Funktionen
- 📝 **Vervollständigung der Fehlervalidierungs-Logik**: Verwendung von throw Error anstelle von return, Gewährleistung des korrekten Ausnahmebehandlungsflusses

---

## [1.0.2]

### Hinzugefügt (Added)
- 🎯 **Intelligente Modusauswahl**: Dualer Modus-Support für normalen Dokumentenmodus und Datenbankmodus
- ✨ **Marken-UI-Design**: Neuer Phoebe-Logo-Dialog für verbesserte visuelle Erfahrung
- 🔄 **Intelligenter Ladestatus**: Echtzeit-Statusanzeige für Erstellungs- und Speicherprozesse
- 🛡️ **Erkennung gleichnamiger Seiten**: Automatische Erkennung doppelter Seitennamen zur Verwirrungsvermeidung

### Geändert (Changed)
- 🎨 **Button-Status-Optimierung**: Intelligente Deaktivierung während Operationen zur Vermeidung doppelter Übermittlungen
- 💬 **Menschliche Benachrichtigungstexte**: Wärmere Benutzerführung und Feedback-Informationen
- 📋 **Einstellungsseiten-Optimierung**: Intelligenter Abruf von Seiten- und Datenbanklisten

### Behoben (Fixed)
- 🔧 **CORS-Problem-Behebung**: Lösung technischer Probleme beim Abrufen von Seiteninformationen
- 🌐 **Cross-Origin-Request-Optimierung**: Verbesserung der API-Aufruf-Stabilität

### Funktionsmerkmale
- 📄 **Normaler Dokumentenmodus**: Inhalte werden direkt zur ausgewählten Seite hinzugefügt, geeignet für einfache Sammlung
- 🗄️ **Datenbankmodus**: Unterstützung für Seitenauswahl oder Erstellung neuer Seiten, geeignet für strukturierte Verwaltung
- 🎨 **Echtzeit-Status-Benachrichtigungen**: Freundliche Nachrichten wie "Phoebe arbeitet hart an der Erstellung..."

---

## [1.0.1]

### Hinzugefügt (Added)
- 🗃️ **Datenbankmodus-Unterstützung**: Notion-Datenbank-API-Unterstützung, Ersetzung einfacher Seitenverbindungen
- 📋 **Seitenauswahl-Funktion**: Auswahl von Zielseiten aus der Datenbank
- ➕ **Schnelle neue Seitenerstellung**: Ein-Klick-Erstellung neuer Seiten in der Datenbank
- 🏷️ **Tag-Eigenschafts-Konfiguration**: Unterstützung für Datenbank-Tag-Eigenschafts-Konfiguration
- 🌍 **Vollständige mehrsprachige Unterstützung**: Unterstützung für Chinesisch, Englisch, Japanisch, Koreanisch und Deutsch (5 Sprachen)

### Geändert (Changed)
- 🔄 **API-Aufruf-Optimierung**: Upgrade von Seiten-API zu Datenbank-API
- 📝 **Vereinfachung des Konfigurationsprozesses**: Automatischer Abruf verfügbarer Datenbanklisten
- 🎯 **Verbesserung der Benutzererfahrung**: Intuitiverer Seitenauswahl- und Erstellungsprozess

### Funktionsmerkmale
- 🗄️ **Datenbank-Integration**: Vollständige Unterstützung für Notion-Datenbankfunktionen
- 🏷️ **Tag-System**: Intelligente Tag-Vorschläge und Verlaufsaufzeichnungen
- 🌐 **Internationalisierte Benutzeroberfläche**: Automatischer Sprachwechsel basierend auf Browser-Sprache

---

## [1.0.0]

### Hinzugefügt (Added)
- 📝 **Grundlegende Inhaltssammlung**: Webseitentext auswählen und per Rechtsklick in Notizen speichern
- 🏷️ **Tag-Management-System**: Unterstützung für das Hinzufügen und Verwalten von Tags
- 🌍 **Mehrsprachige Benutzeroberfläche**: Anfängliche Unterstützung für Chinesisch und Englisch
- ⚙️ **Notion-API-Integration**: Grundlegende API-Verbindung und Authentifizierung
- 🎨 **Benutzeroberfläche**: Einfache Popup- und Einstellungsseiten

### Funktionsmerkmale
- 🔍 **Intelligente Auswahl**: Automatische Erkennung des ausgewählten Webseitentexts
- 📋 **Einfache Konfiguration**: Notion-Verbindung über API-Schlüssel
- 💾 **Direktes Speichern**: Inhalte werden direkt zur angegebenen Seite hinzugefügt
- 🏷️ **Tag-Unterstützung**: Hinzufügung von Kategorie-Tags zu gespeicherten Inhalten

---

## 🔗 Verwandte Links

- [Haupt-Projekt-README](README_de.md)
- [Chinesische Versionsgeschichte](CHANGELOG.md)
- [Englische Versionsgeschichte](CHANGELOG_en.md)
- [Japanische Versionsgeschichte](CHANGELOG_ja.md)
- [Koreanische Versionsgeschichte](CHANGELOG_ko.md)
- [Installationsanleitung](README_de.md#🚀-installationsschritte)
- [Verwendungsanweisungen](README_de.md#📱-verwendung)

---

## 📝 Versions-Benennungskonvention

Dieses Projekt folgt der [Semantic Versioning](https://semver.org/lang/de/) Benennungskonvention:

- **Hauptversion**: Inkompatible API-Änderungen
- **Nebenversion**: Rückwärts kompatible Funktionserweiterungen
- **Patch-Version**: Rückwärts kompatible Fehlerbehebungen

---

*🐕 Jede Version macht Phoebe intelligenter und zuverlässiger!* 