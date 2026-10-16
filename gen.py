# Builds index.html for the public Let's Get FIRE'd page. No personal data, no password.
# LGF_CHAT_ENDPOINT overrides the chat URL for local test builds; LGF_OUT sets the output file.
import json,os
CHAT_ENDPOINT=os.environ.get("LGF_CHAT_ENDPOINT","https://lets-get-fired-chat.clintchegin.workers.dev/chat")
OUT=os.environ.get("LGF_OUT","index.html")
SITE="https://clintchegin.github.io/lets-get-fired/"
# Cloudflare Web Analytics token (public). Cookieless, no IP storage. Empty = no beacon.
CF_BEACON_TOKEN=os.environ.get("LGF_CF_BEACON_TOKEN","fd3fe8f6992c4b1fa35e1e5fa004c11a")
BEACON=f'<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon=\'{json.dumps({"token":CF_BEACON_TOKEN})}\'></script>' if CF_BEACON_TOKEN else ""
r=lambda f:open(f).read()
FLAME=r("favicon.svg").replace('<svg ','<svg aria-hidden="true" ',1)
TRUST_SHORT="Saved only in your browser. Your chat messages and numbers are sent to xAI; this site doesn't store them. Anonymous, cookie-free visit counts via Cloudflare Web Analytics."
TRUST_FULL="Your inputs are kept in this browser's local storage, never on our servers; use Clear my data to remove them. When you chat, your messages and current calculator numbers go to xAI to generate Ledger's reply. Don't share names, account numbers or addresses. Anonymous, cookie-free visit counts via Cloudflare Web Analytics."
html=f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><title>Let's Get FIRE'd: A FIRE retirement calculator</title>
<meta name="description" content="A free FIRE retirement calculator with a chat helper. See when you could reach Lean, Coast, Barista, Chubby or Fat FIRE. Your numbers stay in your browser.">
<link rel="icon" type="image/svg+xml" href="favicon.svg"><meta property="og:type" content="website"><meta property="og:title" content="Let's Get FIRE'd">
<meta property="og:description" content="A FIRE retirement calculator. Answer a few questions and see your plan."><meta property="og:url" content="{SITE}">
<meta property="og:image" content="{SITE}og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">
<script src="vendor/chart.umd.min.js" integrity="sha384-dug+JxfBvklEQdJ4AYuBBAIScUz0bVN73xpy273gcAwHjb3qI0fXmuYNaNfdyYJG"></script><style>{r("style.css")}</style></head><body class="welcome">
<header><div class="brand">{FLAME}<h1>Let's Get FIRE'd</h1></div><p class="tagline">A FIRE retirement calculator</p></header>
<div class="app">
<section class="card" id="chat" aria-label="Ledger chat"><p class="welcomeline">Find out when you could retire early.</p><p class="wsub">Ledger will ask a few quick questions and fill in the calculator for you.</p>
<div id="chatlog" aria-live="off"></div><div id="chatlive" class="sr-only" aria-live="polite"></div>
<form id="chatform"><label for="chatin" class="sr-only">Message Ledger</label><textarea id="chatin" rows="2" placeholder="e.g. I'm 34 and have about $60K invested"></textarea><button class="pri" id="chatsend" type="submit">Send</button></form>
<div class="starters"><button type="button" id="typical">Use typical numbers</button><a href="#inputs" id="skip">Skip, I'll enter numbers myself</a></div>
<div class="privnote">Ledger never needs your name, accounts or address.</div></section>
<section class="card" id="inputs" aria-labelledby="inh"><h2 id="inh">Your numbers</h2>
<div class="trust">{TRUST_SHORT} <button type="button" class="ibtn" id="trustbtn" aria-expanded="false" aria-controls="trustfull" aria-label="More about privacy">ⓘ</button><div id="trustfull" hidden>{TRUST_FULL}</div></div>
<div class="progress" id="progress"></div><div id="fields"></div><button type="button" id="clear" style="margin-top:14px">Clear my data</button></section>
<div id="results"><div class="banner" id="exbanner" hidden>Example numbers — replace with yours</div>
<section class="card band" id="herocard" aria-labelledby="answer"><div id="bandprev"></div><div id="bandwrap" hidden><h2 class="answer" id="answer"></h2><div class="bandg"><div class="bandl"><div class="tiles" id="tiles"></div><div id="dial"></div></div><div class="bandr"><div class="ch"><canvas id="c1" role="img" aria-label="Portfolio growth until retirement: starting balance, contributions and growth, with your FIRE number"></canvas></div></div></div><div id="ladderwrap"></div></div></section>
<section class="card"><h2>Retirement drawdown</h2><div id="ddprev"></div><div id="ddwrap" hidden><div class="ch" style="height:240px"><canvas id="c2" role="img" aria-label="Portfolio balance during retirement"></canvas></div><p class="note" id="ddnote"></p></div></section>
<section class="card" id="sscard" hidden><h2>Social Security</h2><div id="ssbody"></div></section></div></div>
<footer>This is not financial advice. Check all calculations yourself.</footer>
<script>const CHAT_ENDPOINT={json.dumps(CHAT_ENDPOINT)};{r("fields.js")}{r("app.js")}init();{r("chat.js")}</script>{BEACON}</body></html>"""
open(OUT,"w").write(html);print("wrote",OUT)
