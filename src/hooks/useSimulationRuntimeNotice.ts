import { useEffect, useRef } from "react";

import { telemetry } from "../lib/telemetry";
import type { ToastTone } from "./useToast";

type Runtime = "worker" | "inline";

type ShowToast = (
  message: string,
  options?: {
    tone?: ToastTone;
    actionLabel?: string;
    onAction?: () => void;
    durationMs?: number;
  }
) => void;

export function useSimulationRuntimeNotice(runtime: Runtime, showToast: ShowToast) {
  const lastRuntimeRef = useRef<Runtime | null>(null);
  const inlineToastShownRef = useRef(false);

  useEffect(() => {
    if (lastRuntimeRef.current === runtime) return;

    telemetry.track("simulation_runtime", { runtime });

    if (runtime === "inline" && !inlineToastShownRef.current) {
      showToast("Simulation worker unavailable; running inline mode.", {
        tone: "info",
        durationMs: 4000,
      });
      inlineToastShownRef.current = true;
    }

    lastRuntimeRef.current = runtime;
  }, [runtime, showToast]);
}
