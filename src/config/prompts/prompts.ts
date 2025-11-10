export const AI_PROMPTS = {
    EXTRACT_THEMES: `Extract 3-7 main themes from the content below. Return ONLY a valid JSON array.

CONTENT:
{{content}}

EXAMPLE OUTPUT (use this exact format):
[
  {
    "title": "Machine Learning",
    "description": "Brief explanation (2-3 sentences)",
    "orderIndex": 1,
    "confidenceScore": 0.95
  }
]

REQUIREMENTS:
- Extract 3-7 themes ordered by importance
- title: Short, clear theme name (max 60 characters)
- description: 2-3 sentences explaining the theme
- orderIndex: Sequential numbers 1-7 (1 = most important)
- confidenceScore: Calculate based on theme prominence (0.70 to 1.00)

CRITICAL: Your response must be ONLY the JSON array. No markdown, no explanations, no extra text. Start with [ and end with ]`,
}
export function fillPromptTemplate(template: string, variables: Record<string, string>): string {
    let filled = template
    for (const [key, value] of Object.entries(variables)) {
        filled = filled.replace(`{{${key}}}`, value)
    }
    return filled
}