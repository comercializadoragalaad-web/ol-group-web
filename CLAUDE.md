# OL Group — Blueprint

> Generado por The Architect · 2026-05-25
> Archetype: Marketing Site / Landing Page

---

## 1. Project Overview

### Visión

OL Group es una firma guatemalteca de servicios financieros que ofrece Contabilidad, Auditoría, Asesoría Financiera, Formulación de Proyectos y Gestiones Aduaneras. El sitio es una landing page profesional de una sola página cuyo único objetivo es capturar leads y convertir visitantes en clientes — especialmente empresarios y pymes guatemaltecas que necesitan orden financiero.

La propuesta estrella es la primera consulta gratuita + tip financiero sin costo. Tres canales de contacto funcionan simultáneamente: formulario de agendamiento, botón flotante de llamada directa y botón flotante de WhatsApp. El sitio se presenta en español (default) con toggle a inglés.

### Objetivos

- Capturar leads a través del formulario de agendamiento (nombre, empresa, teléfono, modalidad)
- Reducir fricción de contacto con botones flotantes siempre visibles
- Transmitir credibilidad y autoridad financiera desde el primer segundo
- Cargarse en menos de 2 segundos en redes móviles guatemaltecas
- Posicionarse en búsquedas locales de servicios financieros en Guatemala

### Métricas de éxito

- Tasa de conversión de formulario ≥ 3%
- Score Lighthouse Performance ≥ 95
- Tasa de rebote ≤ 60%
- Leads por mes capturados y entregados a info@olgroup.com.gt

---

## 2. Tech Stack

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Framework | **Astro 5** | Genera HTML estático puro — cero JS de framework en el cliente. El más rápido para landing pages. Score Lighthouse 100 por defecto. |
| Lenguaje | **TypeScript** | Seguridad de tipos en i18n, props de componentes y helpers. |
| Estilos | **Tailwind CSS v4** | Velocidad de desarrollo, purga automática, compatible con Astro out-of-the-box. |
| Formularios | **Netlify Forms** | Nativo en Netlify — sin backend, sin API keys. Los leads llegan a info@olgroup.com.gt automáticamente. Gratis hasta 100 envíos/mes. |
| i18n | **Astro i18n (built-in)** | Routing ES/EN sin dependencias externas. `/` sirve español; `/en/` sirve inglés. |
| Fuentes | **Auto-hospedadas** | Sin dependencia de Google Fonts — evita flash y mejora privacidad/velocidad. |
| Hosting | **Netlify** | Requerido por el cliente. CI/CD automático desde Git. Preview deploys incluidos. |
| Gestor de paquetes | **pnpm** | Más rápido que npm, lockfile reproducible. |

---

## 3. Directory Structure

```
ol-group/
  src/
    pages/
      index.astro                   # Landing page en español (idioma default)
      en/
        index.astro                 # Landing page en inglés
    components/
      layout/
        BaseLayout.astro            # Wrapper HTML: <head>, fonts, meta, OG tags
        Header.astro                # Navbar: logo + navegación + toggle ES/EN
        Footer.astro                # Footer: links, datos de contacto, legal
        FloatingButtons.astro       # Botones flotantes WhatsApp + llamada (siempre visibles)
      sections/
        Hero.astro                  # Hero: headline, propuesta de valor, CTA, imagen Profe Balam
        Servicios.astro             # 5 cards de servicios
        PorQueElegirnos.astro       # Diferenciadores de OL Group
        Testimonios.astro           # Testimonios de clientes
        Contacto.astro              # Formulario de agendamiento (Netlify Forms)
      ui/
        Button.astro                # Componente de botón con variantes (primary, outline, ghost)
        ServiceCard.astro           # Card individual de servicio
        TestimonialCard.astro       # Card individual de testimonio
        SectionHeading.astro        # Título de sección con línea decorativa dorada
    i18n/
      es.ts                         # Todos los textos del sitio en español
      en.ts                         # Todos los textos del sitio en inglés
      index.ts                      # Helpers: getLangFromUrl() + useTranslations()
    styles/
      globals.css                   # Tailwind base + CSS custom properties del design system
  public/
    fonts/
      PlayfairDisplay-Regular.woff2
      PlayfairDisplay-Bold.woff2
      Inter-Regular.woff2
      Inter-Medium.woff2
      Inter-SemiBold.woff2
    images/
      logo.svg                      # Logo OL Group (proporcionado por cliente)
      logo-white.svg                # Versión blanca del logo para fondos oscuros
      profe-balam/
        hero.webp                   # Foto principal del personaje (hero section)
        about.webp                  # Foto secundaria (por qué elegirnos)
      og-image.png                  # 1200×630px OG image para redes sociales
    favicon.svg
  netlify.toml                      # Config de build + redirecciones + headers
  astro.config.mjs                  # Config Astro: i18n, integrations, output
  tailwind.config.mjs               # Config Tailwind: tokens de color, fuentes
  tsconfig.json
  package.json
  .gitignore
```

---

## 4. Data Model

No aplica — sitio estático. No hay base de datos.

Los leads del formulario son procesados por Netlify Forms y entregados vía email a `info@olgroup.com.gt`. Los campos del formulario son:

| Campo | Tipo HTML | Validación |
|-------|-----------|-----------|
| `nombre` | `text` | Requerido, mínimo 2 caracteres |
| `empresa` | `text` | Requerido |
| `telefono` | `tel` | Requerido, formato guatemalteco |
| `modalidad` | `select` | Requerido, opciones: Llamada / WhatsApp / Presencial |
| `bot-field` | `text` hidden | Honeypot antispam — debe estar vacío |

---

## 5. API Design

No aplica — no hay backend propio. El formulario usa Netlify Forms con atributo `data-netlify="true"`. Netlify intercepta el POST durante el build e inyecta su propio endpoint.

**Configuración de notificaciones de email en Netlify:**
1. Dashboard → Site → Forms → `contacto`
2. Settings → Form notifications → Add notification → Email
3. Email: `info@olgroup.com.gt`
4. Notificación inmediata por cada envío

---

## 6. Frontend Architecture

### Páginas / Rutas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `pages/index.astro` | Landing page completa en español |
| `/en/` | `pages/en/index.astro` | Landing page completa en inglés |

Ambas páginas son idénticas en estructura. La diferencia es el objeto de traducciones que se pasa a los componentes.

### Flujo de i18n

```typescript
// src/i18n/index.ts
export function getLangFromUrl(url: URL): 'es' | 'en' {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'es';
}

export function useTranslations(lang: 'es' | 'en') {
  return function t(key: string): string {
    return translations[lang][key] ?? translations['es'][key] ?? key;
  };
}
```

```astro
<!-- En pages/index.astro -->
---
import { getLangFromUrl, useTranslations } from '../i18n';
const lang = getLangFromUrl(Astro.url); // 'es'
const t = useTranslations(lang);
---
<Header lang={lang} />
<Hero t={t} lang={lang} />
```

### Jerarquía de componentes

```
BaseLayout.astro
└── <html lang="es|en">
    ├── <head> — meta, OG, fonts, globals.css
    └── <body>
        ├── Header.astro
        │   ├── Logo (link a /)
        │   ├── Nav links (anclas a secciones)
        │   └── LangToggle (ES ↔ EN)
        ├── main
        │   ├── Hero.astro
        │   │   ├── Titular + subtítulo
        │   │   ├── CTA Button (→ #contacto)
        │   │   └── <img> Profe Balam hero
        │   ├── Servicios.astro
        │   │   └── ServiceCard.astro × 5
        │   ├── PorQueElegirnos.astro
        │   │   └── íconos + párrafos de diferenciadores
        │   ├── Testimonios.astro
        │   │   └── TestimonialCard.astro × n
        │   └── Contacto.astro
        │       └── <form data-netlify="true">
        ├── Footer.astro
        └── FloatingButtons.astro
            ├── WhatsApp FAB
            └── Llamada FAB
```

### Estado y interactividad

El sitio es 100% estático. No hay estado global ni client-side hydration, excepto:

- **Toggle de menú móvil** — inline `<script>` de 10 líneas en `Header.astro`
- **Animaciones de entrada** — CSS `@keyframes` + Intersection Observer (script inline en `globals.css`)
- **Formulario** — submit nativo HTML5 (sin JS), manejado por Netlify

---

## 7. Design System

### Colores

| Token CSS | Hex | Uso |
|-----------|-----|-----|
| `--color-black` | `#0A0A0A` | Fondo hero, navbar, textos sobre crema |
| `--color-gold` | `#C9A027` | CTAs primarios, acentos, separadores, hover states, bordes decorativos |
| `--color-gold-light` | `#DDB94A` | Hover state de botones dorados |
| `--color-cream` | `#FAF6EE` | Fondo de secciones alternas, texto sobre negro |
| `--color-carbon` | `#1C1C1C` | Cards, footer, superficies oscuras secundarias |
| `--color-carbon-light` | `#2A2A2A` | Hover state de cards oscuras |
| `--color-text-muted` | `#9B9080` | Texto secundario, subtítulos sobre crema |
| `--color-success` | `#4CAF50` | Estado de formulario enviado exitosamente |
| `--color-error` | `#E53E3E` | Estado de error en formulario |

```css
/* src/styles/globals.css */
@layer base {
  :root {
    --color-black:        #0A0A0A;
    --color-gold:         #C9A027;
    --color-gold-light:   #DDB94A;
    --color-cream:        #FAF6EE;
    --color-carbon:       #1C1C1C;
    --color-carbon-light: #2A2A2A;
    --color-text-muted:   #9B9080;
    --color-success:      #4CAF50;
    --color-error:        #E53E3E;
  }
}
```

### Tipografía

| Rol | Fuente | Pesos | Uso |
|-----|--------|-------|-----|
| Headings | **Playfair Display** | 400, 700 | H1, H2, H3 — transmite elegancia financiera |
| Body | **Inter** | 400, 500, 600 | Párrafos, labels, botones, nav |

```css
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-Regular.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/PlayfairDisplay-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
/* Repetir para Inter Regular, Medium, SemiBold */
```

Escala tipográfica:
- `text-5xl` / `text-6xl` — H1 hero (Playfair Display 700)
- `text-3xl` / `text-4xl` — H2 de sección (Playfair Display 700)
- `text-xl` / `text-2xl` — H3 de card (Playfair Display 400)
- `text-base` — Cuerpo (Inter 400)
- `text-sm` — Labels, captions (Inter 500)

### Espaciado y Layout

- Espaciado base: 4px (escala Tailwind: 4, 8, 12, 16, 24, 32, 48, 64, 96)
- Max-width contenido: `1280px` (clase `max-w-7xl`)
- Padding horizontal: `px-4` (móvil) → `px-6` (tablet) → `px-8` (desktop)
- Padding vertical de secciones: `py-20` desktop / `py-14` móvil
- Border radius: `rounded-lg` (8px) para cards; `rounded-full` para FABs
- Sombras: `shadow-lg` para cards sobre fondos claros; sin sombras sobre fondos oscuros

### Estilo de componentes

- **Aesthetic**: Lujo sobrio — oscuro dominante con acentos dorados. Sin gradientes de múltiples colores.
- **Cards**: Fondo `--color-carbon`, borde `1px solid #2A2A2A`, hover con borde dorado
- **Botón primary**: Fondo `--color-gold`, texto negro, hover `--color-gold-light`, sin border-radius excesivo (`rounded-md`)
- **Botón outline**: Borde dorado, texto dorado, hover fondo dorado transparente (20%)
- **FABs**: Círculo 56px, sombra flotante, posición fija bottom-right, apilados verticalmente
- **Separadores de sección**: Línea horizontal `1px` dorada, 60px ancho, centrada bajo el título
- **Animaciones**: `fade-in-up` suave (200ms) al entrar en viewport — sin animaciones agresivas

---

## 8. Autenticación y Autorización

No aplica — sitio público, sin área privada ni usuarios registrados.

---

## 9. Build Order

**CRÍTICO: Seguir este orden exacto. Cada paso depende del anterior.**

---

**Paso 1: Scaffolding del proyecto**

```bash
pnpm create astro@latest ol-group -- --template minimal --typescript strict --no-install
cd ol-group
pnpm install
pnpm add @astrojs/tailwind tailwindcss
pnpm add -D @types/node
```

Inicializar Git:
```bash
git init
echo "node_modules\n.env\n.env.local\ndist\n.netlify" > .gitignore
git add . && git commit -m "chore: scaffolding inicial"
```

---

**Paso 2: Configuración de Astro + Tailwind + i18n**

Crear `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,  // "/" en vez de "/es/"
    },
  },
  site: 'https://olgroup.com.gt',
});
```

Crear `tailwind.config.mjs`:
```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        black:    '#0A0A0A',
        gold:     '#C9A027',
        'gold-light': '#DDB94A',
        cream:    '#FAF6EE',
        carbon:   '#1C1C1C',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

**Paso 3: Design system — fuentes y CSS base**

1. Descargar fuentes `Playfair Display` y `Inter` en formato `.woff2` desde Google Fonts (usar la herramienta `google-webfonts-helper.herokuapp.com`) y colocarlas en `public/fonts/`.

2. Crear `src/styles/globals.css` con `@font-face` declarations, CSS custom properties de color, y reset base.

3. Verificar que `tailwind.config.mjs` referencia las fuentes correctamente.

---

**Paso 4: BaseLayout + Header + Footer**

Crear en orden:
1. `src/components/layout/BaseLayout.astro` — wrapper HTML con `<head>` completo:
   - `<meta charset>`, `<meta viewport>`, `<title>`, `<meta description>`
   - `<meta og:title>`, `<meta og:image>`, `<meta og:url>`, `<meta og:type>`
   - `<link rel="canonical">`
   - `<link rel="icon">`
   - Import de `globals.css`
   - Props: `title`, `description`, `lang`, `ogImage?`

2. `src/components/layout/Header.astro` — navbar responsive:
   - Logo OL Group (link a `/` o `/en/`)
   - Links de navegación: `#servicios`, `#por-que`, `#testimonios`, `#contacto`
   - Toggle de idioma: chip `ES | EN` que redirige entre `/` y `/en/`
   - Menú hamburguesa para móvil con script inline mínimo

3. `src/components/layout/Footer.astro`:
   - Logo
   - Servicios listados
   - Contacto: email, teléfono, WhatsApp
   - Copyright: `© 2024 OL Group · Guatemala`
   - Nota legal mínima

---

**Paso 5: Sistema de traducciones**

Crear `src/i18n/es.ts` con TODOS los textos del sitio en español:
```typescript
export const es = {
  // Nav
  nav_servicios: 'Servicios',
  nav_por_que: 'Por qué elegirnos',
  nav_testimonios: 'Testimonios',
  nav_contacto: 'Contactar',
  // Hero
  hero_headline: 'Tu empresa merece finanzas en orden',
  hero_subheadline: 'Contabilidad, auditoría y asesoría financiera para empresarios guatemaltecos que quieren crecer sin sorpresas.',
  hero_cta_primary: 'Agenda tu consulta gratuita',
  hero_cta_badge: 'Primera consulta gratis + tip financiero sin costo',
  // Servicios
  servicios_heading: 'Nuestros Servicios',
  servicios_contabilidad_titulo: 'Contabilidad',
  servicios_contabilidad_desc: 'Registros exactos, declaraciones en tiempo y libros contables al día para que puedas tomar decisiones con información real.',
  servicios_auditoria_titulo: 'Auditoría',
  servicios_auditoria_desc: 'Revisión independiente de tus estados financieros para detectar riesgos, cumplir con SAT y generar confianza ante socios e inversionistas.',
  servicios_asesoria_titulo: 'Asesoría Financiera',
  servicios_asesoria_desc: 'Análisis de flujo de caja, planeación financiera y estrategias de rentabilidad adaptadas a la realidad guatemalteca.',
  servicios_formulacion_titulo: 'Formulación de Proyectos',
  servicios_formulacion_desc: 'Planes de negocio y proyectos de inversión con estructura financiera sólida para acceder a financiamiento o presentar ante socios.',
  servicios_aduanas_titulo: 'Gestiones Aduaneras',
  servicios_aduanas_desc: 'Trámites de importación y exportación, clasificación arancelaria y cumplimiento con regulaciones del SAT y la aduana guatemalteca.',
  // Por qué elegirnos
  porque_heading: 'Por qué elegir OL Group',
  porque_1_titulo: 'Expertos locales',
  porque_1_desc: 'Conocemos la legislación fiscal y aduanera guatemalteca. Sin sorpresas, sin traducciones de modelos extranjeros.',
  porque_2_titulo: 'Consulta inicial gratuita',
  porque_2_desc: 'Tu primera sesión es sin costo. Saldrás con al menos un tip financiero accionable, sin compromiso.',
  porque_3_titulo: 'Respuesta en 24 horas',
  porque_3_desc: 'Sabemos que los negocios no esperan. Respondemos dentro de un día hábil, siempre.',
  porque_4_titulo: 'Trato directo',
  porque_4_desc: 'Hablas directamente con el profesional a cargo de tu caso. Sin intermediarios ni call centers.',
  // Testimonios
  testimonios_heading: 'Lo que dicen nuestros clientes',
  // Contacto
  contacto_heading: 'Agenda tu consulta gratuita',
  contacto_subheading: 'Cuéntanos sobre tu empresa. Te contactamos en menos de 24 horas.',
  contacto_nombre: 'Nombre completo',
  contacto_empresa: 'Empresa',
  contacto_telefono: 'Teléfono',
  contacto_modalidad: 'Modalidad preferida',
  contacto_modalidad_llamada: 'Llamada telefónica',
  contacto_modalidad_whatsapp: 'WhatsApp',
  contacto_modalidad_presencial: 'Reunión presencial',
  contacto_submit: 'Solicitar consulta gratuita',
  contacto_success: '¡Listo! Te contactamos pronto.',
  contacto_badge: 'Sin costo · Sin compromiso',
  // Footer
  footer_copyright: '© 2024 OL Group · Guatemala',
  footer_legal: 'Todos los derechos reservados.',
};
```

Crear `src/i18n/en.ts` con las mismas claves en inglés.

Crear `src/i18n/index.ts` con helpers `getLangFromUrl` y `useTranslations`.

---

**Paso 6: Hero Section**

Crear `src/components/sections/Hero.astro`:

Layout: dos columnas en desktop (texto izquierda, imagen derecha), una columna en móvil.

- **Fondo**: `bg-black` con textura sutil (opcional: grid de puntos con CSS)
- **Badge superior**: pequeño chip dorado con el texto de la propuesta gratuita
- **H1**: Playfair Display, `text-5xl md:text-6xl`, color `--color-cream`
- **Subtítulo**: Inter, `text-lg md:text-xl`, color muted cream
- **CTA primario**: `Button` variant primary (dorado, ancla a `#contacto`)
- **Imagen**: `<Image>` de Astro con `src="/images/profe-balam/hero.webp"`, `loading="eager"`, `fetchpriority="high"`
- **Decoración**: línea diagonal dorada o elemento abstracto geométrico

---

**Paso 7: Sección Servicios**

Crear `src/components/sections/Servicios.astro` + `src/components/ui/ServiceCard.astro`.

- **Fondo**: `bg-cream` para contrastar con el hero negro
- **Heading**: `SectionHeading` con separador dorado
- **Grid**: 3 columnas desktop / 2 tablet / 1 móvil (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`)
- Los 5 servicios generan 5 cards. La última card se centra sola en la fila de desktop.

`ServiceCard.astro` recibe: `icon`, `titulo`, `descripcion`.

Íconos recomendados (SVG inline o Lucide):
- Contabilidad → `calculator` o `book-open`
- Auditoría → `shield-check`
- Asesoría Financiera → `trending-up`
- Formulación de Proyectos → `clipboard-list`
- Gestiones Aduaneras → `package`

Style de card: fondo `--color-carbon`, borde `1px solid #2A2A2A`, ícono dorado, título Playfair, hover con borde dorado y elevación sutil.

---

**Paso 8: Sección Por qué elegirnos**

Crear `src/components/sections/PorQueElegirnos.astro`.

- **Fondo**: `bg-black` (alternancia negro/crema/negro)
- **Layout**: 2 columnas desktop — texto + 4 features a la izquierda, imagen Profe Balam a la derecha
- **Features**: 4 items con ícono dorado + título Inter bold + descripción Inter regular
- **Imagen**: `profe-balam/about.webp`

---

**Paso 9: Sección Testimonios**

Crear `src/components/sections/Testimonios.astro` + `src/components/ui/TestimonialCard.astro`.

- **Fondo**: `bg-cream`
- **Grid**: 3 columnas desktop / 1 móvil
- **Datos de testimonios**: hardcodeados en el componente (o en el archivo i18n)
- `TestimonialCard` recibe: `nombre`, `empresa`, `cargo`, `texto`, `avatar?`

Testimonios placeholder para comenzar (el cliente debe proveer los reales):
```
1. "OL Group nos ordenó la contabilidad en 30 días. Ahora sé exactamente cuánto gana mi empresa." — Carlos M., Dueño de distribuidora, Guatemala City
2. "La asesoría para nuestra importación fue clave. Ahorramos en aranceles y no tuvimos ningún problema con aduana." — Ana L., Directora, PYME manufactura
3. "Por fin tengo un contador que me habla en términos que entiendo. Recomendado 100%." — Roberto K., Emprendedor, Zona 10
```

---

**Paso 10: Formulario de Contacto (Netlify Forms)**

Crear `src/components/sections/Contacto.astro`.

- **Fondo**: `bg-black`
- **Layout**: formulario centrado, max-width 640px

HTML del formulario:
```html
<form
  name="contacto-ol-group"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  action="/gracias"
>
  <input type="hidden" name="form-name" value="contacto-ol-group" />
  <p class="hidden">
    <label>No llenar: <input name="bot-field" /></label>
  </p>

  <div>
    <label for="nombre">Nombre completo *</label>
    <input type="text" id="nombre" name="nombre" required minlength="2" />
  </div>

  <div>
    <label for="empresa">Empresa *</label>
    <input type="text" id="empresa" name="empresa" required />
  </div>

  <div>
    <label for="telefono">Teléfono *</label>
    <input type="tel" id="telefono" name="telefono" required
           placeholder="5555-5555" />
  </div>

  <div>
    <label for="modalidad">Modalidad preferida *</label>
    <select id="modalidad" name="modalidad" required>
      <option value="">Seleccionar...</option>
      <option value="llamada">Llamada telefónica</option>
      <option value="whatsapp">WhatsApp</option>
      <option value="presencial">Reunión presencial</option>
    </select>
  </div>

  <button type="submit">Solicitar consulta gratuita</button>
</form>
```

Crear `src/pages/gracias.astro` — página de confirmación post-envío con mensaje de éxito y botón de regreso.

**Estilos del form**: inputs con fondo `#1C1C1C`, borde `1px solid #2A2A2A`, focus con borde dorado, label crema, texto crema.

---

**Paso 11: Botones flotantes (WhatsApp + Llamada)**

Crear `src/components/layout/FloatingButtons.astro`.

Posición: `fixed bottom-6 right-6 z-50`, flex column gap-3.

```html
<!-- WhatsApp -->
<a href="https://wa.me/50277270862?text=Hola%2C%20me%20interesa%20una%20consulta%20gratuita"
   target="_blank" rel="noopener noreferrer"
   aria-label="Contactar por WhatsApp"
   class="fab fab-whatsapp">
  <!-- SVG WhatsApp icon -->
</a>

<!-- Llamada -->
<a href="tel:+50245354755"
   aria-label="Llamar a OL Group"
   class="fab fab-phone">
  <!-- SVG Phone icon -->
</a>
```

Estilos FAB:
- Tamaño: `w-14 h-14` (56px)
- Border radius: `rounded-full`
- WhatsApp: fondo `#25D366`
- Llamada: fondo `--color-gold`
- Ambos: `shadow-lg`, ícono blanco, hover scale 110%
- Tooltip opcional al hover: "Escríbenos" / "Llámanos"

Incluir `FloatingButtons` en `BaseLayout.astro` para que aparezca en todas las páginas.

---

**Paso 12: SEO — Metadata, Sitemap, OG Image**

1. Instalar sitemap:
```bash
pnpm add @astrojs/sitemap
```

Agregar a `astro.config.mjs`:
```javascript
import sitemap from '@astrojs/sitemap';
// integrations: [tailwind(), sitemap()]
```

2. En `BaseLayout.astro`, asegurarse de incluir:
```html
<title>{title} | OL Group</title>
<meta name="description" content={description} />
<link rel="canonical" href={Astro.url} />
<meta property="og:title" content={`${title} | OL Group`} />
<meta property="og:description" content={description} />
<meta property="og:image" content="/og-image.png" />
<meta property="og:url" content={Astro.url} />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

3. Crear `public/og-image.png` (1200×630px) — imagen con logo OL Group y tagline sobre fondo negro con acento dorado. **Usar `/frontend-design` para generar el HTML/CSS de esta imagen.**

4. JSON-LD structured data de tipo `LocalBusiness`:
```json
{
  "@context": "https://schema.org",
  "@type": "AccountingService",
  "name": "OL Group",
  "url": "https://olgroup.com.gt",
  "telephone": "+50245354755",
  "email": "info@olgroup.com.gt",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GT"
  },
  "areaServed": "Guatemala",
  "priceRange": "$$"
}
```

---

**Paso 13: Configuración de Netlify**

Crear `netlify.toml`:
```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

**Deploy en Netlify:**
1. Conectar repositorio Git en Netlify Dashboard
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Dominio personalizado: `olgroup.com.gt`
5. DNS: apuntar registros A/CNAME al CDN de Netlify
6. SSL: automático via Let's Encrypt
7. Form notifications: Dashboard → Forms → contacto-ol-group → Notifications → Email → `info@olgroup.com.gt`

---

**Paso 14: Testing E2E (smoke test)**

```bash
pnpm add -D @playwright/test
npx playwright install --with-deps chromium
```

Crear `tests/smoke.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test('home ES carga correctamente', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/OL Group/);
  await expect(page.locator('section#servicios')).toBeVisible();
  await expect(page.locator('form[name="contacto-ol-group"]')).toBeVisible();
  await expect(page.locator('a[href*="wa.me"]')).toBeVisible();
});

test('home EN carga correctamente', async ({ page }) => {
  await page.goto('/en/');
  await expect(page).toHaveTitle(/OL Group/);
});

test('formulario tiene campos requeridos', async ({ page }) => {
  await page.goto('/');
  await page.click('button[type="submit"]');
  const nombre = page.locator('input[name="nombre"]');
  await expect(nombre).toBeFocused();
});

test('botón WhatsApp tiene href correcto', async ({ page }) => {
  await page.goto('/');
  const wa = page.locator('a[href*="wa.me/50277270862"]');
  await expect(wa).toBeVisible();
});
```

---

**Paso 15: Audit de Performance y Lanzamiento**

1. Correr `pnpm build && pnpm preview`
2. Auditar con Lighthouse CLI:
```bash
npx lighthouse http://localhost:4321 --output html --output-path ./lighthouse-report.html
```
3. Metas: Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95
4. Optimizar imágenes de Profe Balam: convertir a WebP, máximo 400KB para hero
5. Verificar que todos los textos del formulario están disponibles en ambos idiomas
6. Push a main → Netlify hace deploy automático
7. Verificar dominio `olgroup.com.gt` apunta correctamente
8. Enviar formulario de prueba y confirmar que llega a `info@olgroup.com.gt`
9. Ejecutar `/seo-audit` para auditoría técnica completa

---

## 10. Environment Setup

### Prerequisitos

- Node.js 20+
- pnpm (`npm install -g pnpm`)
- Cuenta en Netlify (gratis)
- Repositorio Git (GitHub, GitLab, o Bitbucket)

### Variables de entorno

No se requieren variables de entorno para este proyecto. Netlify Forms no necesita API keys — el procesamiento ocurre en infraestructura de Netlify.

**Si en el futuro se agrega un servicio de email transaccional (Resend), agregar:**

| Variable | Descripción | Dónde obtener |
|----------|-------------|---------------|
| `RESEND_API_KEY` | API key de Resend para email | resend.com → Dashboard → API Keys |

### Comandos de bootstrap

```bash
# 1. Clonar repo
git clone <repo-url>
cd ol-group

# 2. Instalar dependencias
pnpm install

# 3. Iniciar desarrollo
pnpm dev
# → http://localhost:4321

# 4. Build de producción
pnpm build

# 5. Preview del build
pnpm preview
```

---

## 11. Dependencies

### Core

| Paquete | Propósito |
|---------|-----------|
| `astro` | Framework principal — generación estática |
| `@astrojs/tailwind` | Integración Tailwind con Astro |
| `tailwindcss` | Framework de estilos utilitarios |
| `@astrojs/sitemap` | Generación automática de sitemap.xml |

### Dev

| Paquete | Propósito |
|---------|-----------|
| `@playwright/test` | E2E smoke tests |
| `typescript` | Tipos — incluido con Astro |

### Sin dependencias de runtime adicionales

El sitio es HTML+CSS puro en producción. Cero librerías de JavaScript en el cliente.

---

## 12. Deployment Strategy

### Hosting: Netlify

- **Plan**: Starter (gratis) — suficiente para este sitio
- **Build**: automático al hacer push a rama `main`
- **Preview deploys**: automático en cada Pull Request
- **CDN**: global, incluido en Netlify

### CI/CD

```
git push origin main
     ↓
Netlify detecta push
     ↓
Ejecuta: pnpm build
     ↓
Publica: dist/
     ↓
Deploy en CDN global (~30 segundos)
```

### Dominio y DNS

1. En Netlify Dashboard: Domain settings → Add custom domain → `olgroup.com.gt`
2. En el registrador del dominio (probablemente nic.gt o GoDaddy):
   - Registro A: `@` → IP de Netlify (ver en dashboard)
   - Registro CNAME: `www` → `<site-name>.netlify.app`
3. SSL: Netlify provisiona Let's Encrypt automáticamente (5-10 minutos post-DNS)

### Ambientes

| Ambiente | URL | Cuándo se activa |
|----------|-----|-----------------|
| Development | `localhost:4321` | `pnpm dev` local |
| Preview | `<hash>--olgroup.netlify.app` | Cada PR automáticamente |
| Production | `olgroup.com.gt` | Push a `main` |

---

## 13. Testing Strategy

### E2E (Playwright)

Framework: Playwright

Tests críticos a cubrir (ver Paso 14):
1. Página ES carga y muestra secciones clave
2. Página EN carga con textos en inglés
3. Formulario valida campos requeridos
4. Botón WhatsApp apunta al número correcto
5. Botón de llamada tiene `href="tel:+50245354755"`
6. Página `/gracias` es accesible post-submit

Correr tests:
```bash
pnpm exec playwright test
```

### Manual (checklist pre-launch)

- [ ] Formulario: envío real llega a `info@olgroup.com.gt`
- [ ] Toggle de idioma funciona en ambas direcciones
- [ ] Todos los links de navegación llevan a la sección correcta
- [ ] Botón WhatsApp abre WhatsApp con mensaje pre-llenado
- [ ] Sitio es completamente funcional en móvil (iPhone Safari + Android Chrome)
- [ ] Imágenes de Profe Balam cargan correctamente
- [ ] No hay textos en inglés visibles en la versión española y viceversa

---

## 14. Skills a usar durante el Build

| Skill | En qué paso | Para qué |
|-------|-------------|----------|
| `/frontend-design` | Pasos 6, 7, 8, 9, 10 | Generar cada sección con diseño producción-grade: Hero, Servicios, Por qué, Testimonios, Formulario |
| `/frontend-design` | Paso 12 | Diseñar la OG image (1200×630) con logo + tagline sobre fondo negro |
| `/seo-audit` | Paso 15 | Auditoría técnica SEO completa antes del lanzamiento |
| `/playwright-cli` | Paso 14 | Si los smoke tests necesitan refinamiento o depuración |
| `/web-design-guidelines` | Paso 15 | Auditar UI contra reglas de accesibilidad y diseño web |

---

## 15. CLAUDE.md para el Proyecto Target

```markdown
# OL Group

Landing page profesional para firma guatemalteca de servicios financieros. Objetivo: capturar leads y convertir visitantes en clientes.

## Commands

- `pnpm dev` — Servidor de desarrollo en localhost:4321
- `pnpm build` — Build de producción (genera dist/)
- `pnpm preview` — Preview del build local
- `pnpm exec playwright test` — E2E smoke tests

## Tech Stack

Astro 5 + TypeScript + Tailwind CSS v4 + Netlify Forms + Astro i18n built-in + Netlify hosting

## Architecture

### Directory Structure
- `src/pages/` — Rutas: `index.astro` (ES) + `en/index.astro` (EN)
- `src/components/layout/` — BaseLayout, Header, Footer, FloatingButtons
- `src/components/sections/` — Hero, Servicios, PorQueElegirnos, Testimonios, Contacto
- `src/components/ui/` — Button, ServiceCard, TestimonialCard, SectionHeading
- `src/i18n/` — es.ts, en.ts, index.ts (helpers getLangFromUrl + useTranslations)
- `src/styles/globals.css` — CSS custom properties + Tailwind base
- `public/fonts/` — Playfair Display + Inter auto-hospedadas (woff2)
- `public/images/` — logo.svg, profe-balam/*.webp, og-image.png

### Data Flow
No hay backend ni base de datos. El formulario usa `data-netlify="true"` — Netlify intercepta el POST y envía email a info@olgroup.com.gt. Las traducciones fluyen de `i18n/es.ts` o `en.ts` → helper `useTranslations` → prop `t` → componentes de sección.

### Key Patterns
- Todo componente recibe la función `t` (translator) como prop — no importar traducciones directamente
- `getLangFromUrl(Astro.url)` determina el idioma en cada página
- Cero JS de framework en cliente — scripts inline solo para menú móvil
- Imágenes siempre via `<Image>` de Astro para optimización automática
- `FloatingButtons.astro` incluido en `BaseLayout` — aparece en todas las páginas

## Design System

### Colores
- Negro: `#0A0A0A` — fondos oscuros (hero, contacto, footer)
- Dorado: `#C9A027` — CTAs, íconos, acentos, bordes hover
- Dorado claro: `#DDB94A` — hover state de elementos dorados
- Crema: `#FAF6EE` — fondos claros (servicios, testimonios), texto sobre negro
- Carbón: `#1C1C1C` — cards, superficies oscuras secundarias
- Muted: `#9B9080` — texto secundario

### Typography
- Headings: Playfair Display, pesos 400 y 700
- Body: Inter, pesos 400, 500 y 600
- Auto-hospedadas en public/fonts/ — NO usar Google Fonts CDN

### Style
- Border radius: 8px para cards, full para FABs
- Sombras: shadow-lg para cards sobre crema; sin sombra sobre fondos negros
- Spacing base: 4px (escala Tailwind estándar)
- Aesthetic: lujo sobrio — oscuro dominante, acentos dorados, sin gradientes de colores
- Animaciones: fade-in-up suave via Intersection Observer — nada agresivo

## Contacto del cliente (NO hardcodear en componentes — usar constantes)

```typescript
// src/lib/contact.ts
export const CONTACT = {
  whatsapp: '50277270862',
  whatsappUrl: 'https://wa.me/50277270862?text=Hola%2C%20me%20interesa%20una%20consulta%20gratuita',
  phone: '+50245354755',
  phoneUrl: 'tel:+50245354755',
  email: 'info@olgroup.com.gt',
  domain: 'olgroup.com.gt',
} as const;
```

## Reglas No Negociables

1. **Mobile-first.** Diseñar para móvil primero, luego escalar a desktop. El mercado guatemalteco es mayoritariamente móvil.
2. **Sin JS en el cliente.** La única excepción es el menú hamburguesa (script inline, máx 15 líneas). Cero React, Vue, ni librerías JS en el bundle final.
3. **Formulario Netlify nativo.** El form DEBE tener `data-netlify="true"` y `name="contacto-ol-group"`. No crear endpoints propios.
4. **Traducciones completas.** Toda string visible al usuario DEBE existir en ambos `es.ts` y `en.ts`. Nunca hardcodear texto español en un componente.
5. **Imágenes optimizadas.** Siempre usar `<Image>` de Astro. Profe Balam en WebP, máximo 400KB para hero. El cliente proporcionará los assets.
```

---

## 16. Reglas No Negociables

1. **Mobile-first siempre.** Diseñar y probar en móvil primero. El mercado guatemalteco accede principalmente desde smartphones.
2. **Cero JavaScript de framework en el cliente.** Astro genera HTML estático. No agregar React, Vue, ni Alpine salvo que sea absolutamente imposible sin ellos.
3. **Netlify Forms nativo.** No construir un backend API ni usar servicios externos de formulario. `data-netlify="true"` es suficiente.
4. **Traducciones 100% completas.** Toda cadena de texto visible debe estar en `es.ts` Y `en.ts`. Nada hardcodeado en español dentro de componentes.
5. **Imágenes siempre vía `<Image>` de Astro.** Nunca `<img>` raw para content images. Formato WebP, loading lazy excepto hero (eager).
6. **Tipografía auto-hospedada.** Las fuentes van en `public/fonts/` como `.woff2`. No cargar desde Google Fonts CDN (GDPR, velocidad, privacidad).
7. **Los datos de contacto en `src/lib/contact.ts`.** Número de WhatsApp, teléfono y email definidos una sola vez. Los componentes importan de ahí — nunca duplicar.
8. **Lighthouse ≥ 95 en Performance antes de launch.** Si el score es menor, optimizar imágenes y eliminar CSS no usado antes de hacer deploy a producción.
