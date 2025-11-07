import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
} from 'typeorm'
import { Theme } from './Theme.entity'
import { Lesson } from './Lesson.entity'

@Entity('ingestions')
export class Ingestion {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true, name: 'ingestion_id' })
    ingestionId: string

    // File metadata
    @Column({ length: 500 })
    title: string

    @Column({ length: 50, name: 'source_type' })
    sourceType: 'pdf' | 'txt' | 'docx'

    @Column({ name: 'file_size' })
    fileSize: number

    @Column({ length: 1000, nullable: true, name: 'file_path' })
    filePath: string | null

    @Column({ length: 500, name: 'original_filename' })
    originalFilename: string

    @Column({ length: 50, default: 'pending' })
    status: 'pending' | 'processing' | 'completed' | 'failed'

    @Column({ type: 'timestamp', nullable: true, name: 'processing_started_at' })
    processingStartedAt: Date | null

    @Column({ type: 'timestamp', nullable: true, name: 'processing_completed_at' })
    processingCompletedAt: Date | null

    @Column({ type: 'text', nullable: true, name: 'raw_text' })
    rawText: string | null

    @Column({ nullable: true, name: 'word_count' })
    wordCount: number | null

    @OneToMany(() => Theme, (theme) => theme.ingestion, { cascade: true })
    themes: Theme[]

    @OneToOne(() => Lesson, (lesson) => lesson.ingestion, { cascade: true })
    lesson: Lesson

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}