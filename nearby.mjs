export function milesBetween(a, b) {
  const valid = p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite) && Math.abs(p[0]) <= 90 && Math.abs(p[1]) <= 180;
  if (!valid(a) || !valid(b)) return null;
  const rad = n => n * Math.PI / 180;
  const q = Math.sin(rad(b[0] - a[0]) / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return 3958.7613 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, q))));
}

export function formatNearbyMiles(value) {
  if (value === null) return 'Distance unavailable';
  if (value < 1) return 'Less than 1 mile away';
  const rounded = Math.round(value);
  return 'About ' + rounded.toLocaleString('en-GB') + (rounded === 1 ? ' mile away' : ' miles away');
}

export function createNearbySorter({ requestPosition, availability, changed, schedule = setTimeout, cancel = clearTimeout }) {
  // Coordinates stay in this closure. Do not add them to widget state, URLs or analytics.
  let origin = null, phase = 'idle', message = '', revision = 0, timer = null;
  const stopTimer = () => { if (timer !== null) cancel(timer); timer = null; };
  const errors = {
    1: 'Location access was not allowed. Choose a city or try again.',
    2: 'We could not find your location. Choose a city or try again.',
    3: 'Finding your location took too long. Choose a city or try again.'
  };
  return {
    get phase() { return phase; },
    get message() { return message; },
    distance(place) { return milesBetween(origin, place.coordinates); },
    sort(items) {
      if (phase !== 'active') return items.slice();
      return items.map((place, index) => ({ place, index, miles: milesBetween(origin, place.coordinates) }))
        .sort((a, b) => (a.miles ?? Infinity) - (b.miles ?? Infinity) || a.index - b.index)
        .map(item => item.place);
    },
    clear() { revision++; stopTimer(); origin = null; phase = 'idle'; message = ''; },
    request() {
      if (phase === 'locating') return;
      const unavailable = availability();
      origin = null;
      if (unavailable) { phase = 'error'; message = unavailable; changed(); return; }
      const id = ++revision;
      phase = 'locating'; message = 'Finding your location…'; changed();
      const fail = error => {
        if (id !== revision || phase !== 'locating') return;
        stopTimer(); origin = null; phase = 'error'; message = errors[error?.code] || errors[2]; changed();
      };
      timer = schedule(() => fail({ code: 3 }), 15000);
      try {
        requestPosition(position => {
          if (id !== revision || phase !== 'locating') return;
          const point = [position?.coords?.latitude, position?.coords?.longitude];
          if (milesBetween(point, point) === null) { fail({ code: 2 }); return; }
          stopTimer(); origin = point; phase = 'active'; message = ''; changed();
        }, fail);
      } catch { fail({ code: 2 }); }
    }
  };
}
