# AI Powered Standards Recommendation Engine
![Maanak Logo](./assets/logo.svg)

# Maanak

**AI-Powered Recommendation & Search Engine for Indian Standards (BIS)**

Maanak is an intelligent Retrieval-Augmented Generation (RAG) platform designed to answer queries regarding Bureau of Indian Standards (BIS). Instead of relying on a language model's pre-trained knowledge—which can lead to hallucinations or outdated information—Maanak retrieves verified standard-specific data prior to generating precise, structured answers grounded in actual document content.

---

## Overview & System Architecture

Maanak operates across three primary decoupled pipelines: **Data Augmentation**, **Vector Retrieval**, and **Contextual Generation**.

```text
+-----------------------------------------------------------------------------------+
|                            1. DATA AUGMENTATION PIPELINE                          |
|  [ BIS Official Data ] -> [ Data Cleaning ] -> [ Structuring ] -> [ Embeddings ]  |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                              2. RETRIEVAL PIPELINE                                |
|  [ User Query ] -> [ Query Embedding ] -> [ Qdrant DB Search ] -> [ Top-5 Chunks] |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             3. GENERATION PIPELINE                                |
|  [ Top-5 Chunks + Query ] -> [ Prompt ] -> [ Grok LLM ] -> [ Structured Answer ]  |
+-----------------------------------------------------------------------------------+
```

---

## Technical Pipeline Breakdown

### 1. Data Augmentation Pipeline

* **Data Collection**: Collects raw Indian Standards data directly from official sources.
* **Data Cleaning & Structuring**: Irrelevant noise is removed, and meaningful content is organized into a structured JSON format.
* **Embedding Generation**: Structured entries are processed through a `sentence-transformers` model to generate high-dimensional numerical vector representations that capture semantic meaning.

### 2. Retrieval Pipeline

* **Vector Storage**: Embeddings and metadata are stored in Qdrant Vector Database, supporting combined semantic similarity and keyword-based filtering.
* **Query Embedding**: Incoming user queries are embedded using the exact same sentence-transformer model to map into the shared vector space.
* **Top-K Retrieval**: Executes hybrid search in Qdrant to pull the top 5 (`k=5`) most relevant context entries for the given query.

### 3. Generation Pipeline

* **Prompt Engineering**: Merges the retrieved top-5 context entries with the original query into a structured system prompt.
* **LLM Inference**: Sends the context-rich prompt to the Grok (xAI) language model.
* **Response Formatting**: Post-processes the raw model output into a standardized layout for presentation.

---

## Key Benefits

* **High Accuracy**: Reduces hallucinations by grounding answer generation inside official BIS documentation.
* **Scalable Knowledge Base**: New standards can be ingested into Qdrant independently without retraining or fine-tuning models.
* **Fast Retrieval**: Qdrant vector indexing isolates only the relevant information entries instead of processing raw document trees.
* **Decoupled Architecture**: Modular design allows swapping generation models or vector databases without altering frontend or pipeline logic.

---

## Directory Structure

```text
Maanak/
├── .github/
│   └── workflows/          # CI/CD automation and test pipelines
├── backend/                # FastAPI (Python) Service
│   ├── app/
│   │   ├── api/            # Route endpoints and request validation
│   │   ├── core/           # Configuration and environment management
│   │   ├── db/             # Qdrant client connection & query handlers
│   │   ├── pipelines/      # Augmentation, Retrieval, & Generation pipelines
│   │   └── services/       # Transformer embeddings and LLM integrations
│   ├── tests/              # Unit and integration test suites
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js (TypeScript) Client
│   ├── public/             # Static assets, branding, and images
│   ├── src/
│   │   ├── components/     # UI elements (search, standards viewer, footer)
│   │   ├── pages/          # Application routes and dynamic views
│   │   ├── services/       # API integration client
│   │   └── styles/         # Global styles and layout themes
│   ├── package.json        # Frontend scripts and dependencies
│   └── tsconfig.json       # TypeScript configuration
├── extension/              # Chrome browser extension module
├── CONTRIBUTIONS.md        # Contribution guidelines
└── README.md               # Project documentation
```

---
## Architecture

![Architecture](https://drive.google.com/uc?export=view&id=1xAVKcrNKXCUnktxLab88NwSRP530_hmS)
---
## Getting Started

### Prerequisites

* Python 3.9 or higher
* Node.js v18 or higher
* Running instance of Qdrant Vector Database (Local or Cloud)
* API Key for Grok (xAI)

---

### Backend Setup

1. Change directory into `backend`:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install required Python packages:
```bash
pip install -r requirements.txt
```

4. Configure environment variables (create a `.env` file in `backend/`):
```env
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your_qdrant_key
XAI_API_KEY=your_grok_api_key
```

5. Start the FastAPI backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

---

### Frontend Setup

1. Open a new terminal and navigate to `frontend`:
```bash
cd frontend
```

2. Install client dependencies:
```bash
npm install
```

3. Configure local environment variables (create `.env.local` in `frontend/`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

Access points:

* **Web Client**: `http://localhost:3000`
* **API Documentation**: `http://localhost:8000/docs`

---

## User Interface


 ![Maanak dashboard](./assets/maanak_dashboard.jpeg)

---

## Thank You

Thank you for exploring Maanak. Contributions, feedback, and pull requests are welcomed to help advance automated access to Indian Standards.

