/* =========================================================
   城市周末旅行指南 · 详情页渲染
   读取 URL 参数 city=<slug>，从 data.js 的 destinations 取数渲染
   ========================================================= */
(function () {
  const params = new URLSearchParams(location.search);
  const slug = params.get("city");
  const data = destinations.find((d) => d.slug === slug);
  const $ = (id) => document.getElementById(id);

  // ---- 兜底：未指定或未知城市 ----
  if (!data) {
    document.title = "未找到目的地 · 城市周末";
    $("hero-emoji").textContent = "🧭";
    $("hero-city").textContent = "未找到这个目的地";
    $("hero-tagline").textContent = "换个城市再看看？";
    $("dhero").style.background = "linear-gradient(135deg, #1F2A37, #2C3A4B)";
    document.querySelector(".detail").innerHTML =
      '<div class="detail__empty">没有找到你要的目的地，' +
      '<a href="index.html#destinations">返回首页看看其他城市 →</a></div>';
    return;
  }

  const grad = `linear-gradient(135deg, ${data.theme[0]}, ${data.theme[1]})`;

  // ---- 标题 & Hero ----
  document.title = `${data.city}周末攻略 · 城市周末`;

  const dhero = $("dhero");
  dhero.style.background = grad;               // 图片加载失败时的兜底底色
  const img = $("hero-img");
  img.src = data.image;
  img.alt = `${data.city}·${data.region}风光`;

  $("hero-region").textContent = `${data.region} · 周末 2 天`;
  $("hero-season").textContent = `最佳季节 · ${data.season}`;
  $("hero-city").textContent = data.city;
  $("hero-emoji").textContent = data.emoji;
  $("hero-tagline").textContent = data.tagline;
  $("hero-tags").innerHTML = data.tags
    .map((t) => `<span class="chip chip--light">${t}</span>`)
    .join("");

  // ---- 城市速览 ----
  $("intro").textContent = data.intro;
  const facts = [
    { k: "最佳季节", v: data.season },
    { k: "建议时长", v: "2 天 1 晚" },
    { k: "旅行主题", v: data.tags.join(" · ") },
    { k: "所属地区", v: data.region },
  ];
  $("facts").innerHTML = facts
    .map((f) => `<div class="fact"><span class="fact__k">${f.k}</span><span class="fact__v">${f.v}</span></div>`)
    .join("");

  // ---- 必看亮点 ----
  $("highlights").innerHTML = data.highlights
    .map(
      (h, i) => `
    <article class="hl">
      <span class="hl__no">${String(i + 1).padStart(2, "0")}</span>
      <h3 class="hl__title">${h.title}</h3>
      <p class="hl__desc">${h.desc}</p>
    </article>`
    )
    .join("");

  // ---- 周末行程 ----
  $("itinerary").innerHTML = data.itinerary
    .map(
      (d) => `
    <div class="day">
      <div class="day__head">${d.day}</div>
      <div class="day__body">
        ${d.items
          .map(
            (it) => `
          <div class="step">
            <span class="step__time">${it.time}</span>
            <span class="step__text">${it.text}</span>
          </div>`
          )
          .join("")}
      </div>
    </div>`
    )
    .join("");

  // ---- 必吃美食 ----
  $("foods").innerHTML = data.foods
    .map(
      (f) => `
    <article class="food">
      <h3 class="food__name">${f.name}</h3>
      <p class="food__desc">${f.desc}</p>
    </article>`
    )
    .join("");

  // ---- 实用贴士 ----
  $("tips").innerHTML = data.tips
    .map(
      (t) => `
    <div class="tip">
      <span class="tip__label">${t.label}</span>
      <p class="tip__text">${t.text}</p>
    </div>`
    )
    .join("");

  // ---- 其他目的地 ----
  $("more").innerHTML = destinations
    .filter((d) => d.slug !== data.slug)
    .map(
      (d) => `
    <a class="more-card" href="destination.html?city=${d.slug}">
      <span class="more-card__ph" style="background:linear-gradient(135deg,${d.theme[0]},${d.theme[1]})">
        <img src="${d.image}" alt="${d.city}" loading="lazy" onerror="this.classList.add('is-failed')" />
        <span class="more-card__emoji">${d.emoji}</span>
      </span>
      <span class="more-card__name">${d.city}<em>${d.region}</em></span>
    </a>`
    )
    .join("");
})();
