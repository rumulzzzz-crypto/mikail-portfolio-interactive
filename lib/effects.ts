"use client";
import { useSyncExternalStore } from "react";
type Preference = "system" | "on" | "off";
const key = "portfolio-effects";
export function getEffectsPreference(): Preference {
  if (typeof window === "undefined") return "system";
  try {
    const value = localStorage.getItem(key);
    return value === "on" || value === "off" ? value : "system";
  } catch {
    return "system";
  }
}
export function effectsAllowed() {
  return (
    typeof window !== "undefined" &&
    (getEffectsPreference() === "on" ||
      (getEffectsPreference() === "system" &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches))
  );
}
function subscribe(update: () => void) {
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  const sync = () => {
    document.documentElement.dataset.effects = effectsAllowed() ? "on" : "off";
    update();
  };
  sync();
  mq.addEventListener("change", sync);
  window.addEventListener("portfolio-effects", sync);
  window.addEventListener("storage", sync);
  return () => {
    mq.removeEventListener("change", sync);
    window.removeEventListener("portfolio-effects", sync);
    window.removeEventListener("storage", sync);
  };
}
export function setEffectsPreference(value: Preference) {
  try {
    localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event("portfolio-effects"));
}
export function useEffects() {
  return useSyncExternalStore(subscribe, effectsAllowed, () => false);
}
export function useEffectsPreference() {
  return useSyncExternalStore(
    subscribe,
    getEffectsPreference,
    () => "system" as Preference,
  );
}
