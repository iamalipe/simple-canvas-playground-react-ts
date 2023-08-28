import { useLayoutEffect } from "react";
import { THEMES_OBJECT } from "../../../utils";
import { useAtom } from "jotai";
import { themeAtom } from "../../../state";

export const ThemeProfilePopupItem = () => {
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
    <div className="flex items-center gap-4 h-12 border-b border-b-base-300 px-4">
      <span>Theme</span>
      <select
        className="daisy-select daisy-select-bordered daisy-select-sm w-full"
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
