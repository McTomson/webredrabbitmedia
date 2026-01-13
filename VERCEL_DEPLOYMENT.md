# Vercel Deployment Requirements

## WICHTIG: Diese Konfiguration MUSS immer eingehalten werden!

### Node.js Version
- **Erforderlich**: Node.js 20.x oder höher
- **Konfiguriert in**: `vercel.json`
- **Grund**: Next.js 15.5.9+ benötigt mindestens Node.js 20.9.0

### Vercel Konfiguration (`vercel.json`)
Die Datei `vercel.json` ist **zwingend erforderlich** und enthält:
- Node.js Version Spezifikation (20.x)
- Build-Befehle
- Region-Konfiguration (iad1 - Washington D.C.)

### Deployment Checklist

Vor jedem Deployment auf Vercel:

1. ✅ **Dependencies aktualisieren**
   ```bash
   npm install
   ```

2. ✅ **Lokalen Build testen**
   ```bash
   npm run build
   ```

3. ✅ **Alle Änderungen committen**
   ```bash
   git add .
   git commit -m "Update dependencies"
   git push origin main
   ```

4. ✅ **Vercel Cache löschen** (bei Problemen)
   - In Vercel Dashboard → Project Settings → General → "Clear Build Cache"

### Häufige Fehler und Lösungen

#### Problem: "Next.js (15.1.6) is outdated"
**Ursache**: Vercel verwendet gecachte alte Version

**Lösung**:
1. Lokale Dependencies neu installieren:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. `package-lock.json` committen:
   ```bash
   git add package-lock.json package.json
   git commit -m "Update Next.js to 15.5.9"
   git push
   ```

3. Vercel Build Cache löschen

#### Problem: "Module not found: react-server-dom-webpack"
**Ursache**: Korrupte `node_modules` oder Version-Mismatch

**Lösung**:
```bash
rm -rf node_modules .next package-lock.json
npm install
npm run build
```

### Sicherheit

- **CVE-2025-66478**: Behoben in Next.js 15.5.9
- Regelmäßige Updates von Next.js sind **kritisch** für Sicherheit
- Vercel blockiert Deployments mit bekannten Sicherheitslücken

### Wichtige Dateien

Diese Dateien **MÜSSEN** immer committed sein:
- ✅ `package.json` - Dependency-Definitionen
- ✅ `package-lock.json` - Exakte Versionen für reproduzierbare Builds
- ✅ `vercel.json` - Vercel-spezifische Konfiguration
- ✅ `next.config.ts` - Next.js Konfiguration

### Next.js Konfiguration

Die `next.config.ts` enthält wichtige Vercel-Optimierungen:
- `output: 'standalone'` - Optimiert für Serverless Deployment
- `compress: true` - Automatische Kompression
- Bild-Optimierung für AVIF/WebP
- Security Headers
- SEO Redirects

---

**Letzte Aktualisierung**: 2026-01-13  
**Aktuelle Next.js Version**: 15.5.9  
**Aktuelle Node.js Version**: 20.x
