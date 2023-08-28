export const toast = (text: string) => {
  const toastContainer = document.getElementById("custom-toastContainer");
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.classList.add("custom-toast");
  toast.innerText = text;
  toastContainer.appendChild(toast);

  // Remove the toast after a certain duration
  setTimeout(() => {
    // toast.classList.remove("toast-show");
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, 1000);
  }, 4000);
};
