import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm'
import { Ingestion } from './Ingestion.entity'

@Entity('themes')
export class Theme {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid', name: 'ingestion_id' })
    ingestionId: string

    @Column({ length: 255 })
    title: string

    @Column({ type: 'text', nullable: true })
    description: string | null

    @Column({ name: 'order_index' })
    orderIndex: number

    @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true, name: 'confidence_score' })
    confidenceScore: number | null

    @ManyToOne(() => Ingestion, (ingestion) => ingestion.themes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ingestion_id' })
    ingestion: Ingestion

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date
}