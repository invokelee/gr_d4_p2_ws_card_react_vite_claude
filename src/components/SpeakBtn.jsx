import { useState } from "react";
import { speakText, stopTTS } from "../services/tts";
import "./SpeakBtn.css";

export default function SpeakBtn({ text, lang, mood, onPlay }) {
  const [playing, setPlaying] = useState(false);

  async function handleClick(e) {
    e.stopPropagation();
    if (playing) {
      stopTTS();
      setPlaying(false);
      return;
    }
    onPlay?.();
    setPlaying(true);
    try {
      const audio = await speakText({ text, lang, mood });
      audio.addEventListener("ended", () => setPlaying(false));
      audio.addEventListener("error", () => setPlaying(false));
    } catch {
      setPlaying(false);
    }
  }

  return (
    <button
      className={`speak-btn-icon${playing ? " speak-btn-icon--playing" : ""}`}
      onClick={handleClick}
      aria-label={playing
        ? `${lang === "ko" ? "한국어" : "영어"} 읽기 정지`
        : `${lang === "ko" ? "한국어" : "영어"}로 읽기`}
      title={playing ? "정지" : lang === "ko" ? "한국어로 읽기" : "영어로 읽기"}
      type="button"
    >
      {playing ? (
        <span className="speak-btn-icon__bars" aria-hidden="true">
          <span /><span /><span />
        </span>
      ) : (
        <svg className="speak-btn-icon__svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M8 1.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.8.4l-4-3H2a1 1 0 0 1-1-1V5.6a1 1 0 0 1 1-1h1.7l4-3a.5.5 0 0 1 .3-.1z"/>
          <path d="M11.3 5.1a.5.5 0 0 1 .7 0 5 5 0 0 1 0 5.8.5.5 0 1 1-.8-.6 4 4 0 0 0 0-4.6.5.5 0 0 1 .1-.6z" strokeLinecap="round"/>
          <path d="M13.1 3.5a.5.5 0 0 1 .7 0 8 8 0 0 1 0 9 .5.5 0 1 1-.8-.6 7 7 0 0 0 0-7.8.5.5 0 0 1 .1-.6z" strokeLinecap="round"/>
        </svg>
      )}
    </button>
  );
}
