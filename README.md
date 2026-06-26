# AI Content Generator

A Single Page Application (SPA) built with React, Vite, TypeScript, and Tailwind CSS. It integrates directly with a backend webhook workflow to generate, refine, and save structured articles.

## API Documentation and Integration

The integration layer in `src/services/api.ts` connects directly to the following endpoint:
`https://proserv-tool.app.n8n.cloud/webhook/content-generator`

### Request Specifications

#### Mode: generate (First Execution)
Sent on the initial generation submit.
```json
{
  "topic": "Future of Decentralized Finance",
  "contentType": "Article",
  "tone": "Professional",
  "imageStyle": "Minimalist",
  "mode": "generate"
}
```

#### Mode: regenerate (Refinement Execution)
Sent when the user regenerates the article content from the side panel.
```json
{
  "topic": "Future of Decentralized Finance",
  "contentType": "Guide",
  "tone": "Technical",
  "imageStyle": "Minimalist",
  "mode": "regenerate",
  "existingContent": "...previously generated text..."
}
```

### Response Specifications
Expected JSON format returned by the endpoint:
```json
{
  "text": "## Markdown Title\n\nBody content...",
  "imageUrl": "https://picsum.photos/seed/content/800/450",
  "metrics": {
    "promptTokens": 1000,
    "outputTokens": 800,
    "totalTokens": 1800,
    "textCostINR": 0.5,
    "imageCostINR": 2.0,
    "totalCostINR": 2.5
  }
}
```

## Features

- Content Builder: Configure topic, Content Type, Tone, and Style options.
- Dynamic Previews: Live wireframes and headline templates match active format.
- Two-Column Editor: Responsive layout placing the article on the left, and metadata summaries, save actions, word count, and token metrics inside a sticky right sidebar.
- Local Storage Vault: Saved articles are stored locally and accessible via a master-detail history manager.

## Getting Started

### Installation
```bash
git clone https://github.com/anurag-ux/content-gen.git
cd content-gen
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```
