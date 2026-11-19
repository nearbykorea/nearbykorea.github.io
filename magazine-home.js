(() => {
  const koreaPanel = document.getElementById('kn-korea-panel');
  const photoSize = document.getElementById('jongno-size');
  photoSize.addEventListener('click', () => {
    const compact = koreaPanel.classList.toggle('album-strip');
    photoSize.setAttribute('aria-expanded', String(!compact));
    photoSize.querySelector('span').textContent = compact ? 'Enlarge photos' : 'Reduce photos';
  });

  const section = document.querySelector('#kn-magazine');
  const culture = document.getElementById('kn-culture');
  const home = document.getElementById('kn-jongno');
  const books = Array.from(section.querySelectorAll('.edition-book'));
  const next = section.querySelector('#kn-book-next');
  const previous = section.querySelector('#kn-book-prev');
  const parameters = new URLSearchParams(location.search);
  section.dataset.layout = 'letter';

  const menu = document.getElementById('section-menu');
  const opener = document.getElementById('section-menu-open');
  let menuDestination = null;
  opener.addEventListener('click', () => {
    menuDestination = null;
    menu.showModal();
    opener.setAttribute('aria-expanded', 'true');
  });
  document.getElementById('section-menu-close').addEventListener('click', () => menu.close());
  menu.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link) {
      menuDestination = document.getElementById(link.hash.slice(1));
      menu.close();
    } else if (event.target === menu) {
      const bounds = menu.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) menu.close();
    }
  });
  menu.addEventListener('close', () => {
    opener.setAttribute('aria-expanded', 'false');
    if (menuDestination) {
      const heading = menuDestination.querySelector('h2,h3') || menuDestination;
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll:true});
      menuDestination = null;
    }
  });

  const images = Array.from(home.querySelectorAll('img[data-alt-ko]'));
  images.forEach(image => { image.dataset.altEn = image.alt; });

  function language(code) {
    section.lang = code === 'ko' ? 'ko' : 'en-GB';
    culture.lang = section.lang;
    for (const item of home.querySelectorAll('[data-copy]')) item.hidden = item.dataset.copy !== code;
    for (const button of home.querySelectorAll('[data-edition]')) {
      button.setAttribute('aria-pressed', String(button.dataset.edition === code));
    }
    for (const link of home.querySelectorAll('[data-reading]')) {
      const page = link.dataset.reading;
      const target = new URL('reader.html', location.href);
      if (link.closest('.edition-rail')) target.searchParams.set('from', 'shelf');
      if (link.closest('.family-recipes')) target.searchParams.set('from', 'family');
      if (page === 'letter') target.searchParams.set('from', 'letter');
      if (culture.contains(link)) target.searchParams.set('from', 'artists');
      const index = books.indexOf(link);
      if (index > 0) target.searchParams.set('book', String(index));
      target.hash = code + '/' + page;
      link.href = target.href;
    }
    images.forEach(image => { image.alt = code === 'ko' ? image.dataset.altKo : image.dataset.altEn; });
  }

  language(parameters.get('edition') === 'ko' ? 'ko' : 'en');
  home.querySelectorAll('[data-edition]').forEach(button => {
    button.addEventListener('click', () => {
      language(button.dataset.edition);
      const current = new URL(location.href);
      current.searchParams.set('edition', button.dataset.edition);
      history.replaceState(history.state, '', current.href);
    });
  });

  const shelf = section.querySelector('.books');
  let start = null;
  shelf.addEventListener('touchstart', event => {
    start = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
  }, { passive: true });
  shelf.addEventListener('touchcancel', () => { start = null; });
  shelf.addEventListener('touchend', event => {
    if (!start || !section.closest('.compact')) return;
    const point = event.changedTouches[0];
    const dx = point.clientX - start.x;
    const dy = point.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
      event.preventDefault();
      (dx < 0 ? next : previous).click();
    }
  }, { passive: false });

  const initialBook = Number(parameters.get('book'));
  if (Number.isInteger(initialBook) && initialBook > 0 && initialBook < books.length) {
    for (let i = 0; i < initialBook; i++) next.click();
  }
})();
