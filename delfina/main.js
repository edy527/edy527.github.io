/* ============================================================
   Delfina Molteni — Portafolio · main.js
   Vanilla JS, IIFE. Fetches data/contenido.json and renders.
   Content-first: HTML reads fine even if this never runs.
   ============================================================ */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var safe = function (fn, name) {
    try { fn(); } catch (e) { if (window.console) console.warn("init " + name + " falló:", e); }
  };

  /* ---------- helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function el(tag, cls) { var n = document.createElement(tag); if (cls) n.className = cls; return n; }
  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }

  /* ---------- state ---------- */
  var DATA = null;
  var FLAT = [];      // all photos, flattened, current filter applied
  var lbIndex = 0;

  /* ============================================================
     1. Fetch content and render
     ============================================================ */
  function loadContent() {
    fetch("data/contenido.json?v=" + Date.now())
      .then(function (r) { if (!r.ok) throw new Error("no json"); return r.json(); })
      .then(function (data) { DATA = data; renderAll(data); })
      .catch(function () {
        // Sin JSON (p. ej. abierto con file://): dejamos el HTML tal cual
        // y mostramos aviso en la galería.
        var empty = $("#galleryEmpty");
        if (empty) empty.hidden = false;
      });
  }

  function renderAll(data) {
    safe(function () { renderProfile(data); }, "profile");
    safe(function () { renderFilters(data); }, "filters");
    safe(function () { renderGallery(data, "__all__"); }, "gallery");
    safe(function () { renderContact(data); }, "contact");
    safe(function () { observeReveals(); }, "reveal-refresh");
  }

  function renderProfile(data) {
    if (data.nombre) {
      document.title = data.nombre + " · Portafolio";
      Array.prototype.forEach.call(document.querySelectorAll("[data-nav-name]"), function (n) {
        n.textContent = data.nombre;
      });
    }
    if (data.subtitulo) {
      Array.prototype.forEach.call(document.querySelectorAll("[data-nav-subtitle]"), function (n) {
        n.textContent = data.subtitulo;
      });
    }
    if (data.bio) {
      Array.prototype.forEach.call(document.querySelectorAll("[data-nav-bio]"), function (n) {
        n.textContent = data.bio;
      });
    }
    if (data.portada) {
      var h = $("#heroImg"); if (h) h.src = data.portada;
    }
  }

  /* ---------- filters (una por sesión) ---------- */
  function renderFilters(data) {
    var wrap = $("#filters");
    if (!wrap || !data.sesiones || !data.sesiones.length) return;
    wrap.innerHTML = "";

    var chips = [{ key: "__all__", label: "Todo" }];
    data.sesiones.forEach(function (s, i) {
      if (s.fotos && s.fotos.length) chips.push({ key: "s" + i, label: s.titulo || ("Sesión " + (i + 1)) });
    });

    chips.forEach(function (c, idx) {
      var b = el("button", "filter" + (idx === 0 ? " is-active" : ""));
      b.type = "button";
      b.textContent = c.label;
      b.setAttribute("data-key", c.key);
      b.addEventListener("click", function () {
        Array.prototype.forEach.call(wrap.children, function (x) { x.classList.remove("is-active"); });
        b.classList.add("is-active");
        renderGallery(data, c.key);
      });
      wrap.appendChild(b);
    });
  }

  /* ---------- gallery ---------- */
  function renderGallery(data, filterKey) {
    var g = $("#gallery");
    if (!g) return;
    g.innerHTML = "";
    FLAT = [];

    var sesiones = (data.sesiones || []).filter(function (s) { return s.fotos && s.fotos.length; });
    if (!sesiones.length) { var e = el("p", "gallery__empty"); e.textContent = "Todavía no hay fotos cargadas. Pronto habrá novedades."; g.appendChild(e); return; }

    var showAll = filterKey === "__all__";

    sesiones.forEach(function (s, i) {
      if (!showAll && filterKey !== "s" + i) return;

      // Etiqueta de grupo sólo en la vista "Todo"
      if (showAll) {
        var lab = el("div", "group-label");
        lab.innerHTML = esc(s.titulo || "Sesión") +
          " <small>" + esc(s.descripcion || (s.categoria || "")) + "</small>";
        g.appendChild(lab);
      }

      s.fotos.forEach(function (f) {
        var src = typeof f === "string" ? f : (f && f.src);
        if (!src) return;
        var texto = (f && f.texto) || "";
        var idx = FLAT.length;
        FLAT.push({ src: src, texto: texto, titulo: s.titulo, categoria: s.categoria });

        var card = el("div", "card");
        card.setAttribute("tabindex", "0");
        card.setAttribute("role", "button");
        card.setAttribute("aria-label", "Ampliar foto de " + (s.titulo || "sesión"));

        var img = el("img");
        img.src = src;
        img.loading = "lazy";
        img.alt = (s.titulo || "Foto") + (texto ? " — " + texto : "");
        card.appendChild(img);

        var ov = el("div", "card__overlay");
        ov.innerHTML =
          (s.categoria ? '<span class="card__cat">' + esc(s.categoria) + "</span>" : "") +
          '<p class="card__title">' + esc(s.titulo || "") + "</p>";
        card.appendChild(ov);

        card.addEventListener("click", function () { openLightbox(idx); });
        card.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); openLightbox(idx); }
        });

        g.appendChild(card);
      });
    });
  }

  /* ---------- contacto ---------- */
  function renderContact(data) {
    var wrap = $("#contactLinks");
    if (!wrap) return;
    wrap.innerHTML = "";
    var links = [];
    if (data.email) links.push({ href: "mailto:" + data.email, label: data.email });
    if (data.instagram) {
      var ig = data.instagram;
      var url = /^https?:\/\//.test(ig) ? ig : "https://instagram.com/" + ig.replace(/^@/, "");
      links.push({ href: url, label: "Instagram" });
    }
    if (!links.length) {
      var p = el("p"); p.style.opacity = ".6";
      p.textContent = "Escribime para consultas y colaboraciones.";
      wrap.appendChild(p);
      return;
    }
    links.forEach(function (l) {
      var a = el("a");
      a.href = l.href;
      a.textContent = l.label;
      if (l.href.indexOf("http") === 0) { a.target = "_blank"; a.rel = "noopener"; }
      wrap.appendChild(a);
    });
  }

  /* ============================================================
     2. Lightbox
     ============================================================ */
  function openLightbox(i) {
    var lb = $("#lightbox");
    if (!lb || !FLAT.length) return;
    lbIndex = i;
    updateLightbox();
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    var lb = $("#lightbox");
    if (!lb) return;
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function step(dir) {
    if (!FLAT.length) return;
    lbIndex = (lbIndex + dir + FLAT.length) % FLAT.length;
    updateLightbox();
  }
  function updateLightbox() {
    var item = FLAT[lbIndex];
    if (!item) return;
    var img = $("#lbImg"), cap = $("#lbCap");
    if (img) { img.src = item.src; img.alt = item.titulo || "Foto"; }
    if (cap) cap.textContent = item.texto || item.titulo || "";
  }
  function initLightbox() {
    var close = $("#lbClose"), prev = $("#lbPrev"), next = $("#lbNext"), lb = $("#lightbox");
    if (close) close.addEventListener("click", closeLightbox);
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
    if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb || !lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });
  }

  /* ============================================================
     3. Nav (scroll state + mobile toggle)
     ============================================================ */
  function initNav() {
    var nav = $("#nav"), toggle = $("#navToggle"), links = $(".nav__links");
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (toggle && links) {
      var closeMenu = function () {
        nav.classList.remove("is-open");
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      };
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        nav.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      Array.prototype.forEach.call(links.querySelectorAll("a"), function (a) {
        a.addEventListener("click", closeMenu);
      });
    }
  }

  /* ============================================================
     4. Reveal on scroll (threshold bajo + red de seguridad)
     ============================================================ */
  var revealObserver = null;
  function observeReveals() {
    var items = document.querySelectorAll(".reveal:not(.is-in)");
    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(items, function (n) { n.classList.add("is-in"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); revealObserver.unobserve(en.target); }
        });
      }, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
    }
    Array.prototype.forEach.call(items, function (n) { revealObserver.observe(n); });
  }
  function revealSafetyNet() {
    // Si algo quedó oculto tras 6s, mostrarlo sí o sí.
    setTimeout(function () {
      Array.prototype.forEach.call(document.querySelectorAll(".reveal:not(.is-in)"), function (n) {
        n.classList.add("is-in");
      });
    }, 6000);
  }

  /* ============================================================
     Boot
     ============================================================ */
  function boot() {
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
    safe(initNav, "nav");
    safe(initLightbox, "lightbox");
    safe(observeReveals, "reveal");
    safe(revealSafetyNet, "reveal-safety");
    safe(loadContent, "content");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
