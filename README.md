# InvoiceIQ - Smart Invoice & Receipt Reader

An AI-powered invoice and receipt reader that transforms unstructured financial documents into organized, categorized entries for small businesses.

## 🎯 The Problem

Small businesses waste **5-10 hours monthly** on manual receipt entry, leading to errors, missed tax deductions, and cash flow blindness.

## 💡 The Solution

InvoiceIQ uses AI to automatically extract, categorize, and organize receipt data in seconds.

## ✨ Features

- **AI Receipt Scanner** - Upload photos/PDFs, get structured data
- **Smart Categorization** - Auto-categorize expenses (Food, Travel, Office, etc.)
- **Analytics Dashboard** - Visualize spending patterns
- **Export Ready** - CSV/PDF reports for tax filing

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn-ui
- **Backend**: Supabase Edge Functions, PostgreSQL
- **AI**: Gemini 2.5 Flash (via Lovable AI Gateway)

## 🚀 Getting Started

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📁 Project Structure

```
src/
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── Dashboard.tsx      # Main dashboard
│   └── Upload.tsx         # Receipt upload
├── components/
│   └── invoice/           # Invoice-related components
└── integrations/
    └── supabase/          # Backend integration

supabase/
└── functions/
    └── process-receipt/   # AI processing function
```

## 📖 Documentation

See [PROJECT_DOCS.md](./PROJECT_DOCS.md) for detailed project documentation including:
- Problem statement
- Technical architecture
- Impact analysis
- Future roadmap

## 👨‍💻 Author

Created by me.

## 📄 License

MIT License
