# MediBot - AI Health Assistant

A full-stack medical chatbot application that serves as an AI health assistant, helping users understand symptoms, simplify medical reports, and provide medication information.

## Features

- **AI Symptom Checker** - Analyzes described symptoms and suggests common causes
- **Medical Report Simplifier** - Translates medical jargon into simple language
- **Smart Drug Info** - Provides structured medication information including uses, side effects, and warnings
- **Emergency Detection** - Scans for safety-critical keywords and immediately returns emergency alerts
- **RAG-Powered Responses** - Uses medical knowledge base for domain-specific answers
- **Document Upload** - Upload and analyze personal medical documents

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Supabase Edge Functions, PostgreSQL
- **AI**: Lovable AI Gateway (Gemini models)

## Project Structure

```
src/
├── pages/
│   └── MediBot.tsx          # Main chat interface
├── components/
│   └── medibot/
│       ├── DocumentUpload.tsx   # Document upload component
│       └── RAGIndicator.tsx     # RAG sources display
└── integrations/
    └── supabase/
        └── client.ts        # Supabase client configuration

supabase/
└── functions/
    └── medibot-chat/
        └── index.ts         # Backend chat function
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

## Author

Created by me.

## License

MIT License
