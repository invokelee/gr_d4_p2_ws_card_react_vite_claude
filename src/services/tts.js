import OpenAI from "openai";

const getClient = () =>
  new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

// 인물 분위기 → voice 매핑
const MOOD_VOICE = {
  valor:        "onyx",    // 이순신 — 깊고 권위 있음
  resistance:   "onyx",    // 유관순
  determination:"onyx",    // 안중근
  knowledge:    "alloy",   // 세종대왕 — 중립·균형
  art:          "fable",   // 김환기 — 따뜻하고 표현력
  literature:   "fable",   // 박경리
  creativity:   "fable",   // 봉준호
  energy:       "nova",    // 박지성, 손흥민 — 밝고 활기
  inspiration:  "nova",    // BTS
};

const MOOD_INSTRUCTIONS = {
  valor:        "Speak with deep gravitas and historical weight, slowly and solemnly.",
  resistance:   "Speak with quiet but firm conviction, emotionally resonant.",
  determination:"Speak with resolute dignity, clear and measured.",
  knowledge:    "Speak with calm wisdom and gentle authority.",
  art:          "Speak warmly and expressively, with artistic sensitivity.",
  literature:   "Speak with literary depth and emotional richness.",
  creativity:   "Speak with imaginative energy and thoughtful pacing.",
  energy:       "Speak with bright enthusiasm and motivating energy.",
  inspiration:  "Speak with uplifting warmth and youthful energy.",
};

let currentAudio = null;

export function stopTTS() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }
}

export async function speakText({ text, lang, mood }) {
  stopTTS();

  const client = getClient();
  const voice = MOOD_VOICE[mood] ?? "alloy";
  const instructions = MOOD_INSTRUCTIONS[mood] ?? "Speak naturally and clearly.";

  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice,
    input: text,
    instructions: lang === "ko"
      ? `${instructions} The text is in Korean — pronounce it naturally as a native Korean speaker.`
      : `${instructions} The text is in English.`,
    response_format: "mp3",
  });

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);
  currentAudio = audio;

  audio.addEventListener("ended", () => {
    URL.revokeObjectURL(url);
    currentAudio = null;
  });

  audio.play();
  return audio;
}
