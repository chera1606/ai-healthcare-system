# AI Patient Care Intelligence System

An educational, production-style PERN + AI SaaS starter for learning how to build a patient-care support platform step by step.

## Important Safety Note

This project is for informational and educational support only.
It does not diagnose, treat, or replace professional medical advice.

## What We Are Building

The long-term system includes:

- AI chat assistant
- RAG medical document understanding
- Doctor voice note analysis
- Multi-agent orchestration
- Automation and reminders
- Hospital finder
- Patient memory and timeline
- Emergency escalation support

## Build Roadmap

### Phase 1: Project Setup

Goal:

- Create the backend and frontend structure
- Connect the frontend to the backend
- Add a working health-check API
- Establish a clean development workflow

What you learn:

- Monorepo structure
- Express server basics
- Vite + React basics
- API request flow
- Environment variables

### Phase 2: AI Chat Assistant

Goal:

- Add a safe informational health chat interface
- Connect frontend to backend AI endpoint
- Include safety disclaimer in every response

What you learn:

- Request/response API design
- Prompting fundamentals
- Guardrails and disclaimers

### Phase 3: Medical Report Upload + RAG

Goal:

- Upload PDF/text reports
- Extract text
- Generate embeddings
- Store vectors in pgvector
- Retrieve relevant context for answers

What you learn:

- File upload pipelines
- Document chunking
- Embeddings and retrieval
- Vector search concepts

### Phase 4: Doctor Voice Analysis

Goal:

- Upload or record audio
- Transcribe speech
- Extract instructions, medication, warnings, and follow-up tasks

What you learn:

- Speech-to-text
- Structured extraction
- Task generation

### Phase 5: AI Agent System

Goal:

- Split the app into specialized agents
- Add a supervisor/orchestrator

Agents:

- Report Explainer Agent
- Doctor Voice Analyzer Agent
- Care Plan Generator Agent
- Hospital Finder Agent
- Risk Analysis Agent
- Timeline Memory Agent

### Phase 6: Hospital Finder

Goal:

- Store hospitals with latitude/longitude
- Show nearby hospitals on a map
- Rank by distance and specialization

### Phase 7: Automation + Memory

Goal:

- Reminders
- Daily summaries
- Weekly reports
- Patient timeline and history

### Phase 8: Agentic AI

Goal:

- Detect missed medication
- Update care plans automatically
- Escalate alerts
- Suggest hospitals when needed

## Project Structure

```text
ai-healthcare-system-1/
  backend/
  frontend/
```

## Git Workflow

Use small, meaningful commits:

1. `chore: scaffold backend and frontend`
2. `feat: add backend health endpoint`
3. `feat: connect frontend to backend`
4. `feat: add ai chat api`
5. `feat: add medical report upload`
6. `feat: add rag retrieval flow`
7. `feat: add voice analysis pipeline`
8. `feat: add agent orchestration`

Recommended commit style:

- `chore:` setup, config, cleanup
- `feat:` new feature
- `fix:` bug fix
- `refactor:` internal restructuring
- `docs:` documentation only
- `test:` tests

## Phase 1 Run Flow

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Next Step

The next implementation step is Phase 1 completion:

- backend API server
- frontend UI shell
- working request to `/api/health`

