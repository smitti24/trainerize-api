# API Deployed to vercel at: https://trainer-api-gilt.vercel.app

## Endpoints:
**Health**: https://trainer-api-gilt.vercel.app/api/v1/health 
**Ingestions Health Check**: https://trainer-api-gilt.vercel.app/api/v1/ingestions/health 

## Planning

### Database Schema

#### Core Tables

**`ingestions`** - Main table
- Tracks each file upload/processing session
- Stores file metadata, processing status, and extracted text

**`themes`** - Extracted themes
- 3-7 main themes per ingestion
- AI-generated with confidence scores

**`lessons`** - Generated lessons
- One lesson per ingestion (250-400 words)
- Includes audio URL and target audience info

**`source_citations`** - Top 2-3 snippets
- Source references for the lesson
- Includes page/line numbers and relevance scores

---

### Action Plan

#### Database: **Supabase**

**Why Supabase?**

1. **Quick to set up** - Database ready in minutes
2. **Good free tier** - 500MB DB + 1GB storage
3. **Handles file uploads really well** - Built-in storage API
4. **Handles authentication well** - Needed in the future
5. **Great RLS** (Row Level Security) - Fine-grained access control
6. **Real-time functionality** - Live updates for processing status
7. **Good for audio storage** - Perfect for TTS audio files

#### API 

##### Patterns:
**Repository Pattern** TODO: (Fill in more details here)
- The repository pattern allows us to conform to several Design Principles:

1. Separation of Concerns
2. Single Responsibility Principle
3. Dependency Inversion Principle
4. Open/Close Principle
5. Interface Segregation Principle

#### AI Integration: **Google Gemini**

**Why Gemini over OpenAI?**

OpenAi requires a card subscription up front while gemini allows me to have 1500 requests per day. So for this MVP i feel that although openai is the more powerful and accurate model, to prove our concept, gemini serves the purpose well enough

The free tier lets me experiment freely without worrying about API costs piling up. If this project scales beyond the free limits, I can always upgrade or switch to OpenAI later. But for now, Gemini gives me everything I need without the overhead.

**Current model:** `gemini-2.5-flash`