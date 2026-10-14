const anime = [
  {id:1,title:"Trevo Negro",english:"Black Clover",genres:["Ação","Aventura","Fantasia"],year:2017,image:"https://cdn.myanimelist.net/images/anime/2/88336l.jpg",description:"Asta nasceu sem poderes mágicos em um mundo onde a magia faz parte da vida. Com determinação e seus amigos, ele sonha em se tornar o Rei Mago."},
  {id:2,title:"Ataque dos Titãs",english:"Attack on Titan",genres:["Ação","Drama","Mistério"],year:2013,image:"https://cdn.myanimelist.net/images/anime/10/47347l.jpg",description:"A humanidade vive protegida por enormes muralhas e precisa enfrentar mistérios e perigos que podem mudar tudo o que conhece."},
  {id:3,title:"Aquela vez em que reencarnei como um slime",english:"That Time I Got Reincarnated as a Slime",genres:["Aventura","Fantasia","Comédia"],year:2018,image:"https://cdn.myanimelist.net/images/anime/1694/93337l.jpg",description:"Depois de renascer em um mundo fantástico como um slime, Rimuru começa a construir uma comunidade cheia de criaturas diferentes."},
  {id:4,title:"Diários de uma Apotecária",english:"The Apothecary Diaries",genres:["Drama","Mistério"],year:2023,image:"https://cdn.myanimelist.net/images/anime/1708/138033l.jpg",description:"Maomao, uma jovem especialista em remédios, usa sua inteligência para desvendar mistérios dentro do palácio imperial."},
  {id:5,title:"Mushoku Tensei",english:"Mushoku Tensei: Jobless Reincarnation",genres:["Aventura","Fantasia","Drama"],year:2021,image:"https://cdn.myanimelist.net/images/anime/1530/117776l.jpg",description:"Em um mundo de magia, um homem ganha uma nova oportunidade de vida e tenta aprender com seus erros do passado."},
  {id:6,title:"Re:ZERO",english:"Re:Zero − Starting Life in Another World",genres:["Drama","Fantasia","Mistério"],year:2016,image:"https://cdn.myanimelist.net/images/anime/11/79410l.jpg",description:"Subaru é levado para outro mundo e descobre que precisa enfrentar situações difíceis enquanto tenta proteger quem ama."},
  {id:7,title:"Solo Leveling",english:"Solo Leveling",genres:["Ação","Aventura","Fantasia"],year:2024,image:"https://cdn.myanimelist.net/images/anime/1801/142390l.jpg",description:"Em um mundo com portais e caçadores, Sung Jinwoo recebe uma habilidade incomum que pode transformar seu destino."},
  {id:8,title:"Fairy Tail",english:"Fairy Tail",genres:["Ação","Aventura","Comédia"],year:2009,image:"https://cdn.myanimelist.net/images/anime/5/18179l.jpg",description:"Lucy se junta a uma guilda de magos conhecida por suas missões caóticas, amizades fortes e aventuras inesquecíveis."},
  {id:9,title:"Frieren e a Jornada para o Além",english:"Frieren: Beyond Journey's End",genres:["Aventura","Drama","Fantasia"],year:2023,image:"https://cdn.myanimelist.net/images/anime/1015/138006l.jpg",description:"Após a grande aventura terminar, a elfa Frieren começa uma jornada para compreender melhor os laços que criou."},
  {id:10,title:"The Rising of the Shield Hero",english:"The Rising of the Shield Hero",genres:["Ação","Aventura","Fantasia"],year:2019,image:"https://cdn.myanimelist.net/images/anime/1490/101365l.jpg",description:"Convocado para outro mundo como o Herói do Escudo, Naofumi precisa conquistar confiança e provar seu valor."},
  {id:11,title:"Mashle",english:"Mashle: Magic and Muscles",genres:["Ação","Comédia","Fantasia"],year:2023,image:"https://cdn.myanimelist.net/images/anime/1218/135107l.jpg",description:"Em uma sociedade movida pela magia, Mash resolve os problemas com força física e um senso de humor peculiar."},
  {id:12,title:"Sword Art Online",english:"Sword Art Online",genres:["Ação","Aventura","Drama"],year:2012,image:"https://cdn.myanimelist.net/images/anime/11/39717l.jpg",description:"Jogadores ficam presos em um mundo virtual e precisam superar desafios para conseguir voltar à vida real."}
];

const trendingIds = [1,2,3,4,5,6,7,8];
const recommendedIds = [6,3,5,10,9,11,8,12];
const trendingEl = document.getElementById("trending");
const recommendedEl = document.getElementById("recommended");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("searchInput");
const dropdown = document.getElementById("dropdown");
const notice = document.getElementById("notice");
const dialog = document.getElementById("animeDialog");
let currentAnime = null;
let currentMode = "home";
let activeCategory = "";
let searchTerm = "";

function getSaved() {
  try { return JSON.parse(localStorage.getItem("skz-crunchyroll-saved") || "[]"); }
  catch { return []; }
}
function setSaved(ids) {
  localStorage.setItem("skz-crunchyroll-saved", JSON.stringify(ids));
}
function isSaved(id) { return getSaved().includes(id); }
function showNotice(message) {
  notice.textContent = message;
  window.clearTimeout(showNotice.timer);
  showNotice.timer = window.setTimeout(() => notice.textContent = "", 3200);
}
function cardTemplate(item) {
  const saved = isSaved(item.id);
  return `<article class="anime-card" data-id="${item.id}" tabindex="0" aria-label="Ver detalhes de ${item.title}">
    <div class="poster">
      <img src="${item.image}" alt="Pôster de ${item.title}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/360x520/202127/f47521?text=Anime';">
      <button class="save-card ${saved ? "saved" : ""}" data-save="${item.id}" aria-label="${saved ? "Remover da lista" : "Adicionar à lista"}" title="${saved ? "Remover da lista" : "Adicionar à lista"}">${saved ? "✓" : "＋"}</button>
      <div class="card-overlay"><button class="quick-play" data-details="${item.id}" aria-label="Detalhes de ${item.title}">▶</button></div>
    </div>
    <h3 class="card-title">${item.title}</h3>
    <p class="card-meta"><span>${item.genres[0]}</span><span class="dot"></span><span>${item.year}</span></p>
  </article>`;
}
function renderRow(element, list) {
  element.innerHTML = list.length ? list.map(cardTemplate).join("") : '<p class="empty-state">Nenhum anime encontrado. Tente outra busca.</p>';
}
function renderHome() {
  const list = anime.filter(item => {
    const matchesSearch = !searchTerm || (item.title + " " + item.english + " " + item.genres.join(" ")).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || item.genres.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });
  renderRow(trendingEl, list.filter(item => trendingIds.includes(item.id)));
  renderRow(recommendedEl, list.filter(item => recommendedIds.includes(item.id)));
  document.getElementById("trendingTitle").textContent = currentMode === "saved" ? "Minha lista" : activeCategory ? `Animes de ${activeCategory}` : searchTerm ? "Resultados da busca" : currentMode === "Popular" ? "Animes populares" : currentMode === "Novidade" ? "Novidades para assistir" : currentMode === "Transmissão" ? "Em destaque" : "Anime em tendência no Brasil";
  document.getElementById("recommendedTitle").textContent = currentMode === "saved" ? "Continue explorando" : "Inspirado por ti";
  if (currentMode === "saved") {
    const savedList = anime.filter(item => isSaved(item.id));
    renderRow(trendingEl, savedList);
    renderRow(recommendedEl, anime.filter(item => !isSaved(item.id)).slice(0,8));
    document.getElementById("recommendedTitle").textContent = "Talvez você goste";
  }
  document.getElementById("trendingSection").scrollIntoView({behavior:"smooth",block:"nearest"});
}
function showDetails(id) {
  currentAnime = anime.find(item => item.id === Number(id));
  if (!currentAnime) return;
  document.getElementById("dialogArt").style.backgroundImage = `linear-gradient(0deg,#1e1f24 0%,transparent 75%),url("${currentAnime.image}")`;
  document.getElementById("dialogTitle").textContent = currentAnime.title;
  document.getElementById("dialogMeta").textContent = `${currentAnime.english} • ${currentAnime.year} • ${currentAnime.genres.join(" / ")}`;
  document.getElementById("dialogDescription").textContent = currentAnime.description;
  document.getElementById("dialogSaveBtn").textContent = isSaved(currentAnime.id) ? "✓ Na minha lista" : "＋ Minha lista";
  if (typeof dialog.showModal === "function") dialog.showModal();
  else alert(`${currentAnime.title}\n\n${currentAnime.description}`);
}
function toggleSave(id) {
  id = Number(id);
  const saved = getSaved();
  if (saved.includes(id)) {
    setSaved(saved.filter(itemId => itemId !== id));
    showNotice("Anime removido da sua lista.");
  } else {
    setSaved([...saved, id]);
    showNotice("Anime adicionado à sua lista!");
  }
  renderHome();
  if (currentAnime && currentAnime.id === id && dialog.open) {
    document.getElementById("dialogSaveBtn").textContent = isSaved(id) ? "✓ Na minha lista" : "＋ Minha lista";
  }
}
function setMode(mode) {
  currentMode = mode;
  activeCategory = "";
  document.querySelectorAll("[data-category]").forEach(btn => btn.classList.remove("active"));
  if (mode === "Jogos") {
    showNotice("Área de jogos: esta recriação é uma demonstração visual.");
    currentMode = "home";
    return;
  }
  if (mode === "saved") {
    searchTerm = "";
    searchInput.value = "";
  }
  renderHome();
}
document.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) { event.stopPropagation(); toggleSave(saveButton.dataset.save); return; }
  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) { event.stopPropagation(); showDetails(detailsButton.dataset.details); return; }
  const card = event.target.closest(".anime-card");
  if (card) { showDetails(card.dataset.id); return; }
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton) {
    activeCategory = activeCategory === categoryButton.dataset.category ? "" : categoryButton.dataset.category;
    document.querySelectorAll("[data-category]").forEach(btn => btn.classList.toggle("active", btn.dataset.category === activeCategory));
    currentMode = "home"; renderHome(); return;
  }
  const viewButton = event.target.closest("[data-view]");
  if (viewButton) { setMode(viewButton.dataset.view); return; }
  const scrollButton = event.target.closest("[data-scroll]");
  if (scrollButton) {
    const row = document.getElementById(scrollButton.dataset.scroll);
    row.scrollBy({left:Number(scrollButton.dataset.dir) * row.clientWidth * .8, behavior:"smooth"});
  }
});
document.addEventListener("keydown", event => {
  const card = event.target.closest(".anime-card");
  if (card && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); showDetails(card.dataset.id); }
  if (event.key === "Escape") dropdown.hidden = true;
});
document.getElementById("searchToggle").addEventListener("click", () => {
  searchPanel.hidden = !searchPanel.hidden;
  if (!searchPanel.hidden) searchInput.focus();
});
searchInput.addEventListener("input", () => { searchTerm = searchInput.value.trim(); currentMode = "home"; renderHome(); });
document.getElementById("clearSearch").addEventListener("click", () => { searchInput.value = ""; searchTerm = ""; renderHome(); searchInput.focus(); });
document.getElementById("savedToggle").addEventListener("click", () => setMode("saved"));
document.getElementById("categoriesBtn").addEventListener("click", () => {
  dropdown.innerHTML = '<strong style="display:block;padding:9px 10px;color:#f47521">Categorias</strong>' +
    ["Ação","Aventura","Fantasia","Comédia","Drama","Mistério","Romance"].map(category => `<button data-dropdown-category="${category}">${category}</button>`).join("");
  dropdown.hidden = !dropdown.hidden;
});
dropdown.addEventListener("click", event => {
  const button = event.target.closest("[data-dropdown-category]");
  if (!button) return;
  activeCategory = button.dataset.dropdownCategory;
  document.querySelectorAll("[data-category]").forEach(btn => btn.classList.toggle("active", btn.dataset.category === activeCategory));
  dropdown.hidden = true; currentMode = "home"; renderHome();
});
document.getElementById("newsBtn").addEventListener("click", () => {
  dropdown.innerHTML = '<button data-news="season">Temporada atual</button><button data-news="calendar">Calendário de lançamentos</button><button data-news="updates">Últimas novidades</button>';
  dropdown.hidden = !dropdown.hidden;
});
dropdown.addEventListener("click", event => {
  const button = event.target.closest("[data-news]");
  if (button) { dropdown.hidden = true; showNotice(`${button.textContent}: seção demonstrativa do projeto.`); }
});
document.getElementById("profileBtn").addEventListener("click", () => showNotice("Olá! Este é um perfil de demonstração."));
document.getElementById("exploreBtn").addEventListener("click", () => document.getElementById("trendingSection").scrollIntoView({behavior:"smooth"}));
document.getElementById("heroInfoBtn").addEventListener("click", () => showNotice("Explore os cards, pesquise títulos, filtre categorias e monte sua lista pessoal."));
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
document.getElementById("watchBtn").addEventListener("click", () => {
  if (currentAnime) window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(currentAnime.english + " official trailer")}`, "_blank", "noopener,noreferrer");
});
document.getElementById("dialogSaveBtn").addEventListener("click", () => { if (currentAnime) toggleSave(currentAnime.id); });
renderRow(trendingEl, anime.filter(item => trendingIds.includes(item.id)));
renderRow(recommendedEl, anime.filter(item => recommendedIds.includes(item.id)));
