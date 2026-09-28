import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";

interface NavigationGuardContextValue {
  setGuard: (onLeave: (() => void) | null) => void;
  guardedNavigate: (proceed: () => void) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextValue | null>(null);

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const guardRef = useRef<(() => void) | null>(null);
  const [pending, setPending] = useState<(() => void) | null>(null);

  const setGuard = useCallback((onLeave: (() => void) | null) => {
    guardRef.current = onLeave;
  }, []);

  // Runs `proceed` right away, unless a page has registered a guard -- then
  // it waits behind the confirm dialog instead.
  const guardedNavigate = useCallback((proceed: () => void) => {
    if (guardRef.current) setPending(() => proceed);
    else proceed();
  }, []);

  function confirmLeave() {
    guardRef.current?.();
    guardRef.current = null;
    pending?.();
    setPending(null);
  }

  function cancelLeave() {
    setPending(null);
  }

  return (
    <NavigationGuardContext.Provider value={{ setGuard, guardedNavigate }}>
      {children}
      <Dialog open={pending !== null} onOpenChange={(open) => !open && cancelLeave()}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Leave quiz?</DialogTitle>
            <DialogDescription>Navigating away will end your current quiz session.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelLeave}>
              Stay
            </Button>
            <Button variant="destructive" onClick={confirmLeave}>
              Leave quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </NavigationGuardContext.Provider>
  );
}

function useNavigationGuard() {
  const ctx = useContext(NavigationGuardContext);
  if (!ctx) throw new Error("useNavigationGuard must be used within NavigationGuardProvider");
  return ctx;
}

/** Lets sidebar/nav links go through `guardedNavigate` instead of navigating directly. */
export function useGuardedNavigate() {
  return useNavigationGuard().guardedNavigate;
}

/**
 * Registers `onLeave` to run once the user confirms leaving mid-quiz.
 * `active` controls whether there's actually something to confirm about --
 * e.g. no point asking if nothing has been answered yet.
 */
export function useLeaveGuard(active: boolean, onLeave: () => void) {
  const { setGuard } = useNavigationGuard();
  const onLeaveRef = useRef(onLeave);
  useEffect(() => {
    onLeaveRef.current = onLeave;
  });

  useEffect(() => {
    if (!active) {
      setGuard(null);
      return;
    }
    setGuard(() => onLeaveRef.current());
    return () => setGuard(null);
  }, [active, setGuard]);
}
