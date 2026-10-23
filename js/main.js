/* Renders every page from the files in data/ (site.json, paintings.json, exhibitions.json, about.json).
   Those files are what the editor at /admin writes. You should not need to edit this file. */
(function () {
  'use strict';

  var ROOT = document.body.getAttribute('data-root') || '';   // "" on root pages, "../" inside /work/
  var PAGE = document.body.getAttribute('data-page');
  var LINK_KEYS = ['email', 'instagram', 'behance', 'saatchi'];
  var VIEW_ORDER = ['front', 'detail', 'detail2', 'detail3', 'edges', 'room', 'exhibition', 'artist'];
  var VIEW_LABELS = { front: 'Front', detail: 'Detail', detail2: 'Detail 2', detail3: 'Detail 3', edges: 'Edges', room: 'In a room', exhibition: 'In the exhibition', artist: 'With the artist' };
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  var S = {}, P = [], E = [], A = {};

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------- loading ----------
  function loadJSON(name) {
    return fetch(ROOT + 'data/' + name + '.json', { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error('Could not load data/' + name + '.json (' + r.status + ')');
      return r.json();
    });
  }
  function loadError(err) {
    var box = el('div', 'load-error');
    if (location.protocol === 'file:') {
      box.textContent = 'This page needs a local web server to load its data. Double-click preview.bat in the site folder, or open the live site.';
    } else {
      box.textContent = 'The site data could not be loaded. ' + (err && err.message ? err.message : '');
    }
    document.body.insertBefore(box, document.body.firstChild);
  }

  // ---------- helpers ----------
  function slugify(s) {
    var map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'i̇': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
    return String(s || '').replace(/[çğıi̇öşüÇĞİÖŞÜ]/g, function (c) { return map[c] || c; })
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'work';
  }
  function pid(p) { return p.id || slugify(p.title); }
  function src(path) { return path ? ROOT + String(path).replace(/^\/+/, '') : ''; }
  function views(p) {
    var imgs = p.images || {};
    return VIEW_ORDER.filter(function (v) { return imgs[v]; });
  }
  function frontSrc(p) { var v = views(p); return v.length ? src(p.images[v[0]]) : ''; }

  // An <img> that, if the file is missing, turns into a grey box naming the missing path.
  function img(s, alt, cls) {
    var e = el('img', cls);
    e.src = s;
    e.alt = alt || '';
    e.loading = 'lazy';
    e.addEventListener('error', function () {
      var d = el('div', 'missing', 'missing: ' + s.replace(ROOT, ''));
      e.parentNode && e.parentNode.replaceChild(d, e);
    });
    return e;
  }

  function newestFirst(list) {
    return list.slice().sort(function (a, b) {
      return (b.year - a.year) || ((a.order || 99) - (b.order || 99));
    });
  }
  function inches(cm) { return (cm / 2.54).toFixed(1); }
  function sizeText(p) {
    return p.width_cm + ' × ' + p.height_cm + ' cm · ' + inches(p.width_cm) + ' × ' + inches(p.height_cm) + ' in';
  }
  function today() { var t = new Date(); t.setHours(0, 0, 0, 0); return t; }
  function date(s) { return s ? new Date(String(s).slice(0, 10) + 'T00:00:00') : null; }
  function fmt(d, withYear) { return d.getDate() + ' ' + MONTHS[d.getMonth()] + (withYear ? ' ' + d.getFullYear() : ''); }
  function exhDates(e) {
    var s = date(e.start), en = date(e.end), t = today();
    if (s && en) {
      if (s <= t) return 'Until ' + fmt(en, true);
      return fmt(s, s.getFullYear() !== en.getFullYear()) + ' – ' + fmt(en, true);
    }
    if (s) return fmt(s, true);
    return '';
  }
  function exhEnd(e) { return date(e.end) || date(e.start); }
  function upcomingShows() {
    var t = today();
    return E.filter(function (e) { var en = exhEnd(e); return en && en >= t; })
            .sort(function (a, b) { return date(a.start) - date(b.start); });
  }

  // ---------- a work tile ----------
  function tile(p) {
    var a = el('a', 'tile');
    a.href = ROOT + 'work/painting.html?p=' + encodeURIComponent(pid(p));
    var fig = el('figure');
    var box = el('div', 'img');
    box.appendChild(img(frontSrc(p), p.title));
    var cap = el('figcaption');
    cap.appendChild(el('span', 't', p.title));
    cap.appendChild(el('span', 'm', p.width_cm + ' × ' + p.height_cm + ' cm · ' + p.medium + ' · ' + p.year));
    fig.appendChild(box);
    fig.appendChild(cap);
    a.appendChild(fig);
    return a;
  }

  // ---------- things on every page ----------
  function fillCommon() {
    $$('[data-site]').forEach(function (e) {
      var key = e.getAttribute('data-site');
      var val = S[key];
      if (val == null) return;
      var isLink = e.tagName === 'A' && LINK_KEYS.indexOf(key) !== -1;
      if (isLink && val === '') { e.hidden = true; return; }
      if (isLink) {
        if (key === 'email') { e.href = 'mailto:' + val; e.textContent = val; }
        else { e.href = val; e.target = '_blank'; e.rel = 'noopener'; }
      } else {
        e.textContent = val;
      }
    });
    $$('[data-now-year]').forEach(function (e) { e.textContent = String(new Date().getFullYear()); });
    if (S.name && PAGE !== 'painting') {
      var t = document.title;
      document.title = t && t !== 'Home' ? t + ' — ' + S.name : S.name;
    }
  }

  // ---------- HOME ----------
  function renderHome() {
    var hero = null;
    P.forEach(function (p) { if (pid(p) === S.hero) hero = p; });
    if (!hero && P.length) hero = newestFirst(P)[0];
    var heroBox = $('#hero');
    if (hero && heroBox) {
      heroBox.appendChild(img(frontSrc(hero), hero.title));
      heroBox.appendChild(el('span', 'caption', hero.title + ', ' + hero.year + ' · ' + String(hero.medium || '').toLowerCase() + ' · ' + hero.width_cm + ' × ' + hero.height_cm + ' cm'));
    }

    var avatarBox = $('#avatar');
    if (avatarBox && S.portrait) avatarBox.appendChild(img(src(S.portrait), S.name, 'avatar'));

    var up = upcomingShows().slice(0, 3);
    var sec = $('#exhibitions');
    if (sec) {
      if (!up.length) { var e0 = $('#exh-empty'); if (e0) e0.hidden = false; }
      else {
        var list = $('#exh-list');
        up.forEach(function (e) {
          var row = el('div', 'exh-row');
          row.appendChild(el('span', 'dates', exhDates(e)));
          row.appendChild(el('span', 'title', e.title));
          row.appendChild(el('span', 'venue', [e.venue, e.city].filter(Boolean).join(', ')));
          if (e.url) {
            var a = el('a', 'more', 'Details →');
            a.href = e.url; a.target = '_blank'; a.rel = 'noopener';
            row.appendChild(a);
          }
          list.appendChild(row);
        });
      }
    }

    var sel = P.filter(function (p) { return p.featured; })
               .sort(function (a, b) { return (a.order || 99) - (b.order || 99); });
    if (sel.length < 6) {
      var rest = newestFirst(P).filter(function (p) { return sel.indexOf(p) === -1; });
      sel = sel.concat(rest.slice(0, 6 - sel.length));
    }
    sel = sel.slice(0, 9);
    var grid = $('#selected');
    if (grid) sel.forEach(function (p) { grid.appendChild(tile(p)); });
  }

  // ---------- WORK (all works + filters) ----------
  function renderWork() {
    var grid = $('#grid'), count = $('#count'), empty = $('#empty');
    var years = [];
    P.forEach(function (p) { if (years.indexOf(p.year) === -1) years.push(p.year); });
    years.sort(function (a, b) { return b - a; });
    var yearRow = $('#year-filters');
    years.forEach(function (y) {
      var b = el('button', null, String(y));
      b.type = 'button';
      b.setAttribute('data-year', String(y));
      yearRow.appendChild(b);
    });

    var state = { surface: 'all', year: 'all' };
    function readHash() {
      var h = location.hash.replace('#', '');
      if (!h) return;
      h.split('&').forEach(function (kv) {
        var parts = kv.split('=');
        if (parts[0] === 'surface' && parts[1]) state.surface = parts[1];
        if (parts[0] === 'year' && parts[1]) state.year = parts[1];
      });
    }
    function writeHash() {
      var parts = [];
      if (state.surface !== 'all') parts.push('surface=' + state.surface);
      if (state.year !== 'all') parts.push('year=' + state.year);
      history.replaceState(null, '', location.pathname + location.search + (parts.length ? '#' + parts.join('&') : ''));
    }
    function apply() {
      $$('[data-surface]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-surface') === state.surface)); });
      $$('[data-year]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-year') === state.year)); });
      var list = newestFirst(P).filter(function (p) {
        return (state.surface === 'all' || p.surface === state.surface) &&
               (state.year === 'all' || String(p.year) === state.year);
      });
      grid.innerHTML = '';
      list.forEach(function (p) { grid.appendChild(tile(p)); });
      count.textContent = list.length + (list.length === 1 ? ' work' : ' works') + ' · newest first';
      if (!list.length) {
        empty.hidden = false;
        empty.textContent = 'No works on ' + (state.surface === 'all' ? 'any surface' : state.surface) +
                            (state.year === 'all' ? '' : ' from ' + state.year) + '.';
      } else {
        empty.hidden = true;
      }
      writeHash();
    }
    $$('[data-surface], [data-year]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.hasAttribute('data-surface')) state.surface = b.getAttribute('data-surface');
        if (b.hasAttribute('data-year')) state.year = b.getAttribute('data-year');
        apply();
      });
    });
    readHash();
    apply();
  }

  // ---------- PAINTING (single work) ----------
  function renderPainting() {
    var id = new URLSearchParams(location.search).get('p');
    var list = newestFirst(P);
    var idx = -1;
    list.forEach(function (p, i) { if (pid(p) === id) idx = i; });
    var p = list[idx];
    var art = $('#artwork');
    if (!p) {
      art.innerHTML = '';
      art.appendChild(el('p', 'empty', 'Painting not found.'));
      return;
    }
    document.title = p.title + (S.name ? ' — ' + S.name : '');

    var prev = $('#prev'), next = $('#next');
    if (list[idx - 1]) prev.href = 'painting.html?p=' + encodeURIComponent(pid(list[idx - 1])); else prev.hidden = true;
    if (list[idx + 1]) next.href = 'painting.html?p=' + encodeURIComponent(pid(list[idx + 1])); else next.hidden = true;

    var vs = views(p);
    var main = $('#main');
    if (vs.length) main.appendChild(img(src(p.images[vs[0]]), p.title));
    var thumbs = $('#thumbs');
    if (vs.length > 1) {
      vs.forEach(function (v, i) {
        var b = el('button');
        b.type = 'button';
        b.setAttribute('aria-pressed', String(i === 0));
        b.appendChild(img(src(p.images[v]), p.title + ' — ' + (VIEW_LABELS[v] || v)));
        b.appendChild(el('span', null, VIEW_LABELS[v] || v));
        b.addEventListener('click', function () {
          main.innerHTML = '';
          main.appendChild(img(src(p.images[v]), p.title));
          $$('button', thumbs).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        });
        thumbs.appendChild(b);
      });
    } else if (thumbs) {
      thumbs.parentNode.removeChild(thumbs);
    }

    var dlg = $('#zoom'), zoomImg = $('#zoom img');
    main.addEventListener('click', function () {
      var cur = $('img', main);
      if (!cur || !dlg.showModal) return;
      zoomImg.src = cur.src;
      dlg.showModal();
    });
    dlg.addEventListener('click', function () { dlg.close(); });

    $('#title').textContent = p.title;
    $('#year').textContent = p.year;
    $('#medium').textContent = p.medium || '';
    $('#size').textContent = sizeText(p);
    var status = $('#status');
    if (p.status === 'sold') {
      status.appendChild(el('span', 'status-text', 'Sold'));
    } else if (p.status === 'nfs') {
      status.appendChild(el('span', 'status-text', 'Not for sale'));
    } else if (p.saatchi_url) {
      var a = el('a', 'btn', 'Available on Saatchi Art');
      a.href = p.saatchi_url; a.target = '_blank'; a.rel = 'noopener';
      status.appendChild(a);
    } else {
      status.appendChild(el('span', 'status-text', 'Available'));
    }
    var desc = $('#desc');
    if (p.description) desc.textContent = p.description; else desc.hidden = true;
    var enq = $('#enquire');
    if (S.email) enq.href = 'mailto:' + S.email + '?subject=' + encodeURIComponent('Enquiry: ' + p.title); else enq.hidden = true;

    var more = $('#more');
    var others = list.filter(function (x) { return x !== p; });
    var start = others.length ? idx % others.length : 0;
    others.slice(start).concat(others.slice(0, start)).slice(0, 4).forEach(function (x) { more.appendChild(tile(x)); });
  }

  // ---------- ABOUT ----------
  function renderAbout() {
    var portraitBox = $('#portrait');
    if (portraitBox && S.portrait) portraitBox.appendChild(img(src(S.portrait), S.name));
    var studioBox = $('#studio');
    if (studioBox && S.studio) studioBox.appendChild(img(src(S.studio), 'Exhibition view'));

    var st = $('#statement');
    if (st) {
      String(A.statement || '').split(/\n\s*\n/).forEach(function (para) {
        if (para.trim()) st.appendChild(el('p', null, para.trim()));
      });
    }
    function cvList(ul, items) {
      (items || []).forEach(function (it) {
        var li = el('li');
        li.appendChild(el('span', 'y', String(it.year || '')));
        li.appendChild(el('span', null, it.text || ''));
        ul.appendChild(li);
      });
    }
    cvList($('#cv-education'), A.education);

    var ul = $('#cv-exhibitions');
    if (ul) {
      var t0 = today();
      var shows = E.filter(function (e) { var s0 = date(e.start); return s0 && s0 <= t0; });
      shows.sort(function (a, b) { return date(b.start) - date(a.start); });
      if (!shows.length) ul.appendChild(el('li', null, '—'));
      shows.forEach(function (e) {
        var li = el('li');
        li.appendChild(el('span', 'y', String(date(e.start).getFullYear())));
        li.appendChild(el('span', null, [e.title, e.venue, e.city].filter(Boolean).join(', ')));
        ul.appendChild(li);
      });
    }

    var awardsCol = $('#cv-awards-col');
    if (awardsCol) {
      if (A.show_awards && A.awards && A.awards.length) { awardsCol.hidden = false; cvList($('#cv-awards'), A.awards); }
      else awardsCol.hidden = true;
    }
  }

  // ---------- go ----------
  Promise.all([loadJSON('site'), loadJSON('paintings'), loadJSON('exhibitions'), loadJSON('about')])
    .then(function (res) {
      S = res[0] || {};
      P = (res[1] && res[1].paintings) || [];
      E = (res[2] && res[2].exhibitions) || [];
      A = res[3] || {};
      fillCommon();
      if (PAGE === 'home') renderHome();
      else if (PAGE === 'work') renderWork();
      else if (PAGE === 'painting') renderPainting();
      else if (PAGE === 'about') renderAbout();
    })
    .catch(loadError);
})();
