import { useState } from 'react';
import { BOARD_AGENDA, BOARD_SLIDES } from '../data/dialogue';

type BoardMeetingProps = {
  onDone: () => void;
};

// SCENE THREE — the emergency board meeting. Interactive slides with absurd
// corporate language, plus a fake recovery-plan progress indicator.
export default function BoardMeeting({ onDone }: BoardMeetingProps) {
  const [slide, setSlide] = useState(0);
  const current = BOARD_SLIDES[slide];
  const isLast = slide >= BOARD_SLIDES.length - 1;
  const progress = Math.round(((slide + 1) / BOARD_SLIDES.length) * 100);

  return (
    <div className="screen scene-board">
      <div className="boardroom">
        <div className="board-lights" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="board-panel">
          <div className="screen-frame">
            <span className="screen-glare" aria-hidden="true" />
            <div className="slide" key={slide}>
              <h2 className="slide-title">{current.title}</h2>
              {current.lines.map((line, index) => (
                <p key={index} className="slide-line">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="board-side">
            <p className="section-label">جدول الأعمال</p>
            <ol className="agenda">
              {BOARD_AGENDA.map((item, index) => (
                <li key={index} className={index <= slide ? 'active' : ''}>
                  <span className="agenda-num" dir="ltr">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>

            <div className="recovery-meter">
              <div className="recovery-head">
                <span>مؤشر تجهيز خطة الإصلاح</span>
                <span dir="ltr">{progress}%</span>
              </div>
              <div className="bar">
                <i style={{ width: `${progress}%` }} />
              </div>
              <p className="recovery-note">
                ملاحظة: الخطة بتتجهز هنا. أما التنفيذ، فمكانه الحقيقي بره الاجتماع.
              </p>
            </div>
          </div>
        </div>

        <div className="board-controls">
          <button
            type="button"
            className="pixel-btn ghost"
            onClick={() => setSlide((value) => Math.max(0, value - 1))}
            disabled={slide === 0}
          >
            البند السابق
          </button>

          {!isLast ? (
            <button
              type="button"
              className="pixel-btn"
              onClick={() => setSlide((value) => Math.min(BOARD_SLIDES.length - 1, value + 1))}
            >
              البند التالي
            </button>
          ) : (
            <button type="button" className="pixel-btn primary" onClick={onDone}>
              الانتقال للجزء المهم
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
