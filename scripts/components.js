class SiteHeader extends HTMLElement {
  connectedCallback() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    this.innerHTML = `
      <header>
        <div class="headerlogo">
          <a href="index.html"><h1>Ivy's Workshop</h1></a>
        </div>
        <nav>
          <a href="index.html" class="${currentPage === "index.html" ? "active" : ""}">Home</a>
          <a href="readme.html" class="${currentPage === "readme.html" ? "active" : ""}">Read Me</a>
          <a href="media.html" class="${currentPage === "media.html" ? "active" : ""}">Media</a>
          <a href="cat.html" class="${currentPage === "cat.html" ? "active" : ""}">CAT</a>
          <a href="https://discord.gg/FB62v6whbh" target="_blank" rel="noopener">Discord</a>
        </nav>
      </header>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        &copy; 2025 SkyGround Modlist.
      </footer>
    `;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);