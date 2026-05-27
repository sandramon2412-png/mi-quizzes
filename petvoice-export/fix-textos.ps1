# Fix encoding — reemplaza solo los textos con errores
# Ejecutar desde: C:\Users\moras\Downloads\petvoiceai\petvoice-ai
# Comando: & "$env:USERPROFILE\Downloads\fix-textos.ps1"

$b = "C:\Users\moras\Downloads\petvoiceai\petvoice-ai"

# ── OnboardingScreen ──────────────────────────────────────────
$f = "$b\src\screens\OnboardingScreen.js"
$c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# Paso 1 — subtitulo species
$c = $c -replace 'El modelo de anal[^\s"]+sis se adapta por especie', 'El modelo de análisis se adapta por especie'
# Paso 3 — subtitulo edad
$c = $c -replace 'Opcional.*mejora la precisi[^\s"]+n del an[^\s"]+lisis', 'Opcional - mejora la precisión del análisis'
# Paso 3 — label edad
$c = $c -replace '"Edad \(a[^\)]+os\)"', '"Edad (años)"'
# Paso 4 — subtitulo foto
$c = $c -replace 'Aparecer[^\s"]+  en la pantalla', 'Aparecerá en la pantalla'
# Paso 4 — photo sub hint
$c = $c -replace 'Opcional.*JPG o PNG', 'Opcional · JPG o PNG'

[System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
Write-Host "OnboardingScreen.js corregido" -ForegroundColor Green

# ── HomeScreen ────────────────────────────────────────────────
$f = "$b\src\screens\HomeScreen.js"
$c = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

# anos -> años
$c = $c -replace '` \· \$\{pet\.age\} anos`', '` · \${pet.age} años`'
$c = $c -replace "'\s*\·\s*\$\{pet\.age\} anos'", "' · \${pet.age} años'"
# tip card
$c = $c -replace 'Mas contexto = traduccion mas precisa', 'Más contexto = traducción más precisa'
$c = $c -replace 'Graba 3-10 segundos de forma natural\. Mas contexto', 'Graba 3-10 segundos de forma natural. Más contexto'

[System.IO.File]::WriteAllText($f, $c, [System.Text.Encoding]::UTF8)
Write-Host "HomeScreen.js corregido" -ForegroundColor Green

Write-Host ""
Write-Host "Listo! Ahora ejecuta: npx expo start --clear" -ForegroundColor Cyan
