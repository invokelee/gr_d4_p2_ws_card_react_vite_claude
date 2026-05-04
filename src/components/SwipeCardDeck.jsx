import { useState, useRef } from "react";
import { BG_IMAGES } from "../data/people";
import { fetchQuote } from "../services/openai";
import { stopTTS } from "../services/tts";
import SpeakBtn from "./SpeakBtn";
import "./SwipeCardDeck.css";

export default function SwipeCardDeck({ people }) {
  const [index, setIndex] = useState(0);
  const [quotes, setQuotes] = useState({});      // id → quote data
  const [loading, setLoading] = useState({});    // id → bool
  const [flipped, setFlipped] = useState({});    // id → bool
  const [slideDir, setSlideDir] = useState(null); // "left" | "right" | null

  const touchStart = useRef(null);
  const person = people[index];

  // ── Navigation ──────────────────────────────────────────
  function goTo(nextIndex, direction) {
    if (nextIndex < 0 || nextIndex >= people.length) return;
    setSlideDir(direction);
    setTimeout(() => {
      setIndex(nextIndex);
      setSlideDir(null);
    }, 220);
  }

  function prev() { goTo(index - 1, "right"); }
  function next() { goTo(index + 1, "left"); }

  // ── Touch / Swipe ────────────────────────────────────────
  function onTouchStart(e) {
    touchStart.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    if (touchStart.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 40) return;
    delta < 0 ? next() : prev();
  }

  // ── Flip / Quote fetch ───────────────────────────────────
  async function handleCardTap() {
    const id = person.id;
    if (flipped[id]) {
      setFlipped((f) => ({ ...f, [id]: false }));
      return;
    }
    if (quotes[id]) {
      setFlipped((f) => ({ ...f, [id]: true }));
      return;
    }
    setLoading((l) => ({ ...l, [id]: true }));
    try {
      const data = await fetchQuote(person);
      setQuotes((q) => ({ ...q, [id]: data }));
      setFlipped((f) => ({ ...f, [id]: true }));
    } catch {
      // silently keep front
    } finally {
      setLoading((l) => ({ ...l, [id]: false }));
    }
  }

  const isFlipped = !!flipped[person.id];
  const isLoading = !!loading[person.id];
  const quote = quotes[person.id];
  const bgUrl = BG_IMAGES[person.bgImage];

  return (
    <div className="deck">
      {/* Card */}
      <div
        className="deck__stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Prev / Next arrows — visible on non-touch */}
        <button
          className="deck__arrow deck__arrow--prev"
          onClick={prev}
          disabled={index === 0}
          aria-label="이전 인물"
        >
          ‹
        </button>

        <div
          className={[
            "deck__card-wrap",
            slideDir === "left" ? "deck__card-wrap--slide-left" : "",
            slideDir === "right" ? "deck__card-wrap--slide-right" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div
            className={`deck__card${isFlipped ? " deck__card--flipped" : ""}`}
            onClick={handleCardTap}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCardTap()}
            aria-label={isFlipped ? "카드 앞으로 돌아가기" : "명언 보기"}
          >
            {/* Front */}
            <div
              className="deck__face deck__face--front"
              style={{ backgroundImage: `url(${bgUrl})` }}
            >
              <div className="deck__overlay" />
              <div className="deck__face-content">
                <div className="deck__person-info">
                  <span className="deck__years">{person.years}</span>
                  <h2 className="deck__name">{person.name}</h2>
                  <p className="deck__name-en">{person.nameEn}</p>
                  <p className="deck__achievement">{person.achievement}</p>
                  <p className="deck__achievement-en">{person.achievementEn}</p>
                </div>
                <div className="deck__tap-hint">
                  {isLoading ? (
                    <span className="deck__spinner" />
                  ) : (
                    <>
                      <span className="deck__tap-icon">✦</span>
                      <span>탭하여 명언 보기</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Back */}
            <div
              className="deck__face deck__face--back"
              style={{ backgroundImage: `url(${bgUrl})` }}
            >
              <div className="deck__overlay deck__overlay--dark" />
              {quote && (
                <div className="deck__face-content">
                  <div
                    className="deck__quote-scroll"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <blockquote className="deck__blockquote">
                      <p className="deck__quote-line">
                        <SpeakBtn text={quote.quote_ko} lang="ko" mood={person.mood} />
                        <span>&#8220;{quote.quote_ko}&#8221;</span>
                      </p>
                      <p className="deck__quote-line deck__quote-line--en">
                        <SpeakBtn text={quote.quote_en} lang="en" mood={person.mood} />
                        <span>"{quote.quote_en}"</span>
                      </p>
                    </blockquote>
                    <footer className="deck__footer">
                      <span className="deck__author">— {person.name}</span>
                      <span className="deck__author-en">{person.nameEn}</span>
                    </footer>
                    {quote.context && (
                      <p className="deck__context">{quote.context}</p>
                    )}
                  </div>
                  <div className="deck__tap-hint deck__tap-hint--back">
                    <span className="deck__tap-icon">↩</span>
                    <span>탭하여 돌아가기</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="deck__arrow deck__arrow--next"
          onClick={next}
          disabled={index === people.length - 1}
          aria-label="다음 인물"
        >
          ›
        </button>
      </div>

      {/* Dot indicators */}
      <div className="deck__dots" role="tablist" aria-label="인물 목록">
        {people.map((p, i) => (
          <button
            key={p.id}
            className={`deck__dot${i === index ? " deck__dot--active" : ""}`}
            onClick={() => goTo(i, i > index ? "left" : "right")}
            role="tab"
            aria-selected={i === index}
            aria-label={p.name}
          />
        ))}
      </div>

      {/* Counter */}
      <p className="deck__counter">
        {index + 1} / {people.length}
      </p>
    </div>
  );
}
