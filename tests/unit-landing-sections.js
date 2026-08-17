const fs=require('fs'); const storage={};
global.localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
global.window={location:{search:''},LANDING_PALETTES_DEF:[{id:'blue-purple',primary:'#2E5BFF',accent:'#7c3aed',bg:'#09090b',surface:'rgba(255,255,255,.04)',fg:'#fff',mode:'dark'}]};
global.document={getElementById:()=>null,createElement:()=>({style:{},classList:{add(){},remove(){}},setAttribute(){},appendChild(){}}),querySelectorAll:()=>[],body:{appendChild(){}}};
global.navigator={userAgent:'node'};
eval(fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8')+'\n;globalThis.Claude=Claude;');
const C=globalThis.Claude; const pal=C._landingPalette('blue-purple');
let f=0; const chk=(n,ok)=>{console.log(' '+(ok?'✅':'❌'),n); if(!ok)f++;};

console.log('Hero: layout split vs center');
const base={title:'T',subtitle:'S',cta:'Go',image_prompt:'x'};
const split=C._buildSection('hero',{...base,layout:'split'},pal);
const center=C._buildSection('hero',{...base,layout:'center'},pal);
const noLayout=C._buildSection('hero',base,pal);
chk('split → dos columnas flex', split.includes('display:flex;flex-wrap:wrap;align-items:center') && !split.includes('text-align:center'));
chk('center → centrado', center.includes('text-align:center'));
chk('sin layout → split por defecto', noLayout.includes('display:flex;flex-wrap:wrap'));
chk('split muestra la imagen', split.includes('<img'));
// El caso que reportó Sandra: si la IA guardó el texto-guía del schema en layout
const junk=C._buildSection('hero',{...base,layout:'split o center — split: texto a la izquierda...'},pal);
chk('layout con texto basura → cae a split (no rompe)', junk.includes('display:flex;flex-wrap:wrap'));

console.log('Nav');
const nav=C._buildSection('nav',{brand:'Yoga',cta:'Empezar',links:[{label:'Beneficios',href:'#beneficios'},{label:'Precio',href:'#precio'}]},pal);
chk('header sticky', nav.includes('position:sticky') && nav.includes('<header id="nav"'));
chk('links presentes', nav.includes('#beneficios') && nav.includes('Beneficios'));
chk('botón CTA', nav.includes('Empezar'));
chk('burger para móvil', nav.includes('ld-burger'));
const links=C.navLinksFor([{id:'hero'},{id:'beneficios'},{id:'precio'},{id:'faq'},{id:'footer'}]);
chk('navLinksFor solo secciones reales', links.length===3 && links.every(l=>['#beneficios','#precio','#faq'].includes(l.href)));

console.log('Secciones nuevas');
const txt=C._buildSection('texto',{title:'Sobre mí',body:'Linea 1\nLinea 2',align:'center'},pal);
chk('texto respeta saltos y espacios', txt.includes('white-space:pre-wrap') && txt.includes('Sobre mí'));
const img=C._buildSection('imagen',{image_url:'data:image/png;base64,AAA',caption:'Pie',size:'medium'},pal);
chk('imagen con caption y tamaño', img.includes('AAA') && img.includes('Pie') && img.includes('65%'));
const vidYT=C._buildSection('video',{title:'Demo',video_url:'https://www.youtube.com/watch?v=dQw4w9WgXcQ'},pal);
chk('video YouTube → iframe embed', vidYT.includes('youtube.com/embed/dQw4w9WgXcQ'));
const vidMp4=C._buildSection('video',{video_url:'https://x.com/a.mp4'},pal);
chk('video mp4 → tag video', vidMp4.includes('<video src="https://x.com/a.mp4"'));
const gal=C._buildSection('galeria',{title:'G',images:[{url:'a.jpg'},{url:'b.jpg'},{url:'c.jpg'},{url:'d.jpg'}]},pal);
chk('galería 4 imgs → grid 2x2', gal.includes('ld-g2'));

console.log('Media en cualquier sección');
const benImg=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],image_url:'data:image/png;base64,ZZZ'},pal);
chk('imagen agregada a beneficios', benImg.includes('ZZZ'));
const benVid=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],video_url:'https://v/x.mp4'},pal);
chk('video de fondo en beneficios', benVid.includes('<video autoplay muted loop') && benVid.includes('ld-onvideo'));
chk('overlay de legibilidad', benVid.includes('rgba(0,0,0,.62)'));
const galNoVid=C._buildSection('galeria',{title:'G',images:[],video_url:'https://v/x.mp4'},pal);
chk('galería NO recibe video de fondo (tiene su propio media)', !galNoVid.includes('<video autoplay'));

console.log('Hero con video + layout');
const hvSplit=C._buildSection('hero',{...base,video_url:'https://v/x.mp4',layout:'split'},pal);
const hvCenter=C._buildSection('hero',{...base,video_url:'https://v/x.mp4',layout:'center'},pal);
chk('video + split → dos columnas con imagen', hvSplit.includes('display:flex;flex-wrap:wrap') && hvSplit.includes('<img') && hvSplit.includes('<video autoplay'));
chk('video + center → centrado', hvCenter.includes('text-align:center') && hvCenter.includes('<video autoplay'));
chk('ambos con overlay', hvSplit.includes('rgba(0,0,0,.58)') && hvCenter.includes('rgba(0,0,0,.55)'));

console.log('Oferta (upsell/downsell)');
const of1=C._buildSection('oferta',{badge:'Espera',title:'Sumá esto',features:['a','b'],price_before:'$197',price:'$97',cta:'SI',cta_url:'https://pay/UP',decline:'No gracias',decline_url:'https://next'},pal);
chk('precio tachado + precio oferta', of1.includes('line-through') && of1.includes('$197') && of1.includes('$97'));
chk('botón con su propio link de pago', of1.includes('href="https://pay/UP"'));
chk('link de declinar', of1.includes('href="https://next"') && of1.includes('ld-decline'));
chk('features con check', of1.includes('check_circle'));
const asm=C.assembleLanding([{id:'oferta',html:of1}],'blue-purple','t',{ctaUrl:'https://pay/PRINCIPAL'});
chk('el checkout global NO pisa el link propio de la oferta', asm.includes('href="https://pay/UP"') && !asm.includes('href="https://pay/PRINCIPAL"'));
chk('el checkout global NO pisa el "no gracias"', asm.includes('href="https://next"'));
const of2=C._buildSection('oferta',{title:'X',price:'$47',cta:'SI'},pal);
const asm2=C.assembleLanding([{id:'oferta',html:of2}],'blue-purple','t',{ctaUrl:'https://pay/PRINCIPAL'});
chk('oferta sin link propio → usa el checkout global', asm2.includes('href="https://pay/PRINCIPAL"'));

console.log('CTA al pie de secciones');
const benCta=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],cta:'Quiero esto',cta_url:'https://pay/X',cta_note:'Sin tarjeta'},pal);
chk('botón CTA al pie con su link', benCta.includes('Quiero esto') && benCta.includes('href="https://pay/X"'));
chk('nota bajo el botón', benCta.includes('Sin tarjeta'));
const benSinCta=C._buildSection('beneficios',{title:'B',items:[{title:'a'}]},pal);
chk('sin cta → no aparece botón', !benSinCta.includes('ld-btn'));

console.log('Imágenes por ítem y proporciones');
const bonImg=C._buildSection('bonos',{title:'B',items:[{title:'b1',image_url:'foto1.jpg'},{title:'b2',image_url:'foto2.jpg'}]},pal);
chk('cada bono con su foto', bonImg.includes('foto1.jpg') && bonImg.includes('foto2.jpg'));
const benItemImg=C._buildSection('beneficios',{title:'B',items:[{title:'a',image_url:'ben.jpg'}]},pal);
chk('beneficio con foto propia', benItemImg.includes('ben.jpg'));
const imgOrig=C._buildSection('imagen',{image_url:'x.jpg',ratio:'original',align:'left',size:'medium'},pal);
chk('proporción original (sin recorte)', imgOrig.includes('height:auto') && !imgOrig.includes('aspect-ratio'));
chk('alineada a la izquierda', imgOrig.includes('margin-right:auto') && !imgOrig.includes('margin-left:auto'));
const imgSq=C._buildSection('imagen',{image_url:'x.jpg',ratio:'1/1'},pal);
chk('proporción cuadrada', imgSq.includes('aspect-ratio:1/1'));
const galR=C._buildSection('galeria',{images:[{url:'a'},{url:'b'}],ratio:'1/1'},pal);
chk('galería con proporción elegida', galR.includes('aspect-ratio:1/1'));

console.log('Iconos configurables');
const pqIc=C._buildSection('para-quien',{title:'T',yes:['a'],no:['b'],yes_icon:'favorite',no_icon:'block'},pal);
chk('iconos propios en para-quien', pqIc.includes('favorite') && pqIc.includes('block'));
const adIc=C._buildSection('antes-despues',{title:'T',before:['a'],after:['b'],before_icon:'mood_bad',after_icon:'emoji_events'},pal);
chk('iconos propios en antes-despues', adIc.includes('mood_bad') && adIc.includes('emoji_events'));
const pqDef=C._buildSection('para-quien',{title:'T',yes:['a'],no:['b']},pal);
chk('iconos por defecto si no se eligen', pqDef.includes('check_circle') && pqDef.includes('close'));

console.log('Nav con logo y link');
const navLogo=C._buildSection('nav',{brand:'Marca',logo_url:'logo.png',brand_href:'https://misitio.com',links:[]},pal);
chk('logo como imagen', navLogo.includes('logo.png'));
chk('link propio del logo', navLogo.includes('href="https://misitio.com"'));
const navNoLogo=C._buildSection('nav',{brand:'Marca',links:[]},pal);
chk('sin logo → solo el nombre', !navNoLogo.includes('<img') && navNoLogo.includes('Marca'));

console.log('Video en celular');
const vidBg=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],video_url:'v.mp4'},pal);
chk('atributos para autoplay en celular', vidBg.includes('playsinline') && vidBg.includes('webkit-playsinline') && vidBg.includes('muted'));
const asmVid=C.assembleLanding([{id:'x',html:vidBg}],'blue-purple','t');
chk('CSS que fuerza el video visible en celular', asmVid.includes('section > video'));

console.log('Ronda de pulido');
const navBig=C._buildSection('nav',{brand:'M',logo_url:'l.png',logo_size:'60',links:[]},pal);
chk('alto del logo configurable', navBig.includes('height:44px'));
chk('el logo no invade el espacio del título', navBig.includes('max-width:52%'));
const navClamp=C._buildSection('nav',{brand:'M',logo_url:'l.png',logo_size:'999',links:[]},pal);
chk('alto del logo con tope de seguridad — no engorda la barra', navClamp.includes('height:44px') && navClamp.includes('height:68px'));

const faqIc=C._buildSection('faq',{title:'F',items:[{q:'P1',a:'R1',icon:'schedule'},{q:'P2',a:'R2'}]},pal);
chk('icono propio en una pregunta', faqIc.includes('schedule'));
chk('icono por defecto en las demás', faqIc.includes('>help<'));
chk('respuesta respeta saltos de línea', faqIc.includes('white-space:pre-wrap'));

const bonImg2=C._buildSection('bonos',{title:'B',items:[{title:'b1',image_url:'f1.jpg',desc:'d'}]},pal);
chk('imagen del bono va arriba y a lo ancho', bonImg2.includes('aspect-ratio:16/9') && bonImg2.indexOf('f1.jpg') < bonImg2.indexOf('b1'));

const secImg=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],image_url:'x.jpg',image_size:'medium',image_ratio:'original',image_align:'left'},pal);
chk('imagen de sección con tamaño', secImg.includes('max-width:65%'));
chk('imagen de sección sin recorte', secImg.includes('height:auto'));
chk('imagen de sección alineada', secImg.includes('margin-right:auto'));

const vidFit=C._buildSection('hero',{title:'T',video_url:'v.mp4',video_fit:'contain'},pal);
chk('video se puede mostrar completo', vidFit.includes('object-fit:contain'));
const vidCover=C._buildSection('hero',{title:'T',video_url:'v.mp4'},pal);
chk('video cubre por defecto', vidCover.includes('object-fit:cover'));

const subNl=C._buildSection('beneficios',{title:'B',subtitle:'linea1\nlinea2',items:[{title:'a',desc:'d1\nd2'}]},pal);
chk('subtítulo respeta saltos', subNl.includes('white-space:pre-wrap'));

console.log('Ronda 8 — bugs reportados');
// La oferta (upsell/downsell) NO aceptaba imagen: el cierre tenía saltos de línea
const ofImg=C._buildSection('oferta',{title:'X',price:'$47',cta:'SI',image_url:'data:image/png;base64,OFERTAIMG'},pal);
chk('la oferta ahora acepta imagen', ofImg.includes('OFERTAIMG'));
chk('la imagen queda dentro de la sección', ofImg.lastIndexOf('OFERTAIMG') < ofImg.lastIndexOf('</section>'));
// Otras secciones con formato multilínea
const garImg=C._buildSection('garantia',{title:'G',desc:'d',image_url:'GARIMG'},pal);
chk('garantía acepta imagen', garImg.includes('GARIMG'));
const precioImg=C._buildSection('precio',{title:'P',price:'$1',features:['a'],image_url:'PRECIOIMG'},pal);
chk('precio acepta imagen', precioImg.includes('PRECIOIMG'));

// Saltos de línea en títulos
const h2nl=C._buildSection('beneficios',{title:'Linea1\nLinea2',items:[{title:'a'}]},pal);
chk('los títulos respetan los saltos de línea', /white-space:pre-wrap/.test(h2nl.split('</h2>')[0]));
const h1nl=C._buildSection('hero',{title:'A\nB',subtitle:'s'},pal);
chk('el título del hero respeta saltos', /<h1[^>]*white-space:pre-wrap/.test(h1nl));

// Foto de ítem sin recorte
const itFull=C._buildSection('bonos',{title:'B',items:[{title:'b',image_url:'f.jpg',image_ratio:'original'}]},pal);
chk('foto del bono se puede ver completa', itFull.includes('height:auto'));
const itSq=C._buildSection('beneficios',{title:'B',items:[{title:'b',image_url:'f.jpg',image_ratio:'1/1'}]},pal);
chk('foto del beneficio con proporción elegida', itSq.includes('aspect-ratio:1/1'));

// Posición del video
const vPos=C._buildSection('hero',{title:'T',video_url:'v.mp4',video_position:'top'},pal);
chk('se puede elegir qué parte del video se ve', vPos.includes('object-position:top'));

console.log('Ronda 9 — logo, alineación y fotos de tarjetas');
// El respaldo de imágenes rotas imponía min-height:160px a TODAS las imágenes,
// lo que inflaba el logo y la barra lo recortaba: parecía que el tamaño no servía.
const asmLogo=C.assembleLanding([{id:'nav',html:C._buildSection('nav',{brand:'M',logo_url:'l.png',logo_size:'30',links:[]},pal)}],'blue-purple','t');
chk('el respaldo NO se aplica a todas las imágenes', !/img\.ld-img\{/.test(asmLogo));
chk('el respaldo solo actúa cuando una imagen falla', asmLogo.includes("classList.add('ld-fallback')"));
chk('la barra tiene alto fijo', asmLogo.includes('height:68px'));
chk('el logo respeta el alto elegido', asmLogo.includes('height:30px'));

// Alineación de la imagen de sección
const alI=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],image_url:'x.jpg',image_align:'left'},pal);
const alD=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],image_url:'x.jpg',image_align:'right'},pal);
const alC=C._buildSection('beneficios',{title:'B',items:[{title:'a'}],image_url:'x.jpg'},pal);
chk('imagen a la izquierda', alI.includes('margin-left:0;margin-right:auto'));
chk('imagen a la derecha', alD.includes('margin-left:auto;margin-right:0'));
chk('imagen centrada', alC.includes('margin-left:auto;margin-right:auto'));

// Fotos de módulos y bonos: mismo tamaño contenido
const modF=C._buildSection('modulos',{title:'M',items:[{title:'a',image_url:'f.jpg'}]},pal);
const bonF=C._buildSection('bonos',{title:'B',items:[{title:'b',image_url:'f.jpg'}]},pal);
chk('módulos y bonos con el mismo tope de alto', modF.includes('max-height:190px') && bonF.includes('max-height:190px'));
chk('y la misma proporción', modF.includes('aspect-ratio:16/9') && bonF.includes('aspect-ratio:16/9'));

// Saltos de línea: regla global, no parche por sección
chk('regla global de saltos de línea', asmLogo.includes('h1,h2,h3,h4,p,li,summary,figcaption,blockquote{white-space:pre-wrap}'));

console.log('Ronda 10 — pasos, CTA y foto por paso');
// El indicador del paso era un círculo fijo: "Semanas 1 y 2" se desbordaba
const pasoLargo=C._buildSection('como-funciona',{title:'C',items:[{step:'Semanas 1 y 2',title:'T',desc:'d'}]},pal);
const pasoCorto=C._buildSection('como-funciona',{title:'C',items:[{step:'1',title:'T',desc:'d'}]},pal);
chk('etiqueta larga se dibuja como píldora', pasoLargo.includes('border-radius:99px') && pasoLargo.includes('Semanas 1 y 2'));
chk('la píldora deja fluir el texto', pasoLargo.includes('white-space:normal'));
chk('un número corto sigue en círculo', pasoCorto.includes('border-radius:50%') && pasoCorto.includes('width:56px'));
// Foto por paso
const pasoFoto=C._buildSection('como-funciona',{title:'C',items:[{step:'1',title:'T',desc:'d',image_url:'f.jpg'}]},pal);
chk('cada paso admite su foto', pasoFoto.includes('f.jpg') && pasoFoto.includes('max-height:190px'));
// CTA en las secciones que lo ofrecían pero no lo pintaban
for (const [id,c] of [['problema',{title:'P',items:[{title:'a'}],cta:'Ir'}],
                      ['prueba-social',{title:'S',stats:[{value:'1',label:'x'}],cta:'Ir'}],
                      ['faq',{title:'F',items:[{q:'a',a:'b'}],cta:'Ir'}]]) {
  chk('botón CTA en '+id, C._buildSection(id,c,pal).includes('>Ir</a>'));
}

console.log('\n'+(f===0?'🎉 TODOS PASAN':'⚠️ '+f+' FALLAN'));
process.exit(f?1:0);
