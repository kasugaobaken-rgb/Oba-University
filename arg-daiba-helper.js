/* 大馬大学サイト：ARG調査メモ連携 */
(function(){
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
      description: '過去の課外活動規程では、1980年代の同好会・サークル設立には最低3名の在学生が必要だったと記載されている。'
    },
    daiba_occult_club: {
      id: 'daiba_occult_club',
      title: '大馬大学：最上清貴はオカルト研究会に所属',
      source: '大馬大学 卒業生ポータル',
      description: '卒業生ポータルの学籍情報に、最上清貴が在学時にオカルト研究会へ所属していた記録が残っている。'
    },
    daiba_alumni_record: {
      id: 'daiba_alumni_record',
      title: '大馬大学：最上清貴の卒業生記録',
      source: '大馬大学 卒業生ポータル',
      description: '最上清貴の生年月日、入学年月、卒業年月、文学部所属などが卒業生ポータルで確認できる。'
    }
  };

  function read(key){
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch(e){ return []; }
  }
  function write(key, value){
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){}
  }
  function recordVisitedSite(siteId){
    const list = read(VISITED_KEY);
    if(!list.includes(siteId)) list.push(siteId);
    write(VISITED_KEY, list);
  }
  function saveEvidence(id){
    const ev = EVIDENCE[id];
    if(!ev) return;
    const list = read(EVIDENCE_KEY);
    const idx = list.findIndex(item => item.id === ev.id);
    if(idx >= 0) list[idx] = Object.assign({}, list[idx], ev);
    else list.push(ev);
    write(EVIDENCE_KEY, list);
    showToast('調査メモに保存しました。最上との通信で添付できます。');
    const btn = document.querySelector('[data-arg-evidence="' + id + '"]');
    if(btn) btn.textContent = '調査メモに保存済み';
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
    setTimeout(()=>toast.classList.remove('show'), 2600);
  }
  function makeBtn(label, id){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'arg-evidence-btn';
    b.dataset.argEvidence = id;
    b.textContent = label;
    b.addEventListener('click', ()=>saveEvidence(id));
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
  function insertSiteEvidence(){
    const hero = document.querySelector('.page-hero-inner') || document.querySelector('.content-wrap') || document.querySelector('main') || document.body;
    if(!document.querySelector('[data-arg-evidence="daiba_site_found"]')){
      const wrap = document.createElement('div');
      wrap.className = 'arg-evidence-wrap arg-site-confirm';
      wrap.appendChild(makeBtn('このサイトを調査メモに保存', 'daiba_site_found'));
      hero.appendChild(wrap);
    }
  }
  function enhanceClubsPage(){
    if(!location.pathname.endsWith('/clubs.html') && !location.pathname.endsWith('clubs.html')) return;
    const table = document.querySelector('.data-table');
    if(table && !document.querySelector('.arg-archive-note')){
      const tr = document.createElement('tr');
      tr.className = 'arg-archive-note';
      tr.innerHTML = '<th>過去規程資料</th><td>学内アーカイブによると、1980年代の同好会・サークル設立届は、在学生3名以上の署名により受理されていたと記録されています。<br><span class="arg-small">※現行の公認サークル申請条件とは異なります。</span></td>';
      table.appendChild(tr);
      const wrap = document.createElement('div');
      wrap.className = 'arg-evidence-wrap';
      wrap.appendChild(makeBtn('この規程を調査メモに保存', 'daiba_club_rule'));
      table.insertAdjacentElement('afterend', wrap);
    }
  }
  function enhanceAlumniPage(){
    if(!location.pathname.endsWith('/alumni-portal.html') && !location.pathname.endsWith('alumni-portal.html')) return;
    const target = document.getElementById('dash-view');
    if(!target) return;
    const obs = new MutationObserver(()=>{
      if(target.classList.contains('show') && !document.getElementById('arg-alumni-evidence')){
        const block = document.createElement('div');
        block.id = 'arg-alumni-evidence';
        block.className = 'arg-evidence-wrap arg-alumni-box';
        block.innerHTML = '<div class="arg-box-title">調査メモ</div><p class="arg-small">この卒業生記録は、最上清貴本人に確認する際の証拠として保存できます。</p>';
        block.appendChild(makeBtn('最上清貴の卒業生記録を保存', 'daiba_alumni_record'));
        block.appendChild(makeBtn('オカルト研究会所属を保存', 'daiba_occult_club'));
        target.insertBefore(block, target.querySelector('.dash-meta') || null);
      }
    });
    obs.observe(target, {attributes:true, childList:true, subtree:true});
  }
  document.addEventListener('DOMContentLoaded', function(){
    recordVisitedSite('daiba');
    addFloatingBack();
    insertSiteEvidence();
    enhanceClubsPage();
    enhanceAlumniPage();
  });
  window.saveDaibaEvidence = saveEvidence;
  window.recordVisitedSite = recordVisitedSite;
})();
