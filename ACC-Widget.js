(function () {
  'use strict';
  if (document.getElementById('acc-widget-root')) return;

  const _script = document.currentScript ||
    document.querySelector('script[data-client]') ||
    document.querySelector('script[src*="ACC-Widget"]');
  const ACC_CLIENT  = _script ? (_script.getAttribute('data-client')  || '') : '';
  const ACC_TIER    = _script ? (_script.getAttribute('data-tier')    || '1') : '1';
  const ACC_DOMAIN  = _script ? (_script.getAttribute('data-domain')  || window.location.hostname) : window.location.hostname;
  const ACC_COLOR_OVERRIDE = _script ? (_script.getAttribute('data-color') || '') : '';
  const ACC_POS_OVERRIDE   = _script ? (_script.getAttribute('data-position') || '') : '';
  const ACC_LANG_OVERRIDE  = _script ? (_script.getAttribute('data-lang') || 'en') : 'en';
  const ACC_HIDE_FB        = _script ? (_script.getAttribute('data-hide-feedback') === 'true') : false;

  const ACC_RTL = new Set(['ar','he','fa','ur']);

  const _EN = {
    title:'ACC Accessibility',subtitle:'Powered by Auto AI Engine',
    close:'Close accessibility panel',
    tabProfiles:'Profiles',tabSettings:'Settings',tabFeedback:'Feedback',
    profilesIntro:'Select a profile to apply accessibility settings tailored for a specific need.',
    profileVI:'Visually Impaired',profileVIDesc:'Larger text, high contrast, enhanced focus indicators',
    profileCog:'Cognitive / Learning',profileCogDesc:'Dyslexia font, extra spacing, no animations, reading guide',
    profileMotor:'Motor / Physical',profileMotorDesc:'Large cursor, bigger click targets, keyboard navigation',
    profileDeaf:'Deaf / Hard of Hearing',profileDeafDesc:'Highlighted links, muted media, visual cues emphasized',
    profileADHD:'ADHD Friendly',profileADHDDesc:'Reduced visual stimulus, no animations, readable font',
    profileSenior:'Senior Friendly',profileSeniorDesc:'Bigger text, larger cursor, high contrast, generous spacing',
    secContent:'Content',secVision:'Vision',secNavFocus:'Navigation & Focus',
    secReading:'Reading',secMotion:'Motion & Media',
    fontSize:'Font Size',lineHeight:'Line Height',letterSpacing:'Letter Spacing',wordSpacing:'Word Spacing',
    fontFamily:'Font Family',fontDefault:'Default',fontDyslexia:'Dyslexia',fontReadable:'Readable',fontMono:'Monospace',
    textAlign:'Text Align',colourFilter:'Colour Filter',
    focusRing:'Focus Ring',focusRingSub:'Enhanced keyboard focus indicator',
    keyboardNav:'Keyboard Navigation',keyboardNavSub:'High-visibility yellow focus ring',
    largeCursor:'Large Cursor',largeCursorSub:'Enlarged mouse pointer',
    bigTargets:'Big Click Targets',bigTargetsSub:'Min 44px touch target on links & buttons',
    highlightLinks:'Highlight Links',highlightLinksSub:'Outlines all hyperlinks',
    highlightHeadings:'Highlight Headings',highlightHeadingsSub:'Outlines all H1-H6 elements',
    highlightHover:'Highlight on Hover',highlightHoverSub:'Visual outline on hovered elements',
    readingGuide:'Reading Guide',readingGuideSub:'Highlights current reading line',
    readingMask:'Reading Mask',readingMaskSub:'Darkens page above & below focus line',
    textSpacing:'Text Spacing',textSpacingSub:'Extra word & letter spacing (WCAG 1.4.12)',
    pauseAnimations:'Pause Animations',pauseAnimationsSub:'Stops all motion & transitions',
    muteMedia:'Mute All Media',muteMediaSub:'Silences auto-playing audio & video',
    reduceStimulus:'Reduce Stimulus',reduceStimulusSub:'Softer colours, reduced visual noise',
    resetAll:'\u21BA Reset All Settings',
    feedbackTitle:'Submit Feedback',
    feedbackIntro:'Found an accessibility issue on this website? Let us know and we will work to fix it.',
    feedbackType:'Type',feedbackMsg:'Description',feedbackEmail:'Your Email',
    feedbackEmailHint:'optional',feedbackSubmit:'Submit Feedback',
    feedbackSuccess:'Thank you! Your feedback has been submitted.',
    feedbackPlaceholder:'Describe the issue you encountered\u2026',
    typeContrast:'Colour / Contrast',typeNav:'Navigation / Keyboard',typeReader:'Screen Reader',
    typeCaptions:'Captions / Media',typeOther:'Other',
    footer:'ACC Accessibility Widget \u2014 Auto AI Engine',
    activeProfile:'active',clearProfile:'\u2715 Clear',
    scanThisPage:'\u267F Scan This Page',scanComplete:'\u2713 Scan Complete \u2014 Scan Again',
    scanning:'Scanning\u2026',dlReport:'Download Page Report',
    scanInfo:'Scans this page only.',
    noIssues:'Excellent! No accessibility issues found.',
  };

  function getTranslations() { return Object.assign({}, _EN); }

  function applyTranslation(T) {
    var panel = document.getElementById('acc-panel');
    if (panel) panel.setAttribute('dir', ACC_RTL.has((ACC_LANG_OVERRIDE||'en').split('-')[0]) ? 'rtl' : 'ltr');
    var h2el = document.querySelector('#acc-panel .acc-header-title h2');
    var subEl = document.querySelector('#acc-panel .acc-header-title p');
    if (h2el && T.title)    h2el.textContent = T.title;
    if (subEl && T.subtitle) subEl.textContent = T.subtitle;
    var closeBtn = document.getElementById('acc-close');
    if (closeBtn && T.close) closeBtn.setAttribute('aria-label', T.close);
    var tabIds = {'tab-profiles':'tabProfiles','tab-settings':'tabSettings','tab-feedback':'tabFeedback'};
    Object.keys(tabIds).forEach(function(id) {
      var el = document.getElementById(id); if (el && T[tabIds[id]]) el.textContent = T[tabIds[id]];
    });
    var profiles = {
      'visually-impaired':['profileVI','profileVIDesc'],'cognitive':['profileCog','profileCogDesc'],
      'motor':['profileMotor','profileMotorDesc'],'deaf':['profileDeaf','profileDeafDesc'],
      'adhd':['profileADHD','profileADHDDesc'],'senior':['profileSenior','profileSeniorDesc'],
    };
    Object.keys(profiles).forEach(function(key) {
      var card = document.querySelector('[data-profile="'+key+'"]');
      if (!card) return;
      var n = card.querySelector('.acc-profile-name'), d = card.querySelector('.acc-profile-desc');
      if (n && T[profiles[key][0]]) n.textContent = T[profiles[key][0]];
      if (d && T[profiles[key][1]]) d.textContent = T[profiles[key][1]];
    });
    var piEl = document.querySelector('#panel-profiles .acc-profiles-intro');
    if (piEl && T.profilesIntro) piEl.textContent = T.profilesIntro;
    var secMap = {'Content':T.secContent,'Vision':T.secVision,'Navigation & Focus':T.secNavFocus,'Reading':T.secReading,'Motion & Media':T.secMotion};
    document.querySelectorAll('#panel-settings .acc-section').forEach(function(el) {
      var raw = el.textContent.trim(); if (secMap[raw] && el.childNodes[0]) el.childNodes[0].textContent = secMap[raw] + ' ';
    });
    var tmap = {
      'acc-t-focus':['focusRing','focusRingSub'],'acc-t-keyboard':['keyboardNav','keyboardNavSub'],
      'acc-t-cursor':['largeCursor','largeCursorSub'],'acc-t-bigtargets':['bigTargets','bigTargetsSub'],
      'acc-t-links':['highlightLinks','highlightLinksSub'],'acc-t-headings':['highlightHeadings','highlightHeadingsSub'],
      'acc-t-hover':['highlightHover','highlightHoverSub'],'acc-t-guide':['readingGuide','readingGuideSub'],
      'acc-t-mask':['readingMask','readingMaskSub'],'acc-t-spacing':['textSpacing','textSpacingSub'],
      'acc-t-anim':['pauseAnimations','pauseAnimationsSub'],'acc-t-media':['muteMedia','muteMediaSub'],
      'acc-t-stimulus':['reduceStimulus','reduceStimulusSub'],
    };
    Object.keys(tmap).forEach(function(id) {
      var row = document.getElementById(id); if (!row) return;
      var lbl = row.querySelector('.acc-row-label'), sub2 = row.querySelector('.acc-row-sub');
      if (lbl && T[tmap[id][0]]) {
        var icon = lbl.querySelector('.acc-row-icon');
        lbl.textContent = '';
        if (icon) lbl.appendChild(icon);
        lbl.insertAdjacentText('beforeend', '\u00a0' + T[tmap[id][0]]);
      }
      if (sub2 && T[tmap[id][1]]) sub2.textContent = T[tmap[id][1]];
    });
    var resetBtn = document.getElementById('acc-reset');
    if (resetBtn && T.resetAll) resetBtn.textContent = T.resetAll;
    var fbSec = document.querySelector('#panel-feedback-tab .acc-section');
    if (fbSec && T.feedbackTitle && fbSec.childNodes[0]) fbSec.childNodes[0].textContent = T.feedbackTitle + '\u00a0';
    var fbIntro = document.querySelector('#panel-feedback-tab .acc-body > p');
    if (fbIntro && T.feedbackIntro) fbIntro.textContent = T.feedbackIntro;
    var fbMsg = document.getElementById('acc-fb-msg');
    if (fbMsg && T.feedbackPlaceholder) fbMsg.setAttribute('placeholder', T.feedbackPlaceholder);
    var fbBtn = document.getElementById('acc-fb-submit');
    if (fbBtn && T.feedbackSubmit) fbBtn.textContent = T.feedbackSubmit;
    var fbOk = document.getElementById('acc-fb-success');
    if (fbOk && T.feedbackSuccess) fbOk.textContent = T.feedbackSuccess;
    var fbType = document.getElementById('acc-fb-type');
    if (fbType) {
      var opts = fbType.querySelectorAll('option');
      var vals = [T.typeContrast, T.typeNav, T.typeReader, T.typeCaptions, T.typeOther];
      opts.forEach(function(o,i){ if(vals[i]) o.textContent = vals[i]; });
    }
    var footer = document.querySelector('.acc-footer');
    if (footer && T.footer) {
      var img = footer.querySelector('img');
      footer.textContent = T.footer;
      if (img) footer.prepend(img);
    }
  }

  const ACC_API_URL = 'https://wfyzvmfvlukawidowuym.supabase.co';
  const ACC_ANON    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeXp2bWZ2bHVrYXdpZG93dXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyODE3MDksImV4cCI6MjA4ODg1NzcwOX0.UeVjqQtu-eBryHWAnH8wZoX0QPJ1ZNcdRCcAaUbWT1M';

  /* ═══════════════════════════════════════════════════════
     ACC ACCESSIBILITY WIDGET v2  |  acclogo embedded
  ═══════════════════════════════════════════════════════ */

  const ACC_LOGO = 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2064%2064%22%3E%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2214%22%20fill%3D%22%230f1117%22%2F%3E%3Crect%20width%3D%2262%22%20height%3D%2262%22%20x%3D%221%22%20y%3D%221%22%20rx%3D%2213%22%20fill%3D%22none%22%20stroke%3D%22%232a2d3e%22%20stroke-width%3D%221.5%22%2F%3E%3Ccircle%20cx%3D%2232%22%20cy%3D%2214%22%20r%3D%225.5%22%20fill%3D%22%234f8ef7%22%2F%3E%3Cpath%20d%3D%22M32%2021%20L32%2039%22%20stroke%3D%22%234f8ef7%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M13%2027%20L32%2023%20L51%2027%22%20stroke%3D%22%2338d9a9%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20fill%3D%22none%22%2F%3E%3Cpath%20d%3D%22M32%2039%20L22%2053%22%20stroke%3D%22%2338d9a9%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%2F%3E%3Cpath%20d%3D%22M32%2039%20L42%2053%22%20stroke%3D%22%2338d9a9%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E';

  const auditHistory = [];

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.id = 'acc-widget-styles';
  style.textContent = `
:root{--acc-dark:#ffffff;--acc-panel:#ffffff;--acc-surface:#f0f4ff;--acc-border:#dce6f8;--acc-accent:#4f8ef7;--acc-accent2:#38d9a9;--acc-warn:#f5a623;--acc-error:#e53e3e;--acc-text:#0a1628;--acc-muted:#5a6e8c;--acc-font:'Sora',sans-serif;--acc-mono:'JetBrains Mono',monospace}#acc-toggle{position:fixed;bottom:24px;right:24px;width:62px;height:62px;border-radius:16px;background:#ffffff;border:2px solid #4f8ef7;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-shadow:0 4px 20px rgba(79,142,247,.3),0 2px 8px rgba(0,0,0,.12);z-index:2147483646;padding:0;outline:none;transition:transform .2s,box-shadow .3s,border-color .2s}#acc-toggle:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(79,142,247,.4),0 2px 8px rgba(0,0,0,.15);border-color:#3a6fd8}#acc-toggle:focus-visible{outline:3px solid var(--acc-accent) !important;outline-offset:3px !important}#acc-toggle img{width:36px;height:36px;object-fit:contain}#acc-toggle-label{display:none}#acc-panel{position:fixed;bottom:100px;right:24px;width:min(400px,calc(100vw - 48px));max-height:86vh;background:#ffffff;border:1px solid #dce6f8;border-radius:20px;box-shadow:0 8px 40px rgba(10,22,40,.15),0 2px 12px rgba(79,142,247,.1);z-index:2147483645;overflow:hidden;display:flex;flex-direction:column;transform:scale(.92) translateY(16px);opacity:0;pointer-events:none;transition:transform .3s cubic-bezier(.34,1.56,.64,1),opacity .2s;font-family:var(--acc-font);box-sizing:border-box}#acc-panel.acc-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all}#acc-panel.acc-instant{transition:none !important}#acc-panel *{box-sizing:border-box;margin:0;padding:0}body.acc-in-iframe{overflow:hidden}body.acc-in-iframe #acc-toggle{position:absolute !important;bottom:10px !important;right:10px !important}body.acc-in-iframe #acc-panel{position:absolute !important;overflow-y:auto !important}.acc-header{background:linear-gradient(135deg,#0a1628 0%,#0d1f3c 100%);border-bottom:1px solid var(--acc-border);padding:16px 18px 0;flex-shrink:0}.acc-header-top{display:flex;align-items:center;gap:10px;margin-bottom:14px}.acc-header-logo{width:32px;height:32px;object-fit:contain;filter:brightness(1.15) drop-shadow(0 0 6px rgba(79,142,247,.3))}.acc-header-title{flex:1}.acc-header-title h2{font-size:.9rem;font-weight:700;color:#ffffff;letter-spacing:.05em;text-transform:uppercase}.acc-header-title p{font-size:.7rem;color:rgba(255,255,255,.65);margin-top:1px}.acc-close-btn{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.12);color:rgba(255,255,255,.8);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:background .15s,color .15s}.acc-close-btn:hover{background:rgba(255,255,255,.22);color:#ffffff}.acc-close-btn:focus-visible{outline:2px solid var(--acc-accent);outline-offset:2px}.acc-lang-wrap{position:relative}.acc-lang-btn{display:flex;align-items:center;gap:5px;padding:4px 10px 4px 8px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:20px;color:rgba(255,255,255,.85);cursor:pointer;font-family:var(--acc-font);font-size:.68rem;font-weight:700;white-space:nowrap;transition:background .15s,border-color .15s,color .15s;letter-spacing:.04em}.acc-lang-btn:hover{background:rgba(255,255,255,.22);border-color:rgba(255,255,255,.4);color:#ffffff}.acc-lang-btn:focus-visible{outline:2px solid rgba(255,255,255,.6);outline-offset:2px}.acc-lang-btn.acc-lang-active{background:rgba(79,142,247,.35);border-color:#4f8ef7;color:#ffffff}.acc-lang-globe{font-size:13px;line-height:1}.acc-lang-label{letter-spacing:.05em}.acc-lang-dropdown{position:absolute;top:34px;right:0;background:#ffffff;border:1px solid #dce6f8;border-radius:12px;min-width:224px;max-height:280px;overflow-y:auto;z-index:9999;display:none;box-shadow:0 8px 32px rgba(10,22,40,.12),0 2px 8px rgba(79,142,247,.08);scrollbar-width:thin;scrollbar-color:#dce6f8 transparent}.acc-lang-dropdown.acc-lang-open{display:block}.acc-lang-dropdown::-webkit-scrollbar{width:4px}.acc-lang-dropdown::-webkit-scrollbar-thumb{background:var(--acc-border);border-radius:4px}.acc-lang-search{width:100%;padding:9px 12px;background:#f8f9fe;border:none;border-bottom:1px solid #dce6f8;color:#0a1628;font-family:var(--acc-font);font-size:.78rem;outline:none;border-radius:12px 12px 0 0}.acc-lang-search::placeholder{color:#8a9bbf}.acc-lang-option{display:flex;align-items:center;gap:8px;padding:8px 12px;font-size:.78rem;color:#5a6e8c;cursor:pointer;transition:background .12s;border:none;background:none;width:100%;text-align:left;font-family:var(--acc-font)}.acc-lang-option:hover{background:#f0f4ff;color:#0a1628}.acc-lang-option.acc-lang-selected{color:#4f8ef7;background:#f0f4ff;font-weight:600}.acc-lang-option .acc-lang-native{font-size:.68rem;color:#8a9bbf;margin-left:auto;flex-shrink:0}.acc-active-profile-badge{display:none;align-items:center;gap:6px;background:rgba(56,217,169,.12);border:1px solid rgba(56,217,169,.3);border-radius:6px;padding:4px 10px;margin-bottom:10px;font-size:.68rem;font-weight:600;color:var(--acc-accent2)}.acc-active-profile-badge.visible{display:flex}.acc-active-profile-badge button{background:none;border:none;color:var(--acc-muted);cursor:pointer;font-size:.7rem;margin-left:auto;padding:0 2px;transition:color .15s}.acc-active-profile-badge button:hover{color:var(--acc-error)}.acc-tabs{display:flex;gap:1px;padding-bottom:0;overflow-x:auto;scrollbar-width:none;border-top:1px solid #dce6f8;margin-top:12px;background:#f8f9fe}.acc-tabs::-webkit-scrollbar{display:none}.acc-tab{flex:1;padding:9px 4px;font-size:.65rem;font-weight:600;color:var(--acc-muted);cursor:pointer;border:none;background:none;letter-spacing:.03em;text-transform:uppercase;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;font-family:var(--acc-font);white-space:nowrap}.acc-tab.acc-active{color:var(--acc-accent);border-bottom-color:var(--acc-accent)}.acc-tab:focus-visible{outline:2px solid var(--acc-accent);outline-offset:-2px}.acc-panel-content{display:none;flex:1;overflow-y:auto;flex-direction:column}.acc-panel-content.acc-active{display:flex}.acc-panel-content::-webkit-scrollbar{width:4px}.acc-panel-content::-webkit-scrollbar-track{background:transparent}.acc-panel-content::-webkit-scrollbar-thumb{background:var(--acc-border);border-radius:4px}.acc-body{padding:14px;display:flex;flex-direction:column;gap:7px;flex:1}.acc-section{font-size:.63rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#4f8ef7;margin:6px 0 2px;font-family:var(--acc-mono);display:flex;align-items:center;gap:6px}.acc-section::after{content:'';flex:1;height:1px;background:#dce6f8}.acc-row{display:flex;align-items:center;justify-content:space-between;background:#f8f9fe;border:1px solid #dce6f8;border-radius:10px;padding:10px 12px;cursor:pointer;transition:background .15s,border-color .15s;user-select:none}.acc-row:hover{background:#0f2a50;border-color:#1a3a6b}.acc-row.acc-on{background:rgba(79,142,247,.08);border-color:rgba(79,142,247,.35)}.acc-row:focus-visible{outline:2px solid var(--acc-accent);outline-offset:2px}.acc-row-label{display:flex;align-items:center;gap:9px;font-size:.83rem;font-weight:500;color:#0a1628}.acc-row-icon{font-size:1.1rem;line-height:1;width:22px;text-align:center}.acc-row-sub{font-size:.68rem;color:#5a6e8c;margin-top:1px}.acc-switch{width:36px;height:20px;background:var(--acc-border);border-radius:99px;position:relative;transition:background .2s;flex-shrink:0}.acc-switch::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 4px rgba(0,0,0,.3)}.acc-row.acc-on .acc-switch{background:var(--acc-accent)}.acc-row.acc-on .acc-switch::after{transform:translateX(16px)}.acc-stepper{display:flex;align-items:center;justify-content:space-between;background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:10px;padding:9px 12px}.acc-stepper-label{font-size:.83rem;font-weight:500;color:var(--acc-text);display:flex;align-items:center;gap:9px}.acc-stepper-ctrl{display:flex;align-items:center;gap:8px}.acc-step-btn{width:26px;height:26px;border-radius:7px;border:1px solid var(--acc-border);background:var(--acc-dark);color:var(--acc-text);font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s;font-weight:700;line-height:1;padding:0;font-family:inherit}.acc-step-btn:hover{background:var(--acc-border)}.acc-step-btn:focus-visible{outline:2px solid var(--acc-accent)}.acc-step-val{font-size:.8rem;font-family:var(--acc-mono);min-width:42px;text-align:center;color:var(--acc-accent);font-weight:500}.acc-select-row{background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:10px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.acc-select-row select{background:var(--acc-dark);border:1px solid var(--acc-border);border-radius:6px;color:var(--acc-accent);font-family:var(--acc-mono);font-size:.78rem;padding:4px 8px;outline:none;cursor:pointer}.acc-select-row select:focus{border-color:var(--acc-accent)}.acc-align-row{background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:10px;padding:9px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.acc-align-btns{display:flex;gap:4px}.acc-align-btn{width:30px;height:26px;border-radius:6px;border:1px solid var(--acc-border);background:var(--acc-dark);color:var(--acc-muted);font-size:.85rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .15s,border-color .15s,color .15s;padding:0}.acc-align-btn:hover{background:var(--acc-border)}.acc-align-btn.acc-active-align{background:rgba(79,142,247,.15);border-color:var(--acc-accent);color:var(--acc-accent)}.acc-colors-box{background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:10px;padding:11px 12px}.acc-colors-label{font-size:.83rem;font-weight:500;color:var(--acc-text);margin-bottom:9px;display:flex;align-items:center;gap:8px}.acc-swatches{display:flex;gap:7px;flex-wrap:wrap}.acc-swatch{width:30px;height:30px;border-radius:8px;border:2px solid transparent;cursor:pointer;transition:transform .15s,border-color .15s,box-shadow .15s;outline:none;padding:0;font-size:.6rem;display:flex;align-items:center;justify-content:center;font-weight:700}.acc-swatch:hover{transform:scale(1.1)}.acc-swatch:focus-visible{outline:2px solid var(--acc-accent)}.acc-swatch.acc-picked{border-color:var(--acc-accent) !important;box-shadow:0 0 0 3px rgba(79,142,247,.25);transform:scale(1.1)}.acc-reset{width:100%;padding:10px;border-radius:10px;margin-top:2px;border:1px solid rgba(247,95,95,.3);background:rgba(247,95,95,.08);color:var(--acc-error);font-size:.82rem;font-weight:600;cursor:pointer;font-family:var(--acc-font);transition:background .15s}.acc-reset:hover{background:rgba(247,95,95,.15)}.acc-reset:focus-visible{outline:2px solid var(--acc-error)}.acc-profiles-body{padding:14px;display:flex;flex-direction:column;gap:10px;flex:1}.acc-profiles-intro{font-size:.78rem;color:var(--acc-muted);line-height:1.6;padding:10px 12px;background:rgba(79,142,247,.06);border:1px solid rgba(79,142,247,.15);border-radius:10px}.acc-profile-card{background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:12px;padding:14px;cursor:pointer;transition:border-color .2s,background .2s,transform .15s;display:flex;align-items:center;gap:12px;user-select:none}.acc-profile-card:hover{border-color:rgba(79,142,247,.4);background:#0f2a50;transform:translateY(-1px)}.acc-profile-card.acc-profile-active{border-color:var(--acc-accent2);background:rgba(56,217,169,.07)}.acc-profile-card:focus-visible{outline:2px solid var(--acc-accent);outline-offset:2px}.acc-profile-icon{font-size:1.8rem;width:44px;height:44px;border-radius:10px;background:rgba(79,142,247,.08);border:1px solid rgba(79,142,247,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0}.acc-profile-card.acc-profile-active .acc-profile-icon{background:rgba(56,217,169,.12);border-color:rgba(56,217,169,.3)}.acc-profile-info{flex:1}.acc-profile-name{font-size:.88rem;font-weight:700;color:var(--acc-text);margin-bottom:3px}.acc-profile-desc{font-size:.7rem;color:var(--acc-muted);line-height:1.5}.acc-profile-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.acc-profile-tag{font-size:.58rem;font-weight:600;padding:2px 6px;border-radius:4px;background:rgba(79,142,247,.1);color:var(--acc-accent);text-transform:uppercase;letter-spacing:.05em}.acc-profile-check{width:20px;height:20px;border-radius:50%;border:2px solid var(--acc-border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.7rem;transition:background .2s,border-color .2s}.acc-profile-card.acc-profile-active .acc-profile-check{background:var(--acc-accent2);border-color:var(--acc-accent2);color:#fff}.acc-fix-body{padding:14px;display:flex;flex-direction:column;gap:10px;flex:1}.acc-score-card{background:linear-gradient(135deg,#0a1628,#0d1f3c);border:1px solid var(--acc-border);border-radius:14px;padding:18px;text-align:center;position:relative;overflow:hidden}.acc-score-card::before{content:'';position:absolute;top:-40px;right:-40px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(79,142,247,.12),transparent 70%)}.acc-score-ring{width:80px;height:80px;margin:0 auto 10px;border-radius:50%;background:var(--acc-surface);border:3px solid var(--acc-border);display:flex;align-items:center;justify-content:center;position:relative}.acc-score-num{font-size:1.8rem;font-weight:700;color:var(--acc-text);font-family:var(--acc-mono);line-height:1}.acc-score-label{font-size:.65rem;color:var(--acc-muted);text-transform:uppercase;letter-spacing:.1em;margin-top:2px}.acc-score-sub{font-size:.72rem;color:var(--acc-muted);margin-top:8px}.acc-stats{display:flex;justify-content:center;gap:20px;margin-top:12px}.acc-stat{text-align:center}.acc-stat-n{font-size:1.1rem;font-weight:700;font-family:var(--acc-mono)}.acc-stat-n.g{color:var(--acc-accent2)}.acc-stat-n.y{color:var(--acc-warn)}.acc-stat-n.r{color:var(--acc-error)}.acc-stat-l{font-size:.6rem;color:var(--acc-muted);text-transform:uppercase;letter-spacing:.06em;margin-top:2px}.acc-scan-btn{width:100%;padding:12px;border-radius:11px;border:none;background:linear-gradient(135deg,var(--acc-accent),#3a6fd8);color:#fff;font-size:.88rem;font-weight:700;cursor:pointer;font-family:var(--acc-font);transition:opacity .15s,transform .1s;display:flex;align-items:center;justify-content:center;gap:8px;letter-spacing:.02em;box-shadow:0 4px 16px rgba(79,142,247,.3)}.acc-scan-btn:hover{opacity:.92}.acc-scan-btn:active{transform:scale(.98)}.acc-scan-btn:disabled{background:var(--acc-surface);color:var(--acc-muted);box-shadow:none;cursor:default}.acc-scan-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}.acc-dl-btn{width:100%;padding:10px;border-radius:11px;border:1px solid rgba(56,217,169,.3);background:rgba(56,217,169,.07);color:var(--acc-accent2);font-size:.82rem;font-weight:600;cursor:pointer;font-family:var(--acc-font);transition:background .15s;display:flex;align-items:center;justify-content:center;gap:7px}.acc-dl-btn:hover{background:rgba(56,217,169,.14)}.acc-dl-btn:disabled{opacity:.35;cursor:default}.acc-issues{display:flex;flex-direction:column;gap:6px}.acc-issue{background:var(--acc-surface);border-radius:10px;padding:10px 12px;border-left:3px solid var(--acc-border)}.acc-issue.fixed{border-left-color:var(--acc-accent2);background:rgba(56,217,169,.05)}.acc-issue.warning{border-left-color:var(--acc-warn);background:rgba(245,166,35,.05)}.acc-issue.error{border-left-color:var(--acc-error);background:rgba(247,95,95,.05)}.acc-issue-head{display:flex;align-items:flex-start;gap:7px;justify-content:space-between}.acc-issue-title{font-size:.82rem;font-weight:600;color:var(--acc-text);display:flex;align-items:center;gap:6px}.acc-badge{font-size:.6rem;font-weight:700;padding:2px 7px;border-radius:6px;text-transform:uppercase;letter-spacing:.05em;flex-shrink:0;margin-top:1px}.acc-badge.fixed{background:rgba(56,217,169,.15);color:var(--acc-accent2)}.acc-badge.warning{background:rgba(245,166,35,.15);color:var(--acc-warn)}.acc-badge.error{background:rgba(247,95,95,.15);color:var(--acc-error)}.acc-issue-desc{font-size:.75rem;color:var(--acc-muted);margin-top:5px;line-height:1.55}.acc-issue-cnt{font-size:.68rem;font-family:var(--acc-mono);color:#4a6a9b;margin-top:4px}.acc-hist-body{padding:14px;display:flex;flex-direction:column;gap:8px;flex:1}.acc-hist-empty{text-align:center;color:var(--acc-muted);font-size:.83rem;padding:30px 0;line-height:1.7}.acc-hist-card{background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:10px;padding:11px 13px}.acc-hist-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px}.acc-hist-date{font-size:.7rem;color:var(--acc-muted);font-family:var(--acc-mono)}.acc-hist-score{font-size:.88rem;font-weight:700;font-family:var(--acc-mono);color:var(--acc-accent)}.acc-hist-pills{display:flex;gap:6px;flex-wrap:wrap}.acc-hist-pill{font-size:.65rem;padding:2px 8px;border-radius:6px;font-weight:600}.acc-hist-pill.g{background:rgba(56,217,169,.12);color:var(--acc-accent2)}.acc-hist-pill.y{background:rgba(245,166,35,.12);color:var(--acc-warn)}.acc-hist-pill.r{background:rgba(247,95,95,.12);color:var(--acc-error)}.acc-hist-dl{margin-top:8px;width:100%;padding:6px;border-radius:7px;border:1px solid var(--acc-border);background:transparent;color:var(--acc-muted);font-size:.72rem;cursor:pointer;font-family:var(--acc-font);transition:border-color .15s,color .15s}.acc-hist-dl:hover{border-color:var(--acc-accent2);color:var(--acc-accent2)}.acc-footer{padding:9px 16px;border-top:1px solid #dce6f8;font-size:.65rem;color:#5a6e8c;text-align:center;display:flex;align-items:center;justify-content:center;gap:6px;flex-shrink:0;background:#f8f9fe}.acc-footer img{width:14px;height:14px;object-fit:contain;opacity:.5}#acc-reading-line{position:fixed;left:0;right:0;height:34px;background:rgba(79,142,247,.1);border-top:2px solid rgba(79,142,247,.4);border-bottom:2px solid rgba(79,142,247,.4);pointer-events:none;z-index:2147483644;display:none;top:0}#acc-reading-mask-top{position:fixed;left:0;right:0;top:0;background:rgba(0,0,0,.75);pointer-events:none;z-index:2147483643;display:none}#acc-reading-mask-bottom{position:fixed;left:0;right:0;bottom:0;background:rgba(0,0,0,.75);pointer-events:none;z-index:2147483643;display:none}body.acc-big-cursor,body.acc-big-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='44' height='44'%3E%3Ccircle cx='11' cy='11' r='10' fill='%230a1628' stroke='%234f8ef7' stroke-width='2.5'/%3E%3C/svg%3E") 11 11,auto !important}body.acc-highlight-links a{outline:2px solid var(--acc-warn) !important;outline-offset:2px !important;background:rgba(245,166,35,.08) !important}body.acc-highlight-headings h1,body.acc-highlight-headings h2,body.acc-highlight-headings h3,body.acc-highlight-headings h4,body.acc-highlight-headings h5,body.acc-highlight-headings h6{outline:2px solid rgba(79,142,247,.6) !important;outline-offset:3px !important;background:rgba(79,142,247,.05) !important}body.acc-highlight-hover *:hover{outline:2px solid var(--acc-accent2) !important;outline-offset:2px !important}body.acc-readable,body.acc-readable *{font-family:Georgia,'Times New Roman',serif !important;letter-spacing:.03em !important}body.acc-dyslexia,body.acc-dyslexia *{font-family:'Trebuchet MS',Verdana,sans-serif !important;line-height:2 !important;letter-spacing:.09em !important;word-spacing:.22em !important}html.acc-high-contrast{filter:contrast(180%) !important}html.acc-invert{filter:invert(1) hue-rotate(180deg) !important}html.acc-grayscale{filter:grayscale(1) !important}html.acc-low-saturation{filter:saturate(0.2) !important}body.acc-stop-anim *,body.acc-stop-anim *::before,body.acc-stop-anim *::after{animation:none !important;transition:none !important}body.acc-focus-ring *:focus{outline:3px solid var(--acc-accent) !important;outline-offset:3px !important}body.acc-text-spacing,body.acc-text-spacing *{line-height:1.95 !important;letter-spacing:.13em !important;word-spacing:.15em !important}body.acc-big-targets a:not(#acc-widget-root a),body.acc-big-targets button:not(#acc-widget-root button){min-height:44px !important;min-width:44px !important;display:inline-flex !important;align-items:center !important}body.acc-reduced-stimulus{background:#f5f0e8 !important;color:#2a2a2a !important}html.acc-reduced-stimulus{filter:saturate(0.6) brightness(1.05) !important}body.acc-text-align-left *{text-align:left !important}body.acc-text-align-center *{text-align:center !important}body.acc-text-align-right *{text-align:right !important}body.acc-keyboard-nav *:focus{outline:4px solid #ffeb3b !important;outline-offset:4px !important;box-shadow:0 0 0 8px rgba(255,235,59,.2) !important}#acc-status{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}@media (max-width:480px){#acc-toggle{width:54px;height:54px;border-radius:14px;bottom:16px;right:16px}#acc-toggle img{width:30px;height:30px}#acc-toggle-label{display:none}#acc-panel{position:fixed !important;bottom:0 !important;top:auto !important;left:0 !important;right:0 !important;width:100% !important;max-width:100% !important;max-height:88vh !important;border-radius:20px 20px 0 0 !important;transform:translateY(110%) !important;opacity:1 !important}#acc-panel.acc-open{transform:translateY(0) !important}.acc-tab{font-size:.6rem;padding:8px 2px}.acc-body,.acc-fix-body,.acc-hist-body,.acc-profiles-body{padding:10px;gap:6px}.acc-stepper,.acc-row{padding:8px 10px}.acc-row-label{font-size:.78rem}.acc-profile-card{padding:10px}.acc-profile-icon{width:36px;height:36px;font-size:1.4rem}}@media (prefers-reduced-motion:reduce){#acc-panel{transition:none !important}#acc-toggle{transition:none !important}}
  `;
  document.head.appendChild(style);

  if (ACC_COLOR_OVERRIDE && /^#[0-9a-fA-F]{3,6}$/.test(ACC_COLOR_OVERRIDE)) {
    document.documentElement.style.setProperty('--acc-accent', ACC_COLOR_OVERRIDE);
  }
  if (ACC_POS_OVERRIDE) {
  }

  const root = document.createElement('div');
  root.id = 'acc-widget-root';
  root.innerHTML = `
<div id="acc-reading-line" role="presentation" aria-hidden="true"></div> <div id="acc-reading-mask-top" aria-hidden="true"></div> <div id="acc-reading-mask-bottom" aria-hidden="true"></div> <div id="acc-status" aria-live="polite" aria-atomic="true" role="status"></div> <button id="acc-toggle" aria-label="Open ACC Accessibility Panel" aria-expanded="false" aria-haspopup="dialog"> <img src="${ACC_LOGO}" alt="" aria-hidden="true" /> <span id="acc-toggle-label" aria-hidden="true">A11Y</span> </button> <div id="acc-panel" role="dialog" aria-modal="true" aria-label="ACC Accessibility Settings"> <div class="acc-header"> <div class="acc-header-top"> <img class="acc-header-logo" src="${ACC_LOGO}" alt="" aria-hidden="true" /> <div class="acc-header-title"> <h2>ACC Accessibility</h2> <p>Powered by Auto AI Engine</p> </div> <div class="acc-lang-wrap" id="acc-lang-wrap" style="position:relative"> <button class="acc-lang-btn" id="acc-lang-btn" aria-label="Select language" aria-expanded="false" aria-haspopup="listbox"> <span class="acc-lang-globe" aria-hidden="true">&#127760;</span> <span class="acc-lang-label" id="acc-lang-current">EN</span> </button> <div class="acc-lang-dropdown" id="acc-lang-dropdown" role="listbox" aria-label="Select language"> <input class="acc-lang-search" type="text" id="acc-lang-search" placeholder="Search language…" aria-label="Search languages" autocomplete="off" /> <div id="acc-lang-list"></div> </div> </div> <button class="acc-close-btn" id="acc-close" aria-label="Close accessibility panel">✕</button> </div> <div class="acc-active-profile-badge" id="acc-active-badge" aria-live="polite"> <span id="acc-active-badge-text"></span> <button id="acc-clear-profile" aria-label="Clear active profile">✕ Clear</button> </div> <div class="acc-tabs" role="tablist" aria-label="Accessibility settings sections"> <button class="acc-tab acc-active" data-tab="profiles" role="tab" aria-selected="true"  aria-controls="panel-profiles" id="tab-profiles">👤 Profiles</button> <button class="acc-tab"            data-tab="settings" role="tab" aria-selected="false" aria-controls="panel-settings" id="tab-settings">⚙ Settings</button> <button class="acc-tab"            data-tab="feedback" role="tab" aria-selected="false" aria-controls="panel-feedback-tab" id="tab-feedback">💬 Feedback</button> <!-- Scan and History tabs hidden from end users — data still collected in background --> <button class="acc-tab" data-tab="autofix"  role="tab" aria-selected="false" aria-controls="panel-autofix"  id="tab-autofix"  style="display:none">🔍 Scan</button> <button class="acc-tab" data-tab="history"  role="tab" aria-selected="false" aria-controls="panel-history"  id="tab-history"  style="display:none">🕑 History</button> </div> </div> <!-- ═══ PROFILES TAB ═══ --> <div class="acc-panel-content acc-active" data-panel="profiles" id="panel-profiles" role="tabpanel" aria-labelledby="tab-profiles" tabindex="0"> <div class="acc-profiles-body"> <div class="acc-profiles-intro"> Select a profile to instantly apply accessibility settings tailored for a specific need. You can then fine-tune individual settings in the Settings tab. </div> <div class="acc-profile-card" data-profile="visually-impaired" role="button" tabindex="0" aria-pressed="false" aria-label="Visually Impaired profile"> <div class="acc-profile-icon" aria-hidden="true">👁</div> <div class="acc-profile-info"> <div class="acc-profile-name">Visually Impaired</div> <div class="acc-profile-desc">Larger text, high contrast, enhanced focus indicators</div> <div class="acc-profile-tags"> <span class="acc-profile-tag">Large Text</span> <span class="acc-profile-tag">High Contrast</span> <span class="acc-profile-tag">Focus Ring</span> </div> </div> <div class="acc-profile-check" aria-hidden="true"></div> </div> <div class="acc-profile-card" data-profile="cognitive" role="button" tabindex="0" aria-pressed="false" aria-label="Cognitive and Learning profile"> <div class="acc-profile-icon" aria-hidden="true">🧠</div> <div class="acc-profile-info"> <div class="acc-profile-name">Cognitive / Learning</div> <div class="acc-profile-desc">Dyslexia font, extra spacing, no animations, reading guide</div> <div class="acc-profile-tags"> <span class="acc-profile-tag">Dyslexia Font</span> <span class="acc-profile-tag">Text Spacing</span> <span class="acc-profile-tag">No Animations</span> </div> </div> <div class="acc-profile-check" aria-hidden="true"></div> </div> <div class="acc-profile-card" data-profile="motor" role="button" tabindex="0" aria-pressed="false" aria-label="Motor and Physical Impaired profile"> <div class="acc-profile-icon" aria-hidden="true">🖱</div> <div class="acc-profile-info"> <div class="acc-profile-name">Motor / Physical</div> <div class="acc-profile-desc">Large cursor, bigger click targets, keyboard navigation</div> <div class="acc-profile-tags"> <span class="acc-profile-tag">Large Cursor</span> <span class="acc-profile-tag">Big Targets</span> <span class="acc-profile-tag">Keyboard Nav</span> </div> </div> <div class="acc-profile-check" aria-hidden="true"></div> </div> <div class="acc-profile-card" data-profile="deaf" role="button" tabindex="0" aria-pressed="false" aria-label="Deaf and Hard of Hearing profile"> <div class="acc-profile-icon" aria-hidden="true">🔇</div> <div class="acc-profile-info"> <div class="acc-profile-name">Deaf / Hard of Hearing</div> <div class="acc-profile-desc">Highlighted links, muted media, visual cues emphasized</div> <div class="acc-profile-tags"> <span class="acc-profile-tag">Highlight Links</span> <span class="acc-profile-tag">Mute Media</span> <span class="acc-profile-tag">Visual Cues</span> </div> </div> <div class="acc-profile-check" aria-hidden="true"></div> </div> <div class="acc-profile-card" data-profile="adhd" role="button" tabindex="0" aria-pressed="false" aria-label="ADHD Friendly profile"> <div class="acc-profile-icon" aria-hidden="true">⚡</div> <div class="acc-profile-info"> <div class="acc-profile-name">ADHD Friendly</div> <div class="acc-profile-desc">Reduced visual stimulus, no animations, readable font</div> <div class="acc-profile-tags"> <span class="acc-profile-tag">Reduced Stimulus</span> <span class="acc-profile-tag">No Animations</span> <span class="acc-profile-tag">Readable Font</span> </div> </div> <div class="acc-profile-check" aria-hidden="true"></div> </div> <div class="acc-profile-card" data-profile="senior" role="button" tabindex="0" aria-pressed="false" aria-label="Senior Friendly profile"> <div class="acc-profile-icon" aria-hidden="true">👴</div> <div class="acc-profile-info"> <div class="acc-profile-name">Senior Friendly</div> <div class="acc-profile-desc">Bigger text, larger cursor, high contrast, generous spacing</div> <div class="acc-profile-tags"> <span class="acc-profile-tag">Large Text</span> <span class="acc-profile-tag">Large Cursor</span> <span class="acc-profile-tag">High Contrast</span> </div> </div> <div class="acc-profile-check" aria-hidden="true"></div> </div> </div> </div> <!-- ═══ SETTINGS TAB ═══ --> <div class="acc-panel-content" data-panel="settings" id="panel-settings" role="tabpanel" aria-labelledby="tab-settings" tabindex="0"> <div class="acc-body"> <div class="acc-section">Content</div> <div class="acc-stepper"> <div class="acc-stepper-label"><span class="acc-row-icon" aria-hidden="true">🔤</span> Font Size</div> <div class="acc-stepper-ctrl"> <button class="acc-step-btn" id="acc-fs-dn" aria-label="Decrease font size">−</button> <span class="acc-step-val" id="acc-fs-val" aria-live="polite" aria-label="Font size value">100%</span> <button class="acc-step-btn" id="acc-fs-up" aria-label="Increase font size">+</button> </div> </div> <div class="acc-stepper"> <div class="acc-stepper-label"><span class="acc-row-icon" aria-hidden="true">↕</span> Line Height</div> <div class="acc-stepper-ctrl"> <button class="acc-step-btn" id="acc-lh-dn" aria-label="Decrease line height">−</button> <span class="acc-step-val" id="acc-lh-val" aria-live="polite" aria-label="Line height value">1.6</span> <button class="acc-step-btn" id="acc-lh-up" aria-label="Increase line height">+</button> </div> </div> <div class="acc-stepper"> <div class="acc-stepper-label"><span class="acc-row-icon" aria-hidden="true">↔</span> Letter Spacing</div> <div class="acc-stepper-ctrl"> <button class="acc-step-btn" id="acc-ls-dn" aria-label="Decrease letter spacing">−</button> <span class="acc-step-val" id="acc-ls-val" aria-live="polite" aria-label="Letter spacing value">0px</span> <button class="acc-step-btn" id="acc-ls-up" aria-label="Increase letter spacing">+</button> </div> </div> <div class="acc-stepper"> <div class="acc-stepper-label"><span class="acc-row-icon" aria-hidden="true">⎵</span> Word Spacing</div> <div class="acc-stepper-ctrl"> <button class="acc-step-btn" id="acc-ws-dn" aria-label="Decrease word spacing">−</button> <span class="acc-step-val" id="acc-ws-val" aria-live="polite" aria-label="Word spacing value">0px</span> <button class="acc-step-btn" id="acc-ws-up" aria-label="Increase word spacing">+</button> </div> </div> <div class="acc-select-row"> <div class="acc-stepper-label"><span class="acc-row-icon" aria-hidden="true">🔡</span> Font Family</div> <select id="acc-font-family" aria-label="Select font family"> <option value="">Default</option> <option value="dyslexia">Dyslexia</option> <option value="readable">Readable</option> <option value="mono">Monospace</option> </select> </div> <div class="acc-align-row"> <div class="acc-stepper-label"><span class="acc-row-icon" aria-hidden="true">≡</span> Text Align</div> <div class="acc-align-btns" role="group" aria-label="Text alignment"> <button class="acc-align-btn" data-align="" aria-label="Default alignment" aria-pressed="true">−</button> <button class="acc-align-btn" data-align="acc-text-align-left" aria-label="Align left" aria-pressed="false">⬅</button> <button class="acc-align-btn" data-align="acc-text-align-center" aria-label="Align center" aria-pressed="false">≡</button> <button class="acc-align-btn" data-align="acc-text-align-right" aria-label="Align right" aria-pressed="false">➡</button> </div> </div> <div class="acc-section">Vision</div> <div class="acc-colors-box"> <div class="acc-colors-label" id="acc-filter-label"><span aria-hidden="true">🎨</span> Colour Filter</div> <div class="acc-swatches" id="acc-swatches" role="radiogroup" aria-labelledby="acc-filter-label"> <button class="acc-swatch acc-picked" data-filter="" style="background:#112244;border-color:#4a6a9b;color:#8a9bbf;" aria-label="No filter (default)" aria-checked="true" role="radio" title="Default">↺</button> <button class="acc-swatch" data-filter="acc-high-contrast"  style="background:#000;color:#fff;"  aria-label="High contrast" aria-checked="false" role="radio" title="High Contrast">HC</button> <button class="acc-swatch" data-filter="acc-invert"         style="background:linear-gradient(135deg,#000 50%,#fff 50%);" aria-label="Invert colours" aria-checked="false" role="radio" title="Invert"></button> <button class="acc-swatch" data-filter="acc-grayscale"      style="background:#888;" aria-label="Greyscale" aria-checked="false" role="radio" title="Greyscale">GS</button> <button class="acc-swatch" data-filter="acc-low-saturation" style="background:#b3a89d;" aria-label="Low saturation" aria-checked="false" role="radio" title="Low Saturation">LS</button> </div> </div> <div class="acc-section">Navigation & Focus</div> <div class="acc-row" id="acc-t-focus" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">🔲</span> Focus Ring</div><div class="acc-row-sub">Enhanced keyboard focus indicator</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-keyboard" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">⌨</span> Keyboard Navigation</div><div class="acc-row-sub">High-visibility yellow focus ring</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-cursor" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">🖱</span> Large Cursor</div><div class="acc-row-sub">Enlarged mouse pointer</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-bigtargets" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">🎯</span> Big Click Targets</div><div class="acc-row-sub">Min 44px touch target on links &amp; buttons</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-links" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">🔗</span> Highlight Links</div><div class="acc-row-sub">Outlines all hyperlinks</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-headings" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">📋</span> Highlight Headings</div><div class="acc-row-sub">Outlines all H1–H6 elements</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-hover" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">✨</span> Highlight on Hover</div><div class="acc-row-sub">Visual outline on hovered elements</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-section">Reading</div> <div class="acc-row" id="acc-t-guide" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">📏</span> Reading Guide</div><div class="acc-row-sub">Highlights current reading line</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-mask" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">🎭</span> Reading Mask</div><div class="acc-row-sub">Darkens page above &amp; below focus line</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-spacing" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">📐</span> Text Spacing</div><div class="acc-row-sub">Extra word &amp; letter spacing (WCAG 1.4.12)</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-section">Motion &amp; Media</div> <div class="acc-row" id="acc-t-anim" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">⏸</span> Pause Animations</div><div class="acc-row-sub">Stops all motion &amp; transitions</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-media" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">🔇</span> Mute All Media</div><div class="acc-row-sub">Silences auto-playing audio &amp; video</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <div class="acc-row" id="acc-t-stimulus" role="switch" aria-checked="false" tabindex="0"> <div><div class="acc-row-label"><span class="acc-row-icon" aria-hidden="true">🧘</span> Reduce Stimulus</div><div class="acc-row-sub">Softer colours, reduced visual noise</div></div> <div class="acc-switch" aria-hidden="true"></div> </div> <button class="acc-reset" id="acc-reset" aria-label="Reset all accessibility settings to default">↺ Reset All Settings</button> </div> </div> <!-- ═══ AUTO-FIX / SCAN TAB ═══ --> <div class="acc-panel-content" data-panel="autofix" id="panel-autofix" role="tabpanel" aria-labelledby="tab-autofix" tabindex="0"> <div class="acc-fix-body"> <div class="acc-score-card"> <div class="acc-score-ring"> <div> <div class="acc-score-num" id="acc-score">—</div> <div class="acc-score-label">/100</div> </div> </div> <div class="acc-score-sub" id="acc-score-sub">Run a scan to check this page</div> <div class="acc-stats"> <div class="acc-stat"> <div class="acc-stat-n g" id="acc-n-fixed">—</div> <div class="acc-stat-l">Fixed</div> </div> <div class="acc-stat"> <div class="acc-stat-n y" id="acc-n-warn">—</div> <div class="acc-stat-l">Warnings</div> </div> <div class="acc-stat"> <div class="acc-stat-n r" id="acc-n-err">—</div> <div class="acc-stat-l">Failures</div> </div> </div> </div> <div style="font-size:.72rem;color:var(--acc-muted);background:rgba(79,142,247,.06);border:1px solid rgba(79,142,247,.15);border-radius:8px;padding:9px 12px;line-height:1.6;"> ℹ️ Scans this page only. The widget runs on every page of your site — each page visited contributes to your site-wide score in your ACC dashboard. </div> <button class="acc-scan-btn" id="acc-scan" aria-label="Run accessibility scan on this page"> ♿ Scan This Page </button> <div class="acc-issues" id="acc-issues"> <div style="text-align:center;color:var(--acc-muted);font-size:.82rem;padding:20px 0;line-height:1.7;"> Click <strong style="color:var(--acc-accent)">Scan This Page</strong> to check for accessibility issues.<br> <span style="font-size:.72rem;">Auto-fixes are applied immediately.</span> </div> </div> <button class="acc-dl-btn" id="acc-dl-now" disabled aria-label="Download accessibility report for this page"> ↓ Download Page Report </button> </div> </div> <!-- ═══ HISTORY TAB ═══ --> <div class="acc-panel-content" data-panel="history" id="panel-history" role="tabpanel" aria-labelledby="tab-history" tabindex="0"> <div class="acc-hist-body"> <div style="font-size:.72rem;color:var(--acc-muted);background:rgba(79,142,247,.06);border:1px solid rgba(79,142,247,.15);border-radius:8px;padding:9px 12px;line-height:1.6;margin-bottom:4px;"> Scan history for <strong style="color:var(--acc-text)" id="acc-hist-page-label">this page</strong>. Each visit auto-scans in the background. </div> <div class="acc-hist-empty" id="acc-hist-empty"> No scans yet for this page.<br> <span style="font-size:.75rem;">Open the Scan tab and run your first scan.</span> </div> <div id="acc-hist-list"></div> </div> </div> <!-- ═══ FEEDBACK TAB ═══ --> <div class="acc-panel-content" data-panel="feedback" id="panel-feedback-tab" role="tabpanel" aria-labelledby="tab-feedback" tabindex="0"> <div class="acc-body"> <div class="acc-section">Submit Feedback</div> <p style="font-size:.75rem;color:var(--acc-muted);line-height:1.6;padding:8px 0;"> Found an accessibility issue on this website? Let us know and we'll work to fix it. </p> <div id="acc-fb-success" style="display:none;background:rgba(56,217,169,.1);border:1px solid rgba(56,217,169,.3);border-radius:10px;padding:12px 14px;font-size:.82rem;color:var(--acc-accent2);text-align:center;"> ✓ Thank you! Your feedback has been submitted. </div> <div id="acc-fb-form"> <div style="display:flex;flex-direction:column;gap:8px;"> <div> <label for="acc-fb-type" style="font-size:.72rem;font-weight:600;color:var(--acc-muted);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.08em;">Type</label> <select id="acc-fb-type" style="width:100%;background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:8px;color:var(--acc-text);font-family:var(--acc-font);font-size:.82rem;padding:8px 10px;outline:none;cursor:pointer;"> <option value="contrast">Colour / Contrast</option> <option value="navigation">Navigation / Keyboard</option> <option value="screen-reader">Screen Reader</option> <option value="captions">Captions / Media</option> <option value="other">Other</option> </select> </div> <div> <label for="acc-fb-msg" style="font-size:.72rem;font-weight:600;color:var(--acc-muted);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.08em;">Description</label> <textarea id="acc-fb-msg" rows="3" placeholder="Describe the issue you encountered…" style="width:100%;background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:8px;color:var(--acc-text);font-family:var(--acc-font);font-size:.82rem;padding:9px 10px;outline:none;resize:vertical;line-height:1.5;"></textarea> </div> <div> <label for="acc-fb-email" style="font-size:.72rem;font-weight:600;color:var(--acc-muted);display:block;margin-bottom:4px;text-transform:uppercase;letter-spacing:.08em;">Your Email <span style="font-weight:400;text-transform:none;">(optional)</span></label> <input id="acc-fb-email" type="email" placeholder="so we can follow up with you" style="width:100%;background:var(--acc-surface);border:1px solid var(--acc-border);border-radius:8px;color:var(--acc-text);font-family:var(--acc-font);font-size:.82rem;padding:8px 10px;outline:none;" /> </div> <button id="acc-fb-submit" style="width:100%;padding:11px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--acc-accent),#3a6fd8);color:#fff;font-size:.85rem;font-weight:700;cursor:pointer;font-family:var(--acc-font);transition:opacity .15s;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 14px rgba(79,142,247,.3);" aria-label="Submit accessibility feedback"> 💬 Submit Feedback </button> <p id="acc-fb-error" style="display:none;font-size:.75rem;color:var(--acc-error);text-align:center;padding:4px 0;"></p> </div> </div> <div class="acc-section" style="margin-top:4px;">Page URL</div> <p style="font-size:.72rem;color:var(--acc-muted);font-family:var(--acc-mono);word-break:break-all;" id="acc-fb-url"></p> </div> </div> <div class="acc-footer"> <img src="${ACC_LOGO}" alt="" aria-hidden="true" /> ACC Accessibility Widget &mdash; Auto AI Engine </div> </div>
  `;
  document.body.appendChild(root);

  if (ACC_POS_OVERRIDE) {
    const pos     = ACC_POS_OVERRIDE.toLowerCase();
    const toggleEl = document.getElementById('acc-toggle');
    const panelEl  = document.getElementById('acc-panel');
    const bottom = pos.includes('top') ? 'auto' : '24px';
    const top    = pos.includes('top') ? '24px' : 'auto';
    const right  = pos.includes('left') ? 'auto' : '24px';
    const left   = pos.includes('left') ? '24px' : 'auto';
    if (toggleEl) {
      toggleEl.style.bottom = bottom; toggleEl.style.top = top;
      toggleEl.style.right  = right;  toggleEl.style.left = left;
    }
    if (panelEl) {
      panelEl.style.bottom = pos.includes('top') ? 'auto' : '100px';
      panelEl.style.top    = pos.includes('top') ? '100px' : 'auto';
      panelEl.style.right  = right; panelEl.style.left = left;
    }
  }
  if (ACC_HIDE_FB) {
    const fbTab = document.getElementById('tab-feedback');
    if (fbTab) fbTab.style.display = 'none';
  }

  const ACC_ALL_LANGS = [
    ['af','Afrikaans','Afrikaans'],
    ['sq','Albanian','Shqip'],
    ['am','Amharic','አማርኛ'],
    ['ar','Arabic','العربية'],
    ['hy','Armenian','Հայերևն'],
    ['az','Azerbaijani','Azərbaycan'],
    ['eu','Basque','Euskara'],
    ['be','Belarusian','Беларуская'],
    ['bn','Bengali','বাংলা'],
    ['bs','Bosnian','Bosanski'],
    ['bg','Bulgarian','Български'],
    ['my','Burmese','မြန်မာဘာသာ'],
    ['ca','Catalan','Català'],
    ['ceb','Cebuano','Binisaya'],
    ['ny','Chichewa','Chichewa'],
    ['zh','Chinese (Simplified)','中文简体'],
    ['zh-TW','Chinese (Traditional)','中文繁體'],
    ['hr','Croatian','Hrvatski'],
    ['cs','Czech','Čeština'],
    ['da','Danish','Dansk'],
    ['nl','Dutch','Nederlands'],
    ['en','English','English'],
    ['et','Estonian','Eesti'],
    ['tl','Filipino','Tagalog'],
    ['fi','Finnish','Suomi'],
    ['fr','French','Français'],
    ['gl','Galician','Galego'],
    ['ka','Georgian','ქართული'],
    ['de','German','Deutsch'],
    ['el','Greek','Ελληνικά'],
    ['gu','Gujarati','ગુજરાતી'],
    ['ht','Haitian Creole','Kreyòl ayisyen'],
    ['ha','Hausa','Hausa'],
    ['haw','Hawaiian','ʻOlelo Hawaiʻi'],
    ['he','Hebrew','עברית'],
    ['hi','Hindi','हिन्दी'],
    ['hmn','Hmong','Hmoob'],
    ['hu','Hungarian','Magyar'],
    ['is','Icelandic','Íslenska'],
    ['ig','Igbo','Igbo'],
    ['id','Indonesian','Bahasa Indonesia'],
    ['it','Italian','Italiano'],
    ['ja','Japanese','日本語'],
    ['jv','Javanese','Basa Jawa'],
    ['kn','Kannada','ಕನ್ನಡ'],
    ['kk','Kazakh','Қазақша'],
    ['km','Khmer','ភាសាខ្មែរ'],
    ['ko','Korean','한국어'],
    ['ky','Kyrgyz','Кыргызча'],
    ['lo','Lao','ພາສາລາວ'],
    ['lv','Latvian','Latviešu'],
    ['lt','Lithuanian','Lietuvių'],
    ['mk','Macedonian','Македонски'],
    ['mg','Malagasy','Malagasy'],
    ['ms','Malay','Bahasa Melayu'],
    ['ml','Malayalam','മലയാളം'],
    ['mt','Maltese','Malti'],
    ['mr','Marathi','मराठी'],
    ['mn','Mongolian','Монгол'],
    ['ne','Nepali','नेपाली'],
    ['no','Norwegian','Norsk'],
    ['or','Odia','ଓଡ଼ିଆ'],
    ['ps','Pashto','پښتو'],
    ['fa','Persian','فارسی'],
    ['pl','Polish','Polski'],
    ['pt','Portuguese','Português'],
    ['pt-BR','Portuguese (Brazil)','Português (Brasil)'],
    ['pa','Punjabi','ਪੰਜਾਬੀ'],
    ['ro','Romanian','Română'],
    ['ru','Russian','Русский'],
    ['sm','Samoan','Gagana Samoa'],
    ['sr','Serbian','Srpski'],
    ['st','Sesotho','Sesotho'],
    ['sn','Shona','chiShona'],
    ['sd','Sindhi','سنڈي'],
    ['si','Sinhala','සිංහල'],
    ['sk','Slovak','Slovenčina'],
    ['sl','Slovenian','Slovenščina'],
    ['so','Somali','Soomaali'],
    ['es','Spanish','Español'],
    ['sw','Swahili','Kiswahili'],
    ['sv','Swedish','Svenska'],
    ['tg','Tajik','Тоҷикӣ'],
    ['ta','Tamil','தமிழ்'],
    ['te','Telugu','తెలుగు'],
    ['th','Thai','ภาษาไทย'],
    ['tr','Turkish','Türkçe'],
    ['tk','Turkmen','Türkmen'],
    ['uk','Ukrainian','Українська'],
    ['ur','Urdu','اردو'],
    ['uz','Uzbek','Oʻzbek'],
    ['vi','Vietnamese','Tiếng Việt'],
    ['cy','Welsh','Cymraeg'],
    ['xh','Xhosa','isiXhosa'],
    ['yo','Yoruba','Yorùbá'],
    ['zu','Zulu','isiZulu'],
  ];

  var _activeLang = ACC_LANG_OVERRIDE || 'en';

  function initLangPicker() {
    var btn       = document.getElementById('acc-lang-btn');
    var dropdown  = document.getElementById('acc-lang-dropdown');
    var searchEl  = document.getElementById('acc-lang-search');
    var listEl    = document.getElementById('acc-lang-list');
    if (!btn || !dropdown || !listEl) return;

    function buildList(filter) {
      var q = (filter || '').toLowerCase();
      var html = '';
      var pinned = ['en','fr'];

      function makeOption(item) {
        var code = item[0], name = item[1], native = item[2];
        if (q && name.toLowerCase().indexOf(q) === -1 && native.toLowerCase().indexOf(q) === -1 && code.indexOf(q) === -1) return '';
        var sel = code === _activeLang ? ' acc-lang-selected' : '';
        return '<button class="acc-lang-option' + sel + '" role="option" data-lang="' + code + '" aria-selected="' + (code === _activeLang ? 'true' : 'false') + '">'
          + '<span>' + name + '</span>'
          + '<span class="acc-lang-native">' + native + '</span>'
          + '</button>';
      }

      if (!q) {
        pinned.forEach(function(code) {
          var item = ACC_ALL_LANGS.find(function(l){ return l[0] === code; });
          if (item) html += makeOption(item);
        });
        if (html) html += '<div style="height:1px;background:#dce6f8;margin:3px 0"></div>';
      }

      ACC_ALL_LANGS.forEach(function(item) {
        if (!q && pinned.indexOf(item[0]) >= 0) return;
        html += makeOption(item);
      });

      listEl.innerHTML = html || '<div style="padding:10px 12px;font-size:.75rem;color:var(--acc-muted)">No languages found</div>';
      listEl.querySelectorAll('.acc-lang-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
          selectLanguage(opt.getAttribute('data-lang'));
          closeLangDropdown();
        });
      });
    }

    var initLabel = document.getElementById('acc-lang-current');
    if (initLabel) initLabel.textContent = (_activeLang || 'en').toUpperCase().split('-')[0];

    buildList('');

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = dropdown.classList.contains('acc-lang-open');
      if (isOpen) {
        closeLangDropdown();
      } else {
        dropdown.classList.add('acc-lang-open');
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('acc-lang-active');
        searchEl.value = '';
        buildList('');
        setTimeout(function() { searchEl.focus(); }, 50);
      }
    });

    searchEl.addEventListener('input', function() {
      buildList(searchEl.value);
    });

    document.addEventListener('click', function(e) {
      var wrap = document.getElementById('acc-lang-wrap');
      if (wrap && !wrap.contains(e.target)) closeLangDropdown();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeLangDropdown();
    });
  }

  function closeLangDropdown() {
    var dropdown = document.getElementById('acc-lang-dropdown');
    var btn      = document.getElementById('acc-lang-btn');
    if (dropdown) dropdown.classList.remove('acc-lang-open');
    if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.classList.remove('acc-lang-active'); }
  }

  function selectLanguage(langCode) {
    _activeLang = langCode;

    var labelEl = document.getElementById('acc-lang-current');
    var isEn = (langCode === 'en' || langCode === '');
    if (labelEl) {
      if (isEn) {
        labelEl.textContent = 'EN';
      } else {
        labelEl.textContent = '⧗';
        setTimeout(function() {
          if (labelEl.textContent === '⧗') {
            labelEl.textContent = langCode.toUpperCase().split('-')[0];
          }
        }, 3000);
      }
    }

    injectGoogleTranslate(langCode);

    var listEl = document.getElementById('acc-lang-list');
    if (listEl) {
      listEl.querySelectorAll('.acc-lang-option').forEach(function(opt) {
        var isSelected = opt.getAttribute('data-lang') === langCode;
        opt.classList.toggle('acc-lang-selected', isSelected);
        opt.setAttribute('aria-selected', String(isSelected));
      });
    }

    var langName = (ACC_ALL_LANGS.find(function(l){ return l[0] === langCode; }) || [])[1] || langCode;
    if (typeof announce === 'function') announce('Language changed to ' + langName);
  }

  var _gtInitialised = false;
  var _gtPending     = null;

  var GT_CODE_MAP = {
    'zh': 'zh-CN', 'zh-TW': 'zh-TW', 'he': 'iw', 'pt-BR': 'pt',
    'jv': 'jw',    'ceb': 'ceb',      'hmn': 'hmn',
    'haw': 'haw',  'sm': 'sm',
  };

  function getGTCode(code) {
    return GT_CODE_MAP[code] || code;
  }

  function injectGoogleTranslate(langCode) {
    if (langCode === 'en' || langCode === '') {
      restoreOriginalLanguage();
      return;
    }
    var gtCode = getGTCode(langCode);

    if (_gtInitialised) {
      doAccTranslate(gtCode);
      return;
    }

    _gtPending = gtCode;

    if (document.getElementById('acc-gt-script')) return;

    var container = document.createElement('div');
    container.id = 'acc-gt-element';
    container.style.cssText = 'position:absolute;width:1px;height:1px;left:-9999px;overflow:hidden;';
    document.body.appendChild(container);

    window.googleTranslateElementInit = function() {
      try {
        new window.google.translate.TranslateElement({
          pageLanguage:  'en',
          autoDisplay:   false,
          multilanguagePage: false,
        }, 'acc-gt-element');
      } catch(e) {}
      _gtInitialised = true;
      if (_gtPending) {
        setTimeout(function() { doAccTranslate(_gtPending); _gtPending = null; }, 400);
      }
    };

    var script  = document.createElement('script');
    script.id   = 'acc-gt-script';
    script.src  = 'https://translate.googleapis.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = function() {
      console.warn('ACC Widget: Google Translate unavailable.');
    };
    document.head.appendChild(script);
  }

  function doAccTranslate(gtCode) {
    var labelEl = document.getElementById('acc-lang-current');
    if (labelEl && labelEl.textContent === '⧗') {
      labelEl.textContent = (_activeLang || gtCode).toUpperCase().split('-')[0];
    }
    try {
      if (typeof window.doGTranslate === 'function') {
        window.doGTranslate('en|' + gtCode);
        return;
      }

      var sel = document.querySelector('.goog-te-combo');
      if (sel) {
        sel.value = gtCode;
        sel.dispatchEvent(new Event('change'));
        return;
      }

      var host = window.location.hostname;
      document.cookie = 'googtrans=/en/' + gtCode + '; path=/; domain=.' + host;
      document.cookie = 'googtrans=/en/' + gtCode + '; path=/';
      var iframe = document.querySelector('.goog-te-menu-frame');
      if (iframe && iframe.contentWindow) {
        try { iframe.contentWindow.location.reload(); } catch(e) {}
      }
    } catch(e) {
      console.warn('ACC Widget: translate switch failed —', e.message);
    }
  }

  function restoreOriginalLanguage() {
    try {
      var lbl = document.getElementById('acc-lang-current');
      if (lbl) lbl.textContent = 'EN';
      _activeLang = 'en';

      if (!_gtInitialised) return;

      var host = window.location.hostname;
      var exp  = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      document.cookie = 'googtrans=; ' + exp;
      document.cookie = 'googtrans=; ' + exp + '; domain=' + host;
      document.cookie = 'googtrans=; ' + exp + '; domain=.' + host;

      try {
        sessionStorage.setItem('acc_reopen', '1');
      } catch(e2) {}

      window.location.reload();

    } catch(e) {}
  }

  var _gtStyle = document.createElement('style');
  _gtStyle.textContent = [
    '.goog-te-banner-frame{display:none!important}',
    '.goog-te-balloon-frame{display:none!important}',
    '#goog-gt-tt{display:none!important}',
    '.skiptranslate{display:none!important}',
    'body{top:0!important;position:static!important}',
    'font[face]{font-family:inherit!important}',
  ].join(' ');
  document.head.appendChild(_gtStyle);

  initLangPicker();

  const S = {
    open: false, fontSize: 100, lineHeight: 1.6, letterSpacing: 0,
    wordSpacing: 0, colorFilter: '', textAlign: '', fontFamily: '',
    activeProfile: null, toggles: {}
  };

  const REPORT_CFG = {
    show_dev_issues:         true,
    show_critical_in_report: true,
    dev_issues_affect_score: true,
    escalate_chronics:       true,
  };

  const toggleBtn   = document.getElementById('acc-toggle');
  const panel       = document.getElementById('acc-panel');
  const guide       = document.getElementById('acc-reading-line');
  const maskTop     = document.getElementById('acc-reading-mask-top');
  const maskBottom  = document.getElementById('acc-reading-mask-bottom');
  const widgetEl    = document.getElementById('acc-widget-root');
  const statusEl    = document.getElementById('acc-status');

  function announce(msg) { statusEl.textContent = ''; setTimeout(() => { statusEl.textContent = msg; }, 50); }

  const isInIframe = window.self !== window.top;
  if (isInIframe) document.body.classList.add('acc-in-iframe');

  function positionPanel() {
    if (!isInIframe) return;
    const iframeH = window.innerHeight;
    const iframeW = window.innerWidth;
    const btnRect = toggleBtn.getBoundingClientRect();
    const panelW  = Math.min(400, iframeW - 20);
    const spaceBelow = iframeH - btnRect.bottom - 10;
    const spaceAbove = btnRect.top - 10;
    const rightOffset = iframeW - btnRect.right;
    panel.style.right = rightOffset + 'px';
    panel.style.left  = 'auto';
    panel.style.width = panelW + 'px';
    if (spaceAbove > spaceBelow && spaceAbove > 300) {
      panel.style.top    = 'auto';
      panel.style.bottom = (iframeH - btnRect.top + 8) + 'px';
      panel.style.maxHeight = Math.min(spaceAbove - 10, iframeH * 0.85) + 'px';
    } else {
      panel.style.top    = (btnRect.bottom + 8) + 'px';
      panel.style.bottom = 'auto';
      panel.style.maxHeight = Math.min(spaceBelow - 10, iframeH * 0.85) + 'px';
    }
  }

  const openPanel = () => {
    S.open = true;
    positionPanel();
    panel.classList.add('acc-open');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.getElementById('acc-close').focus();
  };
  const closePanel = () => {
    S.open = false;
    panel.classList.remove('acc-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
  };

  try {
    if (sessionStorage.getItem('acc_reopen') === '1') {
      sessionStorage.removeItem('acc_reopen');
      var _rp = document.getElementById('acc-panel');
      var _rb = document.getElementById('acc-toggle');
      if (_rp) {
        _rp.classList.add('acc-instant', 'acc-open');
        if (_rb) _rb.setAttribute('aria-expanded', 'true');
        S.open = true;
        requestAnimationFrame(function() {
          requestAnimationFrame(function() {
            if (_rp) _rp.classList.remove('acc-instant');
          });
        });
      }
    }
  } catch(e) {}

  toggleBtn.addEventListener('click', () => S.open ? closePanel() : openPanel());
  document.getElementById('acc-close').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && S.open) { closePanel(); }
    if (e.key === 'Tab' && S.open) {
      const focusable = panel.querySelectorAll('button:not([disabled]), [tabindex="0"], select, input');
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const accTabs = Array.from(document.querySelectorAll('.acc-tab'));
  accTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      accTabs.forEach(t => { t.classList.remove('acc-active'); t.setAttribute('aria-selected','false'); t.setAttribute('tabindex','-1'); });
      document.querySelectorAll('.acc-panel-content').forEach(c => c.classList.remove('acc-active'));
      tab.classList.add('acc-active');
      tab.setAttribute('aria-selected','true');
      tab.setAttribute('tabindex','0');
      document.querySelector(`.acc-panel-content[data-panel="${tab.dataset.tab}"]`).classList.add('acc-active');
    });
    tab.addEventListener('keydown', (e) => {
      let newIndex = index;
      if (e.key === 'ArrowRight') newIndex = (index + 1) % accTabs.length;
      else if (e.key === 'ArrowLeft') newIndex = (index - 1 + accTabs.length) % accTabs.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = accTabs.length - 1;
      else return;
      e.preventDefault();
      accTabs[newIndex].click();
      accTabs[newIndex].focus();
    });
  });
  accTabs.forEach(t => t.setAttribute('tabindex', t.classList.contains('acc-active') ? '0' : '-1'));

  const PROFILES = {
    'visually-impaired': {
      name: '👁 Visually Impaired',
      apply: () => {
        setFontSize(150);
        setLineHeight(2.0);
        applyFilter('acc-high-contrast');
        setToggle('acc-t-focus', true);
        setToggle('acc-t-links', true);
      }
    },
    'cognitive': {
      name: '🧠 Cognitive / Learning',
      apply: () => {
        setFontFamily('dyslexia');
        setLineHeight(2.2);
        setWordSpacing(4);
        setToggle('acc-t-spacing', true);
        setToggle('acc-t-anim', true);
        setToggle('acc-t-guide', true);
      }
    },
    'motor': {
      name: '🖱 Motor / Physical',
      apply: () => {
        setToggle('acc-t-cursor', true);
        setToggle('acc-t-bigtargets', true);
        setToggle('acc-t-focus', true);
        setToggle('acc-t-keyboard', true);
      }
    },
    'deaf': {
      name: '🔇 Deaf / Hard of Hearing',
      apply: () => {
        setToggle('acc-t-links', true);
        setToggle('acc-t-media', true);
        setToggle('acc-t-headings', true);
        setToggle('acc-t-hover', true);
      }
    },
    'adhd': {
      name: '⚡ ADHD Friendly',
      apply: () => {
        setFontFamily('readable');
        setToggle('acc-t-anim', true);
        setToggle('acc-t-stimulus', true);
        setToggle('acc-t-spacing', true);
        setTextAlign('acc-text-align-left');
      }
    },
    'senior': {
      name: '👴 Senior Friendly',
      apply: () => {
        setFontSize(140);
        setLineHeight(2.0);
        applyFilter('acc-high-contrast');
        setToggle('acc-t-cursor', true);
        setToggle('acc-t-bigtargets', true);
        setToggle('acc-t-focus', true);
      }
    }
  };

  document.querySelectorAll('.acc-profile-card').forEach(card => {
    const activate = () => {
      const pid = card.dataset.profile;
      document.querySelectorAll('.acc-profile-card').forEach(c => {
        c.classList.remove('acc-profile-active');
        c.setAttribute('aria-pressed','false');
        c.querySelector('.acc-profile-check').textContent = '';
      });
      if (S.activeProfile === pid) {
        S.activeProfile = null;
        resetAll();
        document.getElementById('acc-active-badge').classList.remove('visible');
        announce('Profile cleared');
        return;
      }
      resetAll(true);
      S.activeProfile = pid;
      card.classList.add('acc-profile-active');
      card.setAttribute('aria-pressed','true');
      card.querySelector('.acc-profile-check').textContent = '✓';
      PROFILES[pid].apply();
      const badge = document.getElementById('acc-active-badge');
      document.getElementById('acc-active-badge-text').textContent = PROFILES[pid].name + ' active';
      badge.classList.add('visible');
      announce(PROFILES[pid].name + ' profile activated');
    };
    card.addEventListener('click', activate);
    card.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); activate(); } });
  });

  document.getElementById('acc-clear-profile').addEventListener('click', () => {
    document.querySelectorAll('.acc-profile-card').forEach(c => {
      c.classList.remove('acc-profile-active');
      c.setAttribute('aria-pressed','false');
      c.querySelector('.acc-profile-check').textContent = '';
    });
    S.activeProfile = null;
    resetAll();
    document.getElementById('acc-active-badge').classList.remove('visible');
    announce('Profile cleared');
  });

  function withScrollLock(fn) {
    var y = window.scrollY || window.pageYOffset || 0;
    var body = document.body;
    var prevPosition = body.style.position;
    var prevTop      = body.style.top;
    var prevWidth    = body.style.width;
    body.style.position = 'fixed';
    body.style.top      = '-' + y + 'px';
    body.style.width    = '100%';
    fn();
    body.style.position = prevPosition;
    body.style.top      = prevTop;
    body.style.width    = prevWidth;
    window.scrollTo(0, y);
  }
  function setFontSize(v) {
    S.fontSize = Math.min(200, Math.max(70, v));
    document.body.style.fontSize = S.fontSize === 100 ? '' : S.fontSize + '%';
    document.getElementById('acc-fs-val').textContent = S.fontSize + '%';
  }
  function setLineHeight(v) {
    S.lineHeight = +v.toFixed(1);
    document.body.style.lineHeight = S.lineHeight;
    document.getElementById('acc-lh-val').textContent = S.lineHeight;
  }
  function setLetterSpacing(v) {
    S.letterSpacing = +v.toFixed(1);
    document.body.style.letterSpacing = S.letterSpacing + 'px';
    document.getElementById('acc-ls-val').textContent = S.letterSpacing + 'px';
  }
  function setWordSpacing(v) {
    S.wordSpacing = +v.toFixed(1);
    document.body.style.wordSpacing = S.wordSpacing + 'px';
    document.getElementById('acc-ws-val').textContent = S.wordSpacing + 'px';
  }
  function applyFilter(cls) {
    if (S.colorFilter) {
      document.documentElement.classList.remove(S.colorFilter);
      document.body.classList.remove(S.colorFilter);
    }
    document.querySelectorAll('.acc-swatch').forEach(s => { s.classList.remove('acc-picked'); s.setAttribute('aria-checked','false'); });
    S.colorFilter = cls;
    if (cls) {
      document.documentElement.classList.add(cls);
      document.body.classList.add(cls);
      const sw = document.querySelector(`.acc-swatch[data-filter="${cls}"]`);
      if (sw) { sw.classList.add('acc-picked'); sw.setAttribute('aria-checked','true'); }
    } else {
      const sw = document.querySelector('.acc-swatch[data-filter=""]');
      if (sw) { sw.classList.add('acc-picked'); sw.setAttribute('aria-checked','true'); }
    }
  }
  function setFontFamily(val) {
    S.fontFamily = val;
    document.getElementById('acc-font-family').value = val;
    document.body.classList.remove('acc-dyslexia','acc-readable','acc-mono-font');
    if (val === 'dyslexia') document.body.classList.add('acc-dyslexia');
    else if (val === 'readable') document.body.classList.add('acc-readable');
    else if (val === 'mono') {
      document.body.style.fontFamily = 'monospace';
    }
  }
  function setTextAlign(cls) {
    if (S.textAlign) document.body.classList.remove(S.textAlign);
    S.textAlign = cls;
    if (cls) document.body.classList.add(cls);
    document.querySelectorAll('.acc-align-btn').forEach(b => {
      const active = b.dataset.align === cls;
      b.classList.toggle('acc-active-align', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function stepper(upId, dnId, valId, getV, setFn, min, max, step) {
    document.getElementById(upId).addEventListener('click', () => { if (getV() < max) setFn(+(getV() + step).toFixed(2)); });
    document.getElementById(dnId).addEventListener('click', () => { if (getV() > min) setFn(+(getV() - step).toFixed(2)); });
  }
  stepper('acc-fs-up','acc-fs-dn','acc-fs-val', () => S.fontSize,       setFontSize,       70,  200, 10);
  stepper('acc-lh-up','acc-lh-dn','acc-lh-val', () => S.lineHeight,     setLineHeight,     1.0, 3.0, 0.2);
  stepper('acc-ls-up','acc-ls-dn','acc-ls-val', () => S.letterSpacing,  setLetterSpacing,  0,   10,  1);
  stepper('acc-ws-up','acc-ws-dn','acc-ws-val', () => S.wordSpacing,    setWordSpacing,    0,   20,  2);

  document.getElementById('acc-font-family').addEventListener('change', e => setFontFamily(e.target.value));

  document.querySelectorAll('.acc-align-btn').forEach(btn => {
    btn.addEventListener('click', () => setTextAlign(btn.dataset.align));
  });

  document.querySelectorAll('.acc-swatch').forEach(sw => {
    sw.addEventListener('click', () => applyFilter(sw.dataset.filter));
  });

  const toggleMap = {
    'acc-t-guide':      'acc-reading-guide-on',
    'acc-t-mask':       'acc-reading-mask-on',
    'acc-t-links':      'acc-highlight-links',
    'acc-t-headings':   'acc-highlight-headings',
    'acc-t-hover':      'acc-highlight-hover',
    'acc-t-cursor':     'acc-big-cursor',
    'acc-t-bigtargets': 'acc-big-targets',
    'acc-t-focus':      'acc-focus-ring',
    'acc-t-keyboard':   'acc-keyboard-nav',
    'acc-t-spacing':    'acc-text-spacing',
    'acc-t-anim':       'acc-stop-anim',
    'acc-t-media':      'acc-mute-media',
    'acc-t-stimulus':   'acc-reduced-stimulus',
  };

  var REFLOW_CLASSES = ['acc-text-spacing','acc-reduced-stimulus','acc-high-contrast','acc-inverted','acc-dark-contrast'];

  function setToggle(id, forceOn) {
    const row = document.getElementById(id);
    if (!row) return;
    const cls = toggleMap[id];
    const currentlyOn = row.classList.contains('acc-on');
    var needsLock = REFLOW_CLASSES.indexOf(cls) >= 0;

    function applyClass(add) {
      var y = window.scrollY || window.pageYOffset || 0;
      if (add) {
        document.body.classList.add(cls);
        if (cls === 'acc-reduced-stimulus') document.documentElement.classList.add(cls);
      } else {
        document.body.classList.remove(cls);
        if (cls === 'acc-reduced-stimulus') document.documentElement.classList.remove(cls);
      }
      window.scrollTo(0, y);
    }

    if (forceOn === undefined) {
      const on = row.classList.toggle('acc-on');
      row.setAttribute('aria-checked', on ? 'true' : 'false');
      if (needsLock) { applyClass(on); } else { applyClass(on); }
      S.toggles[cls] = on;
      handleSideEffects(cls, on);
    } else {
      if (forceOn && !currentlyOn) {
        row.classList.add('acc-on');
        row.setAttribute('aria-checked','true');
        applyClass(true);
        S.toggles[cls] = true;
        handleSideEffects(cls, true);
      } else if (!forceOn && currentlyOn) {
        row.classList.remove('acc-on');
        row.setAttribute('aria-checked','false');
        applyClass(false);
        S.toggles[cls] = false;
        handleSideEffects(cls, false);
      }
    }
  }

  function handleSideEffects(cls, on) {
    if (cls === 'acc-reading-guide-on') guide.style.display = on ? 'block' : 'none';
    if (cls === 'acc-reading-mask-on') {
      maskTop.style.display = on ? 'block' : 'none';
      maskBottom.style.display = on ? 'block' : 'none';
    }
    if (cls === 'acc-mute-media') {
      document.querySelectorAll('video, audio').forEach(m => {
        if (!widgetEl.contains(m)) m.muted = on;
      });
    }
  }

  Object.keys(toggleMap).forEach(id => {
    S.toggles[toggleMap[id]] = false;
    const row = document.getElementById(id);
    if (!row) return;
    row.addEventListener('click', () => setToggle(id));
    row.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setToggle(id); } });
  });

  document.addEventListener('mousemove', e => {
    if (S.toggles['acc-reading-guide-on']) guide.style.top = (e.clientY - 17) + 'px';
    if (S.toggles['acc-reading-mask-on']) {
      const y = e.clientY;
      const h = 60;
      maskTop.style.height    = Math.max(0, y - h) + 'px';
      maskBottom.style.height = Math.max(0, window.innerHeight - y - h) + 'px';
    }
  });

  function resetAll(silent) {
    setFontSize(100); document.body.style.fontSize = '';
    setLineHeight(1.6);
    setLetterSpacing(0);
    setWordSpacing(0);
    applyFilter('');
    setFontFamily('');
    setTextAlign('');
    document.documentElement.classList.remove(
      'acc-reduced-stimulus','acc-high-contrast','acc-invert',
      'acc-grayscale','acc-low-saturation'
    );
    Object.keys(toggleMap).forEach(id => setToggle(id, false));
    guide.style.display = 'none';
    maskTop.style.display = 'none';
    maskBottom.style.display = 'none';
    document.body.style.fontFamily = '';
    if (!silent) announce('All settings reset');
  }

  document.getElementById('acc-reset').addEventListener('click', () => {
    document.querySelectorAll('.acc-profile-card').forEach(c => {
      c.classList.remove('acc-profile-active');
      c.setAttribute('aria-pressed','false');
      c.querySelector('.acc-profile-check').textContent = '';
    });
    S.activeProfile = null;
    document.getElementById('acc-active-badge').classList.remove('visible');
    resetAll();
  });

  let lastAudit = null;

  function getLuminance(r, g, b) {
    const toLinear = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  }
  function contrastRatio(rgb1, rgb2) {
    const l1 = getLuminance(...rgb1), l2 = getLuminance(...rgb2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function parseRGB(str) {
    const m = (str || '').match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? [+m[1], +m[2], +m[3]] : null;
  }
  function getEffectiveBg(el) {
    let node = el;
    while (node && node !== document.documentElement) {
      const bg = getComputedStyle(node).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return parseRGB(bg);
      node = node.parentElement;
    }
    return [255, 255, 255];
  }
  function getTextSize(el) {
    const fs = parseFloat(getComputedStyle(el).fontSize) || 16;
    const fw = getComputedStyle(el).fontWeight;
    const bold = parseInt(fw) >= 700 || fw === 'bold' || fw === 'bolder';
    return { px: fs, large: fs >= 18 || (bold && fs >= 14) };
  }

  function runScan() {
    const issues = [];
    const $ = sel => Array.from(document.querySelectorAll(sel)).filter(e => !widgetEl.contains(e));

    function lum(r,g,b){const s=c=>{c/=255;return c<=.03928?c/12.92:((c+.055)/1.055)**2.4;}; return .2126*s(r)+.7152*s(g)+.0722*s(b);}
    function contrast(l1,l2){const [hi,lo]=[Math.max(l1,l2),Math.min(l1,l2)];return(hi+.05)/(lo+.05);}
    function parseRgb(str){const m=str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);return m?[+m[1],+m[2],+m[3]]:null;}
    function getBg(el){
      let node=el;
      while(node&&node!==document.body){
        const bg=getComputedStyle(node).backgroundColor;
        if(bg&&bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent'){const p=parseRgb(bg);if(p)return p;}
        node=node.parentElement;
      }
      const bodyBg=getComputedStyle(document.body).backgroundColor;
      const p=parseRgb(bodyBg);
      return p||[255,255,255];
    }
    function push(type,criterion,level,icon,title,desc,count,fixApplied,requiresDev,section,elements){
      issues.push({
        type,
        criterion,
        level,
        icon,
        title,
        desc,
        count:       elements ? elements.length : (count||null),
        fixApplied:  !!fixApplied,
        requiresDev: !!requiresDev,
        section:     section||'page',
        elements:    elements||[],
      });
    }

    function getSelector(el) {
      if (!el) return '';
      const tag = (el.tagName || '').toLowerCase();
      const id  = el.id ? '#' + el.id : '';
      const cls = el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
      const attr = el.getAttribute('name') ? '[name="'+el.getAttribute('name')+'"]' : '';
      return tag + (id || cls || attr);
    }
    function getSnippet(el) {
      const txt = (
        el.textContent ||
        el.getAttribute('alt') ||
        el.getAttribute('placeholder') ||
        el.getAttribute('aria-label') ||
        el.getAttribute('value') || ''
      ).trim().substring(0, 60);
      return txt || (el.getAttribute('src') || el.getAttribute('href') || '').substring(0, 60) || el.tagName.toLowerCase();
    }
    function makeEl(el) { return { selector: getSelector(el), snippet: getSnippet(el) }; }

    function getSection(el){
      if(!el) return 'page';
      let node=el;
      while(node&&node!==document.documentElement){
        const tag=(node.tagName||'').toLowerCase();
        const role=(node.getAttribute('role')||'').toLowerCase();
        if(tag==='header'||role==='banner')     return 'header';
        if(tag==='nav'||role==='navigation')    return 'navigation';
        if(tag==='main'||role==='main')         return 'main';
        if(tag==='aside'||role==='complementary') return 'aside';
        if(tag==='footer'||role==='contentinfo') return 'footer';
        if(tag==='form'||role==='form')          return 'form';
        node=node.parentElement;
      }
      return 'page';
    }

    ;(function(){
      const imgs=$('img,input[type=image],[role=img]');
      let fixed=0,warned=0,errors=0;
      const fixedEls=[],errorEls=[],warnEls=[];
      imgs.forEach(img=>{
        const role=img.getAttribute('role');
        const isDecor=img.getAttribute('alt')==='';
        if(isDecor) return;
        if(!img.hasAttribute('alt')&&role!=='presentation'){
          const lbl=img.getAttribute('aria-label')||img.getAttribute('title');
          if(lbl){img.setAttribute('alt',lbl);fixedEls.push(makeEl(img));}
          else{img.setAttribute('alt','');errorEls.push({selector:getSelector(img),snippet:(img.getAttribute('src')||'').substring(0,60)});}
        } else if(img.getAttribute('alt')===img.getAttribute('src')){
          warnEls.push({selector:getSelector(img),snippet:'alt="'+img.getAttribute('alt')+'"'});
        } else if(/\.(png|jpe?g|gif|webp|svg)$/i.test(img.getAttribute('alt')||'')){
          warnEls.push({selector:getSelector(img),snippet:'alt="'+img.getAttribute('alt')+'"'});
        }
      });
      if(fixedEls.length) push('fixed',  '1.1.1','A','🖼','Alt Text Restored',`Restored meaningful alt text from aria-label/title on ${fixedEls.length} image(s).`,null,true,false,'page',fixedEls);
      if(errorEls.length) push('error',  '1.1.1','A','🖼','Missing Alt Text',`${errorEls.length} image(s) have no alt attribute. Screen readers cannot describe these images.`,null,false,true,'page',errorEls);
      if(warnEls.length)  push('warning','1.1.1','A','🖼','Poor Alt Text Quality',`${warnEls.length} image(s) have alt text that appears to be a filename or URL.`,null,false,true,'page',warnEls);
    })();

    ;(function(){
      const hds=$('h1,h2,h3,h4,h5,h6');
      const h1s=hds.filter(h=>h.tagName==='H1');
      let skipped=0;
      for(let i=1;i<hds.length;i++) if(parseInt(hds[i].tagName[1])-parseInt(hds[i-1].tagName[1])>1) skipped++;
      if(!h1s.length)    push('error',  '1.3.1','A','📋','No H1 Heading','Every page must have exactly one H1 to identify its main topic. Screen readers rely on this.',null,false,true,'page');
      if(h1s.length>1)   push('warning','1.3.1','A','📋','Multiple H1 Headings',`${h1s.length} H1 elements found. Only one H1 is recommended per page.`,h1s.length,false,true,'page');
      if(skipped)        push('warning','1.3.1','A','📋','Heading Levels Skipped',`${skipped} non-sequential heading jump(s) detected (e.g. H2 → H4). This breaks screen reader navigation.`,skipped,false,true,'page');

      const tables=$('table');
      let noTh=0,noCaption=0;
      tables.forEach(t=>{
        if(!t.querySelector('th')) noTh++;
        if(!t.querySelector('caption')) noCaption++;
      });
      if(noTh)      push('error',  '1.3.1','A','📊','Data Tables Missing Headers',`${noTh} table(s) have no <th> elements. Screen readers cannot associate data with column/row headers.`,noTh,false,true,'main');
      if(noCaption) push('warning','1.3.1','A','📊','Tables Missing Caption',`${noCaption} table(s) have no <caption>. A caption identifies the table's purpose.`,noCaption,false,true,'main');

      const listItems=$('ul>li,ol>li');
      const hasProperLists=listItems.length>0;
    })();

    ;(function(){
      const posFixed=$('[style*="position:fixed"],[style*="position: fixed"]').filter(e=>!widgetEl.contains(e));
    })();

    ;(function(){
      const lockMeta=document.querySelector('meta[name=viewport]');
      if(lockMeta){
        const content=lockMeta.getAttribute('content')||'';
        if(/user-scalable\s*=\s*no/i.test(content)||/maximum-scale\s*=\s*1[^.]?(?!\d)/i.test(content)){
          push('error','1.3.4','AA','📱','Zoom/Scale Locked','The viewport meta tag prevents users from zooming. This fails WCAG 1.4.4 and 1.3.4.',null,false,true,'page');
        }
      }
    })();

    ;(function(){
      const personalFields={
        name:/\bname\b/i, email:/\bemail\b/i, tel:/\b(phone|tel)\b/i,
        address:/\b(address|street|city|postal|zip|province|state)\b/i,
        bday:/\b(birth|dob|birthday)\b/i,
      };
      const inputs=$('input[type=text],input[type=email],input[type=tel],input[type=url]');
      let missing=0;
      inputs.forEach(inp=>{
        const name=(inp.getAttribute('name')||'').toLowerCase();
        const id=(inp.getAttribute('id')||'').toLowerCase();
        const auto=inp.getAttribute('autocomplete');
        if(auto&&auto!=='off'&&auto!=='') return;
        for(const [type,rx] of Object.entries(personalFields)){
          if(rx.test(name)||rx.test(id)){ missing++; break; }
        }
      });
      if(missing) push('warning','1.3.5','AA','🏷','Missing autocomplete Attributes',`${missing} personal input field(s) appear to lack autocomplete attributes, making autofill harder for users with motor disabilities.`,missing,false,true,'form');
    })();

    ;(function(){
      const required=$('[required],[aria-required=true]');
      let onlyColor=0;
      required.forEach(inp=>{
        const cs=getComputedStyle(inp);
        const hasRequiredIndicator=inp.getAttribute('aria-describedby')||
          document.querySelector(`label[for="${inp.id}"]`)?.textContent?.includes('*');
        if(!hasRequiredIndicator) onlyColor++;
      });
      if(onlyColor) push('warning','1.4.1','A','🔴','Required Fields May Rely on Colour Only',`${onlyColor} required field(s) may not indicate their required status beyond colour alone. Add an asterisk (*) or text label.`,onlyColor,false,true,'form');
    })();

    ;(function(){
      const textEls=$('p,span,li,h1,h2,h3,h4,h5,h6,a,button,label,td,th,dt,dd,figcaption,caption,legend,blockquote');
      const failAAEls=[],failAAAEls=[];
      const sampled=textEls.filter(e=>e.textContent.trim().length>0).slice(0,200);
      sampled.forEach(el=>{
        try{
          const cs=getComputedStyle(el);
          const fg=parseRgb(cs.color);
          if(!fg) return;
          const bg=getBg(el);
          const fontSize=parseFloat(cs.fontSize);
          const isBold=parseInt(cs.fontWeight)>=700;
          const isLarge=fontSize>=18||(isBold&&fontSize>=14);
          const threshold=isLarge?3.0:4.5;
          const thresholdAAA=isLarge?4.5:7.0;
          const ratio=contrast(lum(...fg),lum(...bg));
          if(ratio<threshold)
            failAAEls.push({selector:getSelector(el),snippet:el.textContent.trim().substring(0,50)+' (ratio:'+ratio.toFixed(2)+':1)'});
          else if(ratio<thresholdAAA)
            failAAAEls.push({selector:getSelector(el),snippet:el.textContent.trim().substring(0,50)+' (ratio:'+ratio.toFixed(2)+':1)'});
        }catch(e){}
      });
      if(failAAEls.length)  push('error',  '1.4.3','AA','🎨','Low Contrast Text',`${failAAEls.length} of ${sampled.length} sampled text elements fail the 4.5:1 minimum contrast ratio (WCAG AA). See affected elements below.`,null,false,true,'page',failAAEls.slice(0,20));
      if(failAAAEls.length&&!failAAEls.length) push('warning','1.4.3','AA','🎨','Contrast Could Be Improved',`${failAAAEls.length} elements pass AA (4.5:1) but not AAA (7:1).`,null,false,true,'page',failAAAEls.slice(0,10));
    })();

    ;(function(){
      const textEls=$('p,li,td,span').slice(0,50);
      let pxFixed=0;
      textEls.forEach(el=>{
        const cs=getComputedStyle(el);
      });
      const lockMeta=document.querySelector('meta[name=viewport]');
      if(lockMeta&&/user-scalable\s*=\s*no/i.test(lockMeta.getAttribute('content')||'')){
        push('error','1.4.4','AA','🔍','Text Resize Blocked','Viewport meta prevents browser zoom. Users who need larger text cannot resize it.',null,false,true,'page');
      }
    })();

    ;(function(){
      const bodyCs=getComputedStyle(document.body);
      const htmlCs=getComputedStyle(document.documentElement);
      if(bodyCs.overflowX==='hidden'||htmlCs.overflowX==='hidden'){
        push('warning','1.4.10','AA','↔','Horizontal Overflow Hidden','overflow-x:hidden on body or html may hide content that breaks at small viewports, violating WCAG 1.4.10 Reflow.',null,false,true,'page');
      }
    })();

    ;(function(){
      const inputs=$('input:not([type=hidden]),select,textarea,button');
      let warned=0;
      inputs.slice(0,60).forEach(el=>{
        try{
          const cs=getComputedStyle(el);
          const border=parseRgb(cs.borderColor);
          if(!border) return;
          const bg=getBg(el.parentElement||document.body);
          const ratio=contrast(lum(...border),lum(...bg));
          if(ratio<3.0) warned++;
        }catch(e){}
      });
      if(warned) push('warning','1.4.11','AA','🖊','Low Contrast UI Components',`~${warned} form control border(s) may not meet the 3:1 contrast ratio required for non-text UI components (WCAG 1.4.11).`,warned,false,true,'form');
    })();

    ;(function(){
      var videos=$('video'), audios=$('audio'), noCaptions=0, noTranscript=0;
      videos.forEach(function(el){
        var hasTrack=el.querySelector('track[kind="captions"],track[kind="subtitles"]');
        var nearby=el.nextElementSibling&&/transcript|caption/i.test(el.nextElementSibling.textContent||'');
        if(!hasTrack&&!nearby) noCaptions++;
      });
      audios.forEach(function(el){
        var nearby=el.nextElementSibling&&/transcript/i.test(el.nextElementSibling.textContent||'');
        if(!nearby) noTranscript++;
      });
      if(noCaptions) push('error','1.2.2','A','[vid]','Videos Missing Captions',
        `${noCaptions} video(s) have no <track kind="captions"> element. Deaf and hard-of-hearing users cannot access this content.`,noCaptions,false,true,'main');
      if(noTranscript&&audios.length) push('warning','1.2.1','A','[aud]','Audio May Lack Transcript',
        `${noTranscript} audio element(s) found with no visible transcript nearby. Audio-only content requires a text alternative.`,noTranscript,false,true,'main');
    })();

    ;(function(){
      var imgs=$('img[alt]'), imgText=0;
      imgs.forEach(function(img){
        var alt=(img.getAttribute('alt')||'').trim();
        if(alt.length>20&&alt.includes(' ')){
          try{var r=img.getBoundingClientRect();if(r.width>0&&r.height>0&&r.width/r.height>3)imgText++;}catch(e){}
        }
      });
      if(imgText) push('warning','1.4.5','AA','[img]','Possible Images of Text',
        `${imgText} wide image(s) have long alt text suggesting text displayed as an image. Real text scales with user preferences; images of text do not.`,imgText,false,true,'page');
    })();

    ;(function(){
      try{
        var ts=document.createElement('style');ts.id='acc-spacing-test';
        ts.textContent='*{line-height:1.5!important;letter-spacing:0.12em!important;word-spacing:0.16em!important;}';
        document.head.appendChild(ts);
        var clipped=0;
        $('p,li,button,a,label,td').slice(0,40).forEach(function(el){
          if(el.scrollHeight>el.offsetHeight+4&&getComputedStyle(el).overflow==='hidden') clipped++;
        });
        ts.remove();
        if(clipped) push('warning','1.4.12','AA','[sp]','Text Spacing Causes Content Loss',
          `${clipped} element(s) clip content when text-spacing overrides applied (WCAG 1.4.12). Remove overflow:hidden from text containers.`,clipped,false,true,'page');
      }catch(e){}
    })();

    ;(function(){
      var potentialFlash=0;
      $('[style*="animation"],[class*="blink"],[class*="flash"],[class*="strobe"]').forEach(function(el){
        var cs=getComputedStyle(el), dur=parseFloat(cs.animationDuration)||0;
        if(dur>0&&dur<0.334&&cs.animationIterationCount==='infinite') potentialFlash++;
      });
      var gifs=$('img[src$=".gif"]');
      if(potentialFlash) push('error','2.3.1','A','[!]','Potentially Flashing Content',
        `${potentialFlash} element(s) have CSS animations faster than 3Hz which may cause seizures. Slow all looping animations to >333ms.`,potentialFlash,false,true,'page');
      if(gifs.length) push('warning','2.3.1','A','[gif]','Animated GIFs Detected',
        `${gifs.length} GIF image(s) found. If any flash more than 3 times per second they violate WCAG 2.3.1.`,gifs.length,false,true,'page');
    })();

    ;(function(){
      var autoEls=$('[data-ride="carousel"],[class*="carousel"],[class*="slider"],[class*="ticker"],marquee');
      var noControl=0;
      autoEls.forEach(function(el){
        var hasPause=el.querySelector('[aria-label*="pause" i],[aria-label*="stop" i],[class*="pause"],[class*="stop"]');
        if(!hasPause) noControl++;
      });
      if(noControl) push('warning','2.2.2','A','[||]','Auto-Scrolling Without Pause Control',
        `${noControl} carousel/slider/ticker element(s) auto-advance without a pause or stop control. Users need to pause moving content.`,noControl,false,true,'page');
    })();

    ;(function(){
      const clickHandlers=$('[onclick]:not(a):not(button):not(input):not(select):not(textarea):not([role=button]):not([role=link]):not([tabindex])');
      if(clickHandlers.length){
        push('error','2.1.1','A','⌨','Click Handlers on Non-Interactive Elements',`${clickHandlers.length} element(s) have onclick but are not keyboard-reachable (missing role + tabindex). Keyboard-only users cannot activate these.`,clickHandlers.length,false,true,'page');
      }
      const divFocusable=$('div[tabindex="0"],span[tabindex="0"]').filter(e=>{
        const role=e.getAttribute('role');
        return !role||!['button','link','checkbox','radio','tab','menuitem','option','combobox','listbox','slider','switch','treeitem'].includes(role);
      });
      if(divFocusable.length) push('warning','2.1.1','A','⌨','Focusable Non-Interactive Elements',`${divFocusable.length} div/span element(s) are focusable (tabindex=0) but have no ARIA role. Screen readers won't know what to do with them.`,divFocusable.length,false,true,'page');
    })();

    ;(function(){
      const dialogs=$('[role=dialog],[role=alertdialog]');
      dialogs.forEach(d=>{
        if(!d.getAttribute('aria-modal')&&!d.getAttribute('aria-labelledby')&&!d.getAttribute('aria-label')){
          push('warning','2.1.2','A','🪤','Dialog Missing ARIA Attributes',`A [role=dialog] element is missing aria-modal and aria-label/aria-labelledby. This can cause keyboard traps.`,null,false,true,'page');
        }
      });
    })();

    ;(function(){
      const hasSkip=document.querySelector('[data-acc-skip],[href="#main"],[href="#content"],.skip-link,#skip-nav,[id*="skip"],[aria-label*="skip" i]');
      if(!hasSkip){
        const main=document.querySelector('main,[role=main],#main,#content');
        if(main){
          if(!main.id) main.id='acc-main';
          const skip=document.createElement('a');
          skip.href='#'+main.id; skip.textContent='Skip to main content';
          skip.setAttribute('data-acc-skip','1');
          Object.assign(skip.style,{position:'absolute',top:'-999px',left:'0',zIndex:'9999999',
            background:'#0a1628',color:'#4f8ef7',padding:'8px 18px',
            borderRadius:'0 0 10px 0',fontFamily:'sans-serif',fontSize:'14px',
            textDecoration:'none',fontWeight:'600'});
          skip.addEventListener('focus',()=>skip.style.top='0');
          skip.addEventListener('blur',()=>skip.style.top='-999px');
          document.body.insertBefore(skip,document.body.firstChild);
          push('fixed','2.4.1','A','⏭','Skip Navigation Added','Keyboard users can now bypass repeated navigation with one Tab press.',null,true,false,'navigation');
        } else {
          push('warning','2.4.1','A','⏭','No Skip Link & No <main> Element','Add a skip navigation link and a <main> element for keyboard users.',null,false,true,'page');
        }
      }
    })();

    ;(function(){
      const title=document.title||'';
      if(!title.trim()) push('error','2.4.2','A','🏷','Page Has No Title','The <title> element is empty or missing. Screen readers announce the page title when users navigate between pages.',null,false,true,'page');
      else if(title.length<5||title.toLowerCase()==='home'||title.toLowerCase()==='index') push('warning','2.4.2','A','🏷','Page Title May Be Generic',`Page title "${title}" may not adequately describe the page's purpose.`,null,false,true,'page');
    })();

    ;(function(){
      const positive=$('[tabindex]').filter(e=>!widgetEl.contains(e)&&parseInt(e.getAttribute('tabindex'))>0);
      if(positive.length) push('error','2.4.3','A','🔢','Positive tabindex Values Disrupt Focus Order',`${positive.length} element(s) use tabindex > 0 which overrides natural DOM focus order. Use tabindex="0" or "-1" only.`,positive.length,false,true,'page');
    })();

    ;(function(){
      const vague=['click here','read more','here','more','link','details','learn more','continue','this','see more'];
      const links=$('a[href]');
      const fixedLinkEls=[],vagueLinkEls=[];
      links.forEach(l=>{
        const txt=(l.textContent||'').trim();
        const aria=l.getAttribute('aria-label')||l.getAttribute('title');
        if(!txt&&!aria&&!l.querySelector('img[alt]')){
          l.setAttribute('aria-label',l.getAttribute('href')||'link');
          fixedLinkEls.push({selector:getSelector(l),snippet:(l.getAttribute('href')||'').substring(0,60)});
        } else if(vague.includes((txt||aria||'').toLowerCase()))
          vagueLinkEls.push({selector:getSelector(l),snippet:'"'+(txt||aria)+'" → '+(l.getAttribute('href')||'').substring(0,50)});
      });
      if(fixedLinkEls.length) push('fixed',  '2.4.4','A','🔗','Empty Links Labelled',`Added descriptive aria-label to ${fixedLinkEls.length} link(s) with no visible text.`,null,true,false,'page',fixedLinkEls);
      if(vagueLinkEls.length) push('warning','2.4.4','A','🔗','Vague Link Text',`${vagueLinkEls.length} link(s) use non-descriptive text like "click here" or "read more". Screen reader users cannot determine the link destination.`,null,false,true,'page',vagueLinkEls);
    })();

    ;(function(){
      let outlineRemoved=false;
      try{
        for(const sheet of Array.from(document.styleSheets)){
          try{
            for(const rule of Array.from(sheet.cssRules||[])){
              if(rule.style&&rule.style.outline==='none'&&/:focus/.test(rule.selectorText||'')) outlineRemoved=true;
            }
          }catch(e){}
        }
      }catch(e){}
      if(outlineRemoved) push('error','2.4.7','AA','🔲','Focus Outline Removed via CSS','A CSS rule removes the focus outline on focused elements (`:focus { outline: none }`). Keyboard users cannot see where focus is.',null,false,true,'page');
    })();

    ;(function(){
      const interactive=$('a,button,input,select,[role=button],[role=link]').slice(0,100);
      let tooSmall=0;
      interactive.forEach(el=>{
        try{
          const r=el.getBoundingClientRect();
          if(r.width>0&&r.height>0&&(r.width<24||r.height<24)) tooSmall++;
        }catch(e){}
      });
      if(tooSmall) push('warning','2.5.5','AA','🎯','Small Touch Targets',`${tooSmall} interactive element(s) appear smaller than 24×24px. WCAG 2.2 recommends a minimum 24×24px target size for pointer inputs.`,tooSmall,false,true,'page');
    })();

    ;(function(){
      const lang=document.documentElement.getAttribute('lang');
      if(!lang){
        document.documentElement.setAttribute('lang','en');
        push('fixed','3.1.1','A','🌐','Page Language Set','Added lang="en" to <html>. Screen readers use this to select the correct speech synthesis voice.',null,true,false,'page');
      } else if(!/^[a-z]{2,3}(-[A-Z]{2})?$/.test(lang)){
        push('warning','3.1.1','A','🌐','Invalid lang Attribute Value',`lang="${lang}" does not appear to be a valid BCP 47 language tag.`,null,false,true,'page');
      }
    })();

    ;(function(){
      const invalidInputs=$('[aria-invalid=true],[class*=error i],[class*=invalid i]');
      let missingDesc=0;
      invalidInputs.forEach(inp=>{
        const describedBy=inp.getAttribute('aria-describedby');
        if(!describedBy||!document.getElementById(describedBy)) missingDesc++;
      });
      if(missingDesc) push('warning','3.3.1','A','❌','Error Messages Not Programmatically Associated',`${missingDesc} invalid input(s) lack aria-describedby pointing to an error message element. Screen readers won't announce the error.`,missingDesc,false,true,'form');
    })();

    ;(function(){
      const inputs=$('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=image]),select,textarea');
      const fixedInpEls=[],errorInpEls=[];
      inputs.forEach(inp=>{
        const lbl=inp.id?document.querySelector(`label[for="${inp.id}"]`):null;
        const aria=inp.getAttribute('aria-label')||inp.getAttribute('aria-labelledby');
        const placeholder=inp.getAttribute('placeholder');
        if(!lbl&&!aria){
          if(placeholder){
            inp.setAttribute('aria-label',placeholder);
            fixedInpEls.push({selector:getSelector(inp),snippet:'placeholder="'+placeholder+'"'});
          } else {
            errorInpEls.push({selector:getSelector(inp),snippet:'type="'+(inp.getAttribute('type')||inp.tagName.toLowerCase())+'" name="'+(inp.name||'(no name)')+'"'});
          }
        }
        if(lbl&&!lbl.textContent.trim()) push('warning','3.3.2','A','📝','Empty Label Text',`A <label> for "${inp.id||inp.name||'?'}" exists but contains no text.`,null,false,true,'form',[{selector:getSelector(inp),snippet:'label[for="'+(inp.id||'')+'"] is empty'}]);
      });
      if(fixedInpEls.length) push('fixed','3.3.2','A','📝','Input Labels Added from Placeholder',`Added aria-label from placeholder to ${fixedInpEls.length} unlabelled input(s). Placeholders disappear on focus — add visible <label> elements for best practice.`,null,true,false,'form',fixedInpEls);
      if(errorInpEls.length) push('error','3.3.2','A','📝','Unlabelled Form Controls',`${errorInpEls.length} input(s) have no label, aria-label, or placeholder. Screen readers cannot identify these fields.`,null,false,true,'form',errorInpEls);
    })();

    ;(function(){
      const allIds=Array.from(document.querySelectorAll('[id]')).filter(e=>!widgetEl.contains(e)).map(e=>e.id);
      const dupeIds=allIds.filter((id,i)=>allIds.indexOf(id)!==i);
      const uniqueDupes=[...new Set(dupeIds)];
      if(uniqueDupes.length) push('error','4.1.1','A','🆔','Duplicate ID Attributes',`${uniqueDupes.length} ID(s) appear more than once. Duplicate IDs break ARIA references.`,null,false,true,'page',uniqueDupes.map(id=>({selector:'#'+id,snippet:allIds.filter(x=>x===id).length+' elements share this ID'})));
    })();

    ;(function(){
      const btns=$('button,input[type=submit],input[type=button],input[type=reset],[role=button]');
      const fixedBtnEls=[],errorBtnEls=[];
      btns.forEach(b=>{
        const txt=(b.textContent||'').trim()||(b.getAttribute('value')||'').trim();
        const aria=b.getAttribute('aria-label')||b.getAttribute('aria-labelledby');
        if(!txt&&!aria){
          const svgTitle=b.querySelector('svg title');
          const imgAlt=b.querySelector('img[alt]');
          const lbl=svgTitle?.textContent||imgAlt?.getAttribute('alt');
          if(lbl){b.setAttribute('aria-label',lbl);fixedBtnEls.push({selector:getSelector(b),snippet:'labelled from: '+lbl.substring(0,40)});}
          else errorBtnEls.push({selector:getSelector(b),snippet:b.className||b.getAttribute('type')||b.tagName.toLowerCase()});
        }
      });
      if(fixedBtnEls.length) push('fixed','4.1.2','A','🔘','Icon Buttons Labelled',`Added aria-label to ${fixedBtnEls.length} button(s) using SVG title or image alt text.`,null,true,false,'page',fixedBtnEls);
      if(errorBtnEls.length) push('error','4.1.2','A','🔘','Unlabelled Buttons',`${errorBtnEls.length} button(s) have no accessible name. Screen readers will just say "button" with no context.`,null,false,true,'page',errorBtnEls);

      const validRoles=['alert','alertdialog','application','article','banner','button','cell','checkbox',
        'columnheader','combobox','complementary','contentinfo','definition','dialog','directory',
        'document','feed','figure','form','grid','gridcell','group','heading','img','link','list',
        'listbox','listitem','log','main','marquee','math','menu','menubar','menuitem','menuitemcheckbox',
        'menuitemradio','navigation','none','note','option','presentation','progressbar','radio',
        'radiogroup','region','row','rowgroup','rowheader','scrollbar','search','searchbox','separator',
        'slider','spinbutton','status','switch','tab','table','tablist','tabpanel','term','textbox',
        'timer','toolbar','tooltip','tree','treegrid','treeitem'];
      const roleEls=$('[role]');
      let badRole=0;
      roleEls.forEach(e=>{
        const roles=(e.getAttribute('role')||'').split(/\s+/).filter(Boolean);
        roles.forEach(r=>{ if(!validRoles.includes(r)) badRole++; });
      });
      if(badRole) push('error','4.1.2','A','♿','Invalid ARIA Role Values',`${badRole} element(s) use ARIA role values that are not in the ARIA specification. These will be ignored or cause errors in screen readers.`,badRole,false,true,'page');

      const frames=$('iframe');
      let fixed2=0;
      frames.forEach(f=>{
        if(!f.getAttribute('title')&&!f.getAttribute('aria-label')){
          const src=(f.getAttribute('src')||'').split('/').pop()||'Embedded content';
          f.setAttribute('title',src.replace(/[?#].*/,'').replace(/\.[^.]+$/,'').replace(/[-_]/g,' ')||'Embedded content');
          fixed2++;
        }
      });
      if(fixed2) push('fixed','4.1.2','A','🖥','iFrames Titled',`Added title attribute to ${fixed2} iframe(s).`,fixed2,true,false,'page');

      if(!document.querySelector('main,[role=main]'))        push('error',  '4.1.2','A','🗺','No <main> Landmark','Add a <main> element to identify the primary content area. Screen reader users navigate by landmarks.',null,false,true,'page');
      if(!document.querySelector('nav,[role=navigation]'))   push('warning','4.1.2','A','🗺','No <nav> Landmark','Wrap primary navigation in a <nav> element for screen reader landmark navigation.',null,false,true,'page');
      if(!document.querySelector('header,[role=banner]'))    push('warning','4.1.2','A','🗺','No <header> Landmark','Add a <header> element for the page banner area.',null,false,true,'page');
      if(!document.querySelector('footer,[role=contentinfo]')) push('warning','4.1.2','A','🗺','No <footer> Landmark','Add a <footer> element for page footer content.',null,false,true,'page');
    })();

    ;(function(){
      const media=$('video[autoplay],audio[autoplay]');
      let fixed=0;
      media.forEach(m=>{if(!m.muted){m.muted=true;fixed++;}});
      if(fixed) push('fixed','1.4.2','A','🔇','Autoplay Media Muted',`Muted ${fixed} auto-playing media element(s) to prevent unexpected audio.`,fixed,true,false,'page');

      const extLinks=$('a[target=_blank]');
      let fixedExt=0;
      extLinks.forEach(a=>{
        const rel=a.getAttribute('rel')||'';
        if(!rel.includes('noopener')) a.setAttribute('rel',(rel+' noopener noreferrer').trim());
        const lbl=a.getAttribute('aria-label')||a.textContent.trim();
        if(lbl&&!lbl.includes('new tab')&&!lbl.includes('new window')) a.setAttribute('aria-label',lbl+' (opens in new tab)');
        fixedExt++;
      });
      if(fixedExt) push('fixed','2.4.4','A','🔒','External Links Secured & Labelled',`Applied rel="noopener noreferrer" and "(opens in new tab)" to ${fixedExt} external link(s).`,fixedExt,true,false,'page');

      if(!document.querySelector('meta[name=viewport]')){
        const m=document.createElement('meta');m.name='viewport';m.content='width=device-width,initial-scale=1';
        document.head.appendChild(m);
        push('fixed','1.3.4','AA','📱','Viewport Meta Added','Injected <meta name="viewport"> for proper mobile scaling.',null,true,false,'page');
      }
    })();

    const nFixed       = issues.filter(i=>i.type==='fixed').length;
    const nAutoFixed   = issues.filter(i=>i.type==='fixed'&&i.fixApplied).length;
    const nRequiresDev = issues.filter(i=>i.requiresDev).length;
    const nErr         = issues.filter(i=>i.type==='error').length;
    const nWarn        = issues.filter(i=>i.type==='warning').length;

    const scoringIssues = REPORT_CFG.dev_issues_affect_score
      ? issues
      : issues.filter(i => !i.requiresDev);
    const errorsA  = scoringIssues.filter(i=>i.type==='error'&&i.level==='A').length;
    const errorsAA = scoringIssues.filter(i=>i.type==='error'&&i.level==='AA').length;
    const warnScore= scoringIssues.filter(i=>i.type==='warning').length;
    const score = Math.max(0, Math.min(100, Math.round(
      100 - errorsA*14 - errorsAA*7 - warnScore*3
    )));

    document.getElementById('acc-score').textContent=score;
    document.getElementById('acc-n-fixed').textContent=nFixed;
    document.getElementById('acc-n-warn').textContent=nWarn;
    document.getElementById('acc-n-err').textContent=nErr;

    const scanBtn=document.getElementById('acc-scan');
    scanBtn.innerHTML='✓ Scan Complete — Scan Again';
    scanBtn.disabled=false;
    document.getElementById('acc-dl-now').disabled=false;

    const list=document.getElementById('acc-issues');
    if(!issues.length){
      list.innerHTML='<div style="text-align:center;color:#38d9a9;font-size:.88rem;padding:24px 0;line-height:1.6;">🎉 Excellent! No accessibility issues found.</div>';
    } else {
      const visibleIssues = REPORT_CFG.show_dev_issues
        ? issues
        : issues.filter(i => !i.requiresDev || i.type === 'fixed');
      const order={fixed:0,warning:1,error:2};
      visibleIssues.sort((a,b)=>order[b.type]-order[a.type]);
      list.innerHTML=visibleIssues.map(i=>`
        <div class="acc-issue ${i.type}">
          <div class="acc-issue-head">
            <div class="acc-issue-title">${i.icon} ${i.title}</div>
            <div style="display:flex;gap:5px;align-items:center;flex-shrink:0;">
              <span style="font-size:.58rem;font-weight:700;padding:2px 5px;border-radius:4px;background:rgba(79,142,247,.15);color:#8a9bbf;">${i.level||'AA'}</span>
              ${i.section&&i.section!=='page'?`<span style="font-size:.58rem;font-weight:600;padding:2px 5px;border-radius:4px;background:rgba(56,217,169,.1);color:#38d9a9;text-transform:uppercase;">${i.section}</span>`:''}
              <span class="acc-badge ${i.type}">${
                i.type==='fixed'   ? 'Auto-Fixed' :
                i.requiresDev      ? 'Needs Dev'  :
                i.type==='warning' ? 'Warn'        : 'Fail'
              }</span>
            </div>
          </div>
          <div class="acc-issue-desc">${i.desc}</div>
          ${i.requiresDev?`<div style="font-size:.68rem;color:var(--acc-warn);margin-top:5px;font-family:var(--acc-mono);">⚠ Requires custom code — widget cannot auto-fix</div>`:''}
          ${i.criterion?`<div class="acc-issue-cnt">WCAG ${i.criterion} — Level ${i.level||'AA'}${i.count&&i.count>1?` — ${i.count} element(s)`:''}</div>`:''} 
        </div>`).join('');
    }

    const record={
      date:          new Date().toLocaleString(),
      score,
      nFixed,
      nAutoFixed,
      nRequiresDev,
      nWarn,
      nErr,
      perceivable:   null,
      operable:      null,
      understandable:null,
      robust:        null,
      issues:        JSON.parse(JSON.stringify(issues)),
    };
    lastAudit=record;
    auditHistory.unshift(record);
    if(auditHistory.length>20) auditHistory.length=20;
    renderHistory();
    announce(`Scan complete. Score: ${score}/100. ${nFixed} fixes applied, ${nErr} failures, ${nWarn} warnings.`);

    if (ACC_CLIENT) {
      const wcagBreakdown = {
        perceivable:    Math.max(0, Math.min(100, Math.round(100 - issues.filter(i=>i.type==='error'&&['1.1.1','1.3.1','1.3.4','1.3.5','1.4.1','1.4.3','1.4.4','1.4.10','1.4.11'].includes(i.criterion)).length*14 - issues.filter(i=>i.type==='warning'&&i.criterion&&i.criterion.startsWith('1.')).length*3))),
        operable:       Math.max(0, Math.min(100, Math.round(100 - issues.filter(i=>i.type==='error'&&['2.1.1','2.1.2','2.4.1','2.4.2','2.4.3','2.4.4','2.4.7','2.5.5'].includes(i.criterion)).length*14 - issues.filter(i=>i.type==='warning'&&i.criterion&&i.criterion.startsWith('2.')).length*3))),
        understandable: Math.max(0, Math.min(100, Math.round(100 - issues.filter(i=>i.type==='error'&&['3.1.1','3.2.1','3.3.1','3.3.2'].includes(i.criterion)).length*14 - issues.filter(i=>i.type==='warning'&&i.criterion&&i.criterion.startsWith('3.')).length*3))),
        robust:         Math.max(0, Math.min(100, Math.round(100 - issues.filter(i=>i.type==='error'&&['4.1.1','4.1.2'].includes(i.criterion)).length*14 - issues.filter(i=>i.type==='warning'&&i.criterion&&i.criterion.startsWith('4.')).length*3))),
      };
      record.perceivable    = wcagBreakdown.perceivable;
      record.operable       = wcagBreakdown.operable;
      record.understandable = wcagBreakdown.understandable;
      record.robust         = wcagBreakdown.robust;

      const topFailures = issues
        .filter(i=>i.type==='error')
        .map(i=>i.criterion)
        .filter((v,idx,arr)=>arr.indexOf(v)===idx)
        .slice(0,5);

      const sectionBreakdown = ['header','navigation','main','form','aside','footer','page'].reduce((acc,s)=>{
        acc[s] = issues.filter(i=>i.section===s&&i.type==='error').length;
        return acc;
      },{});

      fetch(ACC_API_URL + '/rest/v1/scans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey':        ACC_ANON,
          'Authorization': 'Bearer ' + ACC_ANON,
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify({
          client_code:    ACC_CLIENT,
          domain:         ACC_DOMAIN,
          page_url:       window.location.href,
          page_title:     document.title || window.location.pathname,
          score,
          critical:       nErr,
          warnings:       nWarn,
          fixes_applied:  nFixed,
          auto_fixed:     nAutoFixed,
          requires_dev:   nRequiresDev,
          aria:           issues.filter(i=>i.criterion&&i.criterion.startsWith('4.')).length,
          perceivable:    wcagBreakdown.perceivable,
          operable:       wcagBreakdown.operable,
          understandable: wcagBreakdown.understandable,
          robust:         wcagBreakdown.robust,
          top_failures:   JSON.stringify(topFailures),
          section_errors: JSON.stringify(sectionBreakdown),
          issue_count:    issues.length,
          scanned_at:     new Date().toISOString(),
        }),
      }).catch(()=>{});

      const now = new Date().toISOString();
      const pageUrl = window.location.href;
      const elementRows = [];

      issues
        .filter(i => i.criterion)
        .forEach(i => {
          if (i.elements && i.elements.length > 0) {
            i.elements.forEach(el => {
              elementRows.push({
                client_code:    ACC_CLIENT,
                page_url:       pageUrl,
                criterion:      i.criterion,
                level:          i.level || 'AA',
                type:           i.type,
                title:          i.title,
                description:    (i.desc || '').substring(0, 300),
                element_selector: (el.selector || '').substring(0, 200),
                element_snippet:  (el.snippet  || '').substring(0, 300),
                section:        i.section || 'page',
                requires_dev:   i.requiresDev,
                fix_applied:    i.fixApplied,
                element_count:  1,
                scanned_at:     now,
              });
            });
          } else {
            elementRows.push({
              client_code:    ACC_CLIENT,
              page_url:       pageUrl,
              criterion:      i.criterion,
              level:          i.level || 'AA',
              type:           i.type,
              title:          i.title,
              description:    (i.desc || '').substring(0, 300),
              element_selector: '',
              element_snippet:  '',
              section:        i.section || 'page',
              requires_dev:   i.requiresDev,
              fix_applied:    i.fixApplied,
              element_count:  i.count || 1,
              scanned_at:     now,
            });
          }
        });

      if (elementRows.length) {
        fetch(ACC_API_URL + '/rest/v1/scan_issues', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey':        ACC_ANON,
            'Authorization': 'Bearer ' + ACC_ANON,
            'Prefer':        'return=minimal',
          },
          body: JSON.stringify(elementRows),
        }).catch(()=>{});
      }
    }

    return record;
  }
  function renderHistory() {
    const empty=document.getElementById('acc-hist-empty');
    const list=document.getElementById('acc-hist-list');
    if (!auditHistory.length){empty.style.display='';list.innerHTML='';return;}
    empty.style.display='none';
    list.innerHTML=auditHistory.map((r,idx)=>`
      <div class="acc-hist-card">
        <div class="acc-hist-top"><div class="acc-hist-date">${r.date}</div><div class="acc-hist-score">${r.score}/100</div></div>
        <div class="acc-hist-pills">
          <span class="acc-hist-pill g">${r.nFixed} Fixed</span>
          <span class="acc-hist-pill y">${r.nWarn} Warnings</span>
          <span class="acc-hist-pill r">${r.nErr} Critical</span>
        </div>
        <button class="acc-hist-dl" data-idx="${idx}" aria-label="Download report from ${r.date}">↓ Download this report</button>
      </div>`).join('');
    list.querySelectorAll('.acc-hist-dl').forEach(btn=>{btn.addEventListener('click',()=>downloadReport(auditHistory[+btn.dataset.idx]));});
  }

  function downloadReport(record) {
    let reportIssues = record.issues.slice();
    if (!REPORT_CFG.show_dev_issues)
      reportIssues = reportIssues.filter(i => !i.requiresDev || i.type === 'fixed');
    if (!REPORT_CFG.show_critical_in_report)
      reportIssues = reportIssues.filter(i => i.type !== 'error');

    const devIssues  = reportIssues.filter(i=>i.requiresDev);
    const autoIssues = reportIssues.filter(i=>i.type==='fixed');
    const warnIssues = reportIssues.filter(i=>i.type==='warning'&&!i.requiresDev);

    const badgeHtml = i => {
      if(i.type==='fixed')   return `<span class="badge fixed">Auto-Fixed</span>`;
      if(i.requiresDev)      return `<span class="badge needs-dev">Needs Dev</span>`;
      if(i.type==='warning') return `<span class="badge warning">Warning</span>`;
      return `<span class="badge error">Critical</span>`;
    };

    const rows = reportIssues.map(i=>{
      const elDetails = (i.elements&&i.elements.length)
        ? `<div style="margin-top:7px;background:#f8f9fc;border-radius:5px;padding:7px 10px;font-size:.75em">
            <div style="font-weight:600;color:#64748b;margin-bottom:4px;text-transform:uppercase;letter-spacing:.05em;font-size:.9em">Affected Elements</div>`
          + i.elements.slice(0,5).map(el=>
              `<div style="font-family:monospace;color:#1e40af;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin:2px 0">
                ${el.selector}<span style="color:#64748b;font-weight:400"> — ${el.snippet}</span>
               </div>`).join('')
          + (i.elements.length>5?`<div style="color:#94a3b8;font-size:.9em">…and ${i.elements.length-5} more element${i.elements.length-5!==1?'s':''}</div>`:'')
          + '</div>'
        : '';
      return `<tr class="${i.type}">
        <td>
          <div style="font-weight:600;margin-bottom:2px">${i.icon} ${i.title}</div>
          <div style="font-size:.85em;color:#475569;line-height:1.5">${i.desc}</div>
          ${i.requiresDev?'<div style="font-size:.78em;color:#d97706;margin-top:3px;font-style:italic">⚠ Requires custom developer code — widget cannot auto-fix this</div>':''}
          ${elDetails}
        </td>
        <td>${badgeHtml(i)}</td>
        <td style="text-align:center">${i.section||'page'}</td>
        <td style="text-align:center;font-weight:600">${i.elements?i.elements.length:(i.count||1)}</td>
      </tr>`;
    }).join('');

    const html=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>ACC Audit — ${record.date}</title>
<style>
body{font-family:'Segoe UI',sans-serif;background:#f4f5f7;padding:40px;margin:0}
.report{max-width:960px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)}
.rhead{background:linear-gradient(135deg,#0a1628,#0d1f3c);color:#fff;padding:28px 32px}
.rhead h1{font-size:1.3rem;font-weight:700;margin:0 0 4px}
.rhead p{font-size:.78rem;color:#a0aec0;margin:0}
.rscore{display:flex;align-items:center;gap:24px;padding:20px 32px;background:#f8f9fc;border-bottom:1px solid #e5e7eb;flex-wrap:wrap}
.score-big{font-size:3rem;font-weight:800;color:#0a1628;line-height:1}
.score-label{font-size:.72rem;color:#8a9bbf;text-transform:uppercase;letter-spacing:.08em}
.pills{display:flex;gap:8px;flex-wrap:wrap;margin-left:auto}
.pill{padding:6px 14px;border-radius:8px;font-size:.78rem;font-weight:600}
.pill.g{background:#d1fae5;color:#065f46}
.pill.y{background:#fef3c7;color:#92400e}
.pill.r{background:#fee2e2;color:#991b1b}
.pill.b{background:#dbeafe;color:#1e40af}
.pour{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:16px 32px;background:#fafafa;border-bottom:1px solid #e5e7eb}
.pour-item{text-align:center;padding:10px;border-radius:8px;background:#fff;border:1px solid #e5e7eb}
.pour-score{font-size:1.4rem;font-weight:700;color:#0a1628}
.pour-label{font-size:.65rem;text-transform:uppercase;color:#8a9bbf;letter-spacing:.06em;margin-top:2px}
.section-title{padding:14px 32px 8px;font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#8a9bbf;background:#fff;border-bottom:1px solid #f0f0f0}
table{width:100%;border-collapse:collapse}
th{background:#f1f3f9;padding:11px 16px;font-size:.72rem;text-transform:uppercase;color:#8a9bbf;text-align:left;border-bottom:1px solid #e5e7eb;white-space:nowrap}
td{padding:11px 16px;font-size:.83rem;border-bottom:1px solid #f0f0f0;vertical-align:top}
tr.fixed   td:first-child{border-left:3px solid #10b981}
tr.warning td:first-child{border-left:3px solid #f59e0b}
tr.error   td:first-child{border-left:3px solid #ef4444}
.badge{display:inline-block;padding:2px 8px;border-radius:6px;font-size:.68rem;font-weight:700;text-transform:uppercase;white-space:nowrap}
.badge.fixed    {background:#d1fae5;color:#065f46}
.badge.needs-dev{background:#fef3c7;color:#92400e}
.badge.warning  {background:#e0f2fe;color:#0369a1}
.badge.error    {background:#fee2e2;color:#991b1b}
.rfooter{padding:14px 32px;font-size:.7rem;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb}
@media(max-width:600px){.pour{grid-template-columns:repeat(2,1fr)}.rscore{flex-direction:column;align-items:flex-start}.pills{margin-left:0}}
</style>
</head><body>
<div class="report">
  <div class="rhead">
    <h1>ACC Accessibility Audit Report</h1>
    <p>Auto AI Engine &mdash; Generated ${record.date} &mdash; ${window?window.location.hostname:''}</p>
  </div>

  <div class="rscore">
    <div>
      <div class="score-big">${record.score}</div>
      <div class="score-label">Compliance score / 100</div>
    </div>
    <div class="pills">
      <span class="pill g">&#10003; ${record.nFixed} Auto-Fixed</span>
      <span class="pill b">&#9888; ${devIssues.length} Needs Dev</span>
      <span class="pill y">&#9888; ${record.nWarn} Warnings</span>
      <span class="pill r">&#10005; ${record.nErr} Critical</span>
    </div>
  </div>

  <div class="pour">
    <div class="pour-item"><div class="pour-score">${record.perceivable||'—'}</div><div class="pour-label">Perceivable</div></div>
    <div class="pour-item"><div class="pour-score">${record.operable||'—'}</div><div class="pour-label">Operable</div></div>
    <div class="pour-item"><div class="pour-score">${record.understandable||'—'}</div><div class="pour-label">Understandable</div></div>
    <div class="pour-item"><div class="pour-score">${record.robust||'—'}</div><div class="pour-label">Robust</div></div>
  </div>

  <div class="section-title">All Issues &mdash; ${record.issues.length} total</div>
  <table>
    <thead>
      <tr>
        <th>Issue</th>
        <th>Status</th>
        <th>Description</th>
        <th>Section</th>
        <th>#</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="rfooter">
    ACC Accessibility Compliance Canada Inc. &mdash; Auto AI Engine &mdash; ${record.date}<br>
    <span style="color:#cbd5e1">Auto-Fixed items were remediated at runtime by the widget. "Needs Dev" items require custom code changes.</span>
  </div>
</div>
</body></html>`;

    const blob=new Blob([html],{type:'text/html'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=url; a.download=`ACC-Audit-${new Date().toISOString().slice(0,10)}.html`; a.click();
    URL.revokeObjectURL(url);
  }

  document.getElementById('acc-scan').addEventListener('click', () => {
    const btn=document.getElementById('acc-scan');
    btn.innerHTML='⏳ Scanning…'; btn.disabled=true;
    announce('Scanning page for accessibility issues…');
    setTimeout(runScan, 150);
  });
  document.getElementById('acc-dl-now').addEventListener('click', () => { if (lastAudit) downloadReport(lastAudit); });

  setTimeout(() => {
    try {
      const record = runScan();
      const scanTab = document.getElementById('tab-autofix');
      if (scanTab && record) {
        const score = record.score;
        const color = score >= 90 ? 'var(--acc-accent2)' : score >= 70 ? 'var(--acc-warn)' : 'var(--acc-error)';
        const badge = document.createElement('span');
        badge.textContent = score;
        badge.style.cssText = `margin-left:4px;font-size:.6rem;font-weight:700;padding:1px 5px;border-radius:6px;background:${color};color:#fff;`;
        scanTab.appendChild(badge);
      }
    } catch(e) {}
  }, 2000);

  ;(function initMutationWatcher() {
    const targetNode = document.body;
    if (!targetNode || !window.MutationObserver) return;

    let debounceTimer  = null;
    let lastScanURL    = window.location.href;
    let mutationCount  = 0;
    const DEBOUNCE_MS  = 300;
    const MIN_MUTATIONS = 5;
    const RESCAN_COOLDOWN_MS = 8000;
    let lastRescanAt   = 0;

    const IGNORE_ATTRS = new Set(['style','class','aria-expanded','aria-selected',
      'aria-checked','aria-current','data-active','tabindex','aria-hidden']);

    const observer = new MutationObserver(mutations => {
      const meaningful = mutations.filter(m => {
        if (widgetEl && widgetEl.contains(m.target)) return false;
        if (m.type === 'attributes' && IGNORE_ATTRS.has(m.attributeName)) return false;
        if (m.type === 'childList' && (m.addedNodes.length || m.removedNodes.length)) return true;
        if (m.type === 'attributes') return true;
        return false;
      });
      if (!meaningful.length) return;

      mutationCount += meaningful.length;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const now = Date.now();
        if (now - lastRescanAt < RESCAN_COOLDOWN_MS) return;
        if (mutationCount < MIN_MUTATIONS) { mutationCount = 0; return; }
        mutationCount = 0;
        lastRescanAt  = now;
        try { runScan(); } catch(e) {}
      }, DEBOUNCE_MS);
    });

    observer.observe(targetNode, {
      childList:  true,
      subtree:    true,
      attributes: true,
      attributeFilter: [
        'alt','aria-label','aria-labelledby','aria-describedby',
        'aria-required','aria-invalid','aria-modal','aria-live',
        'role','lang','href','src','tabindex','title',
      ],
    });

    const _push    = history.pushState.bind(history);
    const _replace = history.replaceState.bind(history);

    function onRouteChange() {
      const newURL = window.location.href;
      if (newURL === lastScanURL) return;
      lastScanURL = newURL;
      const fbEl = document.getElementById('acc-fb-url');
      if (fbEl) fbEl.textContent = newURL;
      setTimeout(() => { try { runScan(); } catch(e) {} }, 800);
    }

    history.pushState    = function(...args) { _push(...args);    onRouteChange(); };
    history.replaceState = function(...args) { _replace(...args); onRouteChange(); };
    window.addEventListener('popstate', onRouteChange);
  })();

  ;(function applyDevMode() {
    const devMode = _script && (_script.getAttribute('data-dev-mode') === 'true');
    if (!devMode) return;
    const scanTab    = document.getElementById('tab-autofix');
    const historyTab = document.getElementById('tab-history');
    if (scanTab)    scanTab.removeAttribute('style');
    if (historyTab) historyTab.removeAttribute('style');
    const hdr = document.querySelector('.acc-header-title p');
    if (hdr) hdr.textContent = 'Auto AI Engine · DEV MODE';
  })();

  const fbUrlEl = document.getElementById('acc-fb-url');
  if (fbUrlEl) fbUrlEl.textContent = window.location.href;

  document.getElementById('acc-fb-submit').addEventListener('click', async function() {
    const btn      = this;
    const msgEl    = document.getElementById('acc-fb-msg');
    const typeEl   = document.getElementById('acc-fb-type');
    const emailEl  = document.getElementById('acc-fb-email');
    const errEl    = document.getElementById('acc-fb-error');
    const successEl= document.getElementById('acc-fb-success');

    const message = (msgEl.value || '').trim();
    if (!message) {
      errEl.textContent = 'Please describe the issue before submitting.';
      errEl.style.display = 'block';
      msgEl.focus();
      return;
    }

    errEl.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Submitting…';

    const payload = {
      client_code:  ACC_CLIENT || null,
      domain:       ACC_DOMAIN,
      type:         typeEl.value || 'other',
      message:      message,
      email:        (emailEl.value || '').trim() || null,
      page_url:     window.location.href,
      status:       'open',
      source:       'widget',
    };

    try {
      const res = await fetch(ACC_API_URL + '/rest/v1/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey':        ACC_ANON,
          'Authorization': 'Bearer ' + ACC_ANON,
          'Prefer':        'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errText = 'Submission failed';
        try { const errJson = await res.json(); errText = errJson.message || errJson.hint || errText; } catch(_) { errText = await res.text() || errText; }
        throw new Error(errText);
      }

      document.getElementById('acc-fb-form').style.display = 'none';
      successEl.style.display = 'block';
      announce('Feedback submitted successfully.');

      setTimeout(function() {
        msgEl.value = '';
        emailEl.value = '';
        document.getElementById('acc-fb-form').style.display = 'block';
        successEl.style.display = 'none';
      }, 4000);

    } catch(e) {
      errEl.textContent = 'Could not submit (' + (e.message||'').substring(0,120) + ') — please try again.';
      errEl.style.display = 'block';
    } finally {
      btn.disabled = false;
      btn.textContent = '💬 Submit Feedback';
    }
  });

  (async function loadWidgetSettings() {
    if (!ACC_CLIENT) return;
    try {
      const res = await fetch(
        ACC_API_URL + '/rest/v1/widget_settings?client_code=eq.' + encodeURIComponent(ACC_CLIENT) + '&limit=1',
        { headers: { 'apikey': ACC_ANON, 'Authorization': 'Bearer ' + ACC_ANON } }
      );
      if (!res.ok) return;
      const rows = await res.json();
      if (!rows || !rows.length) return;
      const cfg = rows[0];

      if (cfg.position) {
        const pos = cfg.position.toLowerCase();
        const toggle  = document.getElementById('acc-toggle');
        const panelEl = document.getElementById('acc-panel');
        const bottom = pos.includes('top') ? 'auto' : '24px';
        const top    = pos.includes('top') ? '24px' : 'auto';
        const right  = pos.includes('left') ? 'auto' : '24px';
        const left   = pos.includes('left') ? '24px' : 'auto';
        if (toggle)  { toggle.style.bottom=bottom; toggle.style.top=top; toggle.style.right=right; toggle.style.left=left; }
        if (panelEl) { panelEl.style.bottom=pos.includes('top')?'auto':'100px'; panelEl.style.top=pos.includes('top')?'100px':'auto'; panelEl.style.right=right; panelEl.style.left=left; }
      }

      if (cfg.accent_color) {
        document.documentElement.style.setProperty('--acc-accent', cfg.accent_color);
      }

      const profilesTab  = document.getElementById('tab-profiles');
      const feedbackTab  = document.getElementById('tab-feedback');

      if (cfg.hide_profiles && profilesTab) {
        // Hide the tab button
        profilesTab.style.display = 'none';
        profilesTab.classList.remove('acc-active');
        profilesTab.setAttribute('aria-selected', 'false');
        // If profiles panel is currently the active panel (default on first open),
        // deactivate it immediately and activate Settings instead — before any paint
        const profilesPanel = document.getElementById('panel-profiles');
        const settingsTab   = document.getElementById('tab-settings');
        const settingsPanel = document.querySelector('.acc-panel-content[data-panel="settings"]');
        if (profilesPanel) {
          profilesPanel.classList.remove('acc-active');
        }
        if (settingsPanel) {
          settingsPanel.classList.add('acc-active');
        }
        if (settingsTab) {
          settingsTab.classList.add('acc-active');
          settingsTab.setAttribute('aria-selected', 'true');
        }
      }

      if (cfg.hide_feedback && feedbackTab) {
        feedbackTab.style.display = 'none';
        feedbackTab.classList.remove('acc-active');
        feedbackTab.setAttribute('aria-selected', 'false');
      }

      if (cfg.show_dev_issues         !== null && cfg.show_dev_issues         !== undefined)
        REPORT_CFG.show_dev_issues         = !!cfg.show_dev_issues;
      if (cfg.show_critical_in_report !== null && cfg.show_critical_in_report !== undefined)
        REPORT_CFG.show_critical_in_report = !!cfg.show_critical_in_report;
      if (cfg.dev_issues_affect_score !== null && cfg.dev_issues_affect_score !== undefined)
        REPORT_CFG.dev_issues_affect_score = !!cfg.dev_issues_affect_score;
      if (cfg.escalate_chronics       !== null && cfg.escalate_chronics       !== undefined)
        REPORT_CFG.escalate_chronics       = !!cfg.escalate_chronics;

      if (ACC_TIER === '1' && cfg.show_dev_issues === null) {
        REPORT_CFG.show_dev_issues         = false;
        REPORT_CFG.dev_issues_affect_score = false;
      }

    } catch(e) {
    }
  })();

})();