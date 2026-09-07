"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { ContextGuide } from "@/components/shared/ContextGuide";
import { ProjectNavigation } from "@/components/shared/ProjectNavigation";

type ProjectPageHeaderProps = {
  title: string;
  accentTitle: string;
  lightMode: boolean;
  accent?: "sky" | "orange";
  toggleTheme?: () => void;
  guideId?: string;
  guideMessage?: string;
  mobileGuideMessage?: string;
  subtitle?: string;
  mobileSubtitle?: string;
  secondarySubtitle?: string;
  mobileSecondarySubtitle?: string;
};

export function ProjectPageHeader({
  title,
  accentTitle,
  lightMode,
  accent = "sky",
  toggleTheme,
  guideId,
  guideMessage,
  mobileGuideMessage,
  subtitle,
  mobileSubtitle,
  secondarySubtitle,
  mobileSecondarySubtitle,
}: ProjectPageHeaderProps) {
  const accentText = accent === "orange" ? "text-orange-600" : lightMode ? "text-sky-700" : "text-sky-400";
  const accentBorder = accent === "orange" ? "border-orange-500" : lightMode ? "border-sky-700" : "border-sky-400";
  const primaryText = lightMode ? "text-zinc-700" : "text-zinc-300";
  const secondaryText = lightMode ? "text-zinc-600" : "text-zinc-400";
  const hasGuide = Boolean(guideId && guideMessage);
  const hasControls = hasGuide || Boolean(toggleTheme);

  return (
    <header className="relative grid grid-cols-[1fr_auto] items-start gap-x-4 gap-y-9 pb-3 sm:block sm:min-h-[260px] sm:pb-0 lg:h-[300px]">
      <div className="pt-2 sm:absolute sm:left-0 sm:top-0 sm:pt-0">
        <ProjectNavigation lightMode={lightMode} accent={accent} />
      </div>

      {hasControls && (
        <div className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end sm:absolute sm:right-0 sm:top-0">
          {hasGuide && <ContextGuide guideId={guideId!} message={guideMessage!} mobileMessage={mobileGuideMessage} lightMode={lightMode} />}
          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${lightMode ? "dark" : "light"} mode`}
              title={`Switch to ${lightMode ? "dark" : "light"} mode`}
              className={`grid size-11 shrink-0 place-items-center rounded-md border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${lightMode ? "border-zinc-300 bg-white text-zinc-800 hover:border-sky-600 hover:text-sky-700" : "border-white/20 bg-white/[0.08] text-zinc-100 hover:border-sky-400 hover:text-sky-300"}`}
            >
              {lightMode ? <DarkModeOutlinedIcon fontSize="small" /> : <LightModeOutlinedIcon fontSize="small" />}
            </button>
          )}
        </div>
      )}

      <div className="col-span-2 row-start-2 text-center sm:mx-auto sm:max-w-3xl">
        <h1 className={`border-b p-2 font-bebas text-4xl leading-tight tracking-[0.08em] sm:text-5xl lg:whitespace-nowrap lg:px-4 lg:py-8 lg:text-6xl ${accentBorder}`}>
          {title} <span className={accentText}>{accentTitle}</span>
        </h1>

        {(subtitle || mobileSubtitle) && (
          <p className={`mx-auto mt-4 font-inter text-sm leading-relaxed sm:mt-6 sm:text-lg ${primaryText}`}>
            <span className="sm:hidden">{mobileSubtitle ?? subtitle}</span>
            <span className="hidden sm:inline">{subtitle ?? mobileSubtitle}</span>
          </p>
        )}

        {(secondarySubtitle || mobileSecondarySubtitle) && (
          <p className={`mx-auto mt-4 font-inter text-sm leading-relaxed sm:text-base ${secondaryText}`}>
            <span className="sm:hidden">{mobileSecondarySubtitle ?? secondarySubtitle}</span>
            <span className="hidden sm:inline">{secondarySubtitle ?? mobileSecondarySubtitle}</span>
          </p>
        )}
      </div>
    </header>
  );
}
