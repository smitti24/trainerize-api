import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm'
import { Ingestion } from './Ingestion.entity'
import { SourceCitation } from './SourceCitation.entity'

@Entity('lessons')
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid', unique: true, name: 'ingestion_id' })
    ingestionId: string

    @Column({ type: 'text' })
    content: string

    @Column({ type: 'int', name: 'word_count' })
    wordCount: number

    @Column({ type: 'varchar', length: 50, default: 'professional' })
    tone: string

    @Column({ type: 'varchar', length: 1000, nullable: true, name: 'audio_url' })
    audioUrl: string | null

    @Column({ type: 'int', nullable: true, name: 'audio_duration' })
    audioDuration: number | null

    @Column({ type: 'timestamp', nullable: true, name: 'audio_generated_at' })
    audioGeneratedAt: Date | null

    @Column({ type: 'varchar', length: 500, default: 'employee upskilling', name: 'target_audience' })
    targetAudience: string

    @OneToOne(() => Ingestion, (ingestion) => ingestion.lesson, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingestion_id' })
    ingestion: Ingestion

    @OneToMany(() => SourceCitation, (citation) => citation.lesson, { cascade: true })
    citations: SourceCitation[]

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date
}