import { Dispatch, createContext, useContext, useReducer } from "react";

type Theme = "light" | "dark";

type State = {
  theme: Theme;
};

type Action = { type: "TOGGLE_THEME" };

type ThemeDispatch = Dispatch<Action>;

const ThemeStateContext = createContext<State | null>(null);
const ThemeDispatchContext = createContext<ThemeDispatch | null>(null);

function reducer(state: State, action: Action): State {
  if (action.type === "TOGGLE_THEME") {
    const newTheme = state.theme === "light" ? "dark" : "light";

    const root: HTMLElement = window.document.documentElement;
    if (newTheme === "light") root.classList.remove("dark");
    else root.classList.add(newTheme);

    return {
      ...state,
      theme: newTheme,
    };
  } else {
    throw new Error("Unhandled action");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    theme: "light",
  });

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

export function useThemeState() {
  const state = useContext(ThemeStateContext);
  if (!state) throw new Error("Cannot find ThemeStateProvider");
  return state;
}

export function useThemeDispatch() {
  const dispatch = useContext(ThemeDispatchContext);
  if (!dispatch) throw new Error("Cannot find ThemeDispatchProvider");
  return dispatch;
}
