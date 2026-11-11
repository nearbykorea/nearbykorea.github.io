/* Reviewed directory snapshot; optional statistics are handled separately. */
'use strict';
const catalogue=window.KOREA_DIRECTORY;
const entries=catalogue.entries;
const categories=[['all','All interests','grid'],['restaurants','Food / Restaurants','food'],['groceries','Groceries','bag'],['language','Learn Korean','book'],['schools','Korean schools','school'],['sport','Taekwondo','sport'],['culture','Arts & culture','culture'],['shopping','K-pop & beauty','music'],['recipes','Cook Korean','food'],['resources','Discover Korea','globe']];
const icons={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16"/>',bag:'<path d="M4 7h16l1 14H3ZM8 8V6a4 4 0 0 1 8 0v2"/>',book:'<path d="M12 5C9 2 3 3 3 3v16s6-1 9 2c3-3 9-2 9-2V3s-6-1-9 2ZM12 5v16"/>',school:'<path d="m2 9 10-6 10 6-10 6ZM6 12v6c4 3 8 3 12 0v-6M22 9v8"/>',food:'<path d="M5 3v7m3-7v7M3 3v5c0 4 7 4 7 0V3M6.5 12v9M19 3c-4 3-4 7-4 10h4m0-10v18"/>',sport:'<circle cx="15" cy="4" r="2"/><path d="m12 8 5 5 4-2M12 8l-5 4-4-1m9-3-1 8-6 5m6-5 6 1 3 4"/>',culture:'<path d="m2 8 10-6 10 6ZM4 11v8m5-8v8m6-8v8m5-8v8M2 22h20"/>',music:'<path d="M10 18V5l11-2v13M10 9l11-2"/><ellipse cx="6.5" cy="18" rx="3.5" ry="3"/><ellipse cx="17.5" cy="16" rx="3.5" ry="3"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/>'};
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon=name=>`<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.globe}</svg>`;
const cat=id=>categories.find(x=>x[0]===id)||categories[0];
const fold=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const state={query:'',city:'all',category:'all',mode:'all',view:'cards'};
let map,markers,loadPromise,renderVersion=0,focusBeforeDialog;

function readURL(){
 const p=new URLSearchParams(location.search);
 state.query=(p.get('q')||'').slice(0,200);
 state.city=[...new Set(entries.map(d=>d.city)),'all'].includes(p.get('city'))?p.get('city'):'all';
 state.category=categories.some(c=>c[0]===p.get('category'))?p.get('category'):'all';
 state.mode=['all','visit','online'].includes(p.get('mode'))?p.get('mode'):'all';
 state.view=p.get('view')==='map'?'map':'cards';
}
function writeURL(){const p=new URLSearchParams();for(const [k,v] of Object.entries(state))if(v&&v!=='all'&&v!=='cards')p.set(k==='query'?'q':k,v);history.replaceState(null,'',location.pathname+(p.size?'?'+p:'')+location.hash);}
function canVisit(d){return d.mode!=='online'&&(state.city==='all'||d.city===state.city);}
function canOnline(d){return d.mode==='online'||d.mode==='both';}
function filtered(){
 const terms=fold(state.query).trim().split(/\s+/).filter(Boolean);
 return entries.filter(d=>{
  if(state.category!=='all'&&d.category!==state.category&&!(state.category==='language'&&d.category==='schools'))return false;
  const hay=fold([d.name,d.korean,d.city,d.summary,d.category,cat(d.category)[1],d.address,...d.tags].join(' '));
  if(!terms.every(t=>hay.includes(t)))return false;
  return state.mode==='visit'?canVisit(d):state.mode==='online'?canOnline(d):canVisit(d)||canOnline(d);
 });
}
function modeLabel(d){return state.mode==='online'||!canVisit(d)?'Online':d.mode==='both'?'Visit + online':'Visit a place';}
function card(d){const online=state.mode==='online'||!canVisit(d);return `<article class="listing" data-id="${esc(d.id)}"><div class="listing-top"><span class="category-icon ${d.category}">${icon(cat(d.category)[2])}</span><span class="mode-badge ${online?'online':''}">${icon(online?'globe':'pin')}${modeLabel(d)}</span></div><h3><button data-details="${esc(d.id)}">${esc(d.name)}</button></h3><p class="korean-name" lang="ko">${esc(d.korean)}</p><p class="listing-summary">${esc(d.summary)}</p><p class="listing-location">${icon(online?'globe':'pin')}${online?(d.city?'Online · also in '+esc(d.city):'Online · accessible from the UK'):esc(d.city)}</p><div class="listing-bottom"><span class="listing-category">${esc(cat(d.category)[1])}</span><button data-details="${esc(d.id)}" aria-label="Details and source for ${esc(d.name)}">Details & source</button></div></article>`;}
function updateControls(){
 $('#search').value=state.query;$('#city').value=state.city;
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.mode)));
 $('#cards-view').setAttribute('aria-pressed',String(state.view==='cards'));$('#map-view').setAttribute('aria-pressed',String(state.view==='map'));
 $('#categories').innerHTML=categories.map(([id,name,i])=>`<button class="category" data-category="${id}" aria-pressed="${id===state.category}">${icon(i)}${name}</button>`).join('');
 $('#reset').hidden=!state.query&&state.city==='all'&&state.category==='all'&&state.mode==='all';
}
function render(){
 const version=++renderVersion;updateControls();writeURL();const rows=filtered();
 const placeCount=rows.filter(canVisit).length,onlineCount=rows.filter(canOnline).length;
 $('#result-count').textContent=`${rows.length} ${state.mode==='online'?'online ':''}${rows.length===1?'discovery':'discoveries'}${state.city!=='all'&&state.mode!=='online'?' · '+state.city+(state.mode==='visit'?'':' + online'):''}`;
 const scope=state.city!=='all'&&state.mode!=='visit';$('#scope-note').hidden=!scope;
 $('#scope-note').textContent=state.mode==='online'?'Online resources are available beyond city boundaries. Your city choice is kept for “Visit a place”.':`Showing places in ${state.city}, plus resources available online. “Visit + online” listings may appear in both views.`;
 $('#empty').hidden=rows.length>0;$('#results').hidden=state.view==='map'||!rows.length;$('#map-panel').hidden=state.view!=='map'||!rows.length;
 if(state.view==='cards')$('#results').innerHTML=rows.map(card).join('');
 else if(rows.length)renderMap(rows,version);
 return {count:rows.length,places:placeCount,online:onlineCount,entries:rows.map(({id,name,mode,city,website})=>({id,name,mode,city,website}))};
}
function reset(){Object.assign(state,{query:'',city:'all',category:'all',mode:'all'});render();}
function showDialog(content){focusBeforeDialog=document.activeElement;$('#detail-content').innerHTML=content;if(!$('#details').open)$('#details').showModal();}
function detail(id){
 const d=entries.find(d=>d.id===id);if(!d)return;
 const sourceLabel=d.source_kind==='government education directory'?'Korean Education Centre listing':'Official source';
 const website=state.mode==='online'&&d.online_url?d.online_url:d.website;
 const linkLabel=d.source_kind==='government education directory'?'View official school listing':d.mode==='online'?'Open website':'Visit official website';
 showDialog(`<span class="category-icon ${d.category}">${icon(cat(d.category)[2])}</span><h2 id="detail-title">${esc(d.name)}</h2><p class="korean-name" lang="ko">${esc(d.korean)}</p><p>${esc(d.summary)}</p><dl><dt>Explore</dt><dd>${d.mode==='both'?'In person and online':d.mode==='online'?'Online resource':'In person'}</dd><dt>${d.mode==='online'?'Access':'Location'}</dt><dd>${d.mode==='online'?'Available from the UK':esc(d.address||d.city+' · see provider for venue')}</dd><dt>Cost</dt><dd>${esc(d.cost)}</dd>${d.category==='schools'?`<dt>Learners</dt><dd>${esc(d.audience)}</dd>`:''}</dl><h3>Before you go${d.mode==='online'?' online':''}</h3><p>${esc(d.note)}</p><div class="detail-actions"><a class="primary" href="${esc(website)}" target="_blank" rel="noopener noreferrer">${linkLabel}</a>${d.address?`<a class="secondary" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.name+' '+d.address)}" target="_blank" rel="noopener noreferrer">Get directions</a>`:''}${d.mode==='both'&&d.online_url&&website!==d.online_url?`<a class="secondary" href="${esc(d.online_url)}" target="_blank" rel="noopener noreferrer">Explore online</a>`:''}</div><p class="detail-meta verified-note">${sourceLabel} reviewed ${new Date(d.checked_at+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}. <a href="${esc(d.source_url)}" target="_blank" rel="noopener noreferrer">View source</a>.<br>A source check is not a personal visit or a guarantee of current availability.${d.coordinates?'<br>Map location is approximate, based on the published postcode.':''}</p>`);
}
function about(){showDialog(`<p class="eyebrow">A LITTLE CLOSER TO KOREA</p><h2 id="detail-title">Curated with curiosity.<br>Checked at the source.</h2><p>Korea, Nearby is an independent directory for people in the UK who want to explore Korean food, language and culture.</p><h3>What’s in this first edition?</h3><p>${entries.length} listings: selected shops, restaurants, cultural organisations, taekwondo finders, language resources and community Korean schools. Coverage includes England, Scotland, Wales and Northern Ireland, with fewer verified listings in some regions. This is a starting point, not a complete list of everything Korean in the UK.</p><h3>Places and online resources</h3><p>Visit a place for an in-person experience. Explore online for courses, recipes, shopping, programmes and useful directories. Sites with both options can appear in both views. A booking website alone does not make a restaurant an online experience.</p><h3>Our sources</h3><p>We review providers’ websites and official organisations, including the Korean Education Centre UK and British Taekwondo. Each listing includes its source and review date. School listings reflect the official directory; contact the school for current admissions and venue details. Closed schools are excluded from active results.</p><p>We do not claim to have visited every place. Dates, prices, delivery areas and opening hours can change. Check with the provider before travelling, booking or buying.</p><h3>About the map</h3><p>Only physical places with a confirmed public address and a valid postcode are pinned. Pins indicate postcode areas, not exact entrances. Online resources and places awaiting a precise venue stay in the list beside or below the map.</p><h3>Photo & map credits</h3><p>Food photograph by <a href="https://unsplash.com/photos/a-table-topped-with-bowls-of-food-and-chopsticks--UUkXJIXgy4" target="_blank" rel="noopener noreferrer">Maria Klichik on Unsplash</a>, used under the <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash Licence</a>. It illustrates Korean cuisine, not a listed restaurant. Map data © OpenStreetMap contributors; postcode coordinates from Postcodes.io.</p><h3>Your privacy</h3><p>No account is needed to explore. Optional statistics run only after you allow them; search terms are not collected. Read our <a href="privacy.html">privacy and statistics notice</a> to change your preference. The page loads typefaces from Google Fonts and map tiles from OpenStreetMap when the map is opened. External websites follow their own privacy policies.</p>`);}

function loadMap(){
 if(window.L)return Promise.resolve();if(loadPromise)return loadPromise;
 loadPromise=new Promise((resolve,reject)=>{const css=document.createElement('link');css.rel='stylesheet';css.href='assets/leaflet/leaflet.css';document.head.append(css);const script=document.createElement('script');script.src='assets/leaflet/leaflet.js';script.onload=()=>window.L?resolve():reject(new Error('Map unavailable'));script.onerror=()=>reject(new Error('Map unavailable'));document.head.append(script);}).catch(e=>{loadPromise=null;throw e;});return loadPromise;
}
async function renderMap(rows,version){
 const pinned=rows.filter(d=>d.coordinates&&canVisit(d)&&state.mode!=='online');
 const elsewhere=rows.filter(d=>!pinned.includes(d));
 $('.map-layout').hidden=pinned.length===0;
 $('#map-list-title').textContent=`${pinned.length} ${pinned.length===1?'place':'places'} on this map`;
 $('#map-list').innerHTML=pinned.length?pinned.map((d,i)=>`<button class="map-item" data-map-focus="${esc(d.id)}">${i+1}. ${esc(d.name)}<small>${esc(d.city)} · ${esc(cat(d.category)[1])}</small></button>`).join(''):'<p class="unmapped-copy">No map pins for these results. Your online finds and places without a confirmed map location are below.</p>';
 $('#unmapped').innerHTML=elsewhere.length?`<h3 class="unmapped-heading">${state.mode==='online'?'Your online discoveries':'Beyond the pins'}</h3><p class="unmapped-copy">${state.mode==='online'?'These resources are online, so they don’t need a map pin.':'Online discoveries and places with a venue still to confirm. Nothing disappears when you switch to the map.'}</p><div class="results-grid">${elsewhere.map(card).join('')}</div>`:'';
 if(!pinned.length)return;
 try{
  await loadMap();if(version!==renderVersion||state.view!=='map')return;
  if(!map){$('#map').innerHTML='';map=L.map('map',{scrollWheelZoom:false}).setView([54,-2.8],6);const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);let errors=0;tiles.on('tileerror',()=>{if(++errors===3)$('#map').setAttribute('aria-label','Map tiles unavailable. Use the places list and directions links.');});markers=L.layerGroup().addTo(map);}
  markers.clearLayers();
  pinned.forEach((d,i)=>{const marker=L.marker(d.coordinates,{icon:L.divIcon({className:'map-pin',html:String(i+1),iconSize:[30,30],iconAnchor:[15,15]})});marker._directoryId=d.id;marker.bindPopup(`<strong>${esc(d.name)}</strong><br>${esc(d.address)}<br><button data-details="${esc(d.id)}">Details & source</button>`);marker.addTo(markers);});
  map.invalidateSize();if(pinned.length)map.fitBounds(pinned.map(d=>d.coordinates),{padding:[30,30],maxZoom:13});else map.setView([54,-2.8],5);
 }catch(e){if(version!==renderVersion)return;$('#map').innerHTML='<div class="map-fallback"><h3>The map couldn’t load.</h3><p>You can still explore every result and use the address and directions link in its details.</p><button class="primary" id="map-retry">Try map again</button></div>';}
}

document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));
$('#city').insertAdjacentHTML('beforeend',[...new Set(entries.map(d=>d.city).filter(Boolean))].sort().map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join(''));
$('#all-count').textContent=entries.length;
$('#search-form').addEventListener('submit',e=>{e.preventDefault();state.query=$('#search').value;render();$('#directory').scrollIntoView({behavior:'smooth'});});
$('#search').addEventListener('input',()=>{state.query=$('#search').value;render();});
$('#city').addEventListener('change',()=>{state.city=$('#city').value;render();});
document.addEventListener('click',e=>{
 const b=e.target.closest('button,a');if(!b)return;
 if(b.hasAttribute('data-details'))detail(b.dataset.details);
 else if(b.hasAttribute('data-about'))about();
 else if(b.hasAttribute('data-online')){e.preventDefault();Object.assign(state,{mode:'online',category:'all',query:''});render();$('#directory').scrollIntoView({behavior:'smooth'});}
 else if(b.hasAttribute('data-reset')||b.id==='reset'){e.preventDefault();reset();$('#directory').scrollIntoView({behavior:'smooth'});}
 else if(b.hasAttribute('data-mode')){state.mode=b.dataset.mode;render();}
 else if(b.hasAttribute('data-category')){state.category=b.dataset.category;render();if(b.classList.contains('entry-card'))$('#directory').scrollIntoView({behavior:'smooth'});}
 else if(b.id==='cards-view'||b.id==='map-view'){state.view=b.id==='map-view'?'map':'cards';render();}
 else if(b.id==='map-retry')render();
 else if(b.hasAttribute('data-map-focus')){markers?.eachLayer(marker=>{if(marker._directoryId===b.dataset.mapFocus){map.setView(marker.getLatLng(),14);marker.openPopup();}});}
 else if(b.classList.contains('close-dialog'))$('#details').close();
});
$('#details').addEventListener('click',e=>{if(e.target===$('#details')){const r=$('#details').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#details').close();}});
$('#details').addEventListener('close',()=>focusBeforeDialog?.focus());
window.addEventListener('popstate',()=>{readURL();render();});
readURL();render();

// Optional browser agent interface: identical filtering to the visible controls.
if(document.modelContext?.registerTool){
 const controller=new AbortController();
 try{Promise.resolve(document.modelContext.registerTool({name:'search_korea_directory',title:'Search Korea, Nearby',description:'Filter the visible local directory by text, city, interest and visit/online mode. Does not contact or book providers.',inputSchema:{type:'object',properties:{query:{type:'string'},city:{type:'string'},category:{type:'string',enum:categories.map(c=>c[0])},mode:{type:'string',enum:['all','visit','online']}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},execute(input){if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Expected an object');for(const k of Object.keys(input)){if(!['query','city','category','mode'].includes(k)||typeof input[k]!=='string')throw new Error('Invalid filter');}if(input.city&&!['all',...entries.map(d=>d.city)].includes(input.city))throw new Error('Unknown city');if(input.category&&!categories.some(c=>c[0]===input.category))throw new Error('Unknown interest');if(input.mode&&!['all','visit','online'].includes(input.mode))throw new Error('Unknown mode');if(input.query?.length>200)throw new Error('Search is too long');Object.assign(state,{query:'',city:'all',category:'all',mode:'all'},input);return render();}},{signal:controller.signal})).catch(()=>{});}catch(e){}
 window.addEventListener('pagehide',()=>controller.abort(),{once:true});
}
