import { EmailGenerationInput, EmailRefineInput } from "@/types/email"

export function buildEmailSystemPrompt(): string {
  return `You are an elite executive communications expert and world-class email copywriter.
Your task is to write high-converting, clear, natural, and context-aware emails tailored to the user's requirements.

RULES FOR OUTPUT:
1. Always start the response with a compelling subject line formatted strictly as:
Subject: <Your Compelling Subject Line>

2. After the Subject line, leave exactly two blank lines, then write the email body.
3. Do NOT include markdown code blocks (e.g. \`\`\`email or \`\`\`), meta-commentary, or introductory remarks like "Here is your email:".
4. Adopt the exact tone and format requested.
5. Do NOT include bracketed placeholders like "[Insert Date]" if the context provided sufficient information. If specific details are missing, write natural, complete sentences that fit the situation.
6. Ensure standard email structure: warm greeting, clear context/purpose, actionable body, explicit call-to-action (CTA), and professional sign-off.`
}

export function buildEmailUserPrompt(input: EmailGenerationInput): string {
  const parts: string[] = []

  parts.push(`PURPOSE: ${input.purpose}`)
  if (input.recipient) {
    parts.push(`RECIPIENT: ${input.recipient}`)
  }
  if (input.senderName) {
    parts.push(`SENDER NAME: ${input.senderName}`)
  }
  if (input.context) {
    parts.push(`BACKGROUND / CONTEXT: ${input.context}`)
  }
  if (input.keyPoints && input.keyPoints.length > 0) {
    parts.push(`KEY POINTS TO COVER:
${input.keyPoints.map((kp, idx) => `  ${idx + 1}. ${kp}`).join("\n")}`)
  }

  parts.push(`TONE: ${input.tone.toUpperCase()}`)
  parts.push(`EMAIL TYPE: ${input.emailType.replace("_", " ").toUpperCase()}`)
  parts.push(`TARGET LENGTH: ${input.length.toUpperCase()}`)

  // Specific guidance for lengths
  if (input.length === "short") {
    parts.push("LENGTH GUIDANCE: Keep it concise (approx. 50-120 words). Extremely punchy, respectful of reader time.")
  } else if (input.length === "medium") {
    parts.push("LENGTH GUIDANCE: Balanced standard length (approx. 130-250 words). Well-spaced paragraphs, complete details.")
  } else {
    parts.push("LENGTH GUIDANCE: Comprehensive, detailed (approx. 250-450 words). In-depth context, nuances, and step-by-step next steps.")
  }

  return parts.join("\n\n")
}

export function buildRefineSystemPrompt(): string {
  return `You are a master email editor and communications consultant.
Your job is to rewrite or adjust an existing email according to specific editing instructions while preserving any existing subject line format or producing an updated one if needed.

RULES:
1. If the input email starts with "Subject: ...", preserve or refine the Subject line in the same format:
Subject: <Subject Line>

followed by two blank lines and the updated body.
2. Output ONLY the refined email. No explanations, no markdown code block wraps, no preamble.
3. Maintain high professionalism and natural human flow.`
}

export function buildRefineUserPrompt(input: EmailRefineInput): string {
  let instruction = ""

  switch (input.action) {
    case "shorten":
      instruction = "Make this email more concise, direct, and punchy. Cut unnecessary filler while retaining key message and call to action."
      break
    case "expand":
      instruction = "Expand this email with richer context, thoughtful elaboration on key points, and clear next steps."
      break
    case "rewrite":
      instruction = "Completely rewrite this email with fresh vocabulary, better cadence, and high-impact phrasing."
      break
    case "fix_grammar":
      instruction = "Proofread and polish this email. Fix any grammar, punctuation, phrasing, and awkward syntax while keeping the tone intact."
      break
    case "make_friendly":
      instruction = "Adjust the tone to be warmer, friendlier, more conversational and approachable, while still respectful."
      break
    case "make_formal":
      instruction = "Elevate the email to a strictly formal, executive, and traditional business standard."
      break
    case "make_persuasive":
      instruction = "Enhance the persuasive pull of this email. Sharpen the value proposition and emphasize a clear, compelling call-to-action."
      break
  }

  if (input.instruction) {
    instruction += ` Additional specific instruction: ${input.instruction}`
  }

  return `ACTION: ${input.action.toUpperCase()}
EDITING DIRECTIVE: ${instruction}

ORIGINAL EMAIL:
${input.currentEmail}`
}
