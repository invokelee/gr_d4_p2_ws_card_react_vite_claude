import { useState } from "react";
import { speakText, stopTTS } from "../services/tts";
import "./SpeakButtons.css";

export default function SpeakButtons({ quoteKo, quoteEn, mood }) {
  const [playing, setPlaying] = useState(null); // "ko" | "en" | null

  async function handleSpeak(lang) {
    if (playing === lang) {
      stopTTS();
      setPlaying(null);
      return;
    }
    // 다른 언어 재생 중이면 정지 후 전환
    stopTTS();
    setPlaying(lang);
    try {
      const audio = await speakText({
        text: lang === "ko" ? quoteKo : quoteEn,
        lang,
        mood,
      });
      audio.addEventListener("ended", () => setPlaying(null));
      audio.addEventListener("error", () => setPlaying(null));
    } catch {
      setPlaying(null);
    }
  }

  return (
    <div className="speak-btns" aria-label="명언 읽기">
      <button
        className={`speak-btn${playing === "ko" ? " speak-btn--playing" : ""}`}
        onClick={() => handleSpeak("ko")}
        aria-label={playing === "ko" ? "한국어 읽기 정지" : "한국어로 읽기"}
        title={playing === "ko" ? "정지" : "한국어로 읽기"}
      >
        <span className="speak-btn__flag">🇰🇷</span>
        <SpeakerIcon playing={playing === "ko"} />
      </button>

      <button
        className={`speak-btn${playing === "en" ? " speak-btn--playing" : ""}`}
        onClick={() => handleSpeak("en")}
        aria-label={playing === "en" ? "영어 읽기 정지" : "영어로 읽기"}
        title={playing === "en" ? "정지" : "영어로 읽기"}
      >
        <span className="speak-btn__flag">🇺🇸</span>
        <SpeakerIcon playing={playing === "en"} />
      </button>
    </div>
  );
}

function SpeakerIcon({ playing }) {
  if (playing) {
    return (
      <span className="speak-btn__icon speak-btn__icon--playing" aria-hidden="true">
        <span /><span /><span />
      </span>
    );
  }
  return (
    <svg
      className="speak-btn__icon"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.293 3.293a1 1 0 0 1 1.09.217l4 4A1 1 0 0 1 15 8.5v3a1 1 0 0 1-.293.707l-4 4A1 1 0 0 1 9 15.5v-11a1 1 0 0 1 .293-.707z" />
      <path d="M16.243 7.757a6 6 0 0 1 0 4.486M18.364 5.636a9 9 0 0 1 0 8.728" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
