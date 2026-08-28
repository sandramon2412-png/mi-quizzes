# Tests del Landing Builder

Red de seguridad para no volver a romper el builder. Se corren en local con Node.

## E2E (el importante)
Levanta el repo en un servidor local, abre `landing-builder.html` en Chromium real,
simula Supabase y la IA, y hace exactamente lo que hace la usuaria:
generar → editar por chat → guardar → recargar → editar de nuevo →
editar a mano en el panel visual → reordenar → agregar sección → recargar.

```bash
npm i playwright          # solo la primera vez
node tests/e2e-landing-builder.js
```

Verifica, entre otras cosas:
- que un mensaje de chat NO regenere la landing entera
- que la edición sea quirúrgica (no pierda el resto del contenido)
- que el trabajo se guarde y sobreviva a recargar la página
- que el editor visual funcione con CERO llamadas a la IA

## Unitarios (lógica de generación/armado)
```bash
node tests/unit-landing.js
node tests/unit-landing-round2.js
```

## Candado de plan (protege la API que pagas tú)
```bash
npm i typescript --no-save   # solo la primera vez
node tests/unit-plan-gate.js
```
Verifica que `claude-proxy` bloquee en el SERVIDOR lo que el navegador ya bloquea:
Free no genera con IA ni usa Bot Lab, Starter usa Bot Lab pero no genera, y Pro en
adelante hace todo. Cuando bloquea, no gasta la API. El candado del navegador se
saltea desde la consola; este es el que cuenta.
