
(function () {
	//به این لینک دست نزنید
	const ALLOWED_DOMAIN = "https://rtlr.ir/";
	//به این لینک دست نزنید
	const REDIRECT_URL = "https://www.rtl-theme.com/category/template-html/";
	
	const COUNTDOWN_SECONDS = 10;

	if (window.top === window.self) return;

	let topHostname = null;
	try {
		topHostname = window.location.ancestorOrigins[0];
	} catch (e) {
		topHostname = null;
	}
	const allowed = (function () {
		if (!topHostname) return false;
		if (topHostname == 'https://rtlr.ir') return true;
		return false;
	})();

	if (allowed) return;

	const overlay = document.createElement("div");
	overlay.setAttribute("aria-hidden", "false");
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

	const modal = document.createElement("div");
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
	document.documentElement.appendChild(overlay);

	document.body.style.pointerEvents = "none";
	modal.style.pointerEvents = "auto";

	const countdownText = modal.querySelector("#countdownText");
	const goNowBtn = modal.querySelector("#goNowBtn");

	let remaining = COUNTDOWN_SECONDS;
	const updateText = () => {
		countdownText.textContent = `شما در ${remaining} ثانیه به  rtl-theme.com منتقل خواهید شد.`;
	};
	updateText();

	goNowBtn.addEventListener("click", () => {
		redirectToAllowed();
	});

	const timer = setInterval(() => {
		remaining -= 1;
		if (remaining <= 0) {
			clearInterval(timer);
			redirectToAllowed();
		} else {
			updateText();
		}
	}, 1000);

	function redirectToAllowed() {
		try {
			window.top.location.href = REDIRECT_URL;
		} catch (e) {
			try {
				window.location.href = REDIRECT_URL;
			} catch (err) {
				cleanup();
				console.error("Redirect failed:", err);
			}
		}
	}

	function cleanup() {
		clearInterval(timer);
		if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
		document.body.style.pointerEvents = "";
	}
})();
