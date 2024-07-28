import React from 'react';
import { ToastContainer } from "react-toastify";

const toastSettings = {
  toastClassName: "custom-toast-container",
  bodyClassName: "custom-toast-body",
  position: "bottom-left",
  autoClose: 4000,
  hideProgressBar: true,
  newestOnTop: false,
  closeButton: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "light"
};

export default function CustomToastContainer() {
  return <ToastContainer {...toastSettings} />;
}
