const fs=require('fs'); const storage={};
global.localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
global.window={location:{search:''},LANDING_PALETTES_DEF:[{id:'blue-purple',primary:'#2E5BFF',accent:'#7c3aed',bg:'#09090b',surface:'x',fg:'#fff',mode:'dark'}]};
global.document={getElementById:()=>null,createElement:()=>({style:{},classList:{add(){},remove(){}},setAttribute(){},appendChild(){}}),querySelectorAll:()=>[],body:{appendChild(){}}};
global.navigator={userAgent:'node'};
eval(fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8')+'\n;globalThis.C=Claude;');
const C=globalThis.C; const pal=C._landingPalette('blue-purple');
let f=0; const chk=(n,ok)=>{console.log(' '+(ok?'✅':'❌'),n); if(!ok)f++;};

// Sección nav como la de Sandra: con logo subido, tamaño y link
const navContent = { brand:'Mi Marca', logo_url:'data:image/png;base64,MILOGO', logo_size:'30',
  brand_href:'https://misitio.com', cta:'Empezar', links:[{label:'Precio',href:'#precio'}] };
const secs = [{ id:'nav', brief:'', content: navContent, html: C._buildSection('nav', navContent, pal) },
              { id:'hero', brief:'', content:{title:'T', image_url:'data:image/png;base64,MIFOTO', video_url:'v.mp4'}, html:'<section id="hero"></section>' }];

(async () => {
  console.log('CAMINO 1 — el chat "edita" (devuelve JSON incompleto, como el modelo real)');
  C._call = async (m) => {
    const msg = m[m.length-1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({action:'edit',sectionId:'nav',reply:'ok'});
    // El modelo devuelve solo lo que cambió y OMITE el logo
    return JSON.stringify({ brand:'Mi Marca', logo_size:'22' });
  };
  let r = await C.editLandingSectioned('bajá el tamaño del logo', secs, 'blue-purple', 'producto', []);
  let nav = r.sections.find(s=>s.id==='nav');
  chk('aplicó el cambio de tamaño', nav.content.logo_size === '22');
  chk('NO borró el logo', nav.content.logo_url === 'data:image/png;base64,MILOGO');
  chk('NO borró el link del logo', nav.content.brand_href === 'https://misitio.com');
  chk('el logo sigue en el HTML', nav.html.includes('MILOGO'));

  console.log('\nCAMINO 2 — el modelo devuelve el logo VACÍO (lo que borraba todo)');
  C._call = async (m) => {
    const msg = m[m.length-1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({action:'edit',sectionId:'nav',reply:'ok'});
    return JSON.stringify({ brand:'Mi Marca', logo_url:'', logo_size:'22' });
  };
  r = await C.editLandingSectioned('bajá el tamaño del logo', secs, 'blue-purple', 'producto', []);
  nav = r.sections.find(s=>s.id==='nav');
  chk('ignora el borrado accidental del logo', nav.content.logo_url === 'data:image/png;base64,MILOGO');

  console.log('\nCAMINO 3 — el chat decide REGENERAR la sección (el que perdía todo)');
  C._call = async (m) => {
    const msg = m[m.length-1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({action:'fix',sectionId:'nav',reply:'regenero'});
    // Regeneración: contenido nuevo, sin ninguna referencia al logo del usuario
    return JSON.stringify({ brand:'Marca Nueva', cta:'Ir', links:[{label:'X',href:'#x'}] });
  };
  r = await C.editLandingSectioned('el menú está roto, rehacelo', secs, 'blue-purple', 'producto', []);
  nav = r.sections.find(s=>s.id==='nav');
  chk('regeneró el contenido', nav.content.brand === 'Marca Nueva');
  chk('PERO conservó tu logo', nav.content.logo_url === 'data:image/png;base64,MILOGO');
  chk('y conservó el tamaño elegido', nav.content.logo_size === '30');
  chk('y el link del logo', nav.content.brand_href === 'https://misitio.com');

  console.log('\nCAMINO 4 — regenerar TODA la landing');
  C._call = async (m) => {
    const msg = m[m.length-1].content;
    if (msg.includes('REGLAS DE CLASIFICACIÓN')) return JSON.stringify({action:'fix',sectionId:null,reply:'todo'});
    return JSON.stringify({ brand:'Otra', title:'Otro' });
  };
  r = await C.editLandingSectioned('está todo mal', secs, 'blue-purple', 'producto', []);
  nav = r.sections.find(s=>s.id==='nav');
  const hero = r.sections.find(s=>s.id==='hero');
  chk('el logo sobrevive a regenerar todo', nav.content.logo_url === 'data:image/png;base64,MILOGO');
  chk('la foto del hero sobrevive', hero.content.image_url === 'data:image/png;base64,MIFOTO');
  chk('el video del hero sobrevive', hero.content.video_url === 'v.mp4');

  console.log('\nLogo: tamaño y que no tape el título');
  const nChico = C._buildSection('nav', {...navContent, logo_size:'22'}, pal);
  const nGrande = C._buildSection('nav', {...navContent, logo_size:'60'}, pal);
  chk('respeta el alto chico', nChico.includes('height:22px'));
  chk('respeta el alto grande', nGrande.includes('height:60px'));
  chk('limita el ancho para no tapar el título', nChico.includes('max-width:52%'));
  chk('con logo, el nombre no compite por el espacio', !nChico.includes('>Mi Marca<'));
  const nAmbos = C._buildSection('nav', {...navContent, show_brand_text:'si'}, pal);
  chk('se puede pedir logo + nombre', nAmbos.includes('>Mi Marca<'));

  console.log('\n'+(f===0?'🎉 TODOS PASAN':'⚠️ '+f+' FALLAN'));
  process.exit(f?1:0);
})();
