/* =========================================================
   城市周末旅行指南 · 首页渲染与交互
   数据来自 data.js（全局 destinations），此处只负责渲染 / 筛选 / 搜索
   ========================================================= */

// ---- 渲染卡片 ----
const grid = document.getElementById("destinations-grid");

function cardHTML(d) {
  const tags = d.tags.map((t) => `<span class="chip">${t}</span>`).join("");
  const grad = `linear-gradient(135deg, ${d.theme[0]}, ${d.theme[1]})`;
  const searchText = [d.city, d.region, d.tags.join(" "), d.tagline, d.desc].join(" ").toLowerCase();
  return `
  <article class="card" data-tags="${d.tags.join(",")}" data-search="${searchText.replace(/"/g, "&quot;")}">
    <div class="card__cover" style="background:${grad}">
      <img class="card__photo" src="${d.image}" alt="${d.city}·${d.region}周末风光" loading="lazy"
           onerror="this.classList.add('is-failed')" />
      <span class="card__emoji">${d.emoji}</span>
      <span class="card__season">最佳 · ${d.season}</span>
    </div>
    <div class="card__body">
      <div class="card__head">
        <h3>${d.city}</h3>
        <span class="card__region">${d.region}</span>
      </div>
      <p class="card__tagline">${d.tagline}</p>
      <div class="card__tags">${tags}</div>
      <p class="card__desc">${d.desc}</p>
      <a class="card__cta" href="destination.html?city=${d.slug}">查看周末攻略 →</a>
    </div>
  </article>`;
}

grid.innerHTML = destinations.map(cardHTML).join("");

// ---- 统一筛选状态（标签 + 搜索关键词） ----
let activeTag = "全部";
let query = "";

const filtersEl = document.getElementById("filters");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchStatus = document.getElementById("search-status");

const allTags = [...new Set(destinations.flatMap((d) => d.tags))];
const filterList = ["全部", ...allTags];

filtersEl.innerHTML = filterList
  .map((t, i) => `<button class="filter ${i === 0 ? "active" : ""}" data-tag="${t}">${t}</button>`)
  .join("");

// 结合「标签 + 搜索关键词」统一过滤卡片
function applyFilter() {
  let visible = 0;
  [...grid.children].forEach((card) => {
    const tags = card.dataset.tags.split(",");
    const text = card.dataset.search || "";
    const matchTag = activeTag === "全部" || tags.includes(activeTag);
    const matchQuery = !query || text.includes(query);
    const show = matchTag && matchQuery;
    card.style.display = show ? "" : "none";
    if (show) visible++;
  });

  // 无结果提示
  if (query && visible === 0) {
    searchStatus.textContent = `没有找到匹配「${searchInput.value.trim()}」的周末目的地，换个关键词试试～`;
    searchStatus.hidden = false;
  } else {
    searchStatus.hidden = true;
  }
}

// 滚动到卡片并高亮
function focusCard(el) {
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("card--pulse");
  setTimeout(() => el.classList.remove("card--pulse"), 1200);
}

// 标签筛选
filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  [...filtersEl.children].forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeTag = btn.dataset.tag;
  applyFilter();
});

// 实时搜索：输入即筛选
searchInput.addEventListener("input", () => {
  query = searchInput.value.trim().toLowerCase();
  applyFilter();
});

// 提交搜索：定位到第一个匹配结果并高亮
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  query = searchInput.value.trim().toLowerCase();
  applyFilter();
  const first = [...grid.children].find((c) => c.style.display !== "none");
  focusCard(first);
});

// ---- 灵感：按心情随机推荐 ----
const moods = document.querySelectorAll(".inspiration__moods button");
moods.forEach((b) =>
  b.addEventListener("click", () => {
    // 先回到「全部」并清空搜索，确保目标可见
    if (activeTag !== "全部") filtersEl.querySelector('.filter[data-tag="全部"]').click();
    if (query) {
      searchInput.value = "";
      query = "";
      applyFilter();
    }
    const pick = destinations[Math.floor(Math.random() * destinations.length)];
    const el = [...grid.children].find((c) => c.querySelector("h3").textContent === pick.city);
    focusCard(el);
  })
);
