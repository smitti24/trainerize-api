CREATE TABLE ingestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingestion_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    file_size INTEGER NOT NULL, 
    file_path VARCHAR(1000),
    original_filename VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    processing_started_at TIMESTAMP,
    processing_completed_at TIMESTAMP,
    raw_text TEXT,
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingestion_id UUID NOT NULL REFERENCES ingestions(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(ingestion_id, order_index)
)

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ingestion_id UUID NOT NULL UNIQUE REFERENCES ingestions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    tone VARCHAR(50) DEFAULT 'professional',
    audio_url VARCHAR(1000),
    audio_duration INTEGER,
    audio_generated_at TIMESTAMP,
    target_audience VARCHAR(100) DEFAULT 'employee upskilling',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
)

CREATE TABLE source_citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    ingestion_id UUID NOT NULL REFERENCES ingestions(id) ON DELETE CASCADE,
    snippet TEXT NOT NULL,
    page_number INTEGER,
    line_number INTEGER,
    paragraph_number INTEGER,
    context_before TEXT,
    context_after TEXT,
    order_index INTEGER NOT NULL,
    relevance_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(lesson_id, order_index)
)