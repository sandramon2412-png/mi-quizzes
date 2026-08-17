const fs=require('fs'); const st={};
global.localStorage={getItem:k=>st[k]??null,setItem:(k,v)=>st[k]=String(v),removeItem:k=>delete st[k]};
global.window={location:{search:''},LANDING_PALETTES_DEF:[{id:'b',primary:'#2E5BFF',accent:'#7c3aed',bg:'#09090b',surface:'x',fg:'#fff',mode:'dark'}]};
global.document={getElementById:()=>null,createElement:()=>({style:{},classList:{add(){},remove(){}},setAttribute(){},appendChild(){}}),querySelectorAll:()=>[],body:{appendChild(){}}};
global.navigator={userAgent:'node'};
eval(fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8')+'\n;globalThis.C=Claude;');
const C=globalThis.C, pal=C._landingPalette('b');
let f=0; const chk=(n,ok)=>{console.log(' '+(ok?'✅':'❌'),n); if(!ok)f++;};

const mk=(id,c)=>({id,brief:'',content:c,html:C._buildSection(id,c,pal)});
const base=()=>[
  mk('nav',{brand:'Mi Marca',logo_url:'data:image/png;base64,MILOGO',logo_size:'38',brand_href:'https://mio.com',cta:'Empezar',links:[{label:'Precio',href:'#precio'}]}),
  mk('hero',{title:'Título viejo',subtitle:'Sub',cta:'Ir',image_url:'data:image/png;base64,MIFOTO',layout:'split'}),
  mk('beneficios',{title:'Beneficios',items:[{icon:'star',title:'B1',desc:'d1'},{icon:'star',title:'B2',desc:'d2'}]}),
  mk('precio',{title:'Inversión',price:'$120',features:['a','b'],cta:'Comprar'}),
];

let ultimoPrompt='';
function mockIA(respuesta){
  C._call = async (m,t,o) => { ultimoPrompt = m[m.length-1].content + '\n---SYSTEM---\n' + (o.system||''); return JSON.stringify(respuesta); };
}

(async () => {
  console.log('El pedido que le fallaba: "bajá el tamaño del logo"');
  mockIA({reply:'Listo, dejé el logo más chico.',ops:[{section:'nav',set:{logo_size:'22'}}]});
  let r = await C.chatEditLandingSections('bajá el tamaño del logo', base(), 'b', 'curso', []);
  let nav = r.sections.find(s=>s.id==='nav');
  chk('cambió el tamaño', nav.content.logo_size === '22');
  chk('NO borró el logo', nav.content.logo_url === 'data:image/png;base64,MILOGO');
  chk('el HTML se reconstruyó', nav.html.includes('height:22px'));
  chk('dice qué cambió', (r.changed||[]).length === 1);
  chk('responde con sentido', /logo/i.test(r.reply));

  console.log('\nEl modelo ve el contenido real de la página');
  chk('el prompt incluye las secciones con su contenido', ultimoPrompt.includes('"Título viejo"') && ultimoPrompt.includes('id "beneficios"'));
  chk('las imágenes no ensucian el prompt', ultimoPrompt.includes('[imagen que subió la usuaria]') && !ultimoPrompt.includes('MILOGO'));
  chk('le prohíbe tocar los archivos del usuario', /NUNCA incluyas estos campos[\s\S]*logo_url/.test(ultimoPrompt));

  console.log('\nCambio de texto en una sección');
  mockIA({reply:'Cambié el título de la portada.',ops:[{section:'hero',set:{title:'Título nuevo'}}]});
  r = await C.chatEditLandingSections('cambiá el título del hero', base(), 'b', 'curso', []);
  let hero = r.sections.find(s=>s.id==='hero');
  chk('aplicó el título nuevo', hero.content.title === 'Título nuevo');
  chk('conservó el subtítulo', hero.content.subtitle === 'Sub');
  chk('conservó la foto subida', hero.content.image_url === 'data:image/png;base64,MIFOTO');
  chk('las otras secciones intactas', r.sections.find(s=>s.id==='precio').content.price === '$120');

  console.log('\nCambio en una lista (agregar un beneficio)');
  mockIA({reply:'Agregué un tercer beneficio.',ops:[{section:'beneficios',set:{items:[{icon:'star',title:'B1',desc:'d1'},{icon:'star',title:'B2',desc:'d2'},{icon:'bolt',title:'B3',desc:'d3'}]}}]});
  r = await C.chatEditLandingSections('agregá un beneficio más', base(), 'b', 'curso', []);
  chk('la lista quedó con 3', r.sections.find(s=>s.id==='beneficios').content.items.length === 3);

  console.log('\nVarias secciones a la vez');
  mockIA({reply:'Ajusté el precio y el cierre.',ops:[
    {section:'precio',set:{price:'$97'}},
    {section:'hero',set:{cta:'Quiero entrar'}}]});
  r = await C.chatEditLandingSections('poné el precio en 97 y cambiá el botón', base(), 'b', 'curso', []);
  chk('cambió el precio', r.sections.find(s=>s.id==='precio').content.price === '$97');
  chk('cambió el botón', r.sections.find(s=>s.id==='hero').content.cta === 'Quiero entrar');
  chk('informa las dos secciones', (r.changed||[]).length === 2);

  console.log('\nSi la IA intenta borrar un archivo, se ignora');
  mockIA({reply:'ok',ops:[{section:'nav',set:{logo_url:'',logo_size:'22'}}]});
  r = await C.chatEditLandingSections('achicá el logo', base(), 'b', 'curso', []);
  chk('el logo sobrevive igual', r.sections.find(s=>s.id==='nav').content.logo_url === 'data:image/png;base64,MILOGO');

  console.log('\nPregunta que no es un cambio');
  mockIA({reply:'La página tiene 4 secciones: barra, portada, beneficios y precio.',ops:[]});
  r = await C.chatEditLandingSections('qué secciones tiene mi página?', base(), 'b', 'curso', []);
  chk('responde sin tocar nada', r.reply.includes('4 secciones') && !r.changed);

  console.log('\nSi la respuesta viene rota, no rompe la landing');
  C._call = async () => 'esto no es json';
  r = await C.chatEditLandingSections('hacé algo', base(), 'b', 'curso', []);
  chk('avisa con un mensaje claro', /no entend/i.test(r.reply));
  chk('la landing queda intacta', r.sections.find(s=>s.id==='hero').content.title === 'Título viejo');

  console.log('\nEl copy que devuelve el chat también sale sin voseo');
  mockIA({reply:'Listo',ops:[{section:'hero',set:{title:'Sumate y empezá hoy',subtitle:'Vas a ver que podés'}}]});
  r = await C.chatEditLandingSections('cambiá el título', base(), 'b', 'curso', []);
  hero = r.sections.find(s=>s.id==='hero');
  chk('sin voseo en el resultado', hero.content.title === 'Súmate y empieza hoy' && hero.content.subtitle === 'Vas a ver que puedes');

  console.log('\n'+(f===0?'🎉 TODOS PASAN':'⚠️ '+f+' FALLAN'));
  process.exit(f?1:0);
})();
