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
  const parameters = new URLSearchParams(location.search);

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
      if (page === 'issue' || page === 'magazine') target.searchParams.set('from', 'shelf');
      if (link.closest('.family-recipes')) target.searchParams.set('from', 'family');
      if (page === 'letter') target.searchParams.set('from', 'letter');
      if (culture.contains(link)) target.searchParams.set('from', 'artists');
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

  // Previous homepage editions linked to the full letter through these anchors.
  function openLegacyLetter() {
    if (location.hash === '#editors-letter' || location.hash === '#edit-letter-title') {
      location.replace(section.querySelector('[data-reading="letter"]').href);
    }
  }
  // Old mobile shelf links selected the family recipes or shopping card by index.
  if (location.hash === '#magazine-shelf') {
    if (parameters.get('book') === '1') location.replace('#family-recipes');
    if (parameters.get('book') === '2') {
      const code = section.lang === 'ko' ? 'ko' : 'en';
      location.replace('reader.html?from=shelf#' + code + '/shop');
    }
  }
  openLegacyLetter();
  window.addEventListener('hashchange', openLegacyLetter);
})();
