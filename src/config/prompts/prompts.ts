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
- title: Short, clear theme name (max 20 characters) 
- description: 2-3 sentences explaining the theme
- orderIndex: Sequential numbers 1-7 (1 = most important)
- confidenceScore: Calculate based on theme prominence (0.70 to 1.00)

CRITICAL: Your response must be ONLY the JSON array. No markdown, no explanations, no extra text. Start with [ and end with ]`,

  GENERATE_LESSON: `Generate a short lesson (≈250–400 words) aimed at an employee upskilling for
work. The lesson should be engaging and interesting. The lesson should be in the same language as the content. Lesson is concise, workplace-relevant, and matches themes.

CONTENT:
{{content}}

Return a JSON object with this structure:
{
 "introduction": "Opening section explaining key takeaways and why this matters for their work (50-70 words)",
  "wordCount": "Count of words in the lesson",
  "tone": "Determine the tone of the lesson based on the content",
  "targetAudience": "Determine the target audience of the lesson based on the content",
  "keyConcepts": [
    {
      "title": "First Key Concept",
      "content": "Detailed explanation paragraph (75-100 words)"
    },
    {
      "title": "Second Key Concept", 
      "content": "Detailed explanation paragraph (75-100 words)"
    }
  ],
  "keyTakeaways": [
    "First key takeaway - one clear, memorable point",
    "Second key takeaway - one clear, memorable point", 
    "Third key takeaway - one clear, memorable point"
  ],
  "applyAtWork": "Practical paragraph with specific actionable steps employees can take immediately (50-75 words)"
}

Requirements:
- Total 250-400 words across whatYoullLearn + keyConcepts + applyAtWork
- Use "for work" tone: professional, practical, action-oriented
- Focus on immediate workplace application
- Include 2-3 key concepts (can be more if word count allows)
- Provide 3-5 specific, actionable steps in "Apply at Work"
- List 3-5 memorable key takeaways
- Make it engaging and relevant to modern workplace challenges

CRITICAL: Your response must be ONLY the JSON object. No markdown, no explanations, no extra text. Start with { and end with }`,

EXTRACT_CITATIONS: `Extract the 2-3 most relevant and important snippets from the source content that best support the key concepts taught in the lesson. These citations serve as evidence/proof for what was taught.

SOURCE CONTENT:
{{content}}

LESSON CONTEXT:
{{lesson}}

Return ONLY a valid JSON array of citations:
[
  {
    "snippet": "The exact quote or passage from the source (30-150 words). MUST be complete sentences.",
    "contextBefore": "A few words before the snippet for context (optional)",
    "contextAfter": "A few words after the snippet for context (optional)",
    "pageNumber": 1,
    "paragraphNumber": 2,
    "relevanceScore": 0.95
  }
]

REQUIREMENTS:
- Extract 2-3 citations (most important snippets only)
- snippet: Direct quote from source material (30-150 WORDS - count them!)
- Each snippet MUST be COMPLETE sentences with proper punctuation
- DO NOT cut off mid-sentence
- Include enough context to be meaningful and standalone
- contextBefore/contextAfter: Optional surrounding context (10-20 words each)
- pageNumber: Page number if available (null if not applicable)
- paragraphNumber: Paragraph position in the document (estimate based on content location)
- relevanceScore: How relevant this snippet is to the lesson (0.70 to 1.00)
- Order by importance (most relevant first)

EXAMPLE GOOD SNIPPET:
"Modern leaders should also embrace diversity and inclusion, recognizing that diverse perspectives lead to better problem-solving and innovation. Studies have shown that teams with diverse backgrounds generate more creative solutions and adapt better to changing market conditions."

EXAMPLE BAD SNIPPET (too short/incomplete):
"Modern leaders should also embrace diversity and inclusion"

CRITICAL: Your response must be ONLY the JSON array. No markdown, no explanations, no extra text. Start with [ and end with ]`,
}

export function fillPromptTemplate(template: string, variables: Record<string, string>): string {
  let filled = template
  for (const [key, value] of Object.entries(variables)) {
    filled = filled.replace(`{{${key}}}`, value)
  }
  return filled
}