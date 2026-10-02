"use client";
import { useEffect, useRef } from "react";
export function Lightbox({
  src,
  alt,
  slug,
  className = "case-image",
  width = 1440,
  height = 1000,
}: {
  src: string;
  alt: string;
  slug?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const restore = () => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  };
  useEffect(() => () => restore(), []);
  const open = () => {
    if (!dialog.current || dialog.current.open) return;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current.showModal();
  };
  const close = () => dialog.current?.close();
  return (
    <>
      <button
        className={className}
        onClick={open}
        aria-label={`Увеличить: ${alt}`}
      >
        <img
          data-project-image={slug}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={slug ? "eager" : "lazy"}
        />
        <span>Рассмотреть интерфейс ↗</span>
      </button>
      <dialog
        className="lightbox"
        data-lenis-prevent
        ref={dialog}
        onClose={restore}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-label={alt}
      >
        <button className="lightbox-close cut" onClick={close} autoFocus>
          Закрыть ×
        </button>
        <img src={src} alt={alt} loading="lazy" />
      </dialog>
    </>
  );
}
