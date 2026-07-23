# Portafolio de Delfina — Puesta en marcha

Sitio estático (HTML/CSS/JS puro, sin build) con un **panel de carga visual**
(Decap CMS) para que Delfina agregue fotos, textos y secciones sin tocar código.

- **Público:** `index.html` + `styles.css` + `main.js`
- **Contenido:** `data/contenido.json` (lo edita el panel automáticamente)
- **Fotos:** `img/uploads/` (se suben desde el panel)
- **Panel:** `admin/` (Decap CMS)

Todo el contenido sale de `data/contenido.json`. Si el JSON no carga, la página
igual se lee (los textos base están en el HTML).

---

## Ver el sitio ya (gratis, sin panel) — GitHub Pages

Ya funciona en:

```
https://edy527.github.io/delfina/
```

(GitHub Pages ignora Netlify; sirve para previsualizar el diseño. El panel
`/admin` necesita Netlify, ver abajo.)

---

## Activar el panel de carga (Netlify) — recomendado

El panel usa **Netlify Identity + Git Gateway**: Delfina inicia sesión y sus
cambios se guardan solos en este repo. Es gratis.

### 1. Crear el sitio en Netlify
1. Entrá a <https://app.netlify.com> con tu cuenta de GitHub.
2. **Add new site → Import an existing project → GitHub**.
3. Elegí el repo `edy527/edy527.github.io`.
4. Netlify detecta el archivo `netlify.toml` (en la raíz) que publica solo la
   carpeta `delfina/`. Dejá todo como está y **Deploy**.
5. Tu sitio queda en algo como `https://<nombre>.netlify.app`.

### 2. Habilitar el acceso de Delfina
1. En el sitio de Netlify: **Site configuration → Identity → Enable Identity**.
2. En **Identity → Registration**, poné **Invite only** (solo por invitación).
3. En **Identity → Services → Git Gateway**, tocá **Enable Git Gateway**.
4. En **Identity → Invite users**, invitá el email de Delfina (y el tuyo).
5. A Delfina le llega un mail → crea su contraseña → entra a `/admin`.

> Importante: el panel `/admin` solo funciona sobre el dominio de Netlify
> (o el dominio propio conectado a Netlify), no sobre `edy527.github.io`.

### 3. Probar
- Entrá a `https://<nombre>.netlify.app/admin`, iniciá sesión, cambiá algo y
  **Publish now**. En 1-2 min se ve en el sitio.

---

## Dominio propio (cuando quieras)

1. Comprá el dominio (ej. Namecheap, Google Domains, etc.).
2. En Netlify: **Domain management → Add a domain** y seguí los pasos de DNS.
3. Netlify da HTTPS gratis (Let's Encrypt) automáticamente.

No hay que tocar nada del código: el sitio y el panel siguen funcionando igual.

---

## Notas técnicas

- **Rutas relativas** en todo el front-end para que funcione tanto en
  `edy527.github.io/delfina/` como en la raíz de Netlify.
- En `admin/config.yml`: `media_folder: delfina/img/uploads` (ruta en el repo)
  y `public_folder: img/uploads` (ruta relativa que se guarda en el JSON).
- Las imágenes actuales son **placeholders SVG** (`img/uploads/*.svg`) con el
  texto "FOTO DE EJEMPLO". Se reemplazan solas cuando Delfina sube las suyas.
- Cache-buster `?v=YYYYMMDD` en el CSS/JS del HTML: subilo si cambiás esos
  archivos y no ves los cambios.

## Estructura

```
delfina/
├── index.html            # sitio público
├── styles.css
├── main.js
├── data/contenido.json   # contenido (lo edita el panel)
├── img/uploads/          # fotos (las sube el panel)
├── admin/
│   ├── index.html        # panel Decap CMS
│   └── config.yml        # configuración del panel
├── GUIA-DELFINA.md       # manual para Delfina
└── LEEME-configuracion.md
netlify.toml              # (raíz del repo) publica /delfina en Netlify
```
