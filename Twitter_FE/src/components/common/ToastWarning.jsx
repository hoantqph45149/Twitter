import toast from "react-hot-toast";

export const ToastWarning = (message) => {
  toast(message, {
    icon: "⚠️",
    style: {
      border: "1px solid #facc15", // vàng vàng
      padding: "16px",
      color: "#854d0e",
      background: "#fef9c3",
    },
  });
};
