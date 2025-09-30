<script>
(function () {
	
  const ALLOWED = [
    { type: 'host', value: 'rtlr.ir' },      

    { type: 'url',  value: 'https://rtlr.ir/' }    
  ];
  
  const REDIRECT_URL = 'https://www.rtl-theme.com/category/template-html/';
  
  const COUNTDOWN_SECONDS = 10;
  const OVERLAY_ID = '__embed_block_overlay_v1';
  const DEBUG = false;

  function log(...args){ if (DEBUG) console.log(...args); }

 
  if (window.top === window.self) {
    log('not in iframe → exit');
    return;
  }

  
  let parentHost = null;
  let parentHref = null;
  try {
    parentHost = window.top.location.hostname;
    parentHref = window.top.location.href;
    log('top:', parentHost, parentHref);
  } catch (e) {
    log('no access to window.top, fallback to referrer', e);
    if (document.referrer) {
      try {
        const u = new URL(document.referrer);
        parentHost = u.hostname;
        parentHref = u.href;
        log('referrer:', parentHost, parentHref);
      } catch (err) {
        log('referrer parse failed', err);
      }
    }
  }

  function isAllowedHost(host, allowedHost) {
    if (!host) return false;
    host = host.replace(/^www\./i, '');
    allowedHost = allowedHost.replace(/^www\./i, '');
    return host === allowedHost || host.endsWith('.' + allowedHost);
  }


  let allowed = false;
  for (const a of ALLOWED) {
    if (a.type === 'host') {
      if (isAllowedHost(parentHost, a.value)) { allowed = true; break; }
    } else if (a.type === 'url') {
      try {
        const parsed = new URL(a.value);
        if (parentHref) {
         
          if (parentHref === a.value || parentHref.startsWith(a.value + '/') || parentHref.startsWith(a.value + '?') || parentHref.startsWith(a.value + '#')) {
            allowed = true; break;
          }
        }
       
        if (parentHost && isAllowedHost(parentHost, parsed.hostname)) {
          if (!parsed.pathname || parsed.pathname === '/') { allowed = true; break; }
          if (parentHref) {
            try {
              const p = new URL(parentHref);
              if (p.pathname.startsWith(parsed.pathname)) { allowed = true; break; }
            } catch (err) {}
          }
        }
      } catch (e) {}
    }
  }

  if (allowed) {
    log('parent is allowed → exit');
    return;
  }

 
  function showOverlay() {
    if (document.getElementById(OVERLAY_ID)) return; 
    const overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    Object.assign(overlay.style, {
        position: "fixed",
		inset: "0",
		background: "rgba(0,0,0,1)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 2147483647,
		fontFamily: "sans-serif"
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
		maxWidth: "520px",
		width: "90%",
		background: "#fff",
		fontFamily: "Vazirmatn",
		padding: "22px",
		borderRadius: "12px",
		boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
		textAlign: "center"
    });


	modal.innerHTML = `
	<div style="
		width: 100%;
		display: flex;
		justify-content: center;
		">
		<img src="https://media.rtlcdn.com/2025/03/8d372fd1078b1d1a732d3f24fe76e33e4374d83190863.png">
	</div>
		<h2 style="margin:0 0 8px;font-size:20px;padding-top:20px;color:red;">هشدار امنیتی — پیش‌نمایش غیرمعتبر</h2>
		<p style="margin:0 0 12px;line-height:1.4;padding-top:20px;">
		این پیش‌نمایش از یک وب‌سایت <strong style="color:red;">غیر معتبر</strong> بارگذاری شده است
		</p>
		<p>  تنها دامنهٔ معتبر: <strong>rtl-theme.com</strong></p>
		<p id="countdownText" style="margin:0 0 16px;font-weight:600;padding-top:20px;">
		شما در ${COUNTDOWN_SECONDS} ثانیه به rtl-theme.com منتقل خواهید شد.
		</p>
	<div style="display:flex;gap:8px;justify-content:center;padding-top:20px;">
		<button id="goNowBtn" style="padding:15px 14px;border-radius:8px;border:0;cursor:pointer;font-weight:800;font-family:vazirmatn;background-color:#9cda6c;font-size:20px;color:#484848;">
		همین حالا کلیک کنید !
		</button>
	</div>
	`;

    overlay.appendChild(modal);
    const parentEl = document.body || document.documentElement;
    parentEl.appendChild(overlay);

    document.documentElement.style.pointerEvents = 'none';
    modal.style.pointerEvents = 'auto';

    const countdownText = modal.querySelector('#countdownText');
    const goNowBtn = modal.querySelector('#goNowBtn');
    let remaining = COUNTDOWN_SECONDS;
    const updateText = () => countdownText.textContent = `شما در ${remaining} ثانیه به  rtl-theme.com منتقل خواهید شد.`;
    updateText();

    goNowBtn.addEventListener('click', redirectToAllowed);

    const timer = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(timer);
        redirectToAllowed();
      } else updateText();
    }, 1000);

    function redirectToAllowed() {
      clearInterval(timer);
      try { window.top.location.href = REDIRECT_URL; return; } catch (e) {}
      try { window.location.href = REDIRECT_URL; return; } catch (e) { cleanup(); console.error('redirect failed', e); }
    }

    function cleanup() {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.documentElement.style.pointerEvents = '';
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', showOverlay);
  else showOverlay();

})();
</script>
