import { useAtom } from "jotai";
import { useLayoutEffect } from "react";
import { themeAtom } from "../../state";
import { THEMES_OBJECT } from "../../utils";

export const ThemeChangeButton = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const onChangeTheme: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const value = e.target.value;
    setTheme(value);
  };

  useLayoutEffect(() => {
    const htmlElement = document.querySelector("html");
    if (!htmlElement) return;
    htmlElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex sm:gap-4 gap-2 items-center ml-auto">
      <span className="hidden sm:block">Theme</span>
      <select
        className="daisy-select daisy-select-bordered daisy-select-xs sm:daisy-select-sm w-20 sm:w-full max-w-xs"
        onChange={onChangeTheme}
        value={theme}
      >
        {THEMES_OBJECT.map((themeOption, key) => {
          return (
            <option key={key} value={themeOption.value}>
              {themeOption.option}
            </option>
          );
        })}
      </select>
    </div>
  );
};
