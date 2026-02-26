(() => {
  const manifestPath = "resources/media/media.json";
  const grid = document.getElementById("media-grid");
  const status = document.getElementById("media-status");
  const shuffleButton = document.getElementById("shuffle-btn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  let galleryItems = [];

  function shuffleArray(items) {
    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) {
      return;
    }

    lightbox.classList.remove("active");
    lightboxImg.src = "";
    lightboxImg.alt = "";
  }

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) {
      return;
    }

    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("active");
  }

  function createCard(item) {
    const wrapper = document.createElement("div");
    wrapper.className = "media-card";

    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || "SkyGround media image";
    img.loading = "lazy";
    img.decoding = "async";

    img.addEventListener("click", () => {
      openLightbox(item.src, img.alt);
    });

    wrapper.appendChild(img);
    return wrapper;
  }

  function renderGallery(items) {
    if (!grid || !status) {
      return;
    }

    grid.innerHTML = "";

    if (!items.length) {
      grid.innerHTML = `
        <div class="media-empty">
          <strong>No media found.</strong><br>
          Put images inside <code>resources/media</code> and regenerate <code>media.json</code>.
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      grid.appendChild(createCard(item));
    });

    status.textContent = `${items.length} image${items.length === 1 ? "" : "s"} loaded`;
  }

async function loadGallery() {
  if (!grid || !status) {
    return;
  }

  if (window.location.protocol === "file:") {
    grid.innerHTML = `
      <div class="media-empty">
        <strong>Could not load media.json.</strong><br>
        This page is being opened as a local file.<br>
        Open the site with Live Server or another local web server.
      </div>
    `;
    status.textContent = "Gallery load failed";
    return;
  }

  try {
    const manifestUrl = new URL("resources/media/media.json", window.location.href);

    const response = await fetch(`${manifestUrl.href}?v=${Date.now()}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} while loading ${manifestUrl.href}`);
    }

    const data = await response.json();
    const rawImages = Array.isArray(data.images) ? data.images : [];

    galleryItems = rawImages
      .map((item) => {
        if (typeof item === "string") {
          return { src: item };
        }

        if (item && typeof item === "object" && typeof item.src === "string") {
          return {
            src: item.src,
            alt: item.alt || ""
          };
        }

        return null;
      })
      .filter(Boolean);

    renderGallery(shuffleArray(galleryItems));
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <div class="media-empty">
        <strong>Could not load media.json.</strong><br>
        Check browser console for the exact fetch error.
      </div>
    `;
    status.textContent = "Gallery load failed";
  }
}

  if (shuffleButton) {
    shuffleButton.addEventListener("click", () => {
      renderGallery(shuffleArray(galleryItems));
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  loadGallery();
})();