import { toast } from "@zerodevx/svelte-toast";

export const Success = (m) =>
  toast.push(m, {
    theme: {
      "--toastBackground": "green",
      "--toastColor": "white",
      "--toastBarBackground": "olive",
    },
  });

export const Warning = (m) =>
  toast.push(m, {
    theme: {
      "--toastBackground": "#F56565",
      "--toastBarBackground": "#C53030",
    },
  });

export const Failure = (m) =>
  toast.push(m, {
    theme: {
      "--toastBackground": "#F56565",
      "--toastBarBackground": "#C53030",
    },
  });
