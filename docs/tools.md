# 🛠️ Tools und Ressourcen

Diese Übersicht hilft dir, alle wichtigen Tools und Ressourcen zu finden, die du für deine Arbeit benötigst.

## 🧰 Entwicklungstools

<details>
<summary>💻 IDE & Code-Tools</summary>

### Empfohlene Entwicklungsumgebung

- **Visual Studio Code** - Unser bevorzugter Code-Editor
  - [Download](https://code.visualstudio.com/)
  - Empfohlene Extensions:
    - ESLint
    - Prettier
    - GitLens
    - Docker
    - Kubernetes
    - Material Icon Theme

- **Git** - Versionskontrolle
  - [Installationsanleitung](https://git-scm.com/downloads)
  - Unser Git-Workflow:
    ```mermaid
    gitGraph
       commit id: "initial commit"
       branch develop
       checkout develop
       commit id: "setup project"
       branch feature/xyz
       checkout feature/xyz
       commit id: "implement feature"
       commit id: "fix bug"
       checkout develop
       merge feature/xyz
       checkout main
       merge develop tag: "v1.0.0"
    ```

- **Node.js** - JavaScript Runtime
  - Empfohlene Version: 18.x LTS
  - [Download](https://nodejs.org/)
</details>

<details>
<summary>☁️ Cloud & Infrastruktur</summary>

### Cloud-Umgebung

- **AWS** - Cloud-Infrastruktur
  - Zugang wird vom DevOps-Team eingerichtet
  - Services, die wir nutzen:
    - EC2 für Compute
    - S3 für Storage
    - RDS für Datenbanken
    - EKS für Kubernetes

- **Docker** - Container
  - [Installationsanleitung](https://docs.docker.com/get-docker/)
  - Wichtige Befehle:
    ```bash
    # Container starten
    docker-compose up -d
    
    # Container stoppen
    docker-compose down
    
    # Logs anzeigen
    docker logs -f container_name
    ```

- **Kubernetes** - Container-Orchestrierung
  - [kubectl Installationsanleitung](https://kubernetes.io/docs/tasks/tools/)
  - Lokales Entwickeln mit minikube
</details>

<details>
<summary>📊 Monitoring & Analyse</summary>

### Monitoring-Stack

- **Grafana** - Dashboards und Visualisierung
  - URL: [https://grafana.internal.company.com](https://grafana.internal.company.com)
  - Anmeldung mit SSO

- **Prometheus** - Metriken und Alarme
  - Automatisch eingerichtet in der Entwicklungsumgebung

- **ELK Stack** - Logs und Analyse
  - Kibana: [https://kibana.internal.company.com](https://kibana.internal.company.com)
</details>

## 🔄 Kollaborations-Tools

<details>
<summary>👥 Team-Kommunikation</summary>

### Kommunikation

- **Slack** - Tägliche Kommunikation
  - Wichtige Kanäle:
    - #team-allgemein - Allgemeine Team-Kommunikation
    - #tech-support - Technische Unterstützung
    - #random - Nicht-arbeitsrelevante Themen

- **Teams** - Videoanrufe & Meetings
  - Alle geplanten Meetings werden automatisch in Teams erstellt
  - Bitte Kamera aktivieren, wenn möglich
</details>

<details>
<summary>📝 Dokumentation</summary>

### Wissensmanagement

- **Confluence** - Interne Dokumentation
  - URL: [https://company.atlassian.net/wiki](https://company.atlassian.net/wiki)
  - Wichtige Spaces:
    - Team Space
    - Technische Dokumentation
    - Onboarding Guide

- **Backstage** - Service Catalog & Developer Portal
  - URL: [https://backstage.internal.company.com](https://backstage.internal.company.com)
  - Hier findest du:
    - Komponentenübersicht
    - API-Dokumentation
    - Onboarding-Checklisten
</details>

<details>
<summary>📋 Projektmanagement</summary>

### Projektmanagement

- **Jira** - Aufgabenverwaltung
  - URL: [https://company.atlassian.net/jira](https://company.atlassian.net/jira)
  - Unser Agiles Board
  - Sprint-Planung und -Tracking

- **GitHub** - Code-Repository
  - Organisationsname: `company-org`
  - Wichtige Repos:
    - `frontend-app`
    - `backend-services`
    - `infrastructure`
</details>

## 🔒 Zugangsmanagement

### Zugriff auf Tools beantragen

| Tool | Beantragen bei | Zeitrahmen | Priorität |
|------|----------------|------------|-----------|
| GitHub | IT über ServiceDesk | 1 Tag | Hoch |
| AWS | DevOps Team | 2-3 Tage | Mittel |
| Jira & Confluence | Automatisch mit SSO | Sofort | Hoch |
| Slack | HR | Vor erstem Tag | Hoch |
| VPN | IT über ServiceDesk | 1 Tag | Hoch |

## 📱 Mobile Apps

Für unterwegs empfehlen wir dir folgende Apps:

- Slack (iOS/Android)
- Microsoft Teams (iOS/Android)
- Jira Cloud (iOS/Android)
- GitHub Mobile (iOS/Android)

## 📚 Lernressourcen

- Internes Wiki: [https://company.atlassian.net/wiki/spaces/learning](https://company.atlassian.net/wiki/spaces/learning)
- Udemy Business Zugang (wird von HR eingerichtet)
- Wöchentliche Tech-Talks (Mittwochs, 16:00 Uhr)
- Mentoring-Programm (siehe [Team-Seite](/team))
