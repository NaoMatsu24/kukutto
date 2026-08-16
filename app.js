// くくっと！：画面の表示、問題、記録をこのファイルで動かします。
const STORAGE_KEY = "kuku-short-test-v1";
const BACKUP_FORMAT = "kukutto-full-backup";
const BACKUP_VERSION = 1;
const DEFAULT_SETTINGS = { answerDelay: "1000", questionCount: "10" };
const PRAISES = ["すごい！", "やったね！", "正解！", "その<ruby>調子<rt>ちょうし</rt></ruby>！", "よくできた！", "どんどんできるようになっているよ！"];
const GARDEN_STAGES = [
  { points: 0, name: "たね", icon: "🌰", image: "images/garden/seed.png" },
  { points: 20, name: "めが出た", icon: "🌱", image: "images/garden/sprout.png" },
  { points: 45, name: "ふたば", icon: "🌿", image: "images/garden/two-leaves.png" },
  { points: 75, name: "葉がふえた", icon: "🪴", image: "images/garden/leafy.png" },
  { points: 110, name: "つぼみ", icon: "🌷", image: "images/garden/bud.png" },
  { points: 150, name: "花がさいた", icon: "🌻", image: "images/garden/sunflower.png" },
  { points: 200, name: "とくべつな花", icon: "🌺", image: "images/garden/special-flower.png" }
];
const GARDEN_FLOWERS = [
  { id: "sunflower", name: "ひまわり", image: "images/garden/sunflower.png", rarity: "normal" },
  { id: "pink-flower", name: "ピンクの花", image: "images/garden/special-flower.png", rarity: "normal" },
  { id: "red-tulip", name: "赤いチューリップ", image: "images/garden/red-tulip.png", rarity: "normal" },
  { id: "blue-daisy", name: "青いデイジー", image: "images/garden/blue-daisy.png", rarity: "normal" },
  { id: "purple-pansy", name: "紫のパンジー", image: "images/garden/purple-pansy.png", rarity: "normal" },
  { id: "orange-marigold", name: "オレンジのマリーゴールド", image: "images/garden/orange-marigold.png", rarity: "normal" },
  { id: "white-cosmos", name: "白いコスモス", image: "images/garden/white-cosmos.png", rarity: "normal" },
  { id: "rare-rainbow-flower", name: "虹色のきらめき花", image: "images/garden/rare-rainbow-flower.png", rarity: "rare" },
  { id: "rare-moon-star", name: "月夜の星花", image: "images/garden/rare-moon-star.png", rarity: "rare" }
];
const NORMAL_FLOWERS = GARDEN_FLOWERS.filter(flower => flower.rarity === "normal");
const RARE_FLOWERS = GARDEN_FLOWERS.filter(flower => flower.rarity === "rare");

function flowerForCollectionIndex(index) {
  if ((index + 1) % 5 === 0) return RARE_FLOWERS[Math.floor(index / 5) % RARE_FLOWERS.length];
  return NORMAL_FLOWERS[index % NORMAL_FLOWERS.length];
}
const app = document.querySelector("#app");

const UI_ICONS = {
  pencil: '<path d="M4 20l4.5-1 10-10-3.5-3.5-10 10L4 20zM13.5 7l3.5 3.5"/>',
  chart: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M15 9l5-5m-1 0h-3m3 0v3"/>',
  keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21m-3 0h6"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  eye: '<path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"/><circle cx="12" cy="12" r="2.5"/>',
  shuffle: '<path d="M4 7h3c5 0 5 10 10 10h3m-3-3l3 3-3 3M4 17h3c2.5 0 3.7-2.5 5-5 1.3-2.5 2.5-5 5-5h3m-3-3l3 3-3 3"/>',
  trophy: '<path d="M8 4h8v4c0 4-1.8 6-4 6s-4-2-4-6V4zm4 10v4m-4 2h8M8 6H4v2c0 2 1.5 3.5 4 3.5M16 6h4v2c0 2-1.5 3.5-4 3.5"/>',
  flower: '<circle cx="12" cy="12" r="2.5"/><circle cx="12" cy="6.5" r="3"/><circle cx="17.5" cy="12" r="3"/><circle cx="12" cy="17.5" r="3"/><circle cx="6.5" cy="12" r="3"/>',
  gift: '<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M2.5 9h19V6.5h-19V9zM12 9v12M8.5 6.5C6 6.5 5 5.3 5 4.2 5 3 6 2.4 7 2.8c1.8.7 3.2 2.3 5 3.7m3.5 0C18 6.5 19 5.3 19 4.2 19 3 18 2.4 17 2.8c-1.8.7-3.2 2.3-5 3.7"/>',
  warning: '<path d="M12 3L2.8 20h18.4L12 3zM12 9v5m0 3h.01"/>',
  droplet: '<path d="M12 3s6 7 6 11a6 6 0 01-12 0c0-4 6-11 6-11z"/>',
  sprout: '<path d="M12 21v-9m0 2c-5 0-7-3-7-7 5 0 7 3 7 7zm0 2c5 0 7-3 7-7-5 0-7 3-7 7z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-14 4h2m3 0h2m3 0h2m-10 3h2m3 0h2"/>'
};

function iconHtml(name, className = "") {
  return `<svg class="ui-icon ${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${UI_ICONS[name]}</svg>`;
}

// ここは、場面に合わせてキャラクターの表情をかえるところです。
const CHARACTER_PICTURES = {
  main: "images/character/penguin-support-full.png",
  smile: "images/character/penguin-happy-face.png",
  celebrate: "images/character/penguin-celebrate-full.png",
  thinking: "images/character/penguin-thinking-face.png",
  sad: "images/character/penguin-sad-face.png",
  support: "images/character/penguin-support-full.png"
};
const ILLUSTRATION_FILE = CHARACTER_PICTURES.main;
const FALLBACK_PICTURE = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="#ffd65c"/><circle cx="42" cy="48" r="6" fill="#333"/><circle cx="78" cy="48" r="6" fill="#333"/><path d="M35 70 Q60 94 85 70" fill="none" stroke="#333" stroke-width="7" stroke-linecap="round"/><path d="M18 23l15 5M102 23l-15 5" stroke="#ff7043" stroke-width="7" stroke-linecap="round"/></svg>`);

let state = loadData();
let quiz = null;
let nextQuestionTimer = null;
let speechRecognition = null;
let speechPermissionBlocked = false;
let selectedAnswerMode = "number";
let recordsView = { range: "30", month: "all", page: 1 };

function loadData() {
  // ここは、前のきろくをブラウザから読みこむところです。
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const results = saved?.results || [];
    const stats = saved?.stats || {};
    Object.values(stats).forEach(stat => {
      if (stat.wrong > 0 && !stat.nextReview) {
        stat.nextReview = dayKey(new Date());
        stat.reviewInterval = 0;
      }
    });
    const garden = saved?.garden || gardenFromResults(results);
    garden.cycleStartPoints ??= 0;
    garden.completedFlowers ??= [];
    garden.pendingBloom ??= null;
    return { stats, results, garden, settings: { ...DEFAULT_SETTINGS, ...(saved?.settings || {}) } };
  } catch (_) {
    return { stats: {}, results: [], garden: emptyGarden(), settings: { ...DEFAULT_SETTINGS } };
  }
}

function emptyGarden() {
  return { points: 0, cycleStartPoints: 0, completedFlowers: [], practiceDays: [], growthLog: [{ date: new Date().toISOString(), stage: 0 }], pendingBloom: null };
}

function gardenFromResults(results) {
  // 前からあるテストきろくも、植物のせいちょうに入れます。
  const garden = emptyGarden();
  const testsPerDay = {};
  const ordered = [...results].sort((a, b) => new Date(a.date) - new Date(b.date));
  if (ordered.length) garden.growthLog = [{ date: ordered[0].date, stage: 0 }];
  ordered.forEach(result => {
    const day = dayKey(result.date);
    if (!garden.practiceDays.includes(day)) garden.practiceDays.push(day);
    testsPerDay[day] = (testsPerDay[day] || 0) + 1;
    if (testsPerDay[day] > 2) return;
    const rate = result.correct / result.total;
    const basePoints = result.streakChallenge || result.scaledPractice ? Math.min(10, result.total) : 10;
    const bonus = rate === 1 ? 5 : rate >= .8 ? 3 : rate >= .6 ? 2 : 0;
    const oldStage = gardenStageIndex(garden.points);
    garden.points += basePoints + bonus;
    const newStage = gardenStageIndex(garden.points);
    for (let stage = oldStage + 1; stage <= newStage; stage++) garden.growthLog.push({ date: result.date, stage });
  });
  return garden;
}

function saveData() {
  // ここは、きろくをブラウザに保存するところです。
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function dateAfterDays(days) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return dayKey(date);
}

function reviewIntervalFor(streak) {
  if (streak >= 4) return 30;
  if (streak === 3) return 14;
  if (streak === 2) return 7;
  return 3;
}

function reviewDateLabel(date) {
  if (!date) return "―";
  if (date <= dayKey(new Date())) return "今日";
  const [, month, day] = date.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function pictureHtml(className = "friend", picture = ILLUSTRATION_FILE) {
  return `<img class="${className}" src="${picture}" onerror="this.onerror=null;this.src='${FALLBACK_PICTURE}'" alt="おうえんキャラクター">`;
}

function happyPicture() {
  const pictures = [CHARACTER_PICTURES.smile, CHARACTER_PICTURES.celebrate];
  return pictures[Math.floor(Math.random() * pictures.length)];
}

function gardenPicture(stage, className = "garden-picture", flower = null) {
  const picture = flower && stage.points >= 150 ? flower : stage;
  return `<img class="${className}" src="${picture.image}" alt="${picture.name}のイラスト">`;
}

function showPageFromTop() {
  app.focus({ preventScroll: true });
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  root.style.scrollBehavior = previousScrollBehavior;
}

function showPage(page) {
  document.body.classList.toggle("home-page", page === "home");
  stopListening();
  clearTimeout(nextQuestionTimer);
  nextQuestionTimer = null;
  quiz = page === "test" ? quiz : null;
  if (page === "test") showStagePicker();
  else if (page === "records") showRecords();
  else if (page === "weak") showWeak();
  else if (page === "garden") showGarden();
  else if (page === "research") showResearch();
  else showHome();
  showPageFromTop();
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (button) showPage(button.dataset.page);
});

function showHome() {
  document.body.classList.add("home-page");
  const garden = gardenStatus();
  const gardenHasGift = Boolean(state.garden.pendingBloom);
  const homeGardenStage = gardenHasGift ? GARDEN_STAGES.find(stage => stage.points === 110) : garden.current;
  const practicedToday = state.garden.practiceDays.includes(dayKey(new Date()));
  app.innerHTML = `
    <section class="hero home-dashboard">
      <div class="home-intro">
        <h1 class="home-title">くくっと！</h1>
        <p class="lead">1日10問の九九チャレンジ</p>
        ${pictureHtml("friend", CHARACTER_PICTURES.smile)}
      </div>
      <button class="garden-home" data-page="garden">
        <span class="garden-plant">${gardenPicture(homeGardenStage, "garden-picture", garden.flower)}</span>
        <span class="garden-info">
          <span class="garden-label">${iconHtml("flower")} 九九ガーデン</span>
          <strong>${gardenHasGift ? "花が育ったよ！" : `今は「${garden.current.name}」`}</strong>
          <span>${gardenHasGift ? "ガーデンでプレゼントを開けてね" : garden.next ? `あと${garden.next.points - garden.cyclePoints}ポイントで「${garden.next.name}」` : "花が完成！次の種を育てられるよ"}</span>
          <span class="garden-progress"><span style="width:${garden.progress}%"></span></span>
          <span>${practicedToday ? "今日もお水をあげられたね！" : "テストをして、お水をあげよう！"}</span>
        </span>
      </button>
    </section>
    <section class="menu-grid" aria-label="できること">
      <button class="menu-card" data-page="test"><span>${iconHtml("pencil")}</span>テストする</button>
      <button class="menu-card" data-page="records"><span>${iconHtml("chart")}</span><ruby>記録<rt>きろく</rt></ruby>を見る</button>
      <button class="menu-card" data-page="weak"><span>${iconHtml("target")}</span><ruby>苦手<rt>にがて</rt></ruby>な九九</button>
    </section>`;
}

function gardenStageIndex(points) {
  let index = 0;
  GARDEN_STAGES.forEach((stage, i) => { if (points >= stage.points) index = i; });
  return index;
}

function gardenStatus() {
  const cyclePoints = state.garden.points - state.garden.cycleStartPoints;
  const index = gardenStageIndex(cyclePoints);
  const current = GARDEN_STAGES[index];
  const next = GARDEN_STAGES[index + 1] || null;
  const progress = next ? Math.round((cyclePoints - current.points) / (next.points - current.points) * 100) : 100;
  const collectedCurrentFlower = state.garden.completedFlowers.find(flower => flower.cycleStartPoints === state.garden.cycleStartPoints);
  const flower = GARDEN_FLOWERS.find(kind => kind.id === collectedCurrentFlower?.flowerType) || flowerForCollectionIndex(state.garden.completedFlowers.length);
  return { index, current, next, progress, cyclePoints, flower };
}

function showStagePicker() {
  const stages = Array.from({ length: 8 }, (_, i) => i + 2);
  const selectedStages = new Set();
  const speechAvailable = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  if (!speechAvailable && selectedAnswerMode === "voice") selectedAnswerMode = "number";
  app.innerHTML = `<section class="card test-picker">
    <h1 class="section-title">どのテストにする？</h1>
    <div class="character-guide test-picker-guide">${pictureHtml("guide-character", CHARACTER_PICTURES.support)}<span>4つ<ruby>選<rt>えら</rt></ruby>んだらスタート！</span></div>
    <fieldset class="picker-step answer-mode">
      <legend><span class="step-number">1</span><ruby>答<rt>こた</rt></ruby>え方</legend>
      <div class="picker-options mode-options">
        <button class="mode-button ${selectedAnswerMode === "number" ? "selected" : ""}" type="button" data-mode="number" aria-pressed="${selectedAnswerMode === "number"}">${iconHtml("keyboard")} 数字で入力</button>
        <button class="mode-button ${selectedAnswerMode === "voice" ? "selected" : ""}" type="button" data-mode="voice" aria-pressed="${selectedAnswerMode === "voice"}" ${speechAvailable ? "" : "disabled"}>${iconHtml("mic")} ${speechAvailable ? "声で<ruby>答<rt>こた</rt></ruby>える" : "音声入力は使えません"}</button>
        <button class="mode-button ${selectedAnswerMode === "choice" ? "selected" : ""}" type="button" data-mode="choice" aria-pressed="${selectedAnswerMode === "choice"}">${iconHtml("grid")} 4たく</button>
        <button class="mode-button ${selectedAnswerMode === "self" ? "selected" : ""}" type="button" data-mode="self" aria-pressed="${selectedAnswerMode === "self"}">${iconHtml("eye")} 自分でチェック</button>
      </div>
    </fieldset>
    <fieldset class="picker-step question-count">
      <legend><span class="step-number">2</span><ruby>問題<rt>もんだい</rt></ruby>の数</legend>
      <div class="picker-options count-options">
        <label class="recommended-count"><input type="radio" name="question-count" value="10" ${state.settings.questionCount === "10" ? "checked" : ""}><strong>10問</strong><span>ちょこっと</span><small class="recommended-badge">おすすめ</small></label>
        <label><input type="radio" name="question-count" value="20" ${state.settings.questionCount === "20" ? "checked" : ""}><strong>20問</strong><span>しっかり</span></label>
        <label><input type="radio" name="question-count" value="30" ${state.settings.questionCount === "30" ? "checked" : ""}><strong>30問</strong><span>たっぷり</span></label>
        <label><input type="radio" name="question-count" value="until-wrong" ${state.settings.questionCount === "until-wrong" ? "checked" : ""}><strong>連続正解</strong><span>チャレンジ</span><small>まちがえるまで・最大100問</small></label>
      </div>
    </fieldset>
    <fieldset class="picker-step answer-delay">
      <legend><span class="step-number">3</span><ruby>次<rt>つぎ</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>む時間</legend>
      <div class="picker-options delay-options">
        <label><input type="radio" name="answer-delay" value="500" ${state.settings.answerDelay === "500" ? "checked" : ""}>早い 0.5秒</label>
        <label><input type="radio" name="answer-delay" value="1000" ${state.settings.answerDelay === "1000" ? "checked" : ""}><ruby>普通<rt>ふつう</rt></ruby> 1秒</label>
        <label><input type="radio" name="answer-delay" value="2000" ${state.settings.answerDelay === "2000" ? "checked" : ""}>ゆっくり 2秒</label>
        <label><input type="radio" name="answer-delay" value="manual" ${state.settings.answerDelay === "manual" ? "checked" : ""}>自分で進む</label>
      </div>
    </fieldset>
    <fieldset class="picker-step stage-picker">
      <legend><span class="step-number">4</span><ruby>練習<rt>れんしゅう</rt></ruby>する段</legend>
      <div class="stage-grid">
        ${stages.map(n => `<button class="stage-button" type="button" data-stage="${n}" aria-pressed="false">${n}の段</button>`).join("")}
        <button class="stage-button random" type="button" data-stage="random" aria-pressed="false">${iconHtml("shuffle")} ランダム</button>
      </div>
      <p id="stage-selection-status" class="stage-selection-status" aria-live="polite">練習する段を1つ選んでね。</p>
    </fieldset>
    <div class="actions picker-start"><button id="start-selected-stages" class="button green" type="button" disabled><img class="start-button-character" src="${CHARACTER_PICTURES.support}" alt="">テストをスタート</button></div>
  </section>`;
  app.querySelectorAll("[data-mode]").forEach(button => button.addEventListener("click", () => {
    selectedAnswerMode = button.dataset.mode;
    app.querySelectorAll("[data-mode]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
  }));
  app.querySelectorAll("[name='answer-delay']").forEach(input => input.addEventListener("change", () => {
    state.settings.answerDelay = input.value;
    saveData();
  }));
  app.querySelectorAll("[name='question-count']").forEach(input => input.addEventListener("change", () => {
    state.settings.questionCount = input.value;
    saveData();
  }));
  const startButton = app.querySelector("#start-selected-stages");
  const selectionStatus = app.querySelector("#stage-selection-status");
  app.querySelectorAll("[data-stage]").forEach(button => button.addEventListener("click", () => {
    const stage = button.dataset.stage;
    const deselect = selectedStages.has(stage);
    selectedStages.clear();
    if (!deselect) selectedStages.add(stage);
    app.querySelectorAll("[data-stage]").forEach(item => {
      const selected = selectedStages.has(item.dataset.stage);
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    app.querySelector(".stage-grid").classList.toggle("has-selection", selectedStages.size > 0);
    startButton.disabled = selectedStages.size === 0;
    selectionStatus.textContent = selectedStages.has("random")
      ? "ランダムを選んでいます。"
      : selectedStages.size
        ? `${[...selectedStages].sort((a, b) => Number(a) - Number(b)).join("・")}の段を選んでいます。`
        : "練習する段を1つ選んでね。";
  }));
  startButton.addEventListener("click", () => {
    if (!selectedStages.size) return;
    if (selectedStages.has("random")) startQuiz("random");
    else startQuiz(Number([...selectedStages][0]));
  });
}

function allProblems() {
  return Array.from({ length: 8 }, (_, i) => i + 2).flatMap(a =>
    Array.from({ length: 9 }, (_, i) => ({ a, b: i + 1, key: `${a}x${i + 1}` }))
  );
}

function weightedRandomProblems(count) {
  // ここは、にがてな問題ほど少し出やすくするところです。
  const pool = allProblems().map(problem => {
    const s = state.stats[problem.key] || { attempts: 0, wrong: 0, recentCorrect: 0 };
    const difficulty = s.wrong / Math.max(1, s.attempts);
    const weight = 1 + s.wrong * 1.4 + difficulty * 2 - Math.min(s.recentCorrect, 4) * .3;
    return { ...problem, weight: Math.max(1, weight) };
  });
  const chosen = [];
  let available = [...pool];
  while (chosen.length < count) {
    if (!available.length) available = [...pool];
    const total = available.reduce((sum, item) => sum + item.weight, 0);
    let roll = Math.random() * total;
    let index = available.findIndex(item => (roll -= item.weight) <= 0);
    if (index < 0) index = available.length - 1;
    chosen.push({ ...available.splice(index, 1)[0] });
  }
  return chosen;
}

function makeStageProblems(stage, count) {
  const problems = [];
  while (problems.length < count) {
    const cycle = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - .5);
    problems.push(...cycle.map(b => ({ a: Number(stage), b, key: `${stage}x${b}` })));
  }
  return problems.slice(0, count);
}

function makeSelectedStageProblems(stages, count) {
  if (stages.length === 1) return makeStageProblems(stages[0], count);
  const pool = stages.flatMap(a => Array.from({ length: 9 }, (_, i) => ({ a, b: i + 1, key: `${a}x${i + 1}` })));
  const problems = [];
  while (problems.length < count) problems.push(...[...pool].sort(() => Math.random() - .5));
  return problems.slice(0, count);
}

function startQuiz(stage, retryProblems = null) {
  stopListening();
  speechPermissionBlocked = false;
  clearTimeout(nextQuestionTimer);
  nextQuestionTimer = null;
  const stopOnWrong = !retryProblems && state.settings.questionCount === "until-wrong";
  const questionCount = retryProblems ? retryProblems.length : stopOnWrong ? 100 : Number(state.settings.questionCount);
  quiz = {
    stage: retryProblems ? (stage === "weak" ? "苦手を練習" : stage === "review" ? "今日の復習" : "間違い直し") : stage,
    problems: retryProblems || (stage === "random" ? weightedRandomProblems(questionCount) : Array.isArray(stage) ? makeSelectedStageProblems(stage, questionCount) : makeStageProblems(stage, questionCount)),
    index: 0,
    correct: 0,
    mistakes: [],
    recovered: [],
    startedAt: Date.now(),
    answered: false,
    answerMode: selectedAnswerMode,
    stopOnWrong,
    finishAfterAnswer: false
  };
  showQuestion(true);
}

function showQuestion(positionQuizAtTop = false) {
  // 新しい問題になったら、もう一度こたえられるようにします。
  quiz.answered = false;
  const problem = quiz.problems[quiz.index];
  const stageName = quiz.stage === "random" ? "ランダム" : Array.isArray(quiz.stage) ? `${quiz.stage.join("・")}の段` : ["間違い直し", "苦手を練習", "今日の復習"].includes(quiz.stage) ? quiz.stage : `${quiz.stage}の段`;
  app.innerHTML = `<section class="card quiz-card">
    <div class="test-head"><span>${stageName}</span><span>${quiz.index + 1} / ${quiz.stopOnWrong ? "最大100" : quiz.problems.length}問</span><button id="quit-test" class="quit-test" type="button">テストをやめる</button></div>
    <div class="progress"><div style="width:${quiz.index / quiz.problems.length * 100}%"></div></div>
    <div class="question" aria-label="${problem.a} かける ${problem.b}">${problem.a} × ${problem.b}</div>
    <form id="answer-form" class="answer-row ${["choice", "self"].includes(quiz.answerMode) ? "answer-row-hidden" : ""}">
      <input id="answer" class="answer-input ${quiz.answerMode === "voice" ? "visually-hidden" : ""}" type="text" inputmode="none" autocomplete="off" aria-label="こたえ" readonly required>
      ${quiz.answerMode === "voice" ? `<button id="speak-answer" class="button secondary" type="button">${iconHtml("mic")} 声で<ruby>答<rt>こた</rt></ruby>える</button>` : ""}
      ${quiz.answerMode === "number" ? `<button class="button" type="submit"><ruby>答<rt>こた</rt></ruby>える</button>` : ""}
    </form>
    ${quiz.answerMode === "choice" ? `<div class="choice-grid" aria-label="4つの答え">${makeAnswerChoices(problem).map(answer => `<button class="choice-button" type="button" data-answer="${answer}">${answer}</button>`).join("")}</div>` : ""}
    ${quiz.answerMode === "self" ? `<div id="self-check-controls" class="self-check-controls"><p>頭の中や声に出して答えてから、答えを見てね。</p><button id="reveal-self-answer" class="button secondary" type="button">${iconHtml("eye")} <ruby>答<rt>こた</rt></ruby>えを見る</button></div>` : ""}
    ${quiz.answerMode === "number" ? `<div class="number-keypad" aria-label="数字ボタン">
      ${[1,2,3,4,5,6,7,8,9,0].map(number => `<button type="button" data-keypad-digit="${number}">${number}</button>`).join("")}
      <button id="erase-answer" class="erase-key" type="button">⌫ 1字消す</button>
    </div>` : ""}
    ${quiz.answerMode === "self" ? "" : `<div class="unknown-answer"><button id="unknown-answer" class="button light" type="button">わからない</button></div>`}
    <p id="speech-status" class="speech-status" aria-live="polite">${quiz.answerMode === "voice" ? "マイクを準備しています…" : ""}</p>
    <div id="feedback" class="feedback" aria-live="polite"></div>
  </section>`;
  if (positionQuizAtTop) {
    requestAnimationFrame(() => {
      const quizCard = app.querySelector(".quiz-card");
      const header = document.querySelector(".site-header");
      if (!quizCard) return;
      const top = quizCard.getBoundingClientRect().top + window.scrollY - (header?.offsetHeight || 0) - 14;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }
  app.querySelector("#quit-test").addEventListener("click", quitTest);
  app.querySelector("#unknown-answer")?.addEventListener("click", answerUnknown);
  app.querySelector("#answer-form").addEventListener("submit", answerQuestion);
  app.querySelector("#reveal-self-answer")?.addEventListener("click", revealSelfCheckAnswer);
  app.querySelectorAll("[data-keypad-digit]").forEach(button => button.addEventListener("click", () => enterAnswerDigit(button.dataset.keypadDigit)));
  app.querySelector("#erase-answer")?.addEventListener("click", eraseAnswerDigit);
  app.querySelector(".quiz-card").addEventListener("keydown", handlePhysicalNumberKey);
  if (quiz.answerMode === "voice") {
    setUpSpeechButton();
    startListening();
  } else if (quiz.answerMode === "choice") {
    app.querySelectorAll("[data-answer]").forEach(button => button.addEventListener("click", () => answerWithChoice(button.dataset.answer)));
    app.querySelector("[data-answer]").focus({ preventScroll: true });
  } else if (quiz.answerMode === "self") {
    app.querySelector("#reveal-self-answer").focus({ preventScroll: true });
  } else app.querySelector("#answer").focus({ preventScroll: true });
}

function enterAnswerDigit(digit) {
  const input = app.querySelector("#answer");
  if (!input || !quiz || quiz.answered) return;
  const nextValue = `${input.value}${digit}`;
  if (nextValue.length <= 3 && Number(nextValue) <= 100) input.value = nextValue;
}

function eraseAnswerDigit() {
  const input = app.querySelector("#answer");
  if (!input || !quiz || quiz.answered) return;
  input.value = input.value.slice(0, -1);
}

function handlePhysicalNumberKey(event) {
  if (!quiz || quiz.answered || quiz.answerMode !== "number") return;
  if (/^\d$/.test(event.key)) {
    event.preventDefault();
    enterAnswerDigit(event.key);
  } else if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
    eraseAnswerDigit();
  }
}

function quitTest() {
  if (!window.confirm("テストをやめますか？ 途中までの結果は記録されません。")) return;
  stopListening();
  clearTimeout(nextQuestionTimer);
  nextQuestionTimer = null;
  quiz = null;
  showPage("home");
}

function makeAnswerChoices(problem) {
  // ここは、正しいこたえと、まちがいのこたえを3つ作るところです。
  const correct = problem.a * problem.b;
  const choices = new Set([correct]);
  const nearby = [correct - problem.a, correct + problem.a, correct - problem.b, correct + problem.b, correct - 1, correct + 1]
    .filter(answer => answer >= 0 && answer <= 81)
    .sort(() => Math.random() - .5);
  nearby.forEach(answer => { if (choices.size < 4) choices.add(answer); });
  while (choices.size < 4) choices.add(Math.floor(Math.random() * 82));
  return [...choices].sort(() => Math.random() - .5);
}

function answerWithChoice(answer) {
  if (!quiz || quiz.answered) return;
  app.querySelector("#answer").value = answer;
  app.querySelector("#answer-form").requestSubmit();
}

function answerUnknown() {
  if (!quiz || quiz.answered) return;
  recordAnswer(false, "わからない");
}

function revealSelfCheckAnswer() {
  if (!quiz || quiz.answered || quiz.answerMode !== "self") return;
  const problem = quiz.problems[quiz.index];
  const controls = app.querySelector("#self-check-controls");
  if (!controls) return;
  controls.innerHTML = `<div class="self-check-answer">${problem.a} × ${problem.b} ＝ <strong>${problem.a * problem.b}</strong></div>
    <p>自分の答えと同じだったかな？</p>
    <div class="self-check-actions">
      <button class="button green" type="button" data-self-check="correct">できた</button>
      <button class="button light" type="button" data-self-check="retry">もう一度</button>
    </div>`;
  controls.querySelectorAll("[data-self-check]").forEach(button => button.addEventListener("click", () => {
    const isCorrect = button.dataset.selfCheck === "correct";
    recordAnswer(isCorrect, isCorrect ? problem.a * problem.b : "もう一度");
  }));
  controls.querySelector("[data-self-check]").focus();
}

function stopListening() {
  if (!speechRecognition) return;
  speechRecognition.onend = null;
  speechRecognition.abort();
  speechRecognition = null;
}

function spokenNumber(text) {
  // 「56」「５６」「五十六」のどれで聞き取っても数字にします。
  const normalized = text.replace(/[０-９]/g, char => String(char.charCodeAt(0) - 0xFEE0));
  const digits = normalized.match(/\d{1,3}/);
  if (digits) return Number(digits[0]);
  const values = { 零: 0, 〇: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  const kanji = normalized.replace(/[^零〇一二三四五六七八九十]/g, "");
  if (!kanji) return null;
  if (!kanji.includes("十")) return values[kanji] ?? null;
  const [tens, ones] = kanji.split("十");
  return (tens ? values[tens] : 1) * 10 + (ones ? values[ones] : 0);
}

function setUpSpeechButton() {
  const button = app.querySelector("#speak-answer");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    button.disabled = true;
    button.innerHTML = `${iconHtml("mic")} 声の回答は使えません`;
    return;
  }
  if (speechRecognition) {
    button.disabled = true;
    button.innerHTML = `${iconHtml("mic")} きいています…`;
    const status = app.querySelector("#speech-status");
    if (status) status.innerHTML = "<ruby>答<rt>こた</rt></ruby>えを数字で言ってね。";
    return;
  }
  button.addEventListener("click", startListening);
}

function startListening() {
  const button = app.querySelector("#speak-answer");
  const status = app.querySelector("#speech-status");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!button || !status || !SpeechRecognition || !quiz || quiz.answered || speechRecognition) return;

  const recognition = new SpeechRecognition();
  speechRecognition = recognition;
  recognition.lang = "ja-JP";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  // 音声モードでは、10問が終わるまでマイクを止めません。
  recognition.continuous = true;
  button.disabled = true;
  button.innerHTML = `${iconHtml("mic")} きいています…`;
  status.innerHTML = "<ruby>答<rt>こた</rt></ruby>えを数字で言ってね。";

  recognition.onresult = event => {
    if (!quiz || quiz.answered) return;
    const latestResult = event.results[event.results.length - 1];
    if (!latestResult.isFinal) return;
    const heard = latestResult[0].transcript;
    const number = spokenNumber(heard);
    const currentStatus = app.querySelector("#speech-status");
    if (number === null || number < 0 || number > 100) {
      if (currentStatus) currentStatus.textContent = `「${heard}」と聞こえました。もう一度ためしてね。`;
      return;
    }
    const input = app.querySelector("#answer");
    if (!input) return;
    input.value = number;
    if (currentStatus) currentStatus.textContent = `${number} と聞こえました。`;
    app.querySelector("#answer-form").requestSubmit();
  };
  recognition.onerror = event => {
    const currentStatus = app.querySelector("#speech-status");
    if (!currentStatus) return;
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      speechPermissionBlocked = true;
      currentStatus.textContent = "マイクを使えるようにしてから、もう一度おしてね。";
    } else if (event.error !== "aborted") {
      currentStatus.textContent = "うまく聞き取れませんでした。もう一度ためしてね。";
    }
  };
  recognition.onend = () => {
    speechRecognition = null;
    const currentButton = app.querySelector("#speak-answer");
    if (quiz?.answerMode === "voice" && !quiz.answered && currentButton && !speechPermissionBlocked) {
      currentButton.disabled = true;
      currentButton.innerHTML = `${iconHtml("mic")} きいています…`;
      const currentStatus = app.querySelector("#speech-status");
      if (currentStatus) currentStatus.textContent = "音声入力を続けています。数字で答えてね。";
      setTimeout(startListening, 250);
    } else if (!quiz?.answered && currentButton) {
      currentButton.disabled = true;
      currentButton.innerHTML = `${iconHtml("mic")} 音声入力を使えません`;
    }
  };
  recognition.start();
}

function answerQuestion(event) {
  event.preventDefault();
  if (quiz.answered) return;
  // 数字入力のときだけ停止します。音声モードではテスト終了まで使い続けます。
  if (quiz.answerMode !== "voice") stopListening();
  const answer = Number(app.querySelector("#answer").value);
  const problem = quiz.problems[quiz.index];
  recordAnswer(answer === problem.a * problem.b, answer);
}

function recordAnswer(isCorrect, answer) {
  if (!quiz || quiz.answered) return;
  quiz.answered = true;
  quiz.finishAfterAnswer = quiz.stopOnWrong && !isCorrect;
  const problem = quiz.problems[quiz.index];
  const oldStat = state.stats[problem.key] || { attempts: 0, wrong: 0, recentCorrect: 0 };
  const recentCorrect = isCorrect ? oldStat.recentCorrect + 1 : 0;
  const hasBeenWrong = oldStat.wrong > 0 || !isCorrect;
  const reviewInterval = hasBeenWrong ? (isCorrect ? reviewIntervalFor(recentCorrect) : 1) : 0;
  if (isCorrect) {
    quiz.correct++;
    if (oldStat.wrong > 0) quiz.recovered.push(problem);
  } else quiz.mistakes.push({ ...problem, answer });

  state.stats[problem.key] = {
    attempts: oldStat.attempts + 1,
    wrong: oldStat.wrong + (isCorrect ? 0 : 1),
    recentCorrect,
    lastAnswered: dayKey(new Date()),
    nextReview: hasBeenWrong ? dateAfterDays(reviewInterval) : null,
    reviewInterval
  };
  saveData();

  const feedback = app.querySelector("#feedback");
  feedback.className = `feedback ${isCorrect ? "correct" : "wrong"}`;
  feedback.innerHTML = isCorrect
    ? `${pictureHtml("friend", happyPicture())} ${PRAISES[Math.floor(Math.random() * PRAISES.length)]}`
    : `${pictureHtml("friend", CHARACTER_PICTURES.sad)} ${answer === "わからない" ? "大丈夫！" : "おしい！"} 正しい<ruby>答<rt>こた</rt></ruby>えは <strong>${problem.a * problem.b}</strong> だよ。`;
  const answerInput = app.querySelector("#answer");
  if (answerInput) answerInput.disabled = true;
  app.querySelectorAll("[data-answer]").forEach(button => button.disabled = true);
  app.querySelectorAll("[data-self-check]").forEach(button => button.disabled = true);
  app.querySelectorAll("[data-keypad-digit], #erase-answer").forEach(button => button.disabled = true);
  const unknownButton = app.querySelector("#unknown-answer");
  if (unknownButton) unknownButton.disabled = true;
  const submit = app.querySelector("#answer-form button[type='submit']");
  const finishesNow = quiz.finishAfterAnswer || quiz.index + 1 === quiz.problems.length;
  if (submit) {
    submit.textContent = finishesNow ? "結果へ…" : "次の問題へ…";
    submit.disabled = true;
  }

  if (state.settings.answerDelay === "manual") {
    feedback.insertAdjacentHTML("beforeend", `<div class="manual-next"><button id="manual-next" class="button">${finishesNow ? "<ruby>結果<rt>けっか</rt></ruby>を見る" : "次の問題"}</button></div>`);
    app.querySelector("#manual-next").addEventListener("click", nextQuestion);
    app.querySelector("#manual-next").focus();
  } else {
    // えらんだ時間だけ正解・不正解を見せてから、自動でつぎへ進みます。
    nextQuestionTimer = setTimeout(nextQuestion, Number(state.settings.answerDelay));
  }
}

function nextQuestion() {
  nextQuestionTimer = null;
  if (!quiz) return;
  quiz.index++;
  if (!quiz.finishAfterAnswer && quiz.index < quiz.problems.length) showQuestion();
  else finishQuiz();
}

function previousComparableResult() {
  return [...state.results].reverse().find(result => result.total === quiz.index);
}

function finishQuiz() {
  stopListening();
  const seconds = Math.max(1, Math.round((Date.now() - quiz.startedAt) / 1000));
  const previous = previousComparableResult();
  const result = {
    id: Date.now(),
    date: new Date().toISOString(),
    stage: Array.isArray(quiz.stage) ? `${quiz.stage.join("・")}の段` : quiz.stage,
    correct: quiz.correct,
    total: quiz.index,
    seconds,
    streakChallenge: quiz.stopOnWrong,
    scaledPractice: ["今日の復習", "苦手を練習", "間違い直し"].includes(quiz.stage),
    mistakes: quiz.mistakes.map(p => ({ a: p.a, b: p.b, answer: p.answer }))
  };
  result.gardenPoints = awardGardenPoints(result, previous, quiz.recovered);
  state.results.push(result);
  saveData();
  showResult(result, previous, quiz.recovered);
}

function effortMessages(result, previous, recovered) {
  const score = result.correct;
  const rate = score / result.total;
  const messages = [rate === 1 ? "パーフェクト！今日は全部正解できたね！" : rate >= .8 ? "すごい！あと少しでパーフェクト！" : rate >= .5 ? "よくがんばったね！間違えた問題をもう一度やってみよう！" : `今日も${result.total}問チャレンジできたね！少しずつ覚えていこう！`];
  if (previous && score > previous.correct) messages.push(`前回より${score - previous.correct}問多く正解できたよ！`);
  if (previous && result.seconds < previous.seconds) messages.push(`前回より${previous.seconds - result.seconds}秒はやくできたよ！`);
  if (recovered.length) messages.push(`前に<ruby>間違<rt>まちが</rt></ruby>えた${recovered[0].a}×${recovered[0].b}が今日はできたね！`);
  if (result.gardenPoints > 0) messages.push(`九九ガーデンに${result.gardenPoints}ポイントたまったよ！`);
  else messages.push("今日の<ruby>成長<rt>せいちょう</rt></ruby>ポイントは2回分たまっているよ。また明日お水をあげよう！");
  return messages;
}

function awardGardenPoints(result, previous, recovered) {
  // ここは、がんばった分だけ植物をそだてるところです。
  const day = dayKey(result.date);
  if (!state.garden.practiceDays.includes(day)) state.garden.practiceDays.push(day);
  const testsToday = state.results.filter(saved => dayKey(saved.date) === day).length;
  if (testsToday >= 2) return 0;
  const rate = result.correct / result.total;
  let earned = result.streakChallenge || result.scaledPractice ? Math.min(10, result.total) : 10;
  earned += rate === 1 ? 5 : rate >= .8 ? 3 : rate >= .6 ? 2 : 0;
  if (previous && previous.total === result.total && result.correct > previous.correct) earned += 2;
  earned += recovered.length;
  const oldStage = gardenStageIndex(state.garden.points - state.garden.cycleStartPoints);
  state.garden.points += earned;
  const newStage = gardenStageIndex(state.garden.points - state.garden.cycleStartPoints);
  const flower = flowerForCollectionIndex(state.garden.completedFlowers.length);
  const flowerType = flower.id;
  for (let stage = oldStage + 1; stage <= newStage; stage++) state.garden.growthLog.push({ date: result.date, stage, flowerType });
  const bloomStage = GARDEN_STAGES.findIndex(stage => stage.points >= 150);
  if (oldStage < bloomStage && newStage >= bloomStage) state.garden.pendingBloom = flowerType;
  return earned;
}

function showResult(result, previous, recovered) {
  const perfect = result.correct === result.total;
  const resultPicture = perfect ? CHARACTER_PICTURES.celebrate : result.correct / result.total >= .8 ? CHARACTER_PICTURES.smile : CHARACTER_PICTURES.support;
  app.innerHTML = `<section class="card result-card ${perfect ? "celebration" : ""}">
    ${perfect ? `<h1 class="perfect-title">${iconHtml("trophy", "title-icon")}<span>パーフェクト！</span></h1>` : "<h1 class=\"section-title\">テスト<ruby>結果<rt>けっか</rt></ruby></h1>"}
    <div class="score">${result.total}問中 ${result.correct}問正解</div>
    <p class="section-title">かかった時間：<strong>${result.seconds}秒</strong></p>
    <div class="result-message">${pictureHtml("friend", resultPicture)}<span>${effortMessages(result, previous, recovered).join("<br>")}</span></div>
    ${result.mistakes.length ? `<div class="mistakes"><h2>間違えた問題</h2><ul>${result.mistakes.map(p => `<li>${p.a} × ${p.b} ＝ ${p.a * p.b}（<ruby>答<rt>こた</rt></ruby>え：${p.answer}）</li>`).join("")}</ul></div>` : ""}
    <div class="actions">
      ${result.mistakes.length ? `<button id="retry" class="button green">間違えた問題だけもう一度</button>` : ""}
      <button id="again" class="button secondary">もう一度テストする</button>
      <button class="button light" data-page="home">ホームへ</button>
    </div>
  </section>`;
  app.querySelector("#again").addEventListener("click", () => showPage("test"));
  app.querySelector("#retry")?.addEventListener("click", () => startQuiz("retry", result.mistakes.map(p => ({ ...p, key: `${p.a}x${p.b}` }))));
}

function statRows() {
  return Object.entries(state.stats).map(([key, s]) => {
    const [a, b] = key.split("x").map(Number);
    return { a, b, ...s, correct: s.attempts - s.wrong, rate: Math.round((s.attempts - s.wrong) / s.attempts * 100) };
  });
}

function weakestProblem() {
  return statRows().filter(s => s.wrong > 0 && s.rate < 80).sort((x, y) => x.rate - y.rate || y.wrong - x.wrong)[0];
}

function showWeak() {
  const allRows = statRows();
  const today = dayKey(new Date());
  const reviewRows = allRows
    .filter(row => row.wrong > 0 && row.nextReview && row.nextReview <= today)
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview) || a.rate - b.rate)
    .slice(0, 10);
  const rows = allRows.filter(s => s.wrong > 0 && s.rate < 80).sort((x, y) => x.rate - y.rate || y.wrong - x.wrong);
  const recoveryCandidate = rows
    .slice(1)
    .filter(row => row.recentCorrect >= 2)
    .sort((a, b) => b.recentCorrect - a.recentCorrect || b.rate - a.rate)[0];
  app.innerHTML = `<section class="card">
    <h1><ruby>苦手<rt>にがて</rt></ruby>な九九</h1>
    <div class="character-guide">${pictureHtml("guide-character", CHARACTER_PICTURES.thinking)}<span>正解率が<ruby>低<rt>ひく</rt></ruby>い<ruby>順<rt>じゅん</rt></ruby>に<ruby>並<rt>なら</rt></ruby>んでいるよ。一番上の問題から<ruby>練習<rt>れんしゅう</rt></ruby>しよう！</span></div>
    <div class="practice-mode">
      <strong><ruby>答<rt>こた</rt></ruby>え方</strong>
      <div class="compact-mode" aria-label="答え方">
        <button class="mode-button ${selectedAnswerMode === "number" ? "selected" : ""}" type="button" data-weak-mode="number">${iconHtml("keyboard")} 数字で入力</button>
        <button class="mode-button ${selectedAnswerMode === "voice" ? "selected" : ""}" type="button" data-weak-mode="voice">${iconHtml("mic")} 声で<ruby>答<rt>こた</rt></ruby>える</button>
        <button class="mode-button ${selectedAnswerMode === "choice" ? "selected" : ""}" type="button" data-weak-mode="choice">${iconHtml("grid")} 4たく</button>
      </div>
    </div>
    <div class="practice-choice-grid">
      ${reviewRows.length ? `<button class="practice-choice-button review" type="button" data-practice="review" aria-pressed="false"><strong>${iconHtml("calendar")} 今日の<ruby>復習<rt>ふくしゅう</rt></ruby>　${reviewRows.length}問</strong><small>復習日になった問題</small></button>` : `<div class="practice-choice-unavailable review"><strong>${iconHtml("calendar")} 今日の復習</strong><small>今日はありません</small></div>`}
      ${rows.length ? `<button class="practice-choice-button weak" type="button" data-practice="weak" aria-pressed="false"><strong>${iconHtml("target")} <ruby>苦手<rt>にがて</rt></ruby>を練習　${Math.min(10, rows.length)}問</strong><small>正答率80％未満の問題</small></button>` : `<div class="practice-choice-unavailable weak"><strong>${iconHtml("target")} 苦手を練習</strong><small>苦手な問題はありません</small></div>`}
    </div>
    <div class="actions practice-start"><button id="start-practice" class="button green" type="button" disabled><img class="start-button-character" src="${CHARACTER_PICTURES.support}" alt=""><span id="practice-start-label">練習をスタート</span></button></div>
    ${rows.length ? `<p class="weak-list-note">正答率が80％以上になると、苦手を克服した問題としてこの一覧から外れるよ。</p>
    <p class="weak-icon-guide">${iconHtml("target", "rank-icon")} いちばん苦手${recoveryCandidate ? `　${iconHtml("sprout", "recovery-icon")} 苦手克服までもう少し` : ""}</p>
    <div class="weak-table-scroll"><table class="data-table weak-table"><thead><tr><th>問題</th><th>出た回数</th><th>正解</th><th>間違い</th><th>正解率</th><th>次の復習</th></tr></thead><tbody>
      ${rows.map((s, i) => {
        const recovering = recoveryCandidate && s.a === recoveryCandidate.a && s.b === recoveryCandidate.b;
        const marker = i === 0
          ? `<span class="visually-hidden">いちばん苦手：</span>${iconHtml("target", "rank-icon")}`
          : recovering ? `<span class="visually-hidden">苦手克服までもう少し：</span>${iconHtml("sprout", "recovery-icon")}` : "";
        return `<tr class="${i === 0 ? "worst" : recovering ? "recovering" : ""}"><td>${marker}${s.a}×${s.b}</td><td>${s.attempts}回</td><td>${s.correct}回</td><td>${s.wrong}回</td><td>${s.rate}%</td><td>${reviewDateLabel(s.nextReview)}</td></tr>`;
      }).join("")}
    </tbody></table></div>` : `<div class="empty">まだ、<ruby>苦手<rt>にがて</rt></ruby>な問題はないよ。<br>テストをすると、ここに<ruby>記録<rt>きろく</rt></ruby>が出るよ。</div>`}
  </section>`;
  app.querySelectorAll("[data-weak-mode]").forEach(button => button.addEventListener("click", () => {
    selectedAnswerMode = button.dataset.weakMode;
      app.querySelectorAll("[data-weak-mode]").forEach(item => item.classList.toggle("selected", item === button));
  }));
  let selectedPractice = null;
  const practiceStart = app.querySelector("#start-practice");
  app.querySelectorAll("[data-practice]").forEach(button => button.addEventListener("click", () => {
    selectedPractice = button.dataset.practice;
    app.querySelectorAll("[data-practice]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    practiceStart.disabled = false;
    app.querySelector("#practice-start-label").textContent = selectedPractice === "review" ? "復習をスタート" : "苦手練習をスタート";
  }));
  practiceStart.addEventListener("click", () => {
    if (selectedPractice === "review") {
      const problems = reviewRows.map(row => ({ a: row.a, b: row.b, key: `${row.a}x${row.b}` }));
      startQuiz("review", problems);
    } else if (selectedPractice === "weak") {
      const problems = rows.slice(0, 10).map(row => ({ a: row.a, b: row.b, key: `${row.a}x${row.b}` }));
      startQuiz("weak", problems);
    }
  });
}

function dayKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function sevenDayAverages() {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - 6);
  const byDay = new Map();
  state.results.forEach(result => {
    if (new Date(result.date) < cutoff) return;
    const key = dayKey(result.date);
    const day = byDay.get(key) || { date: result.date, tests: 0, accuracyTotal: 0, secondsPerQuestionTotal: 0 };
    day.tests++;
    day.accuracyTotal += result.correct / result.total * 100;
    day.secondsPerQuestionTotal += result.seconds / result.total;
    byDay.set(key, day);
  });
  return [...byDay.values()].map(day => ({
    date: day.date,
    tests: day.tests,
    accuracy: Math.round(day.accuracyTotal / day.tests),
    secondsPerQuestion: day.secondsPerQuestionTotal / day.tests
  })).sort((a, b) => new Date(a.date) - new Date(b.date));
}

function chartSvg(data, field, max, time = false) {
  if (!data.length) return `<div class="empty">テストをするとグラフが出るよ。</div>`;
  const width = 440, height = 230, left = 38, right = 16, top = 18, bottom = 38;
  const label = value => Number.isInteger(value) ? value : Math.round(value * 10) / 10;
  const x = i => left + (data.length === 1 ? (width-left-right)/2 : i * (width-left-right)/(data.length-1));
  const y = value => top + (max - value) * (height-top-bottom)/max;
  const points = data.map((r, i) => `${x(i)},${y(r[field])}`).join(" ");
  return `<svg class="chart ${time ? "time" : ""}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${time ? "時間" : "正解数"}のグラフ">
    ${[0,.25,.5,.75,1].map(p => `<line class="grid" x1="${left}" y1="${top+(height-top-bottom)*p}" x2="${width-right}" y2="${top+(height-top-bottom)*p}"/><text x="4" y="${top+(height-top-bottom)*p+4}">${Math.round(max*(1-p))}</text>`).join("")}
    <polyline class="line" points="${points}"/>
    ${data.map((r,i) => `<circle class="dot" cx="${x(i)}" cy="${y(r[field])}" r="6"/><text text-anchor="middle" x="${x(i)}" y="${Math.max(13,y(r[field])-10)}">${label(r[field])}</text><text text-anchor="middle" x="${x(i)}" y="${height-10}">${new Date(r.date).getMonth()+1}/${new Date(r.date).getDate()}</text>`).join("")}
  </svg>`;
}

function trendMessages(data) {
  if (data.length < 2) return ["2日分の<ruby>記録<rt>きろく</rt></ruby>ができると、前と<ruby>比<rt>くら</rt></ruby>べられるよ！"];
  const first = data[0], last = data.at(-1);
  const scoreDiff = last.accuracy - first.accuracy;
  const timeDiff = Math.round((first.secondsPerQuestion - last.secondsPerQuestion) * 10) / 10;
  return [scoreDiff > 0 ? `${data.length === 7 ? "7日前" : "最初の日"}と<ruby>比<rt>くら</rt></ruby>べて正答率が${scoreDiff}ポイントアップ！` : scoreDiff === 0 ? "正答率をキープしているよ！" : "<ruby>間違<rt>まちが</rt></ruby>えた問題をもう一度やってみよう！", timeDiff > 0 ? `1問あたり${timeDiff}秒早くなったよ！` : timeDiff === 0 ? "同じペースでできたよ！" : "あせらず、正しく答えることから始めよう！"];
}

function formatDate(date, withTime = false) {
  const d = new Date(date);
  return `${d.getMonth()+1}/${d.getDate()}${withTime ? ` ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}` : ""}`;
}

function recordMonth(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month) {
  const [year, number] = month.split("-");
  return `${year}年${Number(number)}月`;
}

function monthlyAverages(results) {
  const groups = new Map();
  results.forEach(result => {
    const key = recordMonth(result.date);
    const group = groups.get(key) || { month: key, tests: 0, score: 0, seconds: 0 };
    group.tests++;
    group.score += result.correct / result.total * 100;
    group.seconds += result.seconds / result.total;
    groups.set(key, group);
  });
  return [...groups.values()].sort((a, b) => b.month.localeCompare(a.month)).slice(0, 12);
}

function showRecords() {
  const recent = sevenDayAverages();
  const best = state.results.length ? Math.max(...state.results.map(r => Math.round(r.correct / r.total * 100))) + "%" : "―";
  const fastest = state.results.length ? Math.min(...state.results.map(r => r.seconds / r.total)).toFixed(1) + "秒" : "―";
  const total = state.results.reduce((sum, r) => sum + r.total, 0);
  const weak = weakestProblem();
  const orderedResults = [...state.results].reverse();
  const months = [...new Set(orderedResults.map(result => recordMonth(result.date)))].sort().reverse();
  let visibleResults = recordsView.month === "all" ? orderedResults : orderedResults.filter(result => recordMonth(result.date) === recordsView.month);
  if (recordsView.range === "30") visibleResults = visibleResults.slice(0, 30);
  const pageSize = 20;
  const pageCount = Math.max(1, Math.ceil(visibleResults.length / pageSize));
  recordsView.page = Math.min(recordsView.page, pageCount);
  const pageResults = visibleResults.slice((recordsView.page - 1) * pageSize, recordsView.page * pageSize);
  const averages = monthlyAverages(state.results);
  app.innerHTML = `<section class="card records-page">
    <h1><ruby>記録<rt>きろく</rt></ruby></h1>
    <div class="character-guide records-guide">${pictureHtml("guide-character", CHARACTER_PICTURES.smile)}<span>がんばった<ruby>記録<rt>きろく</rt></ruby>を、いっしょに見てみよう！</span></div>
    <div class="summary-grid">
      <div class="summary-box">最高正答率<strong>${best}</strong></div>
      <div class="summary-box">1問の最短時間<strong>${fastest}</strong></div>
      <div class="summary-box"><ruby>解<rt>と</rt></ruby>いた問題<strong>${total}問</strong></div>
      <div class="summary-box">一番<ruby>苦手<rt>にがて</rt></ruby><strong>${weak ? `${weak.a}×${weak.b}` : "なし"}</strong></div>
    </div>
    <h2>直近7日間のグラフ</h2>
    <div class="chart-grid">
      <div class="chart-card"><h3>正答率（%）</h3>${chartSvg(recent, "accuracy", 100)}</div>
      <div class="chart-card"><h3>1問あたりの時間（秒）</h3>${chartSvg(recent, "secondsPerQuestion", Math.max(10, ...recent.map(r => r.secondsPerQuestion)), true)}</div>
    </div>
    <div class="result-message">${pictureHtml("friend", CHARACTER_PICTURES.smile)}<span>${trendMessages(recent).join("<br>")}</span></div>
    <div class="actions"><button class="button green" data-page="research">7日間のまとめを見る</button></div>
    <h2>月ごとの平均</h2>
    ${averages.length ? `<div class="monthly-grid">${averages.map(item => `<div class="monthly-card"><strong>${monthLabel(item.month)}</strong><span>${item.tests}回テスト</span><span>平均正答率 ${Math.round(item.score / item.tests * 10) / 10}%</span><span>1問平均 ${Math.round(item.seconds / item.tests * 10) / 10}秒</span></div>`).join("")}</div>` : `<div class="empty">テストをすると月ごとの平均が出るよ。</div>`}
    <h2>今までの<ruby>結果<rt>けっか</rt></ruby></h2>
    ${state.results.length ? `<div class="record-tools">
      <label>表示する月<select id="record-month"><option value="all">すべての月</option>${months.map(month => `<option value="${month}" ${recordsView.month === month ? "selected" : ""}>${monthLabel(month)}</option>`).join("")}</select></label>
      <label>表示する件数<select id="record-range"><option value="30" ${recordsView.range === "30" ? "selected" : ""}>直近30件</option><option value="all" ${recordsView.range === "all" ? "selected" : ""}>すべて</option></select></label>
      <button id="download-records" class="button secondary">CSVで保存</button>
    </div>
    ${pageResults.length ? `<div class="records-table-scroll" tabindex="0" aria-label="今までの結果（スクロールできます）"><table class="data-table"><thead><tr><th>日付</th><th>段</th><th><ruby>結果<rt>けっか</rt></ruby></th><th>正答率</th><th>時間</th><th>間違い</th></tr></thead><tbody>${pageResults.map(r => `<tr><td data-label="日付">${formatDate(r.date,true)}</td><td data-label="段">${r.stage === "random" ? "ランダム" : r.stage}</td><td data-label="結果">${r.total}問中${r.correct}問</td><td data-label="正答率">${Math.round(r.correct/r.total*100)}%</td><td data-label="時間">${r.seconds}秒</td><td data-label="間違い">${r.mistakes.length ? r.mistakes.map(p => `${p.a}×${p.b}`).join("、") : "なし"}</td></tr>`).join("")}</tbody></table></div>` : `<div class="empty">この月の<ruby>記録<rt>きろく</rt></ruby>はありません。</div>`}
    ${pageCount > 1 ? `<div class="pagination"><button id="previous-records" class="button light" ${recordsView.page === 1 ? "disabled" : ""}>前へ</button><strong>${recordsView.page} / ${pageCount}ページ</strong><button id="next-records" class="button light" ${recordsView.page === pageCount ? "disabled" : ""}>次へ</button></div>` : ""}` : `<div class="empty">まだ<ruby>記録<rt>きろく</rt></ruby>がないよ。まずはテストしてみよう！</div>`}
    <h2>全データのバックアップ</h2>
    <div class="backup-tools">
      <p>テスト記録・苦手な九九・設定・九九ガーデンをファイルに保存できます。</p>
      <div class="actions">
        <button id="backup-all-data" class="button secondary" type="button">全データを保存</button>
        <button id="restore-all-data" class="button light" type="button">バックアップを読み込む</button>
        <input id="backup-file" class="visually-hidden" type="file" accept="application/json,.json">
      </div>
    </div>
    ${state.results.length || Object.keys(state.stats).length ? `<div class="clear-records"><p>初めからやり直したいときに使います。</p><button id="clear-records" class="button danger">すべての<ruby>記録<rt>きろく</rt></ruby>を消す</button></div>` : ""}
  </section>`;
  app.querySelector("#record-month")?.addEventListener("change", event => {
    recordsView.month = event.target.value;
    recordsView.page = 1;
    showRecords();
  });
  app.querySelector("#record-range")?.addEventListener("change", event => {
    recordsView.range = event.target.value;
    recordsView.page = 1;
    showRecords();
  });
  app.querySelector("#previous-records")?.addEventListener("click", () => { recordsView.page--; showRecords(); });
  app.querySelector("#next-records")?.addEventListener("click", () => { recordsView.page++; showRecords(); });
  app.querySelector("#download-records")?.addEventListener("click", downloadRecordsCsv);
  app.querySelector("#backup-all-data").addEventListener("click", downloadFullBackup);
  app.querySelector("#restore-all-data").addEventListener("click", () => app.querySelector("#backup-file").click());
  app.querySelector("#backup-file").addEventListener("change", restoreFullBackup);
  app.querySelector("#clear-records")?.addEventListener("click", showClearRecordsWarning);
}

function downloadRecordsCsv() {
  // ここは、自由研究で使える表をファイルにするところです。
  const rows = [["日付", "練習した段", "正解数", "問題数", "正答率", "時間（秒）", "間違えた問題"]];
  state.results.forEach(result => rows.push([
    new Date(result.date).toLocaleString("ja-JP"), result.stage, result.correct, result.total,
    `${Math.round(result.correct / result.total * 100)}%`, result.seconds,
    result.mistakes.map(problem => `${problem.a}×${problem.b}`).join("、") || "なし"
  ]));
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `九九テストきろく-${dayKey(new Date())}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadFullBackup() {
  const backup = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: state
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `くくっと-全データ-${dayKey(new Date())}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function validBackupDate(value) {
  return typeof value === "string" && value.length <= 40 && !Number.isNaN(new Date(value).getTime());
}

function validateBackupData(backup) {
  if (!backup || backup.format !== BACKUP_FORMAT || backup.version !== BACKUP_VERSION || !backup.data) throw new Error("このアプリのバックアップファイルではありません。");
  const data = backup.data;
  if (!data.stats || typeof data.stats !== "object" || Array.isArray(data.stats) || !Array.isArray(data.results) || !data.garden || typeof data.garden !== "object" || !data.settings || typeof data.settings !== "object") throw new Error("バックアップの内容が不足しています。");
  const validNumber = value => Number.isFinite(value) && value >= 0;
  const validStage = value => (Number.isInteger(value) && value >= 2 && value <= 9) || (typeof value === "string" && value.length <= 30 && !/[<>&"']/.test(value));
  const validMistake = mistake => mistake && Number.isInteger(mistake.a) && mistake.a >= 2 && mistake.a <= 9 && Number.isInteger(mistake.b) && mistake.b >= 1 && mistake.b <= 9 && (mistake.answer === "わからない" || validNumber(mistake.answer));
  if (!data.results.every(result => result && validBackupDate(result.date) && validStage(result.stage) && validNumber(result.correct) && validNumber(result.total) && result.correct <= result.total && validNumber(result.seconds) && Array.isArray(result.mistakes) && result.mistakes.every(validMistake))) throw new Error("テスト記録の形式を確認できませんでした。");
  const validDay = value => value == null || /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (!Object.entries(data.stats).every(([key, stat]) => /^[2-9]x[1-9]$/.test(key) && stat && validNumber(stat.attempts) && validNumber(stat.wrong) && stat.wrong <= stat.attempts && validNumber(stat.recentCorrect || 0) && validDay(stat.lastAnswered) && validDay(stat.nextReview))) throw new Error("苦手な九九の形式を確認できませんでした。");
  const flowerIds = new Set(GARDEN_FLOWERS.map(flower => flower.id));
  const garden = data.garden;
  if (!validNumber(garden.points) || !validNumber(garden.cycleStartPoints || 0) || !Array.isArray(garden.completedFlowers) || !garden.completedFlowers.every(flower => flower && validBackupDate(flower.date) && flowerIds.has(flower.flowerType)) || !Array.isArray(garden.practiceDays) || !garden.practiceDays.every(day => validDay(day)) || !Array.isArray(garden.growthLog)) throw new Error("九九ガーデンの形式を確認できませんでした。");
  if (garden.pendingBloom != null && !flowerIds.has(garden.pendingBloom)) throw new Error("花のデータを確認できませんでした。");
  if (!["500", "1000", "2000", "manual"].includes(data.settings.answerDelay) || !["10", "20", "30", "until-wrong"].includes(data.settings.questionCount)) throw new Error("設定の形式を確認できませんでした。");
  return JSON.parse(JSON.stringify(data));
}

async function restoreFullBackup(event) {
  const input = event.currentTarget;
  const file = input.files?.[0];
  if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error("ファイルが大きすぎます。");
    const restoredState = validateBackupData(JSON.parse(await file.text()));
    if (!window.confirm("現在の全データを、選んだバックアップの内容で置き換えますか？")) return;
    state = restoredState;
    saveData();
    recordsView = { range: "30", month: "all", page: 1 };
    window.alert("全データを復元しました。");
    showPage("records");
  } catch (error) {
    window.alert(`バックアップを読み込めませんでした。\n${error.message}`);
  } finally {
    input.value = "";
  }
}

function showClearRecordsWarning() {
  // まちがえて消さないように、注意の画面を1枚はさみます。
  app.innerHTML = `<section class="card delete-warning">
    <div class="warning-characters">${pictureHtml("warning-character", CHARACTER_PICTURES.thinking)}<span class="warning-icon">${iconHtml("warning")}</span></div>
    <h1><ruby>記録<rt>きろく</rt></ruby>を消しますか？</h1>
    <p class="warning-lead">消した<ruby>記録<rt>きろく</rt></ruby>は、後から元に<ruby>戻<rt>もど</rt></ruby>せません。</p>
    <div class="warning-list">
      <h2>消えるもの</h2>
      <ul>
        <li>今までのテスト結果</li>
        <li><ruby>苦手<rt>にがて</rt></ruby>な九九の<ruby>記録<rt>きろく</rt></ruby></li>
        <li>九九ガーデンの<ruby>成長<rt>せいちょう</rt></ruby></li>
        <li>お花コレクション</li>
      </ul>
    </div>
    <p><strong><ruby>残<rt>のこ</rt></ruby>しておきたい<ruby>場合<rt>ばあい</rt></ruby>は「<ruby>記録<rt>きろく</rt></ruby>に<ruby>戻<rt>もど</rt></ruby>る」を<ruby>押<rt>お</rt></ruby>してね。</strong></p>
    <div class="actions">
      <button class="button light" data-page="records"><ruby>記録<rt>きろく</rt></ruby>に<ruby>戻<rt>もど</rt></ruby>る</button>
      <button id="confirm-clear-records" class="button danger">本当にすべて消す</button>
    </div>
  </section>`;
  app.querySelector("#confirm-clear-records").addEventListener("click", clearAllRecords);
  showPageFromTop();
}

function clearAllRecords() {
  const settings = state.settings;
  state = { stats: {}, results: [], garden: emptyGarden(), settings };
  recordsView = { range: "30", month: "all", page: 1 };
  localStorage.removeItem(STORAGE_KEY);
  showPage("records");
}

function showGarden(showCollectionPreview = false) {
  const garden = gardenStatus();
  const pendingFlower = GARDEN_FLOWERS.find(flower => flower.id === state.garden.pendingBloom);
  const displayedGardenStage = pendingFlower && garden.current.points >= 150 ? GARDEN_STAGES.find(stage => stage.points === 110) : garden.current;
  const practicedToday = state.garden.practiceDays.includes(dayKey(new Date()));
  const previewFlowers = Array.from({ length: 10 }, (_, index) => ({
    date: new Date(Date.now() - (9 - index) * 7 * 24 * 60 * 60 * 1000).toISOString(),
    points: 200 + index * 3,
    flowerType: flowerForCollectionIndex(index).id
  }));
  const collectionFlowers = showCollectionPreview ? previewFlowers : state.garden.completedFlowers;
  app.innerHTML = `<section class="card garden-page">
    <h1>九九ガーデン</h1>
    ${pendingFlower ? `<button id="open-flower-gift" class="flower-gift-notice" type="button">
      ${pictureHtml("gift-guide-character", CHARACTER_PICTURES.celebrate)}
      <span class="gift-message"><strong>花が育ちました。</strong><small>プレゼントボックスを押してね！</small></span>
      <span class="gift-box" aria-hidden="true">${iconHtml("gift")}</span>
    </button>` : ""}
    <div class="garden-stage">
      <div class="garden-scene">${gardenPicture(displayedGardenStage, "garden-picture-large", garden.flower)}</div>
      <div>
        <p class="garden-kicker">今の<ruby>成長<rt>せいちょう</rt></ruby></p>
        <h2>${garden.current.name}</h2>
        <p class="flower-surprise">${pendingFlower ? "プレゼントを開けるまでのお楽しみ！" : garden.current.points >= 150 ? `さいた花：${garden.flower.name}` : "どんな花がさくかは、お楽しみ！"}</p>
        <p><strong>${garden.cyclePoints}ポイント</strong>・<ruby>練習<rt>れんしゅう</rt></ruby>した日 ${state.garden.practiceDays.length}日</p>
        <p>今までの合計 ${state.garden.points}ポイント・完成した花 ${state.garden.completedFlowers.length}こ</p>
        <div class="garden-progress large"><span style="width:${garden.progress}%"></span></div>
        <p>${garden.next ? `あと${garden.next.points - garden.cyclePoints}ポイントで「${garden.next.name}」になるよ！` : "おめでとう！特別な花まで育ったよ！"}</p>
      </div>
    </div>
    <div class="garden-penguin-message garden-today">${pictureHtml("garden-guide-character", CHARACTER_PICTURES.support)}<span>${iconHtml("droplet")} ${practicedToday ? "今日のお水はあげられたよ！" : "今日はまだお水をあげていないよ。テストにチャレンジしよう！"}</span></div>
    <h2>どうしたら育つの？</h2>
    <div class="point-rules">
      <div><strong>＋10</strong><span><ruby>通常<rt>つうじょう</rt></ruby>テストを<ruby>最後<rt>さいご</rt></ruby>まで</span></div>
      <div><strong>＋1〜10</strong><span><ruby>連続正解<rt>れんぞくせいかい</rt></ruby>・<ruby>復習<rt>ふくしゅう</rt></ruby></span></div>
      <div><strong>＋2〜5</strong><span><ruby>正答率<rt>せいとうりつ</rt></ruby>60%以上</span></div>
      <div><strong>＋2</strong><span>前回よりアップ</span></div>
      <div><strong>＋1</strong><span><ruby>苦手<rt>にがて</rt></ruby>を1問<ruby>克服<rt>こくふく</rt></ruby></span></div>
    </div>
    <p class="garden-plain-note garden-note">ポイントがもらえるのは1日2回まで。お休みしても植物はかれないよ。<ruby>続<rt>つづ</rt></ruby>きからまた育てよう！</p>
    <h2>お花コレクション</h2>
    ${showCollectionPreview ? `<p class="collection-preview-note">これは10この花がたまったときの見本です。5こ目ごとにレア花が登場します。<ruby>実際<rt>じっさい</rt></ruby>の<ruby>記録<rt>きろく</rt></ruby>には入りません。</p>` : ""}
    ${collectionFlowers.length ? `<div class="flower-collection">${collectionFlowers.map((flower, index) => {
      const flowerKind = GARDEN_FLOWERS.find(kind => kind.id === flower.flowerType) || flowerForCollectionIndex(index);
      return `<article class="flower-card ${flowerKind.rarity === "rare" ? "rare" : ""}">
      ${flowerKind.rarity === "rare" ? `<span class="rare-badge">★ レア</span>` : ""}
      ${gardenPicture(GARDEN_STAGES.at(-1), "flower-picture", flowerKind)}
      <strong>${formatDate(flower.date)}に完成</strong>
      <small>${flowerKind.name}</small>
    </article>`;
    }).join("")}</div>` : `<div class="garden-penguin-message collection-empty">${pictureHtml("garden-guide-character", CHARACTER_PICTURES.support)}<span>最初の花を育てて、ここにかざろう！</span></div>`}
    <div class="collection-preview-action"><button id="toggle-collection-preview" class="button secondary" type="button">${showCollectionPreview ? "見本を閉じる" : "花がたまった見本を見る"}</button></div>
    <div class="actions">${garden.next ? "" : `<button id="plant-new-seed" class="button green">${iconHtml("sprout")} 新しい種を<ruby>植<rt>う</rt></ruby>える</button>`}<button class="button" data-page="test">テストをしてお水をあげる</button><button class="button light" data-page="home">ホームに<ruby>戻<rt>もど</rt></ruby>る</button></div>
  </section>`;
  app.querySelector("#plant-new-seed")?.addEventListener("click", plantNewSeed);
  app.querySelector("#toggle-collection-preview").addEventListener("click", () => showGarden(!showCollectionPreview));
  app.querySelector("#open-flower-gift")?.addEventListener("click", () => revealGardenFlower(pendingFlower));
}

function revealGardenFlower(flower) {
  if (!flower) return;
  const garden = gardenStatus();
  const alreadyCollected = state.garden.completedFlowers.some(savedFlower => savedFlower.cycleStartPoints === state.garden.cycleStartPoints);
  if (!alreadyCollected) {
    state.garden.completedFlowers.push({
      date: new Date().toISOString(),
      points: garden.cyclePoints,
      stage: garden.index,
      flowerType: flower.id,
      cycleStartPoints: state.garden.cycleStartPoints
    });
  }
  state.garden.pendingBloom = null;
  saveData();
  app.insertAdjacentHTML("beforeend", `<div class="flower-bloom-overlay" role="dialog" aria-modal="true" aria-labelledby="flower-bloom-title">
    <div class="flower-bloom-popup ${flower.rarity === "rare" ? "rare" : ""}">
      <p class="flower-bloom-kicker">${flower.rarity === "rare" ? "★ レアな花！" : "お花がさいたよ！"}</p>
      <span class="bloom-sparkles" aria-hidden="true">✦　✧　✦</span>
      <img src="${flower.image}" alt="${flower.name}" class="flower-bloom-picture">
      <h2 id="flower-bloom-title">${flower.name}</h2>
      <p>毎日のがんばりで、きれいな花がさきました！</p>
      <button id="close-flower-bloom" class="button green" type="button">ガーデンを見る</button>
    </div>
  </div>`);
  const overlay = app.querySelector(".flower-bloom-overlay");
  const closeBloomWithEscape = event => { if (event.key === "Escape") closeBloom(); };
  const closeBloom = () => {
    overlay.remove();
    document.removeEventListener("keydown", closeBloomWithEscape);
    showGarden();
  };
  app.querySelector("#close-flower-bloom").addEventListener("click", closeBloom);
  document.addEventListener("keydown", closeBloomWithEscape);
  app.querySelector("#close-flower-bloom").focus({ preventScroll: true });
}

function plantNewSeed() {
  const garden = gardenStatus();
  if (garden.next) return;
  // 完成した花は、新しいたねに戻ってもコレクションに残します。
  const alreadyCollected = state.garden.completedFlowers.some(flower => flower.cycleStartPoints === state.garden.cycleStartPoints);
  if (!alreadyCollected) state.garden.completedFlowers.push({ date: new Date().toISOString(), points: garden.cyclePoints, stage: garden.index, flowerType: garden.flower.id, cycleStartPoints: state.garden.cycleStartPoints });
  state.garden.cycleStartPoints = state.garden.points;
  state.garden.growthLog.push({ date: new Date().toISOString(), stage: 0 });
  saveData();
  showGarden();
}

function showResearch() {
  const data = sevenDayAverages();
  const first = data[0], latest = data.at(-1);
  const weak = weakestProblem();
  const improved = statRows().filter(s => s.wrong > 0 && s.recentCorrect >= 2).sort((a,b) => b.recentCorrect-a.recentCorrect)[0];
  app.innerHTML = `<section class="card">
    <h1>7日間のまとめ</h1>
    <div class="character-guide">${pictureHtml("guide-character", CHARACTER_PICTURES.smile)}<span>どのくらい上手になったか見てみよう！</span></div>
    ${data.length ? `<div class="chart-grid"><div class="chart-card"><h3>正答率の<ruby>変化<rt>へんか</rt></ruby></h3>${chartSvg(data,"accuracy",100)}</div><div class="chart-card"><h3>1問あたりの時間</h3>${chartSvg(data,"secondsPerQuestion",Math.max(10,...data.map(r=>r.secondsPerQuestion)),true)}</div></div>
    <div class="research-grid">
      <div class="research-item"><strong>最初の日（${formatDate(first.date)}）</strong><br>平均正答率 ${first.accuracy}%・1問平均 ${Math.round(first.secondsPerQuestion * 10) / 10}秒</div>
      <div class="research-item"><strong>一番新しい日（${formatDate(latest.date)}）</strong><br>平均正答率 ${latest.accuracy}%・1問平均 ${Math.round(latest.secondsPerQuestion * 10) / 10}秒</div>
      <div class="research-item"><strong>一番<ruby>苦手<rt>にがて</rt></ruby>な問題</strong><br>${weak ? `${weak.a}×${weak.b}（正解率${weak.rate}%）` : "まだありません"}</div>
      <div class="research-item"><strong>できるようになった問題</strong><br>${improved ? `${improved.a}×${improved.b}（さいきん${improved.recentCorrect}回れんぞく正解）` : "これから見つけよう！"}</div>
    </div>
    <div class="result-message">${pictureHtml("friend", CHARACTER_PICTURES.smile)}<span>${trendMessages(data).join("<br>")}</span></div>` : `<div class="empty">まだ7日間のまとめはないよ。<br>テストをすると、ここに<ruby>結果<rt>けっか</rt></ruby>が出るよ。</div>`}
    <div class="actions"><button class="button light" data-page="records"><ruby>記録<rt>きろく</rt></ruby>に<ruby>戻<rt>もど</rt></ruby>る</button></div>
  </section>`;
}

showPage("home");

const installPrompt = document.querySelector("#install-prompt");
const installButton = document.querySelector("#install-app");
const installTitle = document.querySelector("#install-prompt-title");
const installMessage = document.querySelector("#install-prompt-message");
let deferredInstallPrompt = null;

const isiPhoneOrIPad = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const isAndroid = /Android/i.test(navigator.userAgent);

function runningAsInstalledApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function hideInstallPrompt() {
  installPrompt.hidden = true;
}

window.addEventListener("beforeinstallprompt", event => {
  if (runningAsInstalledApp()) return;
  event.preventDefault();
  deferredInstallPrompt = event;
  installTitle.textContent = isAndroid ? "スマホにアプリを入れますか？" : "パソコンにアプリを入れますか？";
  installMessage.textContent = isAndroid
    ? "ホーム画面から、くくっと！をすぐに開けるようになります。"
    : "デスクトップやアプリ一覧から、くくっと！をすぐに開けるようになります。";
  installButton.textContent = isAndroid ? "インストールする" : "パソコンに追加";
  installPrompt.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    hideInstallPrompt();
    return;
  }
  installTitle.textContent = "ホーム画面への追加方法";
  installMessage.textContent = "ブラウザの共有ボタンを押し、「ホーム画面に追加」→「追加」の順に選んでください。";
  installButton.hidden = true;
});

document.querySelector("#close-install-prompt").addEventListener("click", hideInstallPrompt);
window.addEventListener("appinstalled", hideInstallPrompt);

if (isiPhoneOrIPad && !runningAsInstalledApp()) {
  installTitle.textContent = "iPhone・iPadに追加しますか？";
  installMessage.textContent = "ホーム画面に追加すると、アイコンからすぐに開けます。";
  installButton.textContent = "追加方法を見る";
  installPrompt.hidden = false;
}

const updatePrompt = document.querySelector("#update-prompt");
let waitingServiceWorker = null;
let updateRequested = false;

function showUpdatePrompt(worker) {
  waitingServiceWorker = worker;
  hideInstallPrompt();
  updatePrompt.hidden = false;
}

document.querySelector("#apply-update").addEventListener("click", () => {
  if (!waitingServiceWorker) return;
  updateRequested = true;
  waitingServiceWorker.postMessage({ type: "SKIP_WAITING" });
});

document.querySelector("#close-update-prompt").addEventListener("click", () => {
  updatePrompt.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").then(registration => {
      if (registration.waiting && navigator.serviceWorker.controller) showUpdatePrompt(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) showUpdatePrompt(worker);
        });
      });
    }).catch(error => {
      console.warn("オフライン機能を準備できませんでした。", error);
    });
  });
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (updateRequested) window.location.reload();
  });
}
