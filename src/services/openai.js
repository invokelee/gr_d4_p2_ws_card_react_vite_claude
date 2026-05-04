import OpenAI from "openai";

const getClient = () =>
  new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

export async function fetchQuote(person) {
  const client = getClient();

  const prompt = `당신은 한국의 역사·문화 전문가입니다.
다음 인물이 실제로 남긴 명언 또는 그 삶을 대표하는 말을 하나 선택해 주세요.

인물: ${person.name} (${person.nameEn}, ${person.years})
업적: ${person.achievement}

응답 형식은 반드시 아래 JSON만 출력하세요 (다른 텍스트 없이):
{
  "quote_ko": "한국어 명언",
  "quote_en": "English translation of the quote",
  "context": "이 명언의 배경과 의미를 2~3문장으로 설명 (한국어)"
}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 400,
  });

  const text = response.choices[0].message.content.trim();
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid JSON response from GPT");
  return JSON.parse(jsonMatch[0]);
}
