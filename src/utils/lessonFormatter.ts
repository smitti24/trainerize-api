export interface LessonContent {
    whatYoullLearn: string
    keyConcepts: Array<{
        title: string
        content: string
    }>
    applyAtWork: string
    keyTakeaways: string[]
    wordCount?: number
    tone?: string
    targetAudience?: string
}

export function formatLessonForAudio(lessonData: LessonContent): string {
    const parts: string[] = []

    // Introduction
    parts.push("Welcome to your learning session.")
    parts.push("")

    // What You'll Learn
    if (lessonData.whatYoullLearn) {
        parts.push("What you'll learn:")
        parts.push(lessonData.whatYoullLearn)
        parts.push("")
    }

    // Key Concepts
    if (lessonData.keyConcepts && lessonData.keyConcepts.length > 0) {
        parts.push("Let's explore the key concepts.")
        parts.push("")

        lessonData.keyConcepts.forEach((concept, index) => {
            parts.push(`Concept ${index + 1}: ${concept.title}`)
            parts.push(concept.content)
            parts.push("")
        })
    }

    // Apply at Work
    if (lessonData.applyAtWork) {
        parts.push("How to apply this at work:")
        parts.push(lessonData.applyAtWork)
        parts.push("")
    }

    // Key Takeaways
    if (lessonData.keyTakeaways && lessonData.keyTakeaways.length > 0) {
        parts.push("Key takeaways:")
        lessonData.keyTakeaways.forEach((takeaway, index) => {
            parts.push(`${index + 1}. ${takeaway}`)
        })
        parts.push("")
    }

    // Closing
    parts.push("Thank you for learning with us today.")

    return parts.join(" ")
}

export function calculateAudioDuration(wordCount: number): number {
    // Average speaking rate: 150 words per minute
    const wordsPerSecond = 150 / 60
    return Math.ceil(wordCount / wordsPerSecond)
}

