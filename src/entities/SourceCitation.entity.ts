import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Ingestion } from './Ingestion.entity'
import { Lesson } from './Lesson.entity'

@Entity('source_citations')
export class SourceCitation {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid', name: 'lesson_id' })
    lessonId: string

    @Column({ type: 'uuid', name: 'ingestion_id' })
    ingestionId: string

    // Citation details
    @Column({ type: 'text' })
    snippet: string

    @Column({ nullable: true, name: 'page_number' })
    pageNumber: number | null

    @Column({ nullable: true, name: 'line_number' })
    lineNumber: number | null

    @Column({ nullable: true, name: 'paragraph_number' })
    paragraphNumber: number | null

    // Context
    @Column({ type: 'text', nullable: true, name: 'context_before' })
    contextBefore: string | null

    @Column({ type: 'text', nullable: true, name: 'context_after' })
    contextAfter: string | null

    @Column({ name: 'order_index' })
    orderIndex: number

    @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, name: 'relevance_score' })
    relevanceScore: number | null

    // Relationships
    @ManyToOne(() => Lesson, (lesson) => lesson.citations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'lesson_id' })
    lesson: Lesson

    @ManyToOne(() => Ingestion, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingestion_id' })
    ingestion: Ingestion

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date
}