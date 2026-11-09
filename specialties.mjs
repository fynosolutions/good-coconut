// Specialties page body, ported from brand-visual-1108/round2/hero-0706 by round4/scripts/port_specialties.py. Edit there and re-run.
export const specialtiesBody=`<div class="sp">
<div class="container">
<section class="word-wrap" aria-label="COCONUT, with a real coconut and a video as the two O's">
    <div class="word" id="word">
      <svg class="l l-c1" viewBox="0 0 230 260" aria-hidden="true"><path d="M190 68 A88 88 0 1 0 190 192"/></svg>
      <div class="l l-o1"><img src="/assets/specialties/o1-coconut.jpg" alt="" width="480" height="480"></div>
      <svg class="l l-c2" viewBox="0 0 230 260" aria-hidden="true"><path d="M190 68 A88 88 0 1 0 190 192"/></svg>
      <button class="l l-o2" id="o2" type="button" aria-label="Play the fresh coconut video larger">
        <video src="/assets/r5/jars.mp4" poster="/assets/r5/jars-poster.jpg" muted loop playsinline preload="metadata"></video>
        <span class="play" aria-hidden="true"></span>
      </button>
      <svg class="l l-n" viewBox="0 0 250 240" aria-hidden="true"><path d="M0 240V0h70l110 150V0h70v240h-70L70 90v150z"/></svg>
      <svg class="l l-u" viewBox="0 0 240 240" aria-hidden="true"><path d="M0 0h74v128a46 46 0 0 0 92 0V0h74v128a120 120 0 0 1-240 0z"/></svg>
      <svg class="l l-t" viewBox="0 0 240 240" aria-hidden="true"><path d="M0 0h240v72h-83v168H83V72H0z"/></svg>

      <!-- Hand-drawn New York street that continues the word's baseline (stage y = 540). -->
      <svg class="lines" viewBox="0 0 1600 560" aria-hidden="true">
        <path class="ln" d="M770 540 H1600"/>
        <circle class="sun" cx="1470" cy="150" r="42"/>
        <path class="ln thin" d="M1300 170 q10 -26 36 -18 q12 -22 36 -6 q22 -4 24 18 q14 4 8 18 H1306 q-16 -4 -6 -12"/>
        <path class="ln" d="M808 440 h84 v-46 q-42 -36 -84 0 z M816 440 L804 540 M884 440 L896 540 M812 486 H888 M812 486 L884 534 M888 486 L816 534 M850 358 v-14"/>
        <path class="ln thin" d="M820 418 h60 M820 404 h60"/>
        <path class="ln" d="M1050 540 V372 H1096 V540 M1096 540 V170 L1124 136 L1152 170 V540 M1152 540 V330 H1206 V540"/>
        <path class="ln thin" d="M1062 400 h22 M1062 430 h22 M1062 460 h22 M1110 290 h28 M1110 320 h28 M1110 350 h28 M1110 380 h28 M1166 360 h26 M1166 392 h26 M1124 136 V100 M1110 200 h28 M1110 230 h28 M1110 260 h28"/>
        <circle class="ln" cx="1330" cy="384" r="16"/>
        <path class="ln" d="M1316 378 q14 -18 30 -2 M1330 400 C1327 436 1328 456 1330 474 M1330 474 L1316 540 M1330 474 L1346 538 M1310 540 h11 M1342 538 h11"/>
        <path class="ln" d="M1330 418 C1348 426 1356 414 1352 400 M1330 420 C1318 438 1316 452 1322 466"/>
        <path class="ln coco" d="M1346 412 L1368 412 L1371 394 C1371 386 1364 379 1360 376 L1354 376 C1350 379 1343 386 1343 394 Z"/>
        <path class="ln thin" d="M1358 378 L1340 392"/>
        <path class="ln" d="M1220 540 V360 H1268 V540 M1212 360 H1276 M1212 352 H1276 M1226 392 h12 M1250 392 h12 M1232 540 V506 H1256 V540 M1226 452 h12 M1250 452 h12"/>
        <path class="ln thin" d="M1240 540 l-20 0 l0 -10 l-8 0 l0 -10 M1222 474 h-12 v24 h12 M1210 486 h12"/>
        <path class="ln" d="M1392 540 C1390 506 1418 492 1446 496 L1452 480 L1460 496 C1466 497 1470 498 1472 500 L1478 486 L1482 504 C1488 514 1488 528 1484 540 M1392 540 C1366 540 1356 520 1366 506 C1372 498 1382 500 1384 508"/>
        <path class="ln thin" d="M1450 512 q4 3 8 0 M1464 512 q4 3 8 0"/>
        <path class="ln" d="M1548 540 C1538 470 1546 404 1566 344 M1566 344 Q1540 326 1512 334 M1566 344 Q1552 316 1530 304 M1566 344 Q1576 314 1598 308 M1566 344 Q1592 336 1612 348 M1566 344 Q1578 362 1592 378"/>
      </svg>
    </div>
  </section>
  <svg class="street" viewBox="770 90 840 460" aria-hidden="true">
        <path class="ln" d="M770 540 H1600"/>
        <circle class="sun" cx="1470" cy="150" r="42"/>
        <path class="ln thin" d="M1300 170 q10 -26 36 -18 q12 -22 36 -6 q22 -4 24 18 q14 4 8 18 H1306 q-16 -4 -6 -12"/>
        <path class="ln" d="M808 440 h84 v-46 q-42 -36 -84 0 z M816 440 L804 540 M884 440 L896 540 M812 486 H888 M812 486 L884 534 M888 486 L816 534 M850 358 v-14"/>
        <path class="ln thin" d="M820 418 h60 M820 404 h60"/>
        <path class="ln" d="M1050 540 V372 H1096 V540 M1096 540 V170 L1124 136 L1152 170 V540 M1152 540 V330 H1206 V540"/>
        <path class="ln thin" d="M1062 400 h22 M1062 430 h22 M1062 460 h22 M1110 290 h28 M1110 320 h28 M1110 350 h28 M1110 380 h28 M1166 360 h26 M1166 392 h26 M1124 136 V100 M1110 200 h28 M1110 230 h28 M1110 260 h28"/>
        <circle class="ln" cx="1330" cy="384" r="16"/>
        <path class="ln" d="M1316 378 q14 -18 30 -2 M1330 400 C1327 436 1328 456 1330 474 M1330 474 L1316 540 M1330 474 L1346 538 M1310 540 h11 M1342 538 h11"/>
        <path class="ln" d="M1330 418 C1348 426 1356 414 1352 400 M1330 420 C1318 438 1316 452 1322 466"/>
        <path class="ln coco" d="M1346 412 L1368 412 L1371 394 C1371 386 1364 379 1360 376 L1354 376 C1350 379 1343 386 1343 394 Z"/>
        <path class="ln thin" d="M1358 378 L1340 392"/>
        <path class="ln" d="M1220 540 V360 H1268 V540 M1212 360 H1276 M1212 352 H1276 M1226 392 h12 M1250 392 h12 M1232 540 V506 H1256 V540 M1226 452 h12 M1250 452 h12"/>
        <path class="ln thin" d="M1240 540 l-20 0 l0 -10 l-8 0 l0 -10 M1222 474 h-12 v24 h12 M1210 486 h12"/>
        <path class="ln" d="M1392 540 C1390 506 1418 492 1446 496 L1452 480 L1460 496 C1466 497 1470 498 1472 500 L1478 486 L1482 504 C1488 514 1488 528 1484 540 M1392 540 C1366 540 1356 520 1366 506 C1372 498 1382 500 1384 508"/>
        <path class="ln thin" d="M1450 512 q4 3 8 0 M1464 512 q4 3 8 0"/>
        <path class="ln" d="M1548 540 C1538 470 1546 404 1566 344 M1566 344 Q1540 326 1512 334 M1566 344 Q1552 316 1530 304 M1566 344 Q1576 314 1598 308 M1566 344 Q1592 336 1612 348 M1566 344 Q1578 362 1592 378"/>
      </svg>

  <section class="below">
    <h1><span>Our specialties.</span> <span>Made from fresh coconut.</span></h1>
    <div class="side">
      <p class="sub">The coconut drinks &amp; desserts<br class="m"> we’re known for.</p>
      <div class="ctas"><a class="btn order-toggle" href="/online/" aria-haspopup="true" aria-expanded="false" aria-controls="order-panel">Order online</a><a class="btn btn-ghost" href="/menu/">See the full menu</a></div>
    </div>
    <ul class="sp-shops"><li><a href="/online/#flushing">Flushing</a><small>Golden Shopping Mall</small></li><li><a href="/online/#manhattan">FiDi</a><small>Golden Mall FiDi</small></li></ul>
  </section>
<section class="tops" data-on-dark id="tops-section" aria-label="Our top three">
  
  <div class="tops-head"><h2 id="tops-title">Top three <span class="sr-only">· 王牌三款</span></h2><svg class="tops-mark" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="54" r="34"/><ellipse cx="50" cy="38" rx="20" ry="7"/><path d="M58 30l14-20"/></svg><p class="tops-zh" lang="zh-Hans" aria-hidden="true">王牌三款</p></div>
  <ul class="top-list" id="tops">
    <li class="top" role="group" data-kind="persimmon" tabindex="0">
      <div class="top-stage"><span class="disc" aria-hidden="true"></span><div class="icons" aria-hidden="true"><svg class="ic" viewBox="0 0 104 104"><path d="M30 52a22 20 0 1 0 44 0a22 20 0 1 0 -44 0z"/><path d="M42 34l10 6 10-6 M52 40v-10 M44 38l-8-2 M60 38l8-2"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M30 70q22-40 50-44q-6 34-50 44z"/><path d="M30 70q20-18 40-36"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M30 70q22-40 50-44q-6 34-50 44z"/><path d="M30 70q20-18 40-36"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M30 52a22 20 0 1 0 44 0a22 20 0 1 0 -44 0z"/><path d="M42 34l10 6 10-6 M52 40v-10 M44 38l-8-2 M60 38l8-2"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M30 52a22 20 0 1 0 44 0a22 20 0 1 0 -44 0z"/><path d="M42 34l10 6 10-6 M52 40v-10 M44 38l-8-2 M60 38l8-2"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M30 70q22-40 50-44q-6 34-50 44z"/><path d="M30 70q20-18 40-36"/></svg></div><img class="top-prod" loading="lazy" decoding="async" src="/assets/specialties/top-persimmon.webp" alt="Persimmon Puree Pudding" width="552" height="900"></div>
      <span class="top-tag">New</span>
      <p class="top-label"><span><b>Persimmon Puree Pudding</b><i lang="zh-Hans">喜柿玻玻 · 秋季新品</i><em class="top-desc">Seasonal persimmon puree over coconut pudding in a glass jar.</em></span></p>
    </li>
    <li class="top" role="group" data-kind="coconut" tabindex="0">
      <div class="top-stage"><span class="disc" aria-hidden="true"></span><div class="icons" aria-hidden="true"><svg class="ic" viewBox="0 0 104 104"><path d="M22 56a30 30 0 0 0 60 0z"/><path d="M30 56a22 14 0 0 0 44 0"/><path d="M52 20q8 12 0 18q-8-6 0-18z"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M52 24q16 22 16 34a16 16 0 0 1 -32 0q0-12 16-34z"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M52 24q16 22 16 34a16 16 0 0 1 -32 0q0-12 16-34z"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M22 56a30 30 0 0 0 60 0z"/><path d="M30 56a22 14 0 0 0 44 0"/><path d="M52 20q8 12 0 18q-8-6 0-18z"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M22 56a30 30 0 0 0 60 0z"/><path d="M30 56a22 14 0 0 0 44 0"/><path d="M52 20q8 12 0 18q-8-6 0-18z"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M52 24q16 22 16 34a16 16 0 0 1 -32 0q0-12 16-34z"/></svg></div><img class="top-prod" loading="lazy" decoding="async" src="/assets/specialties/top-fresh-coconut.webp" alt="Freshly Opened Coconut" width="1105" height="1400"></div>
      <span class="top-tag">Fresh</span>
      <p class="top-label"><span><b>Freshly Opened Coconut</b><i lang="zh-Hans">现开椰子</i><em class="top-desc">A freshly opened coconut in a Good Coconut bowl, with a straw.</em></span></p>
    </li>
    <li class="top" role="group" data-kind="latte" tabindex="0">
      <div class="top-stage"><span class="disc" aria-hidden="true"></span><div class="icons" aria-hidden="true"><svg class="ic" viewBox="0 0 104 104"><ellipse cx="52" cy="52" rx="18" ry="26" transform="rotate(25 52 52)"/><path d="M46 30q10 20 0 44" transform="rotate(25 52 52)"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M52 72s-24-14-24-30a12 12 0 0 1 24-4a12 12 0 0 1 24 4c0 16-24 30-24 30z"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M52 72s-24-14-24-30a12 12 0 0 1 24-4a12 12 0 0 1 24 4c0 16-24 30-24 30z"/></svg><svg class="ic" viewBox="0 0 104 104"><ellipse cx="52" cy="52" rx="18" ry="26" transform="rotate(25 52 52)"/><path d="M46 30q10 20 0 44" transform="rotate(25 52 52)"/></svg><svg class="ic" viewBox="0 0 104 104"><ellipse cx="52" cy="52" rx="18" ry="26" transform="rotate(25 52 52)"/><path d="M46 30q10 20 0 44" transform="rotate(25 52 52)"/></svg><svg class="ic" viewBox="0 0 104 104"><path d="M52 72s-24-14-24-30a12 12 0 0 1 24-4a12 12 0 0 1 24 4c0 16-24 30-24 30z"/></svg></div><img class="top-prod" loading="lazy" decoding="async" src="/assets/specialties/top-latte.webp" alt="Coconut Latte" width="418" height="900"></div>
      <span class="top-tag">Signature</span>
      <p class="top-label"><span><b>Coconut Latte</b><i lang="zh-Hans">生椰拿铁</i><em class="top-desc">Coconut milk with espresso.</em></span></p>
    </li>
  </ul>
</section>
<section class="signatures" id="signatures" aria-label="Our signatures">
  <p class="peek-title">Our signatures · 招牌</p>
  <h2>Eight ways to love&nbsp;coconut.</h2>
  <p class="about">Good Coconut 好好椰 makes fresh coconut drinks and coconut desserts at two New York shops, in Flushing and FiDi.</p>
  <ul class="cards" id="cards">
    <li class="card" role="button" data-fruit="coconut" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-whole-coconut.webp" alt="Whole Coconut Pudding with Mango &amp; Popping Boba 整颗多芒爆珠布丁" loading="lazy" width="603" height="720">
      <p class="name">Whole Coconut Pudding with Mango &amp; Popping Boba<span lang="zh-Hans">整颗多芒爆珠布丁</span></p>
    </li>
    <li class="card" role="button" data-fruit="mango" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-mango-pudding.webp" alt="Mango Pudding 芒果椰奶布丁" loading="lazy" width="510" height="720">
      <p class="name">Mango Pudding<span lang="zh-Hans">芒果椰奶布丁</span></p>
    </li>
    <li class="card" role="button" data-fruit="strawberry" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-strawberry-pudding.webp" alt="Strawberry Pudding 草莓椰奶布丁" loading="lazy" width="427" height="720">
      <p class="name">Strawberry Pudding<span lang="zh-Hans">草莓椰奶布丁</span></p>
    </li>
    <li class="card" role="button" data-fruit="dragonfruit" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-dragonfruit-pudding.webp" alt="Dragon Fruit Pudding 火龙果椰奶布丁" loading="lazy" width="496" height="720">
      <p class="name">Dragon Fruit Pudding<span lang="zh-Hans">火龙果椰奶布丁</span></p>
    </li>
    <li class="card" role="button" data-fruit="coffee" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-americano.webp" alt="Coconut Americano 椰青美式" loading="lazy" width="382" height="720">
      <p class="name">Coconut Americano<span lang="zh-Hans">椰青美式</span></p>
    </li>
    <li class="card" role="button" data-fruit="taro" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-taro-milk.webp" alt="Handmade Taro Coconut Milk 手打香芋椰椰" loading="lazy" width="323" height="720">
      <p class="name">Handmade Taro Coconut Milk<span lang="zh-Hans">手打香芋椰椰</span></p>
    </li>
    <li class="card" role="button" data-fruit="sesame" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-sesame-milk.webp" alt="Black Sesame Coconut Milk (Hot) 黑芝麻椰椰（热）" loading="lazy" width="477" height="720">
      <p class="name">Black Sesame Coconut Milk (Hot)<span lang="zh-Hans">黑芝麻椰椰（热）</span></p>
    </li>
    <li class="card" role="button" data-fruit="lime" tabindex="0">
      <div class="burst" aria-hidden="true"></div>
      <img class="prod" src="/assets/specialties/p-lime-boba.webp" alt="Lime Boba Coconut 青柠爆珠鲜椰水" loading="lazy" width="306" height="720">
      <p class="name">Lime Boba Coconut<span lang="zh-Hans">青柠爆珠鲜椰水</span></p>
    </li>
  </ul>
  <p class="menu-link"><a href="/menu/">See the full menu, 90+ items →</a></p>
</section>
</div>
<section class="shell" id="fresh" aria-label="Fresh from the shell">
  <div class="shell-copy">
    <p class="peek-title">Fresh from the shell</p>
    <h2>Every sip starts<br>inside a coconut.</h2>
    
    <p class="shell-more">Try a Freshly Opened Coconut at Flushing or FiDi. <a class="nowrap" href="/online/">Find a shop&nbsp;→</a></p>
  </div>
  <div class="shell-stage">
    <canvas id="water" width="480" height="480" aria-label="A freshly opened coconut full of coconut water. Touch or move over it to make ripples."></canvas>
  </div>
</section>
<section class="sp-outro" aria-label="Order">
  <h2>Found your favorite?</h2>
  <p>Order ahead for pickup on Chowbus, or get it delivered.</p>
  <div class="ctas"><a class="btn order-toggle" href="/online/" aria-haspopup="true" aria-expanded="false" aria-controls="order-panel">Order online</a></div>
  <p class="outro-links"><a href="/menu/">Full menu →</a><a href="/online/">Visit us →</a></p>
</section>
</div>`;
export const specialtiesSchema=`<script type="application/ld+json">{"@context": "https://schema.org", "@graph": [{"@type": "Menu", "@id": "https://good-coconut.vercel.app/specialties/#menu", "name": "Good Coconut signatures", "inLanguage": "en", "hasMenuSection": {"@type": "MenuSection", "name": "Signatures", "hasMenuItem": [{"@type": "MenuItem", "name": "Persimmon Puree Pudding", "alternateName": "喜柿玻玻", "description": "Seasonal persimmon puree over coconut pudding in a glass jar (new item)."}, {"@type": "MenuItem", "name": "Freshly Opened Coconut", "alternateName": "现开椰子", "description": "A freshly opened coconut served in a Good Coconut bowl with a straw."}, {"@type": "MenuItem", "name": "Coconut Latte", "alternateName": "生椰拿铁", "description": "Coconut milk with espresso."}, {"@type": "MenuItem", "name": "Whole Coconut Pudding with Mango & Popping Boba", "alternateName": "整颗多芒爆珠布丁", "description": "Coconut pudding served in a whole coconut, topped with mango and popping boba."}, {"@type": "MenuItem", "name": "Mango Pudding", "alternateName": "芒果椰奶布丁", "description": "Coconut milk pudding topped with mango."}, {"@type": "MenuItem", "name": "Strawberry Pudding", "alternateName": "草莓椰奶布丁", "description": "Coconut milk pudding topped with strawberry."}, {"@type": "MenuItem", "name": "Dragon Fruit Pudding", "alternateName": "火龙果椰奶布丁", "description": "Coconut milk pudding topped with dragon fruit."}, {"@type": "MenuItem", "name": "Coconut Americano", "alternateName": "椰青美式"}, {"@type": "MenuItem", "name": "Handmade Taro Coconut Milk", "alternateName": "手打香芋椰椰", "description": "Coconut milk with taro paste and crystal boba."}, {"@type": "MenuItem", "name": "Black Sesame Coconut Milk (Hot)", "alternateName": "黑芝麻椰椰（热）", "description": "Hot coconut milk with black sesame."}, {"@type": "MenuItem", "name": "Lime Boba Coconut", "alternateName": "青柠爆珠鲜椰水", "description": "Coconut water with water chestnut popping boba and lime."}]}, "url": "https://good-coconut.vercel.app/specialties/"}, {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://good-coconut.vercel.app/"}, {"@type": "ListItem", "position": 2, "name": "Specialties", "item": "https://good-coconut.vercel.app/specialties/"}]}]}</script>`;
