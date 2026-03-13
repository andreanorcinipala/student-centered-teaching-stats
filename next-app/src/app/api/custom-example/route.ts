import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const difficultyInstructions: Record<string, string> = {
  beginner:
    "Explain using plain, everyday language. No jargon, no formulas. Use 'you' voice. Keep it conversational and relatable. Use a concrete analogy from the student's chosen scenario.",
  intermediate:
    "Use formal definitions and notation where appropriate. Include a realistic research example with numbers. Assume the student has taken an intro stats or methods course.",
  advanced:
    "Use frameworks and formal notation. Reference established statistical theory. Discuss assumptions, limitations, and edge cases. Assume graduate-level methodological knowledge.",
};

export async function POST(req: NextRequest) {
  try {
    const { topic, difficulty, scenario } = await req.json();

    if (!topic || !difficulty || !scenario) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (scenario.length > 300) {
      return NextResponse.json(
        { error: "Scenario is too long. Please keep it under 300 characters." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a statistics teaching assistant. A student is learning about "${topic}" at the ${difficulty} level.

${difficultyInstructions[difficulty] || difficultyInstructions.beginner}

The student asked: "Explain ${topic} using a ${scenario} scenario."

Write a clear, engaging example (3-5 short paragraphs) that explains ${topic} through their chosen scenario. Do not use em dashes. Do not start with "Sure" or "Great question." Jump straight into the example.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ example: text });
  } catch (error) {
    console.error("Custom example error:", error);
    return NextResponse.json(
      { error: "Failed to generate example. Please try again." },
      { status: 500 }
    );
  }
}
