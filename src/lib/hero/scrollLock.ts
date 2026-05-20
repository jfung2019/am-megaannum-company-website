const LOCK_CLASS = "hero-scroll-locked";

let lockCount = 0;

export function lockPageScroll(): void {
  if (typeof document === "undefined") return;
  lockCount += 1;
  if (lockCount === 1) {
    document.documentElement.classList.add(LOCK_CLASS);
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
}

export function unlockPageScroll(): void {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove(LOCK_CLASS);
    document.documentElement.style.removeProperty("overflow");
    document.body.style.removeProperty("overflow");
  }
}

export function forceUnlockPageScroll(): void {
  lockCount = 0;
  unlockPageScroll();
}
