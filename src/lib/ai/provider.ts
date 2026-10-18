import { openai, createOpenAI } from "@ai-sdk/openai"
import { google, createGoogleGenerativeAI } from "@ai-sdk/google"
import { anthropic, createAnthropic } from "@ai-sdk/anthropic"
import type { LanguageModel } from "ai"

export type SupportedProvider = "openai" | "google" | "anthropic"

export interface ProviderInfo {
  provider: SupportedProvider
  modelName: string
  isConfigured: boolean
  providerDisplayName: string
}

export function detectActiveProvider(): SupportedProvider {
  const explicit = process.env.AI_PROVIDER?.toLowerCase() as SupportedProvider
  if (explicit && ["openai", "google", "anthropic"].includes(explicit)) {
    return explicit
  }

  // Auto-detect based on available API keys
  if (process.env.OPENAI_API_KEY) return "openai"
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return "google"
  if (process.env.ANTHROPIC_API_KEY) return "anthropic"

  // Default to OpenAI
  return "openai"
}

export function getActiveProviderInfo(): ProviderInfo {
  const provider = detectActiveProvider()

  switch (provider) {
    case "google": {
      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
      const modelName = process.env.GOOGLE_MODEL || "gemini-1.5-flash"
      return {
        provider: "google",
        modelName,
        isConfigured: !!apiKey && apiKey.length > 5,
        providerDisplayName: "Google Gemini",
      }
    }
    case "anthropic": {
      const apiKey = process.env.ANTHROPIC_API_KEY
      const modelName = process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-latest"
      return {
        provider: "anthropic",
        modelName,
        isConfigured: !!apiKey && apiKey.length > 5,
        providerDisplayName: "Anthropic Claude",
      }
    }
    case "openai":
    default: {
      const apiKey = process.env.OPENAI_API_KEY
      const modelName = process.env.OPENAI_MODEL || "gpt-4o-mini"
      return {
        provider: "openai",
        modelName,
        isConfigured: !!apiKey && apiKey.length > 5,
        providerDisplayName: "OpenAI",
      }
    }
  }
}

export function getAIModel(): { model: LanguageModel; modelName: string; provider: SupportedProvider } {
  const info = getActiveProviderInfo()

  if (!info.isConfigured) {
    throw new Error(
      `AI Provider [${info.providerDisplayName}] is not configured. Please add ${
        info.provider === "google"
          ? "GOOGLE_GENERATIVE_AI_API_KEY"
          : info.provider === "anthropic"
          ? "ANTHROPIC_API_KEY"
          : "OPENAI_API_KEY"
      } to your .env or environment variables.`
    )
  }

  switch (info.provider) {
    case "google": {
      const customGoogle = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      })
      return {
        model: customGoogle(info.modelName) as unknown as LanguageModel,
        modelName: info.modelName,
        provider: "google",
      }
    }
    case "anthropic": {
      const customAnthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      })
      return {
        model: customAnthropic(info.modelName) as unknown as LanguageModel,
        modelName: info.modelName,
        provider: "anthropic",
      }
    }
    case "openai":
    default: {
      const customOpenAI = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      return {
        model: customOpenAI(info.modelName) as unknown as LanguageModel,
        modelName: info.modelName,
        provider: "openai",
      }
    }
  }
}
