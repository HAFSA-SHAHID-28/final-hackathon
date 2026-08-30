import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
} from "./ticketConstants.js";

const cleanText = (value, maxLength) =>
  typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";

const parseJson = (content) => {
  const match = content.match(/\{[\s\S]*\}/);
  return JSON.parse(match?.[0] || content);
};

export const validateTriage = (triage) => {
  const category = cleanText(triage?.category, 30);
  const priority = cleanText(triage?.priority, 10);
  const summary = cleanText(triage?.summary, 300);

  if (!category) {
    throw new Error("AI returned an empty category");
  }

  if (!TICKET_CATEGORIES.includes(category)) {
    throw new Error("AI returned an invalid category");
  }

  if (!TICKET_PRIORITIES.includes(priority)) {
    throw new Error("AI returned an invalid priority");
  }

  if (!summary) {
    throw new Error("AI returned an empty summary");
  }

  return {
    category,
    priority,
    summary,
  };
};

export const requestTriage = async ({
  subject,
  description,
}) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("AI service is not configured");
  }

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    12_000
  );

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model:
            process.env.OPENAI_TRIAGE_MODEL ||
            "gpt-4o-mini",

          temperature: 0.2,

          response_format: {
            type: "json_object",
          },

          messages: [
            {
              role: "system",
              content:
                'Classify support tickets. Return JSON only: {"category":"Teaching|Tutoring|Technical|Design","priority":"Low|Medium|High","summary":"short factual summary"}.',
            },

            {
              role: "user",
              content: `Subject: ${subject}\nDescription: ${description}`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `AI service returned ${response.status}`
      );
    }

    const body = await response.json();

    return validateTriage(
      parseJson(
        body.choices?.[0]?.message?.content || ""
      )
    );
  } finally {
    clearTimeout(timeout);
  }
};