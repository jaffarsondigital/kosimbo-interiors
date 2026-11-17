(function () {
  var doc = document;
  var lb = doc.querySelector('[data-if="lbOpen"]');
  var ITEMS = window.LB || [];
  var filter = 'all';
  var list = ITEMS.slice();
  var pos = -1;

  function inFilter(it) { return filter === 'all' || (it.cats && it.cats.indexOf(filter) >= 0); }
  function refreshList() { list = ITEMS.filter(inFilter); }

  function fill() {
    var it = list[pos];
    if (!it || !lb) return;
    var v = { lbSrc: it.src, lbAlt: it.alt, lbCap: it.cap, lbShort: it.cap, lbRoom: it.room || '', lbTxt: it.txt || '', lbCount: (pos + 1) + ' of ' + list.length };
    lb.querySelectorAll('[data-bind]').forEach(function (el) { var k = el.getAttribute('data-bind'); if (k in v) el.textContent = v[k]; });
    lb.querySelectorAll('[data-bind-src]').forEach(function (el) { el.src = v[el.getAttribute('data-bind-src')]; });
    lb.querySelectorAll('[data-bind-alt]').forEach(function (el) { el.alt = v[el.getAttribute('data-bind-alt')]; });
  }
  function openLb(i) {
    if (!lb) return;
    var item = ITEMS[i];
    refreshList();
    pos = list.indexOf(item);
    if (pos < 0) pos = 0;
    fill();
    lb.hidden = false;
    doc.body.style.overflow = 'hidden';
    var c = lb.querySelector('[data-act="lbClose"]'); if (c) c.focus();
  }
  function closeLb() { if (!lb) return; lb.hidden = true; doc.body.style.overflow = ''; }
  function step(d) { pos = (pos + d + list.length) % list.length; fill(); }

  var ON = 'background:#1A1C1F;color:#F7F6F3;border:1px solid #1A1C1F;padding:11px 20px;font-size:15px;cursor:pointer;min-height:44px';
  var OFF = 'background:transparent;color:#1A1C1F;border:1px solid #BDB8AD;padding:11px 20px;font-size:15px;cursor:pointer;min-height:44px';
  var CATS = { pickAll: 'all', pickKitchen: 'kitchen', pickWardrobe: 'wardrobe', pickTv: 'tv', pickGypsum: 'gypsum', pickStairs: 'stairs', pickFloor: 'floor' };
  function setFilter(f) {
    filter = f;
    doc.querySelectorAll('[data-cats]').forEach(function (t) {
      t.hidden = !(f === 'all' || t.getAttribute('data-cats').split(',').indexOf(f) >= 0);
    });
    Object.keys(CATS).forEach(function (k) {
      var b = doc.querySelector('[data-act="' + k + '"]');
      if (b) b.style.cssText = CATS[k] === f ? ON : OFF;
    });
  }
  function toggleMore(b) {
    var card = b.closest('article'); if (!card) return;
    var more = card.querySelector('[data-if="isOpen"]');
    var closed = card.querySelector('[data-if="closed"]');
    var open = more.hidden;
    more.hidden = !open;
    if (closed) closed.hidden = open;
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (b.firstChild && b.firstChild.nodeType === 3) b.firstChild.textContent = (open ? 'Read less' : 'Read more') + ' ';
    var arrow = b.querySelector('span'); if (arrow) arrow.style.transform = 'rotate(' + (open ? 90 : 0) + 'deg)';
  }
  function toggleQuote() {
    var box = doc.querySelector('[data-if="quoteOpen"]');
    var b = doc.querySelector('[data-act="toggleQuote"]');
    if (!box || !b) return;
    var open = box.hidden;
    box.hidden = !open;
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.textContent = open ? 'Hide price list' : 'Request a quote';
  }

  doc.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var a = t.getAttribute('data-act');
    if (a === 'openIt') {
      var i = parseInt(t.getAttribute('data-i'), 10);
      if (!window.LB_GALLERY && ITEMS.length && doc.querySelector('.track')) i = i % ITEMS.length;
      openLb(i);
    } else if (a === 'lbClose') closeLb();
    else if (a === 'lbPrev') step(-1);
    else if (a === 'lbNext') step(1);
    else if (a === 'toggle') toggleMore(t);
    else if (a === 'toggleQuote') toggleQuote();
    else if (a in CATS) setFilter(CATS[a]);
  });

  doc.addEventListener('keydown', function (e) {
    var menu = doc.getElementById('navtoggle');
    if (lb && !lb.hidden) {
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    } else if (e.key === 'Escape' && menu) menu.checked = false;
  });

  if (location.hash === '#quote') { var qb = doc.querySelector('[data-if="quoteOpen"]'); if (qb && qb.hidden) toggleQuote(); }
})();
