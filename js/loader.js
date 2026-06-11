/**
 * Adobe Ingeniería — loader.js
 * Pantalla de carga estilo AutoCAD / plotter técnico
 * Se inyecta antes que todo el resto. No depende de ninguna librería.
 */
(function () {

  /* ── 1. CREAR EL OVERLAY LO ANTES POSIBLE ── */
  var overlay = document.createElement('div');
  overlay.id = 'acad-loader';

  /* ── 2. ESTILOS INLINE (críticos, no dependen de styles.css) ── */
  var css = [
    '#acad-loader{',
      'position:fixed;inset:0;z-index:99999;',
      'background:#111210;',          /* negro mate */
      'display:flex;align-items:center;justify-content:center;',
      'flex-direction:column;gap:28px;',
      'transition:opacity .7s cubic-bezier(.4,0,.2,1),transform .7s cubic-bezier(.4,0,.2,1);',
      'will-change:opacity,transform;',
    '}',
    '#acad-loader.hide{',
      'opacity:0;transform:scale(1.04);pointer-events:none;',
    '}',

    /* canvas de fondo */
    '#acad-canvas{position:absolute;inset:0;display:block;}',

    /* contenedor central */
    '#acad-center{',
      'position:relative;z-index:2;',
      'display:flex;flex-direction:column;align-items:center;gap:20px;',
    '}',

    /* escuadra giratoria */
    '#acad-spinner{width:48px;height:48px;animation:acad-spin 2s linear infinite;}',
    '@keyframes acad-spin{to{transform:rotate(360deg)}}',

    /* texto plotter */
    '#acad-text{',
      'font-family:"Inter",system-ui,sans-serif;',
      'font-size:clamp(15px,2.4vw,22px);',
      'font-weight:600;letter-spacing:.32em;',
      'text-transform:uppercase;color:#FF6600;',
      'white-space:nowrap;',
    '}',
    '#acad-text span{',
      'opacity:0;display:inline-block;',
      'animation:acad-char .04s forwards;',
    '}',
    '@keyframes acad-char{to{opacity:1}}',

    /* barra de progreso técnica */
    '#acad-bar-wrap{',
      'width:clamp(220px,40vw,360px);height:2px;',
      'background:rgba(255,255,255,.08);',
      'border-radius:2px;overflow:hidden;',
      'position:relative;',
    '}',
    '#acad-bar{',
      'height:100%;width:0;background:#FF6600;',
      'border-radius:2px;',
      'transition:width .25s linear;',
      'box-shadow:0 0 8px rgba(255,102,0,.7);',
    '}',

    /* coordenadas en esquinas */
    '.acad-coord{',
      'position:absolute;font-family:"Inter",monospace;',
      'font-size:10px;color:rgba(255,102,0,.45);',
      'letter-spacing:.1em;pointer-events:none;z-index:3;',
      'animation:acad-blink 2.8s ease-in-out infinite;',
    '}',
    '@keyframes acad-blink{0%,100%{opacity:.45}50%{opacity:.9}}',
    '.acad-coord.tl{top:14px;left:18px;}',
    '.acad-coord.tr{top:14px;right:18px;text-align:right;}',
    '.acad-coord.bl{bottom:14px;left:18px;}',
    '.acad-coord.br{bottom:14px;right:18px;text-align:right;}',

    /* label inferior */
    '#acad-label{',
      'position:absolute;bottom:40px;left:50%;transform:translateX(-50%);',
      'font-family:"Inter",monospace;font-size:10px;',
      'color:rgba(255,255,255,.25);letter-spacing:.22em;',
      'text-transform:uppercase;white-space:nowrap;z-index:3;',
    '}',
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── 3. CANVAS (grid + crosshair animado) ── */
  var canvas = document.createElement('canvas');
  canvas.id = 'acad-canvas';
  overlay.appendChild(canvas);

  /* ── 4. COORDENADAS EN ESQUINAS ── */
  var coords = [
    { cls:'tl', text:'X: 0.000  Y: 0.000' },
    { cls:'br', text:'ADOBE Ingeniería · Salta' },
  ];
  coords.forEach(function(c){
    var el = document.createElement('div');
    el.className = 'acad-coord ' + c.cls;
    el.textContent = c.text;
    overlay.appendChild(el);
  });

  /* ── 5. CONTENEDOR CENTRAL ── */
  var center = document.createElement('div');
  center.id = 'acad-center';

  /* escuadra SVG */
  var spinnerSVG = [
    '<svg id="acad-spinner" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">',
      /* regla / escuadra exterior */
      '<rect x="4" y="4" width="40" height="40" rx="3"',
        ' stroke="#FF6600" stroke-width="1.2" stroke-dasharray="4 3"/>',
      /* diagonales */
      '<line x1="4" y1="4" x2="44" y2="44" stroke="#FF6600" stroke-width=".6" opacity=".4"/>',
      '<line x1="44" y1="4" x2="4" y2="44" stroke="#FF6600" stroke-width=".6" opacity=".4"/>',
      /* centro */
      '<circle cx="24" cy="24" r="3" fill="#FF6600"/>',
      '<circle cx="24" cy="24" r="7" stroke="#FF6600" stroke-width=".8" stroke-dasharray="2 2"/>',
      /* marcas de esquina */
      '<polyline points="4,12 4,4 12,4" stroke="#FF6600" stroke-width="1.4" fill="none"/>',
      '<polyline points="36,4 44,4 44,12" stroke="#FF6600" stroke-width="1.4" fill="none"/>',
      '<polyline points="4,36 4,44 12,44" stroke="#FF6600" stroke-width="1.4" fill="none"/>',
      '<polyline points="44,36 44,44 36,44" stroke="#FF6600" stroke-width="1.4" fill="none"/>',
    '</svg>',
  ].join('');

  var spinnerWrap = document.createElement('div');
  spinnerWrap.innerHTML = spinnerSVG;
  center.appendChild(spinnerWrap.firstChild);

  /* texto plotter — se construye carácter a carácter con delay */
  var textEl = document.createElement('div');
  textEl.id = 'acad-text';
  var fullText = 'Somos ADOBE Ingeniería';
  fullText.split('').forEach(function(ch, i){
    var span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = (0.3 + i * 0.11) + 's';
    textEl.appendChild(span);
  });
  center.appendChild(textEl);

  /* barra de progreso */
  var barWrap = document.createElement('div');
  barWrap.id = 'acad-bar-wrap';
  var bar = document.createElement('div');
  bar.id = 'acad-bar';
  barWrap.appendChild(bar);
  center.appendChild(barWrap);

  overlay.appendChild(center);

  /* label técnico inferior */
  var label = document.createElement('div');
  label.id = 'acad-label';
  label.textContent = 'Cargando proyecto · Adobe Ingeniería · Salta';
  overlay.appendChild(label);

  /* ── 6. INYECTAR EN BODY Y REVELAR INMEDIATAMENTE ── */
  function inject(){
    if (document.body) {
      document.body.insertBefore(overlay, document.body.firstChild);
      /* revelar el body ahora que el loader está encima tapando todo */
      document.body.style.visibility = 'visible';
    } else {
      document.addEventListener('DOMContentLoaded', inject);
    }
  }
  if (document.body) { inject(); }
  else { document.addEventListener('DOMContentLoaded', inject); }

  /* ── 7. CANVAS: GRID + CROSSHAIR ── */
  function initCanvas(){
    var W = canvas.width  = window.innerWidth;
    var H = canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    var t = 0;
    var raf;

    function draw(){
      ctx.clearRect(0, 0, W, H);

      /* grid principal */
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = .5;
      var step = 48;
      for (var x = 0; x < W; x += step){
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (var y = 0; y < H; y += step){
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      /* sub-grid (dots en intersecciones) */
      ctx.fillStyle = 'rgba(255,102,0,0.12)';
      for (var gx = 0; gx < W; gx += step){
        for (var gy = 0; gy < H; gy += step){
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI*2);
          ctx.fill();
        }
      }

      /* crosshair animado — sigue una curva de Lissajous suave */
      var cx = W/2 + Math.sin(t * 0.004) * W * 0.12;
      var cy = H/2 + Math.cos(t * 0.003) * H * 0.08;

      /* líneas de mira largas */
      ctx.strokeStyle = 'rgba(255,102,0,0.18)';
      ctx.lineWidth = .6;
      ctx.setLineDash([4, 6]);
      ctx.beginPath(); ctx.moveTo(0, cy);    ctx.lineTo(W, cy);    ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0);    ctx.lineTo(cx, H);    ctx.stroke();
      ctx.setLineDash([]);

      /* círculo de mira */
      ctx.strokeStyle = 'rgba(255,102,0,0.55)';
      ctx.lineWidth = .8;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI*2);
      ctx.stroke();

      /* punto central de mira */
      ctx.fillStyle = 'rgba(255,102,0,0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI*2);
      ctx.fill();

      /* líneas de coordenada punteadas desde mira hasta bordes */
      ctx.strokeStyle = 'rgba(255,102,0,0.10)';
      ctx.lineWidth = .5;
      ctx.setLineDash([2, 8]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(W, cy); ctx.stroke();
      ctx.setLineDash([]);

      /* actualizar coordenadas en esquina TL */
      var coordTL = overlay.querySelector('.acad-coord.tl');
      if (coordTL){
        coordTL.textContent =
          'X: ' + cx.toFixed(3) + '  Y: ' + cy.toFixed(3);
      }

      t++;
      raf = requestAnimationFrame(draw);
    }

    draw();
    return function stop(){ cancelAnimationFrame(raf); };
  }

  var stopCanvas;

  /* esperar a que el canvas esté en el DOM */
  function tryInitCanvas(){
    if (canvas.isConnected){ stopCanvas = initCanvas(); }
    else { requestAnimationFrame(tryInitCanvas); }
  }
  requestAnimationFrame(tryInitCanvas);

  /* resize */
  window.addEventListener('resize', function(){
    if (canvas.isConnected){
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  /* ── 8. BARRA DE PROGRESO SIMULADA + DISPARO AL LOAD ── */
  var pct = 0;
  var fakeInterval = setInterval(function(){
    /* avanza lento: ~4s para llegar a 85% */
    var inc = pct < 30 ? 1.2 : pct < 60 ? 0.7 : pct < 85 ? 0.3 : 0;
    pct = Math.min(85, pct + inc);
    bar.style.width = pct + '%';
  }, 80);

  function dismiss(){
    clearInterval(fakeInterval);
    pct = 100;
    bar.style.width = '100%';
    bar.style.transition = 'width .3s linear';
    /* garantizar que el body sea visible antes de salir */
    document.body.style.visibility = 'visible';

    setTimeout(function(){
      overlay.classList.add('hide');
      if (stopCanvas) stopCanvas();
      setTimeout(function(){
        if (overlay.parentNode){ overlay.parentNode.removeChild(overlay); }
        if (styleEl.parentNode){ styleEl.parentNode.removeChild(styleEl); }
      }, 750);
    }, 400);
  }

  /* disparo real: window load (DOM + recursos)
     + retardo mínimo de 3.5s para apreciar el efecto */
  var minDelay = 3500;
  var loadFired = false;
  var loadTime  = null;

  function tryDismiss(){
    var elapsed = Date.now() - loadTime;
    var wait    = Math.max(0, minDelay - elapsed);
    setTimeout(dismiss, wait);
  }

  if (document.readyState === 'complete'){
    loadTime = Date.now() - 2000; /* ya cargó, contar desde hace 2s */
    tryDismiss();
  } else {
    window.addEventListener('load', function(){
      loadTime = Date.now();
      tryDismiss();
    });
  }

  /* fallback de seguridad: máximo 8 segundos */
  setTimeout(function(){
    if (overlay.isConnected){ dismiss(); }
  }, 8000);

})();
