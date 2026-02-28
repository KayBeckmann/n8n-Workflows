# n8n-Workflows – Projektanleitung für Claude

## MCP-Server: n8n-mcp

### Konfiguration

Der n8n-mcp MCP-Server ist in `.mcp.json` konfiguriert und startet automatisch beim Öffnen des Projekts.

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "npx",
      "args": ["n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio",
        "LOG_LEVEL": "error",
        "DISABLE_CONSOLE_OUTPUT": "true",
        "N8N_API_URL": "https://n8n.beckmann-md.de/",
        "N8N_API_KEY": "<siehe .mcp.json>"
      }
    }
  }
}
```

### Verfügbare Tool-Kategorien (40+ Tools)

| Kategorie | Zweck |
|---|---|
| Node Discovery | `search_nodes`, `get_node` (essentials/standard/full) |
| Konfiguration & Validierung | `validate_node`, `validate_workflow`, `n8n_autofix_workflow` |
| Workflow-Management | `n8n_create_workflow`, `n8n_update_*`, `n8n_list_workflows`, `n8n_get_workflow` |
| Ausführung | `n8n_test_workflow`, `n8n_executions` |
| Templates | `search_templates`, `get_template`, `n8n_deploy_template` |
| Versionierung | `n8n_workflow_versions` |
| Diagnose | `n8n_health_check` |

### Wichtige Tool-Regeln

- **nodeType-Format**: Bei `search_nodes` → `nodes-base.slack`; bei `get_node` → `n8n-nodes-base.slack`
- **Detail-Level**: Immer mit `get_node` (detail=standard) beginnen – 91,7 % Erfolgsrate. Nur bei Bedarf auf `full` eskalieren.
- **Validierungs-Loop**: Konfigurieren → Validieren → Fehler lesen → Korrigieren → erneut validieren (2–3 Iterationen normal)
- **Validierungsprofil**: `runtime` für die meisten Fälle, `ai-friendly` reduziert False-Positives um 60 %

---

## Installierte Skills

Skills befinden sich in `~/.claude/skills/` und werden kontextsensitiv aktiviert.

### Skill-Übersicht

| Skill | Aktiviert bei | Priorität |
|---|---|---|
| `n8n-mcp-tools-expert` | MCP-Tools, Node-Suche, Template, Validierung | HÖCHSTE |
| `n8n-workflow-patterns` | Workflow-Architektur, Webhook, API, DB, AI-Agents | HOCH |
| `n8n-expression-syntax` | `{{}}` Ausdrücke, `$json`, `$node`, Webhook-Daten | MITTEL |
| `n8n-validation-expert` | Validierungsfehler, False-Positives, Validation-Loop | MITTEL |
| `n8n-node-configuration` | Node konfigurieren, Pflichtfelder, Property-Dependencies | MITTEL |
| `n8n-code-javascript` | JavaScript im Code-Node, `$input`, `$helpers`, Luxon | MITTEL |
| `n8n-code-python` | Python im Code-Node, Standardbibliothek, Limitierungen | MITTEL |

### Skill: n8n-mcp-tools-expert

Lehrt die korrekte Nutzung aller n8n-mcp-Tools.

**Kernthemen**: Tool-Auswahl, nodeType-Formate, Validierungsprofile, Smart Parameters (branch/case für IF/Switch), Auto-Sanitization, 15 Workflow-Operationstypen, 8 KI-Verbindungstypen.

### Skill: n8n-workflow-patterns

Architekturmuster für n8n-Workflows aus über 2.600 echten Templates.

**5 Kernmuster**:
1. **Webhook Processing** – Daten unter `$json.body` (häufigster Fehler!)
2. **HTTP API Integration** – Paginierung, Rate Limiting, Auth
3. **Database Operations** – Parameterisierte Queries, Batch-Verarbeitung
4. **AI Agent Workflow** – 8 KI-Verbindungstypen, jeder Node kann ein AI-Tool sein
5. **Scheduled Tasks** – Cron, Timezone explizit setzen, Overlap verhindern

### Skill: n8n-expression-syntax

Korrekte `{{ }}` Ausdrücke in n8n.

**Kritischer Gotcha**: Webhook-Daten liegen unter `$json.body.field`, nicht direkt unter `$json.field`.

Ausdrücke gehören in Felder anderer Nodes – **nicht** in Code-Nodes.

### Skill: n8n-validation-expert

Systematisches Interpretieren und Beheben von Validierungsfehlern.

**Fehler-Hierarchie**: Errors (müssen behoben werden) → Warnings (kontextabhängig) → Suggestions (optional).

**Auto-Sanitization**: Operator-Struktur-Fehler werden automatisch behoben – nicht manuell beheben.

**False-Positives**: 40 % der Warnungen sind in Produktion akzeptabel. Mit `ai-friendly`-Profil um 60 % reduzierbar.

### Skill: n8n-node-configuration

Operation-bewusste Konfiguration mit Property-Dependencies.

**Prinzip**: Resource + Operation bestimmen Pflichtfelder. Bei Operationswechsel immer Anforderungen neu prüfen.

**Top-5-Gotchas**:
1. Webhook-Daten unter `$json.body`
2. POST braucht `sendBody: true`
3. Slack Channel mit `#name`-Format
4. SQL: parameterisierte Queries (SQL-Injection-Schutz)
5. Timezone bei Schedule-Nodes explizit setzen

### Skill: n8n-code-javascript

JavaScript in n8n Code-Nodes.

**Pflichtregeln**:
- Rückgabe immer `[{json: {...}}]` (Array mit json-Property)
- Kein `{{}}` im Code-Node verwenden – direkt `$json.field`
- Webhook-Daten: `$json.body.field`
- Modus: "Run Once for All Items" für 95 % der Fälle

**Verfügbare Built-ins**: `$input`, `$helpers.httpRequest()`, `DateTime` (Luxon), `$jmespath()`, `$getWorkflowStaticData()`

### Skill: n8n-code-python

Python in n8n Code-Nodes.

**Kritische Einschränkung**: Keine externen Bibliotheken – kein `requests`, `pandas`, `numpy`.

**Empfehlung**: JavaScript für 95 % der Fälle nutzen. Python nur wenn Python-spezifische Standardbibliothek (json, datetime, re, base64, hashlib) benötigt wird.

**Syntax-Unterschied zu JavaScript**: `_input` statt `$input`, `_json` statt `$json`.

---

## Workflow-Checkliste

### Planung
- [ ] Muster identifizieren (Webhook / API / Datenbank / AI / Schedule)
- [ ] Nodes mit `search_nodes` suchen
- [ ] Datenfluss planen (Input → Transform → Output)
- [ ] Fehlerbehandlungsstrategie festlegen

### Implementierung
- [ ] Workflow mit passendem Trigger erstellen
- [ ] Authentifizierung/Credentials über n8n UI konfigurieren (nie hardcoden!)
- [ ] Transformation-Nodes (Set, Code, IF) hinzufügen
- [ ] Fehlerbehandlung hinzufügen

### Validierung
- [ ] Jeden Node mit `validate_node` prüfen
- [ ] Gesamten Workflow mit `validate_workflow` prüfen
- [ ] Mit Testdaten ausführen
- [ ] Edge-Cases behandeln

---

## Quellen

- n8n-mcp MCP-Server: https://github.com/czlonkowski/n8n-mcp
- n8n-skills: https://github.com/czlonkowski/n8n-skills
- n8n-Instanz: https://n8n.beckmann-md.de/
