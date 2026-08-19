const fs=require('fs'); const st={};
global.localStorage={getItem:k=>st[k]??null,setItem:(k,v)=>st[k]=String(v),removeItem:k=>delete st[k]};
global.window={location:{search:''},LANDING_PALETTES_DEF:[{id:'b',primary:'#2E5BFF',accent:'#7c3aed',bg:'#09090b',surface:'x',fg:'#fff',mode:'dark'}]};
global.document={getElementById:()=>null,createElement:()=>({style:{},classList:{add(){},remove(){}},setAttribute(){},appendChild(){}}),querySelectorAll:()=>[],body:{appendChild(){}}};
global.navigator={userAgent:'node'};
eval(fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8')+'\n;globalThis.C=Claude;');
const C=globalThis.C;
let f=0; const chk=(n,ok)=>{console.log(' '+(ok?'✅':'❌'),n); if(!ok)f++;};

// El planificador OLVIDA los bonos, igual que pasó de verdad
const PLAN_SIN_BONOS = { title:'Marca que Habla Sola', sections:[
  {id:'hero',brief:''},{id:'problema',brief:''},{id:'beneficios',brief:''},
  {id:'como-funciona',brief:''},{id:'precio',brief:''},{id:'footer',brief:''}]};

// El prompt de Sandra: menciona bonos, precio, garantía, testimonios y FAQ
const BRIEF = `Producto: "Marca que Habla Sola" — mentoría grupal de 8 semanas.
Bonos incluidos:
- Bono 1: Auditoría escrita de tu perfil actual (valor $80)
- Bono 2: Banco de 60 ideas de contenido (valor $45)
- Bono 3: Guiones de respuesta cuando preguntan el precio (valor $35)
Precio: $390, o 3 pagos de $145.
Garantía: si después de las primeras 2 sesiones no es para ti, se devuelve el 100%.
Testimonios de gente que pasó de recomendaciones a consultas semanales.
Objeciones para el FAQ: "no tengo tiempo", "me da vergüenza mostrarme".`;

(async () => {
  C._call = async (m) => {
    const msg = m[m.length-1].content;
    if (msg.includes('Elegí las secciones ideales')) return JSON.stringify(PLAN_SIN_BONOS);
    const jsonStart = msg.indexOf('\n{');
    return jsonStart !== -1 ? msg.slice(jsonStart) : '{}';
  };
  const r = await C.generateLandingSectioned(BRIEF, 'b');
  const ids = r.sections.map(s=>s.id);
  console.log('secciones generadas:', ids.join(', '));
  console.log();
  chk('agrega BONOS aunque el planificador los olvide', ids.includes('bonos'));
  chk('agrega GARANTÍA mencionada en el brief', ids.includes('garantia'));
  chk('agrega TESTIMONIOS mencionados', ids.includes('testimonios'));
  chk('agrega FAQ mencionado', ids.includes('faq'));
  chk('mantiene precio (está en el brief)', ids.includes('precio'));
  chk('los bonos van antes del precio', ids.indexOf('bonos') < ids.indexOf('precio'));
  chk('la garantía va después del precio', ids.indexOf('garantia') > ids.indexOf('precio'));
  chk('el footer queda último', ids[ids.length-1] === 'footer');
  chk('el nav queda primero', ids[0] === 'nav');
  const bon = r.sections.find(s=>s.id==='bonos');
  chk('la sección de bonos trae contenido', !!(bon && bon.content && bon.html.includes('<section')));

  // Un producto SIN bonos ni precio no debe inventarlos
  C._call = async (m) => {
    const msg = m[m.length-1].content;
    if (msg.includes('Elegí las secciones ideales')) return JSON.stringify({title:'X',sections:[
      {id:'hero',brief:''},{id:'beneficios',brief:''},{id:'bonos',brief:''},{id:'precio',brief:''},{id:'footer',brief:''}]});
    const j = msg.indexOf('\n{'); return j !== -1 ? msg.slice(j) : '{}';
  };
  const r2 = await C.generateLandingSectioned('Mentoría de yoga, agendar una llamada para conversar', 'b');
  const ids2 = r2.sections.map(s=>s.id);
  console.log('\nsin precio ni bonos en el brief →', ids2.join(', '));
  chk('no inventa sección de bonos', !ids2.includes('bonos'));
  chk('no inventa sección de precio', !ids2.includes('precio'));

  console.log('\n'+(f===0?'🎉 TODOS PASAN':'⚠️ '+f+' FALLAN'));
  process.exit(f?1:0);
})();
