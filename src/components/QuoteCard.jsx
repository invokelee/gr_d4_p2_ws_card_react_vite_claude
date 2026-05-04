import { useState } from "react";
import { BG_IMAGES } from "../data/people";
import { fetchQuote } from "../services/openai";
import "./QuoteCard.css";

export default function QuoteCard({ person }) {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flipped, setFlipped] = useState(false);

  const bgUrl = BG_IMAGES[person.bgImage];

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuote(person);
      setQuote(data);
      setFlipped(true);
    } catch (e) {
      setError("명언을 불러오지 못했습니다. API 키를 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  function handleFlipBack() {
    setFlipped(false);
  }

  return (
    <div className="quote-card-scene">
      <div className={`quote-card${flipped ? " quote-card--flipped" : ""}`}>
        {/* 앞면: 인물 소개 */}
        <div
          className="quote-card__face quote-card__front"
          style={{ backgroundImage: `url(${bgUrl})` }}
        >
          <div className="quote-card__overlay" />
          <div className="quote-card__content">
            <div className="quote-card__person">
              <span className="quote-card__years">{person.years}</span>
              <h2 className="quote-card__name">{person.name}</h2>
              <p className="quote-card__name-en">{person.nameEn}</p>
              <p className="quote-card__achievement">{person.achievement}</p>
              <p className="quote-card__achievement-en">{person.achievementEn}</p>
            </div>
            <button
              className="quote-card__btn"
              onClick={handleGenerate}
              disabled={loading}
              aria-label={`${person.name} 명언 생성`}
            >
              {loading ? (
                <span className="quote-card__spinner" aria-hidden="true" />
              ) : (
                "명언 보기"
              )}
            </button>
            {error && <p className="quote-card__error">{error}</p>}
          </div>
        </div>

        {/* 뒷면: 명언 */}
        <div
          className="quote-card__face quote-card__back"
          style={{ backgroundImage: `url(${bgUrl})` }}
        >
          <div className="quote-card__overlay quote-card__overlay--dark" />
          {quote && (
            <div className="quote-card__content quote-card__content--quote">
              <div className="quote-card__quote-scroll">
                <blockquote className="quote-card__quote">
                  <p className="quote-card__quote-ko">&#8220;{quote.quote_ko}&#8221;</p>
                  <p className="quote-card__quote-en">"{quote.quote_en}"</p>
                </blockquote>
                <footer className="quote-card__footer">
                  <span className="quote-card__author">— {person.name}</span>
                  <span className="quote-card__author-en">{person.nameEn}</span>
                </footer>
                {quote.context && (
                  <p className="quote-card__context">{quote.context}</p>
                )}
              </div>
              <button
                className="quote-card__btn quote-card__btn--secondary"
                onClick={handleFlipBack}
                aria-label="뒤로 돌아가기"
              >
                돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
