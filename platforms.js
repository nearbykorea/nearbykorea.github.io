(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const form = $('#filters');
  const fields = Object.fromEntries(['search','category','kind','mode','city'].map(key => [key, $(`#platform-${key}`)]));
  const cards = [...document.querySelectorAll('.platform')];
  const normalise = value => value.normalize('NFKC').toLocaleLowerCase().trim();
  const texts = new Map(cards.map(card => [card, normalise(card.textContent)]));
  let view = 'cards', map, markers, visible = [];
  const markerFor = new Map();
  [...new Set(cards.map(card => card.dataset.city).filter(Boolean))].sort().forEach(city => fields.city.add(new Option(city, city)));
  const restore = () => {
    form.reset(); const params = new URLSearchParams(location.search);
    for (const [key, field] of Object.entries(fields)) {
      let value = params.get(key === 'search' ? 'q' : key) || '';
      if (key === 'category' && value === 'restaurants') value = 'Food / Restaurants';
      if (field.tagName === 'INPUT') field.value = value.slice(0,200);
      else if ([...field.options].some(option => option.value === value)) field.value = value;
    }
    view = params.get('view') === 'map' ? 'map' : 'cards';
  };
  const writeURL = () => {
    const params = new URLSearchParams();
    for (const [key, field] of Object.entries(fields)) if (field.value) params.set(key === 'search' ? 'q' : key, field.value);
    if (view === 'map') params.set('view','map');
    history.replaceState(null,'',location.pathname + (params.size ? '?' + params : '') + location.hash);
  };
  const onMap = card => card.dataset.coordinates && fields.mode.value !== 'Online' && card.dataset.mode !== 'Online';
  const renderMap = pinned => {
    if (!pinned.length) return;
    try {
      if (!window.L) throw new Error('Map library unavailable');
      if (!map) {
        map = L.map('platform-map',{scrollWheelZoom:false});
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).on('tileerror', () => { $('#map-error').hidden = false; }).addTo(map);
        markers = L.layerGroup().addTo(map);
      }
      map.closePopup(); markers.clearLayers(); markerFor.clear();
      for (const card of pinned) {
        const coordinates = card.dataset.coordinates.split(',').map(Number);
        const popup = document.createElement('div');
        const link = card.querySelector('h3 a').cloneNode(true);
        const address = document.createElement('p'); address.textContent = card.querySelector('.venue-address').textContent;
        popup.append(link,address,card.querySelector('.venue-actions a').cloneNode(true));
        const name = card.querySelector('h3').textContent.trim();
        const marker = L.marker(coordinates,{title:name,alt:name}).bindPopup(popup).addTo(markers); markerFor.set(card,marker);
      }
      map.invalidateSize();map.fitBounds(pinned.map(card => card.dataset.coordinates.split(',').map(Number)),{padding:[35,35],maxZoom:13});
    } catch (_) { $('#map-error').hidden = false; }
  };
  const render = () => {
    const terms = normalise(fields.search.value).split(/\s+/).filter(Boolean);
    const mode = fields.mode.value;
    visible = cards.filter(card => {
      const d = card.dataset;
      const matches = terms.every(term => texts.get(card).includes(term)) &&
        (!fields.category.value || fields.category.value === d.category) &&
        (!fields.kind.value || fields.kind.value === d.kind) &&
        (!mode || mode === d.mode || (d.mode === 'Hybrid' && ['UK venues','Online'].includes(mode))) &&
        (!fields.city.value || mode === 'Online' || fields.city.value === d.city);
      card.hidden = !matches; return matches;
    });
    const pinned = visible.filter(onMap);
    $('#platform-count').textContent = `${visible.length} of ${cards.length} places & resources`;
    $('#platform-empty').hidden = visible.length !== 0;
    $('#platform-cards').setAttribute('aria-pressed',String(view === 'cards'));
    $('#platform-map-view').setAttribute('aria-pressed',String(view === 'map'));
    fields.city.disabled = mode === 'Online';
    document.querySelectorAll('[data-interest]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.interest === fields.category.value)));
    $('#platform-map-note').hidden = view !== 'map';
    $('#platform-map-note').textContent = `${pinned.length} confirmed venues on the map. ${visible.length - pinned.length} online or unlocated resources remain in the cards.`;
    $('#platform-map-panel').hidden = view !== 'map' || pinned.length === 0;
    $('#discovery-layout').classList.toggle('is-map',view === 'map' && pinned.length > 0);
    cards.forEach(card => { const button = card.querySelector('[data-focus-place]'); if (button) button.hidden = mode === 'Online'; });
    if (view === 'map') renderMap(pinned);
    writeURL();
  };
  const clear = () => { form.reset(); render(); fields.search.focus(); };
  form.addEventListener('submit', event => { event.preventDefault(); render(); });
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  $('#platform-clear').addEventListener('click',clear);
  $('#empty-clear').addEventListener('click',clear);
  $('#platform-cards').addEventListener('click',() => {view='cards';render();});
  $('#platform-map-view').addEventListener('click',() => {view='map';render();});
  document.querySelectorAll('[data-interest]').forEach(button => button.addEventListener('click',() => {
    // A quick interest is a fresh starting point; hidden filter combinations cannot mask it.
    form.reset(); fields.category.value = button.dataset.interest; render();
  }));
  document.addEventListener('click',event => {
    const button = event.target.closest('[data-focus-place]'); if (!button) return;
    const card = button.closest('.platform'); view = 'map';render();
    const marker = markerFor.get(card); if (marker) { map.setView(marker.getLatLng(),15);marker.openPopup(); }
    $('#platform-map-panel').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  window.addEventListener('popstate',() => {restore();render();});
  restore();render();
})();
