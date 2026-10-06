"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Playfair_Display } from "next/font/google";

import type { NavLink } from "./hero.config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/** Matches Tailwind's `md` breakpoint, where the desktop nav takes over. */
const DESKTOP_QUERY = "(min-width: 768px)";

type MobileNavProps = {
  links: readonly NavLink[];
  /** Brand mark shown in the menu's top bar, mirroring the page header. */
  logo: ReactNode;
  /** Trailing external link; shown muted and unclickable when not enabled. */
  portal?: { href: string; label: string; enabled: boolean };
};

export default function MobileNav({ links, logo, portal }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  // The menu portals into <body>, which doesn't exist during SSR.
  const [mounted, setMounted] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => setMounted(true), []);

  // Focus follows the menu: in on open, back to the toggle on close.
  // preventScroll matters on close — the toggle sits at the top of the page,
  // and a link tap has just scrolled away from it.
  useEffect(() => {
    if (open) {
      closeRef.current?.focus();
      wasOpen.current = true;
    } else if (wasOpen.current) {
      toggleRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
    }
  }, [open]);

  // While open: lock page scroll, close on Esc, keep Tab inside the menu.
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable =
        panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      html.style.overflow = previousOverflow;
    };
  }, [open]);

  // Rotating a tablet or widening the window hands over to the desktop nav.
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // The scroll lock is lifted when the menu closes, so the jump has to wait
  // for that commit — a plain anchor would try to scroll a locked page.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    setOpen(false);
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView();
      history.pushState(null, "", href);
    });
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(true)}
        className="-mr-2.5 inline-flex h-11 w-11 items-center justify-center text-white md:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            inert={!open}
            // Visibility only animates on the way out (so the fade can finish).
            // On the way in it must flip at once: a transitioning `visibility`
            // stays hidden for the first frame, and focus() would be refused.
            className={`fixed inset-0 z-50 flex flex-col bg-[#071a33] text-white motion-safe:duration-300 md:hidden ${
              open
                ? "visible opacity-100 motion-safe:transition-opacity"
                : "invisible opacity-0 motion-safe:transition-[opacity,visibility]"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-3">
              {logo}
              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="-mr-2.5 inline-flex h-11 w-11 items-center justify-center text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <nav
              aria-label="Main"
              className="flex-1 overflow-y-auto px-6 pt-10 pb-12"
            >
              <ul className="flex flex-col">
                {links.map((link, index) => (
                  <li
                    key={link.href}
                    className={`border-b border-white/10 motion-safe:transition-[opacity,transform] motion-safe:duration-500 ${
                      open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0"
                    }`}
                    style={{
                      transitionDelay: open ? `${80 + index * 50}ms` : "0ms",
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={(event) => goTo(event, link.href)}
                      className={`${playfair.className} block py-4 text-3xl font-medium tracking-tight transition-colors hover:text-[#ec721a] focus-visible:text-[#ec721a]`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {portal && (
                  <li
                    className={`border-b border-white/10 motion-safe:transition-[opacity,transform] motion-safe:duration-500 ${
                      open
                        ? "translate-y-0 opacity-100"
                        : "translate-y-3 opacity-0"
                    }`}
                    style={{
                      transitionDelay: open
                        ? `${80 + links.length * 50}ms`
                        : "0ms",
                    }}
                  >
                    {portal.enabled ? (
                      <a
                        href={portal.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${playfair.className} block py-4 text-3xl font-medium tracking-tight transition-colors hover:text-[#ec721a] focus-visible:text-[#ec721a]`}
                      >
                        {portal.label}
                      </a>
                    ) : (
                      <span
                        aria-disabled="true"
                        className={`${playfair.className} block cursor-not-allowed py-4 text-3xl font-medium tracking-tight text-white/30`}
                      >
                        {portal.label}
                      </span>
                    )}
                  </li>
                )}
              </ul>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
