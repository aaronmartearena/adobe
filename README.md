# Adobe Ingeniería — Landing Page Institucional

Sitio web profesional para **Adobe Ingeniería**, empresa de construcción e ingeniería con base en Salta, Argentina.

---

## Estructura del proyecto

```
ADOBE/
│
├── index.html                  ← Página principal
├── 404.html                    ← Página de error personalizada
├── favicon.ico                 ← Favicon multi-size (16/32/48px)
├── favicon.svg                 ← Favicon vectorial (navegadores modernos)
├── apple-touch-icon.png        ← Ícono para iOS (180×180px)
├── site.webmanifest            ← Manifest PWA (instalar como app)
├── robots.txt                  ← Instrucciones para buscadores
├── sitemap.xml                 ← Mapa del sitio para Google
├── _headers                    ← Caché y seguridad para Netlify
├── .htaccess                   ← Caché, HTTPS y seguridad para Apache
│
├── css/
│   └── styles.css              ← Todos los estilos (655 líneas)
│
├── js/
│   └── main.js                 ← Interactividad + lazy load de videos
│
├── assets/
│   ├── images/
│   │   ├── og-image.jpg        ← Preview al compartir links (1200×630px)
│   │   ├── favicon-16x16.png   ← Ícono 16px para manifest
│   │   ├── favicon-32x32.png   ← Ícono 32px para manifest
│   │   ├── hero.jpg            ← Poster video hero
│   │   ├── about-obra.jpg      ← Poster sección empresa
│   │   ├── signature-estructura.jpg ← Poster servicio destacado
│   │   ├── obra-recursos.jpg   ← Poster obra pública
│   │   ├── obra-civil.jpg      ← Poster obra civil
│   │   └── obra-piscina.jpg    ← Poster obra privada
│   │
│   └── videos/
│       ├── hero.mp4            ← Hero: obra institucional, Salta
│       ├── about-obra.mp4      ← Sección empresa: obra en construcción
│       ├── signature-estructura.mp4 ← Servicio destacado: estructura metálica
│       ├── obra-recursos.mp4   ← Sec. Recursos Hídricos (obra pública)
│       ├── obra-civil.mp4      ← Movimiento de suelos + maquinaria
│       └── obra-piscina.mp4    ← Obra privada: piscina y exteriores
│
└── README.md                   ← Este archivo
```

---

## Cómo ver la web localmente (con videos)

> ⚠️ Doble clic en Chrome/Edge no funciona para videos (protocolo `file://`).
> Usá uno de estos métodos:

**Opción A — Python (sin instalar nada):**
```bash
cd ADOBE/
python3 -m http.server 8080
# Abrí http://localhost:8080 en el navegador
```

**Opción B — VS Code + Live Server:**
1. Instalá la extensión "Live Server".
2. Click derecho en `index.html` → "Open with Live Server".

---

## Cómo publicar en internet

### Netlify Drop (más rápido, gratis, 0 configuración)
1. Entrá a [app.netlify.com/drop](https://app.netlify.com/drop)
2. Arrastrá la carpeta `ADOBE/` completa.
3. URL pública al instante. Los `_headers` se aplican automáticamente.

### GitHub Pages (repo ADOBE)
1. Creá el repositorio `ADOBE` en github.com.
2. Subí todos los archivos con **Add file → Upload files**.
3. **Settings → Pages → Source: main / root → Save.**
4. URL: `https://TUUSUARIO.github.io/ADOBE/`
   > Nota: GitHub Pages no aplica `.htaccess`. Usá Netlify para caché y HTTPS automático.

### Hosting con Apache (cPanel, Hostinger, SiteGround, etc.)
1. Subí todo el contenido al directorio `public_html/` por FTP o File Manager.
2. El `.htaccess` activa HTTPS, caché y la página 404 automáticamente.

---

## Antes de publicar: checklist

### ✅ Ya está listo
- [x] HTML semántico con SEO local (schema.org `GeneralContractor`)
- [x] Meta Open Graph completas (og:image, og:url, og:title, og:description)
- [x] Twitter card para preview en redes
- [x] Favicon multi-formato (ico + svg + png)
- [x] Apple touch icon para iOS
- [x] site.webmanifest (instalable como app)
- [x] robots.txt
- [x] sitemap.xml
- [x] 404.html personalizada
- [x] _headers (Netlify: caché + seguridad)
- [x] .htaccess (Apache: HTTPS + caché + seguridad)
- [x] Canonical URL
- [x] 6 videos reales de obra, editados y optimizados
- [x] Lazy loading de 5/6 videos
- [x] Responsive (980px y 620px)
- [x] prefers-reduced-motion

### ⚠️ Verificar con el cliente antes de publicar
- [ ] Actualizar dominio real en `sitemap.xml`, `robots.txt` y meta `og:url` / `canonical`
- [ ] Confirmar años de trayectoria (figura "15 años" según material de la empresa)
- [ ] Confirmar autorización para mostrar las 3 obras con nombre
- [ ] Reemplazar logo tipográfico "A" por el logo vectorial real cuando esté disponible
- [ ] Instalar Google Analytics 4 (agregar snippet antes de `</head>`)
- [ ] Crear perfil en Google Business Profile para SEO local en Salta

### 📌 Post-lanzamiento (opcional)
- [ ] Verificar propiedad en Google Search Console
- [ ] Agregar banner de cookies si se activa Analytics
- [ ] Agregar página privacidad.html si lo requiere el cliente
- [ ] Crear og-image con foto real de obra cuando haya material aprobado

---

## Datos cargados en la web

| Campo | Valor |
|---|---|
| Teléfono / WhatsApp | +54 387 573-9888 |
| Email | adobeinge.dr@gmail.com |
| Instagram | @adobe.ingenieria |
| Facebook | Adobe Ingeniería |
| LinkedIn | Daniel Rodríguez Zigaran |
| Color de marca | Naranja #FF6600 |
| Dominio sugerido | adobeingenieria.com.ar *(confirmar disponibilidad)* |

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| HTML | HTML5 semántico, lang="es-AR", schema.org |
| CSS | CSS3 puro, design tokens, sin frameworks |
| JS | Vanilla ES6+, sin dependencias |
| Tipografías | Fraunces + Inter via Google Fonts |
| Videos | H.264/MP4, lazy load con IntersectionObserver |
| Hosting recomendado | Netlify (gratis) o Apache compartido |
