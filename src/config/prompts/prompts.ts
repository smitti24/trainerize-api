export const AI_PROMPTS = {
    EXTRACT_THEMES: `You are a JSON generator. Extract 3-7 main themes from the content below.

CONTENT:
{{content}}

OUTPUT FORMAT (strict JSON array, no other text):
[
  {
    "title": "Theme title (max 10 chars), make it short and concise and unique and relevant to the content and should be a single word or phrase that is easy to understand and remember",
    "description": "Brief explanation (2-3 sentences)",
    "orderIndex": 1,
    "confidenceScore": 0.95
  }
]

STRICT RULES:
1. Return ONLY the JSON array
2. NO markdown code blocks (no \`\`\`json)
3. NO explanatory text before or after
4. Extract exactly 3-7 themes
5. orderIndex: 1 (most important) to 7
6. confidenceScore: YOUR calculated score between 0.70 and 1.00 based on how central this theme is to the content and how well it is supported by the content and how well it is aligned with the overall purpose of the content
7. All values must be present (no null)
8. Higher confidence scores for themes that appear frequently and are well-supported in the content and are well-aligned with the overall purpose of the content

START YOUR RESPONSE WITH [ AND END WITH ]`,
}
export function fillPromptTemplate(template: string, variables: Record<string, string>): string {
    let filled = template
    for (const [key, value] of Object.entries(variables)) {
        filled = filled.replace(`{{${key}}}`, value)
    }
    return filled
}