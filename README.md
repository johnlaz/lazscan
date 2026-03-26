# 🛠️ LazScan AI — Intelligent Garage System

> Professional-grade OBD-II diagnostic PWA with Groq-powered AI analysis, live vehicle telemetry, NFC component tagging, and NHTSA recall integration.

**Live App:** [johnlaz.github.io/lazscan](https://johnlaz.github.io/lazscan/)

---

## Features

- **BLE OBD-II Connection** — Web Bluetooth API, ELM327-compatible adapters
- **AI Cortex** — Groq Llama-3.3-70b diagnostic reasoning with typewriter output
- **Live Telemetry** — RPM, coolant, O2, fuel trim, engine load — real-time Chart.js
- **DTC Analysis** — Probability-ranked fault trees for every code
- **NHTSA Integration** — Live recall + complaint data by VIN
- **NFC Digital Twin** — Tag physical components, read service history with a tap
- **4 Themes** — Diagnostic Green, Midnight Blue, Amber Forge, Garage Day
- **PDF Reports** — Formatted diagnostic export via browser print
- **Dev Notes** — On-device idea/bug/feature log, persisted to localStorage
- **Full PWA** — Installable, offline-capable, no app store needed

## Hardware Requirements

| Adapter | Protocol | Notes |
|---|---|---|
| OBDLink CX | BLE | Best compatibility |
| Vgate iCar Pro | BLE | Recommended budget option |
| vLinker MC+ | BLE | Android/iOS compatible |

**Browser:** Chrome (Android/Windows) · Edge (Windows) · Bluefy (iOS)

> ⚠️ iOS requires [Bluefy](https://apps.apple.com/app/bluefy-web-ble-browser/id1492822055) — do **not** pair the adapter in iOS Bluetooth settings.

## Setup

1. Add your Groq API key in the **Config** tab (get one free at [console.groq.com](https://console.groq.com))
2. Plug in your BLE OBD-II adapter
3. Turn ignition to **ON** or **ACC**
4. Tap **SCAN FOR ADAPTER** — done

## GitHub Pages Deployment

```bash
# Clone and deploy to your fork
git clone https://github.com/johnlaz/lazscan.git
cd lazscan

# Push to GitHub — Pages deploys from root or /docs
git add .
git commit -m "deploy: LazScan AI v1.0.0"
git push origin main
```

**Settings → Pages → Source:** Deploy from branch `main` / root `/`

The `.nojekyll` file prevents GitHub's Jekyll processor from interfering with the PWA assets.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS — single file, zero build |
| BLE | Web Bluetooth API |
| AI | Groq API · Llama-3.3-70b-versatile |
| Vehicle Data | NHTSA vPIC API · NHTSA Complaints API |
| Charts | Chart.js |
| NFC | Web NFC API (Android Chrome) |
| PWA | Service Worker · Web App Manifest |

## Version History

| Version | Notes |
|---|---|
| v1.0.0 | Initial release — full PWA, BLE, Groq AI, NHTSA, NFC, themes |

---

*Built by [johnlaz](https://github.com/johnlaz) · Part of the LAZ PWA ecosystem*
