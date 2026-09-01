"use client";

import { useLayoutEffect, useState } from "react";

const themeStorageKey = "bfshop-merchant-theme";

export function useMerchantTheme() {
  const [lightMode, setLightMode] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  useLayoutEffect(() => {
    const storedLightMode = window.localStorage.getItem(themeStorageKey) === "light";
    setLightMode(storedLightMode);
    document.documentElement.dataset.bfshopTheme = storedLightMode ? "light" : "dark";
    setThemeReady(true);
  }, []);

  function toggleTheme() {
    setLightMode((currentMode) => {
      const nextMode = !currentMode;
      window.localStorage.setItem(themeStorageKey, nextMode ? "light" : "dark");
      document.documentElement.dataset.bfshopTheme = nextMode ? "light" : "dark";
      return nextMode;
    });
  }

  return { lightMode, themeReady, toggleTheme };
}
