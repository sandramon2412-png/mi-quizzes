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
chk('texto con saltos de línea', txt.includes('white-space:pre-line') && txt.includes('Sobre mí'));
const img=C._buildSection('imagen',{image_url:'data:image/png;base64,AAA',caption:'Pie',size:'medium'},pal);
chk('imagen con caption y tamaño', img.includes('AAA') && img.includes('Pie') && img.includes('72%'));
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

console.log('\n'+(f===0?'🎉 TODOS PASAN':'⚠️ '+f+' FALLAN'));
process.exit(f?1:0);
