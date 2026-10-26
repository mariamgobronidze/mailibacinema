// ლოგო არ იტვირთება? მის ნაცვლად ტექსტური ვერსია გამოჩნდება.
document.querySelectorAll(".logo-frame").forEach((frame) => {
  const image = frame.querySelector(".logo");
  const fallback = frame.querySelector(".logo-fallback");

  if (!image || !fallback) {
    return;
  }

  const showFallback = () => {
    image.hidden = true;
    fallback.hidden = false;
  };

  image.addEventListener("error", showFallback, { once: true });
  image.addEventListener("load", () => {
    image.hidden = false;
    fallback.hidden = true;
  }, { once: true });

  if (image.complete) {
    if (image.naturalWidth === 0) {
      showFallback();
    } else {
      fallback.hidden = true;
    }
  } else {
    fallback.hidden = true;
  }
});
