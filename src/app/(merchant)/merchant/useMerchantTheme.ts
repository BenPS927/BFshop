"use client";

import { useEffect, useState } from "react";

const themeStorageKey = "bfshop-merchant-theme";

export function useMerchantTheme() {
  const [lightMode, setLightMode] = useState(false);

  useEffect(() => {
    setLightMode(window.localStorage.getItem(themeStorageKey) === "light");
  }, []);

  function toggleTheme() {
    setLightMode((currentMode) => {
      const nextMode = !currentMode;
      window.localStorage.setItem(themeStorageKey, nextMode ? "light" : "dark");
      return nextMode;
    });
  }

  return { lightMode, toggleTheme };
}