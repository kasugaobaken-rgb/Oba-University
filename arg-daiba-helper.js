/* 大馬大学サイト：ARG調査メモ連携 v2
   最上フォーム側 localStorage keys:
   - mogami_arg_visited_sites: ["daiba", ...]
   - mogami_arg_evidence: [{id,title,source,description}, ...]
*/
(function(){
  'use strict';

  const EVIDENCE_KEY = 'mogami_arg_evidence';
  const VISITED_KEY = 'mogami_arg_visited_sites';
  const MOGAMI_URL = 'https://kasugaobaken-rgb.github.io/musical-octo-lamp/';

  const EVIDENCE = {
    daiba_site_found: {
      id: 'daiba_site_found',
      title: '大馬大学サイトを確認',
      source: '大馬大学',
      description: '大馬大学の公式サイトが現在も残っていることを確認した。'
    },
    daiba_club_rule: {
      id: 'daiba_club_rule',
      title: '大馬大学：1980年代のサークル設立には3名必要',
      source: '大馬大学 サークル・課外活動',
      description: '学内アーカイブ上の過去規程に、1980年代の同好会・サークル設立届は在学生3名以上で受理されていたと記録されている。'
    },
    daiba_alumni_record: {
      id: 'daiba_alumni_record',
      title: '大馬大学：最上清貴の卒業生記録',
      source: '大馬大学 卒業生ポータル',
      description: '最上清貴の生年月日、入学年月、卒業年月、文学部所属などが卒業生ポータルで確認できる。'
    },
    daiba_occult_club: {
      id: 'daiba_occult_club',
      title: '大馬大学：最上清貴はオカルト研究会に所属',
      source: '大馬大学 卒業生ポータル',
      description: '卒業生ポータルの学籍情報に、最上清貴が在学時にオカルト研究会へ所属していた記録が残っている。'
    }
  };

  function readList(key){
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) {
      return [];
    }
  }

  function writeList(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch(e) { console.warn('[ARG] localStorage write failed:', e); }
  }

  function recordVisitedSite(siteId){
    const id = String(siteId || '').trim();
    if (!id) return;
    const list = readList(VISITED_KEY).map(String);
    if (!list.includes(id)) {
      list.push(id);
      writeList(VISITED_KEY, list);
    }
  }

  function saveMogamiEvidence(id){
    const ev = EVIDENCE[id];
    if (!ev) {
      showToast('この調査メモは登録されていません。');
      return false;
    }
    recordVisitedSite('daiba');
    const list = readList(EVIDENCE_KEY);
    const idx = list.findIndex(item => item && item.id === ev.id);
    if (idx >= 0) list[idx] = Object.assign({}, list[idx], ev);
    else list.push(ev);
    writeList(EVIDENCE_KEY, list);
    markSavedButtons(ev.id);
    showToast('調査メモに保存しました。最上との通信で添付できます。');
    return true;
  }

  function hasEvidence(id){
    return readList(EVIDENCE_KEY).some(item => item && item.id === id);
  }

  function markSavedButtons(id){
    document.querySelectorAll('[data-arg-evidence="' + id + '"]').forEach(btn => {
      btn.classList.add('saved');
      btn.textContent = '調査メモに保存済み';
      btn.setAttribute('aria-label', '調査メモに保存済み');
    });
  }

  function showToast(text){
    let toast = document.querySelector('.arg-toast');
    if(!toast){
      toast = document.createElement('div');
      toast.className = 'arg-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => toast.classList.remove('show'), 2600);
  }

  function makeButton(label, id){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'arg-evidence-btn';
    b.dataset.argEvidence = id;
    b.textContent = hasEvidence(id) ? '調査メモに保存済み' : label;
    if (hasEvidence(id)) b.classList.add('saved');
    b.addEventListener('click', function(){ saveMogamiEvidence(id); });
    return b;
  }

  function addFloatingBack(){
    if(document.querySelector('.arg-back-link')) return;
    const a = document.createElement('a');
    a.className = 'arg-back-link';
    a.href = MOGAMI_URL;
    a.textContent = '最上との通信に戻る';
    document.body.appendChild(a);
  }

  function appendEvidenceBox(container, title, note, buttons){
    if (!container) container = document.querySelector('main') || document.body;
    const box = document.createElement('div');
    box.className = 'arg-evidence-wrap';
    if (title) {
      const h = document.createElement('div');
      h.className = 'arg-box-title';
      h.textContent = title;
      box.appendChild(h);
    }
    if (note) {
      const p = document.createElement('p');
      p.className = 'arg-small';
      p.textContent = note;
      box.appendChild(p);
    }
    buttons.forEach(btn => box.appendChild(btn));
    container.appendChild(box);
    return box;
  }

  function addSiteEvidence(){
    if(document.querySelector('[data-arg-site-confirm]')) return;
    const target = document.querySelector('.page-hero-inner') || document.querySelector('.hero-inner') || document.querySelector('.content-wrap') || document.querySelector('main') || document.body;
    const box = appendEvidenceBox(target, '調査メモ', 'このページを確認した記録を、最上清貴への質問時に添付できます。', [makeButton('このサイトを調査メモに保存', 'daiba_site_found')]);
    box.classList.add('arg-site-confirm');
    box.dataset.argSiteConfirm = 'true';
  }

  function enhanceClubsPage(){
    if(!/clubs\.html$/.test(location.pathname)) return;
    if(document.querySelector('[data-arg-evidence="daiba_club_rule"]')) return;

    const table = document.querySelector('.data-table');
    if (table && !document.querySelector('.arg-archive-note')) {
      const tr = document.createElement('tr');
      tr.className = 'arg-archive-note';
      tr.innerHTML = '<th>過去規程資料</th><td>学内アーカイブによると、1980年代の同好会・サークル設立届は、在学生3名以上の署名により受理されていたと記録されています。<br><span class="arg-small">※現行の公認サークル申請条件とは異なります。</span></td>';
      table.appendChild(tr);
      appendEvidenceBox(table.parentNode, '調査メモ', '1980年代のサークル設立条件は、最上清貴の記憶と照合できそうです。', [makeButton('この規程を調査メモに保存', 'daiba_club_rule')]);
    } else {
      const target = document.querySelector('.content-wrap') || document.querySelector('main') || document.body;
      appendEvidenceBox(target, '過去規程資料', '学内アーカイブによると、1980年代の同好会・サークル設立届は、在学生3名以上の署名により受理されていたと記録されています。', [makeButton('この規程を調査メモに保存', 'daiba_club_rule')]);
    }
  }

  function insertAlumniEvidenceBox(){
    if(!/alumni-portal\.html$/.test(location.pathname)) return;
    const target = document.getElementById('dash-view');
    if(!target || document.getElementById('arg-alumni-evidence')) return;

    const box = document.createElement('div');
    box.id = 'arg-alumni-evidence';
    box.className = 'arg-evidence-wrap arg-alumni-box';
    box.innerHTML = '<div class="arg-box-title">調査メモ</div><p class="arg-small">この卒業生記録は、最上清貴本人に確認する際の証拠として保存できます。</p>';
    box.appendChild(makeButton('最上清貴の卒業生記録を保存', 'daiba_alumni_record'));
    box.appendChild(makeButton('オカルト研究会所属を保存', 'daiba_occult_club'));

    const anchor = document.getElementById('dash-meta') || target.firstElementChild;
    if (anchor && anchor.parentNode === target) target.insertBefore(box, anchor.nextSibling);
    else target.insertBefore(box, target.firstChild);
  }

  function enhanceAlumniPage(){
    if(!/alumni-portal\.html$/.test(location.pathname)) return;
    const target = document.getElementById('dash-view');
    if(!target) return;

    // If already visible from browser restore or code, insert immediately.
    if (target.classList.contains('show')) insertAlumniEvidenceBox();

    const obs = new MutationObserver(function(){
      if(target.classList.contains('show')) insertAlumniEvidenceBox();
    });
    obs.observe(target, {attributes:true, attributeFilter:['class'], childList:true, subtree:true});
  }

  function init(){
    recordVisitedSite('daiba');
    addFloatingBack();
    addSiteEvidence();
    enhanceClubsPage();
    enhanceAlumniPage();
    console.info('[ARG] Daiba evidence helper loaded.');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Public aliases for older snippets / manual buttons.
  window.recordVisitedSite = recordVisitedSite;
  window.saveMogamiEvidence = saveMogamiEvidence;
  window.saveDaibaEvidence = saveMogamiEvidence;
  window.addArgEvidence = saveMogamiEvidence;
})();
