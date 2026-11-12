import {createNearbySorter,formatNearbyMiles} from './nearby.mjs';
import {filterDiscoveries} from './homepage-search.mjs';

    (()=>{
      const root=document.getElementById('kn-jongno');
      const books=Array.from(root.querySelectorAll('.book'));
      const count=root.querySelector('#kn-book-count');
      const intro=root.querySelector('#kn-intro');
      const discoveryTabs=[root.querySelector('#kn-korea-tab'),root.querySelector('#kn-uk-tab')];
      const discoveryPanels=[root.querySelector('#kn-korea-panel'),root.querySelector('#kn-uk-panel')];
      const design={view:'Automatic',spacing:100};
      let current=0,discovery=0,compact=false;
      const places=JSON.parse(root.querySelector('#kn-uk-data').textContent);
      const england=JSON.parse(root.querySelector('#kn-uk-geometry').textContent);
      const uk={category:'all',city:'all',page:0,version:2};
      const ukCities=[...new Set(places.map(p=>p.city_group))].sort();
      const ukCity=root.querySelector('#kn-uk-city');
      const devonOption=document.createElement('option');devonOption.value='Devon';devonOption.textContent='Devon · Exeter & Plymouth';ukCity.append(devonOption);
      ukCities.forEach(city=>{const o=document.createElement('option');o.value=city;o.textContent=city==='London'?'London & New Malden':['Exeter','Plymouth'].includes(city)?city+' · Devon':city;ukCity.append(o);});
      const escapeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const categoryName={restaurants:'Restaurant',groceries:'Shop & market',schools:'Korean school',culture:'Arts & culture'};
      const categoryLabels={all:'All',restaurants:'Restaurants',groceries:'Shops & markets',schools:'Korean schools',culture:'Culture'};
      const hasCoordinates=p=>Array.isArray(p.coordinates)&&p.coordinates.length===2&&p.coordinates.every(Number.isFinite);
      const nearby=createNearbySorter({
        availability:()=>{
          const policy=document.permissionsPolicy||document.featurePolicy;
          if(!window.isSecureContext||!navigator.geolocation||policy?.allowsFeature?.('geolocation')===false)return 'Location is unavailable here. Choose a city instead.';
          return '';
        },
        requestPosition:(success,failure)=>navigator.geolocation.getCurrentPosition(success,failure,{enableHighAccuracy:false,timeout:10000,maximumAge:60000}),
        changed:()=>{if(nearby.phase==='active'){uk.city='all';uk.page=0;}renderUK();}
      });
      const cityShort=c=>c==='Newcastle upon Tyne'?'Newcastle':c==='Staines-upon-Thames'?'Staines':c;
      const ukBase=()=>places.filter(p=>uk.category==='all'||p.category===uk.category);
      const inArea=p=>uk.city==='all'||p.city_group===uk.city||p.county===uk.city;
      function renderUK(){
        const base=ukBase().filter(inArea);
        const nearest=uk.category==='restaurants'&&nearby.phase==='active';
        const filtered=nearest?nearby.sort(base):base;
        root.querySelector('#kn-uk-nearby').hidden=uk.category!=='restaurants';
        const locate=root.querySelector('#kn-uk-locate');
        locate.disabled=nearby.phase==='locating';
        locate.textContent=nearby.phase==='locating'?'Finding you…':nearby.phase==='active'?'Refresh location':'Near me';
        root.querySelector('#kn-uk-clear-location').hidden=!['active','locating'].includes(nearby.phase);
        root.querySelector('#kn-uk-location-status').textContent=nearby.phase==='active'?'Nearest first · approximate straight-line distances in miles.':nearby.phase==='idle'?'Use your location to see the closest restaurants first.':nearby.message;
        const pages=Math.max(1,Math.ceil(filtered.length/3));uk.page=Math.min(Math.max(0,uk.page),pages-1);
        root.querySelectorAll('[data-category]').forEach(b=>{const key=b.dataset.category,n=key==='all'?places.length:places.filter(p=>p.category===key).length;b.setAttribute('aria-pressed',String(key===uk.category));b.innerHTML=escapeText(categoryLabels[key])+(n?' <span>'+n+'</span>':'');});
        ukCity.value=uk.city;
        root.querySelector('#kn-uk-result-title').textContent=uk.category==='groceries'&&!filtered.length?'Shops & markets':filtered.length+' '+(filtered.length===1?'place':'places')+(uk.city==='all'?' across England':' · '+cityShort(uk.city));
        root.querySelector('#kn-uk-page-count').textContent=filtered.length?(uk.page+1)+' / '+pages:'';
        root.querySelector('#kn-uk-results').innerHTML=filtered.length?filtered.slice(uk.page*3,uk.page*3+3).map(p=>{
          const school=p.category==='schools';
          const rating=school?'Enrolment enquiries':Number.isFinite(p.rating)?('★ '+p.rating.toFixed(1)+(Number.isFinite(p.reviews)?' · '+p.reviews.toLocaleString('en-GB')+' Google reviews':' · Google')+(/whole museum/.test(p.rating_scope||'')?' · whole museum':'')):'Rating not yet confirmed';
          const note=p.note||(p.id==='vam-korea'?'The Google rating is for the whole V&A, not the Korean Gallery.':'');
          return `<article class="uk-place" data-place-id="${escapeText(p.id)}"><p class="uk-place-type">${escapeText(categoryName[p.category])} · ${escapeText(p.city)}</p><h4>${escapeText(p.name)}</h4>${p.korean?`<p class="uk-place-ko" lang="ko">${escapeText(p.korean)}</p>`:''}${nearest?`<p class="uk-place-distance">${escapeText(formatNearbyMiles(nearby.distance(p)))}</p>`:''}<div class="uk-place-rating">${escapeText(rating)}</div><p class="uk-place-description">${escapeText(p.summary)}</p>${p.address?`<address>${escapeText(p.address)}</address>`:''}<div class="uk-place-links"><a href="${escapeText(p.website)}" target="_blank" rel="noopener noreferrer">${school?'School information':'Official website'} ↗</a>${p.maps_url?`<a href="${escapeText(p.maps_url)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>`:''}</div>${note?`<p class="uk-place-note">${escapeText(note)}</p>`:''}</article>`;
        }).join(''):'<p class="uk-place">No places in this selection yet. Choose another city or category.</p>';
        root.querySelector('#kn-uk-prev').disabled=uk.page===0;
        root.querySelector('#kn-uk-next').disabled=uk.page===pages-1;
        root.querySelector('.uk-pagination').hidden=pages===1;
        drawUKMap();
      }
      let ukMapW=0,ukMapH=0;
      function drawUKMap(){
        if(!window.d3)return;
        const box=root.querySelector('#kn-uk-map'),w=box.clientWidth;
        const allGroups=ukCities.map(city=>{const located=places.filter(p=>p.city_group===city&&hasCoordinates(p));return{city,lat:d3.mean(located,p=>p.coordinates[0]),lon:d3.mean(located,p=>p.coordinates[1])};}).filter(c=>Number.isFinite(c.lat)&&Number.isFinite(c.lon));
        const leftCities=new Set([...allGroups].sort((a,b)=>a.lon-b.lon).slice(0,Math.ceil(allGroups.length/2)).map(c=>c.city));
        const h=Math.max(root.classList.contains('compact')?460:510,Math.ceil(allGroups.length/2)*45+48);
        if(box.style.height!==h+'px')box.style.height=h+'px';
        if(!w||!h)return;ukMapW=w;ukMapH=h;
        const svg=d3.select(box.querySelector('svg')).attr('viewBox',`0 0 ${w} ${h}`);svg.selectAll('*').remove();
        const feature=JSON.parse(JSON.stringify(england));
        if(d3.geoArea(feature)>Math.PI*2){const polys=feature.geometry.type==='MultiPolygon'?feature.geometry.coordinates:[feature.geometry.coordinates];polys.forEach(poly=>poly.forEach(ring=>ring.reverse()));}
        const projection=d3.geoMercator().fitExtent([[16,16],[w-16,h-16]],feature);
        svg.append('path').datum(feature).attr('d',d3.geoPath(projection)).attr('fill','var(--sage)').attr('stroke','var(--rule)').attr('stroke-width',1);
        const grouped=allGroups.map(c=>{const items=ukBase().filter(p=>p.city_group===c.city);const xy=projection([c.lon,c.lat]);return{city:c.city,n:items.length,x:xy[0],y:xy[1],side:leftCities.has(c.city)?'left':'right'};}).filter(c=>c.n);
        const labelLayer=box.querySelector('.uk-map-labels');labelLayer.replaceChildren();
        const labelWidth=root.classList.contains('compact')?100:106;
        ['left','right'].forEach(side=>{
          const rows=grouped.filter(c=>c.side===side).sort((a,b)=>a.y-b.y);let last=-22;
          rows.forEach(c=>{c.ly=Math.max(24,c.y,last+45);last=c.ly;});
          if(last>h-24){const overflow=last-(h-24);rows.forEach(c=>c.ly-=overflow);}
          rows.forEach(c=>{
            const selected=uk.city===c.city||(uk.city==='Devon'&&['Exeter','Plymouth'].includes(c.city));
            const tx=side==='left'?labelWidth:w-labelWidth;
            svg.append('path').attr('d',`M${c.x},${c.y}L${tx},${c.ly}`).attr('fill','none').attr('stroke',selected?'var(--green)':'var(--rule)').attr('stroke-width',1);
            svg.append('circle').attr('cx',c.x).attr('cy',c.y).attr('r',selected?5:3.5).attr('fill','var(--green)');
            const button=document.createElement('button');button.type='button';button.className='uk-map-label cursor-interaction';button.style[side]='0';button.style.top=c.ly+'px';button.setAttribute('aria-pressed',String(selected));button.setAttribute('aria-label',`${c.city}: ${c.n} places`);button.innerHTML=`<span>${c.n}</span>${escapeText(cityShort(c.city))}`;button.addEventListener('click',()=>{uk.city=c.city;uk.page=0;renderUK();});labelLayer.append(button);
          });
        });
      }
      root.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{const chosen=button.dataset.category;uk.category=uk.category===chosen?'all':chosen;if(uk.category!=='restaurants')nearby.clear();uk.city='all';uk.page=0;renderUK();}));
      const locationDialog=root.querySelector('#kn-location-dialog');
      root.querySelector('#kn-uk-locate').addEventListener('click',()=>locationDialog.showModal());
      root.querySelector('#kn-location-allow').addEventListener('click',()=>{locationDialog.close();nearby.request();});
      root.querySelector('#kn-location-city').addEventListener('click',()=>{locationDialog.close();ukCity.focus();});
      root.querySelector('.location-close').addEventListener('click',()=>locationDialog.close());
      root.querySelector('#kn-uk-clear-location').addEventListener('click',()=>{nearby.clear();uk.page=0;renderUK();});
      window.addEventListener('pagehide',()=>nearby.clear());
      ukCity.addEventListener('change',()=>{uk.city=ukCity.value;uk.page=0;renderUK();});
      root.querySelector('#kn-uk-reset').addEventListener('click',()=>{nearby.clear();uk.category='all';uk.city='all';uk.page=0;renderUK();});
      root.querySelector('#kn-uk-prev').addEventListener('click',()=>{uk.page--;renderUK();});
      root.querySelector('#kn-uk-next').addEventListener('click',()=>{uk.page++;renderUK();});
      new ResizeObserver(entries=>{const r=entries[0].contentRect;if(r.width!==ukMapW||r.height!==ukMapH)drawUKMap();}).observe(root.querySelector('#kn-uk-map'));

      function render(){
        root.style.maxWidth=design.view==='Phone'?'390px':'none';
        root.style.setProperty('--section-space',design.spacing+'px');
        compact=root.getBoundingClientRect().width<640;
        root.classList.toggle('compact',compact);
        books.forEach((b,i)=>b.hidden=compact&&i!==current);
        count.textContent=(current+1)+' / 3';
        discoveryTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===discovery));tab.tabIndex=i===discovery?0:-1;});
        discoveryPanels.forEach((panel,i)=>panel.hidden=i!==discovery);
        renderUK();
      }
      root.querySelector('#kn-book-prev').addEventListener('click',()=>{current=(current+2)%3;render();});
      root.querySelector('#kn-book-next').addEventListener('click',()=>{current=(current+1)%3;render();});
      discoveryTabs.forEach((tab,i)=>{
        tab.addEventListener('click',()=>{discovery=i;render();});
        tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();discovery=event.key==='Home'?0:event.key==='End'?1:1-i;render();discoveryTabs[discovery].focus();}});
      });
      const search={query:'',city:'all',category:'all',mode:'places',page:0};
      const searchCity=root.querySelector('#kn-search-city');
      searchCity.innerHTML=ukCity.innerHTML.replace('All cities','Anywhere in England');
      const searchInput=root.querySelector('#kn-search');
      const searchInterest=root.querySelector('#kn-search-interest');
      const onlineEntries=(window.KOREA_DIRECTORY?.entries||[]).filter(p=>p.mode==='online'||p.mode==='both');
      function searchCard(p){
        const online=search.mode==='online';
        const website=online?(p.online_url||p.website):p.website;
        const type=online?'Online · available from the UK':(categoryName[p.category]+' · '+p.city);
        const rating=online?'':p.category==='schools'?'Enrolment enquiries':Number.isFinite(p.rating)?'★ '+p.rating.toFixed(1)+' · Google'+(/whole museum/.test(p.rating_scope||'')?' · whole museum':''):'';
        return `<article class="uk-place"><p class="uk-place-type">${escapeText(type)}</p><h3>${escapeText(p.name)}</h3>${p.korean?`<p class="uk-place-ko" lang="ko">${escapeText(p.korean)}</p>`:''}<p class="uk-place-description">${escapeText(p.summary)}</p>${rating?`<p class="uk-place-rating">${escapeText(rating)}</p>`:''}${!online&&p.address?`<address>${escapeText(p.address)}</address>`:''}<div class="uk-place-links"><a href="${escapeText(website)}" target="_blank" rel="noopener noreferrer">${online?'Explore online':'Official website'} ↗</a>${!online&&p.maps_url?`<a href="${escapeText(p.maps_url)}" target="_blank" rel="noopener noreferrer">Google Maps ↗</a>`:''}</div>${p.note?`<p class="uk-place-note">${escapeText(p.note)}</p>`:''}${online&&p.checked_at?`<p class="uk-place-note">Source reviewed ${escapeText(p.checked_at)}. Check the provider for current details.</p>`:''}</article>`;
      }
      function runSearch(){
        const matches=filterDiscoveries({places,online:onlineEntries},search);
        const pages=Math.max(1,Math.ceil(matches.length/6));search.page=Math.min(search.page,pages-1);
        root.querySelector('#kn-search-output').hidden=false;
        root.querySelector('#kn-search-summary').textContent=matches.length+' '+(search.mode==='online'?'online discoveries':'places')+(search.city!=='all'&&search.mode==='places'?' · '+search.city:'');
        root.querySelector('#kn-search-results').innerHTML=matches.length?matches.slice(search.page*6,search.page*6+6).map(searchCard).join(''):'<p class="search-empty">No discoveries here just yet. Try a broader search, another city or Explore online.</p>';
        root.querySelector('#kn-search-page').textContent=(search.page+1)+' / '+pages;
        root.querySelector('#kn-search-prev').disabled=search.page===0;
        root.querySelector('#kn-search-next').disabled=search.page===pages-1;
        root.querySelector('#kn-search-page').parentElement.hidden=pages===1;
      }
      function setSearchMode(mode){
        search.mode=mode;search.page=0;searchCity.disabled=mode==='online';
        root.querySelectorAll('[data-search-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.searchMode===mode)));
      }
      root.querySelector('#kn-search-form').addEventListener('submit',event=>{event.preventDefault();search.query=searchInput.value.slice(0,200);search.city=searchCity.value;search.category=searchInterest.value;search.page=0;runSearch();});
      root.querySelectorAll('[data-search-mode]').forEach(button=>button.addEventListener('click',()=>{search.query=searchInput.value.slice(0,200);search.city=searchCity.value;search.category=searchInterest.value;setSearchMode(button.dataset.searchMode);runSearch();}));
      root.querySelector('#kn-search-prev').addEventListener('click',()=>{search.page--;runSearch();root.querySelector('#kn-search-summary').scrollIntoView({block:'start'});});
      root.querySelector('#kn-search-next').addEventListener('click',()=>{search.page++;runSearch();root.querySelector('#kn-search-summary').scrollIntoView({block:'start'});});
      const query=new URLSearchParams(location.search);
      if(['q','category','city','mode'].some(key=>query.has(key))){
        searchInput.value=(query.get('q')||'').slice(0,200);
        if([...searchCity.options].some(o=>o.value===query.get('city')))searchCity.value=query.get('city');
        if([...searchInterest.options].some(o=>o.value===query.get('category')))searchInterest.value=query.get('category');
        search.query=searchInput.value;search.city=searchCity.value;search.category=searchInterest.value;
        setSearchMode(query.get('mode')==='online'?'online':'places');runSearch();
      }

      render();
      new ResizeObserver(render).observe(root);
    })();
  