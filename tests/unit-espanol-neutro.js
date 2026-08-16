const fs=require('fs'); const storage={};
global.localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v),removeItem:k=>delete storage[k]};
global.window={location:{search:''},LANDING_PALETTES_DEF:[{id:'blue-purple',primary:'#2E5BFF',accent:'#7c3aed',bg:'#09090b',surface:'x',fg:'#fff',mode:'dark'}]};
global.document={getElementById:()=>null,createElement:()=>({style:{},classList:{add(){},remove(){}},setAttribute(){},appendChild(){}}),querySelectorAll:()=>[],body:{appendChild(){}}};
global.navigator={userAgent:'node'};
eval(fs.readFileSync(require('path').resolve(__dirname,'..','app.js'),'utf8')+'\n;globalThis.C=Claude;');
const C=globalThis.C;
let f=0; const chk=(a,b)=>{const r=C._deVos(a); const ok=r===b; if(!ok)f++; console.log((ok?'✅':'❌'),JSON.stringify(a),'→',JSON.stringify(r), ok?'':('(esperado: '+b+')'));};

console.log('Frases típicas de landing:');
chk('Ya tenés todo lo que necesitás para empezar','Ya tienes todo lo que necesitas para empezar');
chk('Sumate hoy y empezá a ver resultados','Súmate hoy y empieza a ver resultados');
chk('Si querés, podés probarlo sin riesgo','Si quieres, puedes probarlo sin riesgo');
chk('Esto es para vos si sos profesional','Esto es para ti si eres profesional');
chk('Fijate cómo quedó y contame qué pensás','Fíjate cómo quedó y cuéntame qué piensas');
chk('Unite a las personas que ya lo lograron','Únete a las personas que ya lo lograron');
chk('Escribinos y te respondemos','Escríbenos y te respondemos');
chk('Descargá la guía y seguí los pasos','Descarga la guía y sigue los pasos');
chk('Trabajamos con vos durante 8 semanas','Trabajamos contigo durante 8 semanas');
chk('¿Estás listo? Empezá ahora','¿Estás listo? Empieza ahora');
chk('Aprendé a cocinar sin perder tiempo','Aprende a cocinar sin perder tiempo');

console.log('\nMayúsculas y contexto:');
chk('Tenés que verlo','Tienes que verlo');
chk('PODÉS lograrlo','PUEDES lograrlo');

console.log('\nNo debe romper palabras normales:');
chk('El curso es en inglés y francés','El curso es en inglés y francés');
chk('Después del proceso vas a estar mejor','Después del proceso vas a estar mejor');
chk('Nosotros y vosotros somos distintos','Nosotros y vosotros somos distintos');
chk('Ya está todo listo','Ya está todo listo');
chk('Más de 2.000 personas','Más de 2.000 personas');

console.log('\nObjeto completo (como lo devuelve la IA):');
const obj={title:'Tenés que probarlo',subtitle:'Sumate y mirá los resultados',cta:'Quiero empezar',
  image_url:'https://x.com/vos-foto.jpg', image_prompt:'happy+woman', icon:'check_circle',
  items:[{title:'Ahorrás tiempo',desc:'Podés cocinar toda la semana'},{title:'Aprendé rápido',desc:'Sin vueltas'}],
  features:['Accedés cuando querés','Llevate las plantillas']};
const out=C._neutralize(obj);
const okObj = out.title==='Tienes que probarlo' && out.subtitle==='Súmate y mira los resultados'
  && out.items[0].title==='Ahorras tiempo' && out.items[0].desc==='Puedes cocinar toda la semana'
  && out.items[1].title==='Aprende rápido'
  && out.features[0]==='Accedes cuando quieres' && out.features[1]==='Llévate las plantillas';
console.log(okObj?'✅':'❌','todo el contenido queda en neutro'); if(!okObj){f++;console.log(JSON.stringify(out,null,1));}
const okUrl = out.image_url==='https://x.com/vos-foto.jpg' && out.icon==='check_circle' && out.image_prompt==='happy+woman';
console.log(okUrl?'✅':'❌','no toca URLs, iconos ni prompts de imagen'); if(!okUrl)f++;

console.log('\nVerbos no listados (regla general):');
chk('Accedés cuando querés','Accedes cuando quieres');
chk('Compartís tu experiencia','Compartes tu experiencia');
chk('Definís tu mensaje y construís tu marca','Defines tu mensaje y construyes tu marca');
chk('Recibís el material al instante','Recibes el material al instante');

console.log('\nPalabras que NO son voseo (no deben tocarse):');
chk('El curso es en inglés, no en francés','El curso es en inglés, no en francés');
chk('Después de un mes vas a ver el interés','Después de un mes vas a ver el interés');
chk('Quizás sea más de lo que estás buscando','Quizás sea más de lo que estás buscando');
chk('Un país con raíz cultural','Un país con raíz cultural');
chk('Jamás vuelvas atrás','Jamás vuelvas atrás');

console.log('\n'+(f===0?'🎉 TODOS PASAN':'⚠️ '+f+' FALLAN'));
process.exit(f?1:0);
