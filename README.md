# API Deployed to vercel at: https://trainer-api-gilt.vercel.app

## Endpoints:
**Health**: https://trainer-api-gilt.vercel.app/api/v1/health 


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

thisistrainerizeapidb