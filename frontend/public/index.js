if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event && event.data && event.data.type === "NAVIGATE_TO") {
      const url = event.data.payload && event.data.payload.url;
      if (typeof url === "string") {
        window.location.href = url;
      }
    }
  });
}
