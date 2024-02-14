import { Dispatch, createContext, useContext, useReducer } from "react";

type State = {
  openMenu: boolean;
};

type Action = { type: "TOGGLE_MENU" };

type SideMenuDispatch = Dispatch<Action>;

const SideMenuStateContext = createContext<State | null>(null);
const SideMenuDispatchContext = createContext<SideMenuDispatch | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        ...state,
        openMenu: !state.openMenu,
      };
    default:
      throw new Error("Unhandled action");
  }
}

export function SideMenuProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    openMenu: false,
  });

  return (
    <SideMenuStateContext.Provider value={state}>
      <SideMenuDispatchContext.Provider value={dispatch}>
        {children}
      </SideMenuDispatchContext.Provider>
    </SideMenuStateContext.Provider>
  );
}

export function useSideMenuState() {
  const state = useContext(SideMenuStateContext);
  if (!state) throw new Error("Cannot find SideMenuStateProvider");
  return state;
}

export function useSideMenuDispatch() {
  const dispatch = useContext(SideMenuDispatchContext);
  if (!dispatch) throw new Error("Cannot find SideMenuDispatchProvider");
  return dispatch;
}
