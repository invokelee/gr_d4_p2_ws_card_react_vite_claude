import { useState } from "react";
import { PEOPLE } from "./data/people";
import QuoteCard from "./components/QuoteCard";
import SwipeCardDeck from "./components/SwipeCardDeck";
import "./App.css";

const CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "history", label: "역사" },
  { key: "art", label: "예술·문화" },
  { key: "sports", label: "스포츠" },
  { key: "modern", label: "현대" },
];

const CATEGORY_MAP = {
  history: [1, 2, 3, 4],
  art: [5, 6, 9],
  sports: [7, 10],
  modern: [8, 9, 10],
};

export default function App() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState("desktop"); // "mobile" | "desktop"

  const filtered =
    activeCategory === "all"
      ? PEOPLE
      : PEOPLE.filter((p) => CATEGORY_MAP[activeCategory]?.includes(p.id));

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo-mark" aria-hidden="true">✦</span>
            <div>
              <h1 className="app-header__title">한국의 목소리</h1>
              <p className="app-header__subtitle">Voices of Korea</p>
            </div>
          </div>
          <p className="app-header__desc">
            한국 태생의 위인들이 남긴 명언을 AI로 만나보세요
          </p>
        </div>
      </header>

      {/* Nav: 카테고리 + 뷰 모드 토글 */}
      <nav className="app-nav" aria-label="카테고리 필터">
        <div className="app-nav__inner">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`app-nav__item${activeCategory === cat.key ? " app-nav__item--active" : ""}`}
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={activeCategory === cat.key}
            >
              {cat.label}
            </button>
          ))}

          <div className="app-nav__divider" aria-hidden="true" />

          <div className="view-toggle" role="group" aria-label="화면 모드 선택">
            <button
              className={`view-toggle__btn${viewMode === "mobile" ? " view-toggle__btn--active" : ""}`}
              onClick={() => setViewMode("mobile")}
              aria-pressed={viewMode === "mobile"}
              title="모바일 뷰"
            >
              <span aria-hidden="true">📱</span> 모바일
            </button>
            <button
              className={`view-toggle__btn${viewMode === "desktop" ? " view-toggle__btn--active" : ""}`}
              onClick={() => setViewMode("desktop")}
              aria-pressed={viewMode === "desktop"}
              title="데스크톱 뷰"
            >
              <span aria-hidden="true">🖥</span> 데스크톱
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="app-main">
        {viewMode === "mobile" ? (
          <SwipeCardDeck key={activeCategory} people={filtered} />
        ) : (
          <div className="card-grid">
            {filtered.map((person) => (
              <div key={person.id} className="card-grid__item">
                <QuoteCard person={person} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>명언은 GPT-4o mini가 생성합니다 · 이미지 © Unsplash</p>
      </footer>
    </div>
  );
}
