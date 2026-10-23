/* Renders the pages from js/site.js, js/paintings.js and js/exhibitions.js.
   You should not need to edit this file to add paintings or shows. */
(function () {
  'use strict';

  var S = window.SITE || {};
  var P = window.PAINTINGS || [];
  var E = window.EXHIBITIONS || [];
  var ROOT = document.body.getAttribute('data-root') || '';   // "" on root pages, "../" inside /work/
  var PAGE = document.body.getAttribute('data-page');
  var VIEW_LABELS = { front: 'Front', detail: 'Detail', detail2: 'Detail 2', detail3: 'Detail 3', edges: 'Edges', room: 'In a room', exhibition: 'In the exhibition', artist: 'With the artist' };
  var LINK_KEYS = ['email', 'instagram', 'behance', 'saatchi'];   // keys that are web links, not text
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------- images ----------
  function paintingImg(p, view) { return ROOT + 'images/paintings/' + p.id + '/' + view + '.jpg'; }

  // An <img> that, if the file is missing, turns into a grey box naming the missing path.
  function img(src, alt, cls) {
    var e = el('img', cls);
    e.src = src;
    e.alt = alt || '';
    e.loading = 'lazy';
    e.addEventListener('error', function () {
      var d = el('div', 'missing', 'missing: ' + src.replace(ROOT, ''));
      e.parentNode && e.parentNode.replaceChild(d, e);
    });
    return e;
  }

  // ---------- data helpers ----------
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
  function date(s) { return s ? new Date(s + 'T00:00:00') : null; }
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
  function pastShows() {
    var t = today();
    return E.filter(function (e) { var en = exhEnd(e); return en && en < t; })
            .sort(function (a, b) { return date(b.start) - date(a.start); });
  }

  // ---------- a work tile (used on home, work page, "more work") ----------
  function tile(p) {
    var a = el('a', 'tile');
    a.href = ROOT + 'work/painting.html?p=' + encodeURIComponent(p.id);
    var fig = el('figure');
    var box = el('div', 'img');
    box.appendChild(img(paintingImg(p, 'front'), p.title));
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
    for (var i = 0; i < P.length; i++) if (P[i].id === S.hero) hero = P[i];
    if (!hero && P.length) hero = newestFirst(P)[0];
    var heroBox = $('#hero');
    if (hero && heroBox) {
      heroBox.appendChild(img(paintingImg(hero, 'front'), hero.title));
      heroBox.appendChild(el('span', 'caption', hero.title + ', ' + hero.year + ' · ' + hero.medium.toLowerCase() + ' · ' + hero.width_cm + ' × ' + hero.height_cm + ' cm'));
    }

    var avatarBox = $('#avatar');
    if (avatarBox && S.portrait) avatarBox.appendChild(img(ROOT + S.portrait, S.name, 'avatar'));

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
      var url = location.pathname + location.search + (parts.length ? '#' + parts.join('&') : '');
      history.replaceState(null, '', url);
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
    for (var i = 0; i < list.length; i++) if (list[i].id === id) idx = i;
    var p = list[idx];
    var art = $('#artwork');
    if (!p) {
      art.innerHTML = '';
      art.appendChild(el('p', 'empty', 'Painting not found. Check the "p=" part of the address matches an id in js/paintings.js.'));
      return;
    }
    document.title = p.title + (S.name ? ' — ' + S.name : '');

    // previous / next
    var prev = $('#prev'), next = $('#next');
    if (list[idx - 1]) prev.href = 'painting.html?p=' + encodeURIComponent(list[idx - 1].id); else prev.hidden = true;
    if (list[idx + 1]) next.href = 'painting.html?p=' + encodeURIComponent(list[idx + 1].id); else next.hidden = true;

    // images
    var views = (p.views && p.views.length) ? p.views : ['front'];
    var main = $('#main');
    main.appendChild(img(paintingImg(p, views[0]), p.title));
    var thumbs = $('#thumbs');
    if (views.length > 1) {
      views.forEach(function (v, i) {
        var b = el('button');
        b.type = 'button';
        b.setAttribute('aria-pressed', String(i === 0));
        b.appendChild(img(paintingImg(p, v), p.title + ' — ' + (VIEW_LABELS[v] || v)));
        b.appendChild(el('span', null, VIEW_LABELS[v] || v));
        b.addEventListener('click', function () {
          main.innerHTML = '';
          main.appendChild(img(paintingImg(p, v), p.title));
          $$('button', thumbs).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        });
        thumbs.appendChild(b);
      });
    } else {
      thumbs.parentNode.removeChild(thumbs);
    }

    // zoom
    var dlg = $('#zoom'), zoomImg = $('#zoom img');
    main.addEventListener('click', function () {
      var cur = $('img', main);
      if (!cur || !dlg.showModal) return;
      zoomImg.src = cur.src;
      dlg.showModal();
    });
    dlg.addEventListener('click', function () { dlg.close(); });

    // info
    $('#title').textContent = p.title;
    $('#year').textContent = p.year;
    $('#medium').textContent = p.medium;
    $('#size').textContent = sizeText(p);
    var status = $('#status');
    if (p.status === 'sold') {
      status.appendChild(el('span', 'status-text', 'Sold'));
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

    // more work: the next four in the list, wrapping around
    var more = $('#more');
    var others = list.filter(function (x) { return x !== p; });
    var start = idx % Math.max(others.length, 1);
    var pick = others.slice(start).concat(others.slice(0, start)).slice(0, 4);
    pick.forEach(function (x) { more.appendChild(tile(x)); });
  }

  // ---------- ABOUT ----------
  function renderAbout() {
    var portraitBox = $('#portrait');
    if (portraitBox && S.portrait) portraitBox.appendChild(img(ROOT + S.portrait, S.name));
    var studioBox = $('#studio');
    if (studioBox && S.studio) studioBox.appendChild(img(ROOT + S.studio, 'Exhibition view'));

    var ul = $('#cv-exhibitions');
    if (ul) {
      // About lists exhibitions that have already opened (past, plus any running now) — newest first.
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
  }

  // ---------- go ----------
  fillCommon();
  if (PAGE === 'home') renderHome();
  else if (PAGE === 'work') renderWork();
  else if (PAGE === 'painting') renderPainting();
  else if (PAGE === 'about') renderAbout();
})();
