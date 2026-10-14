<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=42&duration=3000&pause=800&color=00FF41&background=000000&center=true&vCenter=true&width=700&height=100&lines=EYE+OF+ODIN;INITIALIZING...;SCANNING+CAMPUS...;MATCH+FOUND%3A+94%25)](https://git.io/typing-svg)

### *A campus lost & found system that actually finds things — using computer vision, not vibes.*

<br>

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![CLIP](https://img.shields.io/badge/OpenAI_CLIP-412991?style=for-the-badge&logo=openai&logoColor=white)

![Tests](https://img.shields.io/badge/TESTS-35%20PASSING-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)
![Status](https://img.shields.io/badge/STATUS-ACTIVE%20DEV-orange?style=for-the-badge&logo=statuspage&logoColor=white)
![License](https://img.shields.io/badge/LICENSE-MIT-blue?style=for-the-badge&logo=opensourceinitiative&logoColor=white)

<br>

<img src="https://img.shields.io/badge/-●_LIVE_DEMO-000000?style=flat-square" height="28"/> <img src="https://img.shields.io/badge/-●_API_DOCS-000000?style=flat-square" height="28"/> <img src="https://img.shields.io/badge/-●_REPORT_BUG-000000?style=flat-square" height="28"/>

</div>

<br>

<div align="center">

### 📚 Table of Contents

<table>
<tr>
<td align="center">🎯<br><a href="#-the-problem">The Problem</a></td>
<td align="center">⚡<br><a href="#-features">Features</a></td>
<td align="center">🏗️<br><a href="#-architecture">Architecture</a></td>
<td align="center">🛠️<br><a href="#-tech-stack">Tech Stack</a></td>
</tr>
<tr>
<td align="center">📡<br><a href="#-api-reference">API</a></td>
<td align="center">🚀<br><a href="#-getting-started">Setup</a></td>
<td align="center">🗺️<br><a href="#-roadmap">Roadmap</a></td>
<td align="center">🧪<br><a href="#-testing">Testing</a></td>
</tr>
</table>

</div>

<br>

---

<div align="center">

## 🎯 THE PROBLEM

<table>
<tr>
<td width="33%" align="center">📦<br><b>The Cardboard Box</b><br><sub>Sits in the security office.<br>Nobody checks it. Ever.</sub></td>
<td width="33%" align="center">💬<br><b>The WhatsApp Graveyard</b><br><sub>200+ messages deep.<br>Unreadable by message 40.</sub></td>
<td width="33%" align="center">🕳️<br><b>The Missing Link</b><br><sub>"Lost near Auditorium" never<br>meets "Found near Main Gate."</sub></td>
</tr>
</table>

<br>

**Eye of Odin replaces all three with one system: report it, and let vision embeddings do the matching a human would take days to do by scrolling.**

</div>

---

<div align="center">

## ⚡ FEATURES

</div>

<table width="100%">
<tr><th align="left" width="80">Status</th><th align="left">Feature</th></tr>
<tr><td>✅</td><td>FastAPI backend with <b>locked, validated schema</b> (category, location zone, type, status)</td></tr>
<tr><td>✅</td><td>Full <b>CRUD</b> — create, list, filter, retrieve, and update lost/found reports</td></tr>
<tr><td>✅</td><td>Image upload with <b>magic-byte validation</b> — not just trusting file extensions like an amateur</td></tr>
<tr><td>✅</td><td><b>Overwrite-safe</b> image handling — no orphaned files rotting on disk</td></tr>
<tr><td>✅</td><td><b>35-test suite</b> covering validation, edge cases, filtering, and data integrity</td></tr>
<tr><td>✅</td><td>CLIP embedding generation on image upload</td></tr>
<tr><td>✅</td><td>Cosine similarity matching engine — auto-suggest "is this your item?"</td></tr>
<tr><td>✅</td><td>Match confidence scoring + in-app notification feed</td></tr>
<tr><td>✅</td><td>3D campus frontend — report submission, live feed, neural match review, claims & security vault</td></tr>
</table>

---

<div align="center">

## 🏗️ ARCHITECTURE

</div>

```mermaid
flowchart LR
    A["👤 User Reports Item"] -->|"POST /reports"| B["⚙️ FastAPI Backend"]
    B --> C[("🗄️ SQLite DB")]
    A -.->|"POST /reports/id/image"| D["🖼️ Image Upload"]
    D --> E["🔍 Magic-Byte Validation"]
    E --> F["📁 uploads/ storage"]
    E --> G["🧠 CLIP Encoder — Phase 1"]
    G --> H["🔢 Embedding Vector"]
    H --> C
    C --> I["📊 Cosine Similarity Engine — Phase 1"]
    I -->|"Match found"| J["🔔 Notify Both Reporters"]

    style A fill:#1a1a1a,stroke:#00FF41,color:#00FF41
    style B fill:#1a1a1a,stroke:#00FF41,color:#00FF41
    style G fill:#1a1a1a,stroke:#FFA500,color:#FFA500
    style I fill:#1a1a1a,stroke:#FFA500,color:#FFA500
    style J fill:#1a1a1a,stroke:#00FF41,color:#00FF41
```

<div align="center">
<sub><b>Report pipeline</b> — structured intake of every lost/found submission &nbsp;|&nbsp; <b>Matching engine</b> — CLIP embeddings + cosine similarity for automatic recognition</sub>
</div>

---

<div align="center">

## 🛠️ TECH STACK

<img src="https://skillicons.dev/icons?i=python,fastapi,sqlite,pytorch&theme=dark" height="60"/>

<table>
<tr><th>Layer</th><th>Technology</th></tr>
<tr><td>Backend Framework</td><td>FastAPI (unified API: legacy <code>/reports</code> + campus-grid <code>/api</code>)</td></tr>
<tr><td>Database</td><td>SQLite + SQLAlchemy ORM (Postgres-ready via <code>DATABASE_URL</code>)</td></tr>
<tr><td>Validation</td><td>Pydantic</td></tr>
<tr><td>Vision Model</td><td>OpenAI CLIP — <b>live</b>: embeddings on image upload + cosine-similarity matching</td></tr>
<tr><td>Testing</td><td>Pytest + FastAPI TestClient — <b>35 tests passing</b></td></tr>
<tr><td>Frontend</td><td>Vanilla JS + Three.js 3D campus UI, served by the backend itself</td></tr>
<tr><td>Deployment</td><td>Render (single service — <code>render.yaml</code> included)</td></tr>
</table>

</div>

---

<div align="center">

## 📡 API REFERENCE

</div>

<details open>
<summary><b>🔹 POST /reports</b> — Create a lost or found report</summary>
<br>

`status` defaults to `open`. Returns `201` + the created object as JSON.

</details>

<details>
<summary><b>🔹 GET /reports</b> — List all reports</summary>
<br>

Optional `?type=lost` or `?type=found` filter. Returns a JSON array.

</details>

<details>
<summary><b>🔹 GET /reports/{id}</b> — Retrieve a single report</summary>
<br>

Returns single JSON object. `404` if not found.

</details>

<details>
<summary><b>🔹 POST /reports/{id}/image</b> — Upload an item image</summary>
<br>

Validated by file content (magic bytes), not extension.

</details>

<details>
<summary><b>🔹 GET /uploads/{filename}</b> — Serve uploaded item images</summary>
<br>

Static file serving for stored report images.

</details>

<br>

<div align="center">

**Locked category values**

`bag` `electronics` `id_card` `bottle` `keys` `clothing` `book` `other`

**Locked location zones**

`Engineering Block` `Library` `Cafeteria` `Hostel A` `Hostel B` `Sports Complex` `Main Gate` `Admin Block` `Auditorium` `Other`

</div>

---

<div align="center">

## 🚀 GETTING STARTED

</div>

**Prerequisites:** Python 3.10+, pip

```bash
# Clone the repo
git clone https://github.com/venkataramavinaybandla-crypto/eye-of-odin.git
cd eye-of-odin

# Set up virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server (API + 3D frontend on one origin)
uvicorn main:app --reload
```

Open **http://127.0.0.1:8000** — the 3D campus UI is served by the backend itself. No separate frontend server needed.

### Deploying to Render

A Blueprint is included. Push this repo to GitHub, then in Render:
**New → Blueprint** → select the repo → Render reads `render.yaml` and provisions the service with the right start command, health check (`/api/health`), and persistent disk for uploads. Free tier works; set `SEED_DEMO_DATA=0` in the dashboard if you want an empty registry in production.

<div align="center">

🌐 API live at `http://127.0.0.1:8000` &nbsp;|&nbsp; 📖 Interactive docs at `http://127.0.0.1:8000/docs`

</div>

### Running Tests

```bash
pytest -v
```

<div align="center">

![Test Results](https://img.shields.io/badge/pytest-20%20passed-brightgreen?style=for-the-badge&logo=pytest&logoColor=white)

</div>

---

<div align="center">

## 📁 PROJECT STRUCTURE

</div>

```
eye-of-odin/
├── main.py              # FastAPI app: /reports pipeline + static frontend mount
├── campus_api.py        # Unified campus-grid API (/api/items, /api/claims, /api/stats, /api/health)
├── models.py            # SQLAlchemy models: Report, Item, Claim
├── database.py          # DB session + connection config
├── schemas.py           # Pydantic request/response validation
├── seed_data.py         # Demo registry (guarded by SEED_DEMO_DATA env var)
├── embedding.py         # CLIP embeddings + cosine similarity
├── test_main.py         # Original 20-test suite (/reports pipeline)
├── test_campus_api.py   # 15-test suite (unified campus API)
├── frontend/            # 3D campus UI (Three.js), served by the backend at /
├── uploads/             # Uploaded item images
├── requirements.txt
└── ../render.yaml       # Render Blueprint (single-service deploy)
```

---

<div align="center">

## 🗺️ ROADMAP

<table>
<tr><td align="left"><b>Phase 0</b> — CRUD backend, validation, image handling, full test coverage</td><td>![100%](https://progress-bar.xyz/100/?width=120&color=00FF41)</td></tr>
<tr><td align="left"><b>Phase 1</b> — CLIP embedding generation on report creation</td><td>![100%](https://progress-bar.xyz/100/?width=120&color=00FF41)</td></tr>
<tr><td align="left"><b>Phase 2</b> — Cosine similarity matching engine + confidence scoring</td><td>![100%](https://progress-bar.xyz/100/?width=120&color=00FF41)</td></tr>
<tr><td align="left"><b>Phase 3</b> — 3D campus frontend wired to the unified API</td><td>![100%](https://progress-bar.xyz/100/?width=120&color=00FF41)</td></tr>
<tr><td align="left"><b>Phase 4</b> — Notification feed (in-app, live) + claims/verification flow</td><td>![90%](https://progress-bar.xyz/90/?width=120&color=FFA500)</td></tr>
</table>

</div>

---

<div align="center">

## 🧪 TESTING

</div>

<table>
<tr><td align="center">✅<br><b>Validation</b><br><sub>invalid categories, zones,<br>types, malformed IDs</sub></td>
<td align="center">🖼️<br><b>Image Upload</b><br><sub>nonexistent reports, overwrites,<br>non-image files</sub></td>
<td align="center">🔍<br><b>Filtering</b><br><sub>empty results, invalid filters,<br>unfiltered queries</sub></td>
<td align="center">🔗<br><b>Data Integrity</b><br><sub>field round-tripping,<br>default status, timestamps</sub></td>
<td align="center">🧬<br><b>Embeddings</b><br><sub>locked as null,<br>pending Phase 1</sub></td>
</tr>
</table>

<div align="center">
<sub>All tests use real HTTP calls via <code>TestClient</code> — no mocked internals.</sub>
</div>

---

<div align="center">

## 🤝 CONTRIBUTING

This started as a simple Brainstorming activity which was actually growing and turned into a Backend Course Project.
Issues and PRs welcome — especially if you've got opinions on CLIP model selection or similarity thresholds for Phase 1.

![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen?style=for-the-badge)

</div>

---

<div align="center">

## 📄 LICENSE

`[MIT — or swap in whatever you're actually using]`

<br><br>

**Built by Team 17** — because lost & found shouldn't require faith in a WhatsApp group.

</div>
