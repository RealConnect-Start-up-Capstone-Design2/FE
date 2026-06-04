import { useEffect } from "react";

const DEV_TOOLS_KEYS = new Set(["I", "J", "C"]);

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']"),
  );
}

function shouldPreventDevToolsShortcut(event: KeyboardEvent) {
  if (event.key === "F12") {
    return true;
  }

  const key = event.key.toUpperCase();
  const isChromeDevToolsShortcut =
    event.ctrlKey && event.shiftKey && DEV_TOOLS_KEYS.has(key);
  const isMacDevToolsShortcut =
    event.metaKey && event.altKey && DEV_TOOLS_KEYS.has(key);

  return isChromeDevToolsShortcut || isMacDevToolsShortcut;
}

function preventEvent(event: Event) {
  event.preventDefault();
  event.stopPropagation();
}

export function usePreventDevToolsShortcuts() {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!shouldPreventDevToolsShortcut(event)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    const handleProtectedInteraction = (event: Event) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      preventEvent(event);
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("contextmenu", handleProtectedInteraction, {
      capture: true,
    });
    window.addEventListener("copy", handleProtectedInteraction, {
      capture: true,
    });
    window.addEventListener("cut", handleProtectedInteraction, {
      capture: true,
    });
    window.addEventListener("dragstart", handleProtectedInteraction, {
      capture: true,
    });
    window.addEventListener("selectstart", handleProtectedInteraction, {
      capture: true,
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("contextmenu", handleProtectedInteraction, {
        capture: true,
      });
      window.removeEventListener("copy", handleProtectedInteraction, {
        capture: true,
      });
      window.removeEventListener("cut", handleProtectedInteraction, {
        capture: true,
      });
      window.removeEventListener("dragstart", handleProtectedInteraction, {
        capture: true,
      });
      window.removeEventListener("selectstart", handleProtectedInteraction, {
        capture: true,
      });
    };
  }, []);
}
