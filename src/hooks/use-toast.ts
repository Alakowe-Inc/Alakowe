import * as React from "react";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

type ToastFn = (options: ToastOptions) => void;

let toastFn: ToastFn = () => {};

export function setToastFn(fn: ToastFn) {
  toastFn = fn;
}

export function toast(options: ToastOptions) {
  toastFn(options);
}

export function useToast() {
  const [toasts, setToasts] = React.useState<(ToastOptions & { id: number })[]>([]);

  React.useEffect(() => {
    setToastFn((opts) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { ...opts, id }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    });
  }, []);

  return { toast, toasts };
}
