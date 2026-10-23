import { useId } from "react";

type Props = {
  n: string;
  kicker: string;
  title: string;
  titleId: string;
  /** Крупный подзаголовок по строкам (последняя строка — акцентная). */
  lead?: readonly string[];
  /** Абзацы текста под заголовком. */
  text?: readonly string[];
  /** Пометка на полях («реплика»). */
  aside?: string;
  right?: React.ReactNode;
};

/** Заголовок секции в духе журнала: номер / рубрика, пунктирная линия, крупный заголовок и «примечание на полях». */
export function SectionHead({ n, kicker, title, titleId, lead, text, aside, right }: Props) {
  const note = useId();
  return (
    <header className="sec-head">
      <span className="ghost-num" aria-hidden="true">{n}</span>
      <div className="sec-rule">
        <span className="eyebrow">{n} / {kicker}</span>
        <span className="eyebrow muted-eyebrow" aria-hidden="true">· · ·</span>
      </div>
      <div className="sec-title-row">
        <h2 id={titleId} className="display" aria-describedby={aside ? note : undefined}>{title}</h2>
        {right}
      </div>
      {lead && <p className="sec-lead">{lead.map((line) => <span key={line}>{line} </span>)}</p>}
      {text && text.map((p) => <p key={p} className="sec-text">{p}</p>)}
      {aside && <p id={note} className="aside"><span className="aside-mark" aria-hidden="true">✱</span> {aside}</p>}
    </header>
  );
}
