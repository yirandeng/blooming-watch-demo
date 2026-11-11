const screen = document.querySelector("#screen");
const tabbar = document.querySelector("#tabbar");
const screenMeta = document.querySelector("#screenMeta");
const watch = document.querySelector(".watch");

const tabs = ["garden", "food", "move", "learn", "family"];

const state = {
  launched: false,
  activeTab: "garden",
  foodStep: "method",
  foodMethod: null,
  selectedFood: "vegfruit",
  moveStep: "choose",
  selectedMove: null,
  moveStartedAt: null,
  moveElapsedMs: 0,
  gardenGrowth: 62,
  foodDone: false,
  moveDone: false,
  shareParent: true,
  feedback: null,
  feedbackSpokenId: null,
  quizChoice: null,
  askOpen: false,
  askQuestion: null,
  customQuestion: "",
  customAnswer: "",
  listening: false,
  familyTask: "walk",
  familyRead: false
};

const meta = {
  garden: {
    title: "绿芽 blooming",
    text: "第一屏只保留花园和成长记录条，符合 1.6 英寸手表“一屏一个重点”的原则。",
    chips: ["花园状态", "成长条", "无入口干扰"]
  },
  food: {
    title: "饮食打卡",
    text: "饮食打卡独立成屏，去掉解释性小芽文案，用大图标承载拍照、语音和卡片记录。",
    chips: ["拍照图标", "语音图标", "卡片图标"]
  },
  move: {
    title: "运动打卡",
    text: "运动打卡独立成屏，每个运动选项使用对应图标，孩子可先滑到该屏再完成记录。",
    chips: ["运动图标", "开始记录", "完成反馈"]
  },
  learn: {
    title: "知识花房",
    text: "知识页把“小芽问一问”前置，科普正文放大，优先适配手表上的短时阅读。",
    chips: ["提问前置", "大字号", "短科普"]
  },
  family: {
    title: "陪伴小屋",
    text: "陪伴页只呈现孩子需要的鼓励和共同任务，避免把家长管理信息放到儿童端。",
    chips: ["家长鼓励", "共同任务", "已听反馈"]
  }
};

const foodMethods = [
  { id: "photo", name: "拍照记录", detail: "拍餐盘" },
  { id: "voice", name: "语音记录", detail: "说一说" },
  { id: "card", name: "卡片记录", detail: "点卡片" }
];

const foodGroups = [
  { id: "vegfruit", name: "蔬果", type: "绿色", icon: "icon-apple.png", line: "花园长出新叶子！" },
  { id: "staple", name: "主食", type: "成长", icon: "icon-rice.png", line: "小树有了稳稳能量。" },
  { id: "protein", name: "蛋白质", type: "力量", icon: "icon-beef.png", line: "身体充电，翅膀更有力。" },
  { id: "water", name: "喝水", type: "补水", icon: "icon-water.png", line: "小溪更清澈了！" },
  { id: "treat", name: "甜食", type: "偶尔", icon: "icon-icecream.png", line: "偶尔能量也可以，明天试试加一份绿色能量。" },
  { id: "fried", name: "炸物", type: "偶尔", icon: "icon-fried-chicken.png", line: "炸物能量收到啦，下次给花园补一点清爽能量。" }
];

const foodFeedbackLines = {
  vegfruit: [
    "绿色能量到账！花园长出了新叶子。",
    "今天有蔬菜水果，花园变得更有活力啦！",
    "你给花园带来了彩虹能量，小花开得更亮了。",
    "水果能量让花园甜甜的，蔬菜能量让小树更有力。",
    "今天的小叶子很开心，因为你给它带来了绿色能量。"
  ],
  protein: [
    "你给小树补充了成长能量，今天很棒！",
    "蛋白能量让身体更有力量，小芽为你点赞。",
    "小树收到结实能量，悄悄长高了一点。",
    "鸡蛋、豆腐、鱼肉都能给小树力量。",
    "明天继续给小树补一点结实能量吧。"
  ],
  staple: [
    "主食能量来啦，下次再加点绿色能量会更棒。",
    "小路亮起来啦，配上蔬菜水果更丰富。",
    "今天有奔跑能量，花园还想要一点彩虹颜色。"
  ],
  water: [
    "清清水能量到账！小溪变亮啦。",
    "你给花园补水啦，小溪更清澈了。",
    "白水能量来啦，花园变得更清爽。",
    "小溪喝到白水啦，正在开心唱歌。",
    "今天记得喝水，小芽给你点赞！",
    "白水能量让身体和花园都舒服起来。",
    "补水成功！花园的小叶子更精神啦。"
  ],
  treat: [
    "甜甜能量有点多啦，花园还想要清清水能量。",
    "小芽收到啦！下次让水果能量也加入吧。",
    "甜甜能量很热闹，明天我们给花园加点绿色能量。",
    "今天甜甜能量来了不少，小溪想喝一点白水。",
    "下次可以先吃正餐能量，再选择一点甜甜能量。"
  ],
  fried: [
    "炸物能量有点热闹，花园想要一点清爽蔬果。",
    "小芽记下啦，下次可以给小溪补一点白水。",
    "偶尔吃炸物可以，明天给花园加点绿色能量。",
    "炸物能量到账，配上蔬菜水果会更舒服。"
  ]
};

const moves = [
  { id: "run", name: "跑步", icon: "icon-run.png", line: "跑步让小太阳亮起来！" },
  { id: "bike", name: "骑车", icon: "icon-bike.png", line: "骑车把风带进花园。" },
  { id: "walk", name: "行走", icon: "icon-walk.png", line: "花园小路被点亮了。" },
  { id: "swim", name: "游泳", icon: "icon-swim.png", line: "小溪溅起快乐水花。" },
  { id: "climb", name: "爬山", icon: "icon-climb.png", line: "山坡长出更有力的小草。" },
  { id: "rope", name: "跳绳", icon: "icon-rope.png", line: "跳绳让小芽翅膀更有力。" }
];

const familyTasks = [
  { id: "walk", title: "饭后散步", detail: "和妈妈 10 分钟" },
  { id: "fruit", title: "挑水果", detail: "和爸爸选一种" },
  { id: "plate", title: "彩虹盘", detail: "一起摆餐盘" }
];

const askQuestions = [
  { id: "water", question: "为什么要喝水？", answer: "白水像身体里的小溪，可以帮能量送到需要的地方。" },
  { id: "veg", question: "蔬菜有什么用？", answer: "蔬菜像小盾牌，会帮助身体更有力量。" },
  { id: "move", question: "运动会累怎么办？", answer: "累了可以休息一下，再从短短几分钟开始。" },
  { id: "sweet", question: "甜食能吃吗？", answer: "可以偶尔吃一点。下次也给花园加一点水果或白水能量。" }
];

const quiz = {
  question: "午餐有米饭、鸡腿和青菜，怎么吃更合适？",
  answers: [
    { key: "A", text: "只吃鸡腿" },
    { key: "B", text: "只吃米饭" },
    { key: "C", text: "三样都吃" }
  ]
};

function render() {
  tabbar.classList.toggle("is-hidden", !state.launched || Boolean(state.feedback));
  document.querySelectorAll(".tab").forEach((button) => {
    const isActive = button.dataset.tab === state.activeTab;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-current", isActive ? "page" : "false");
  });

  if (!state.launched) {
    renderSplash();
    renderMeta("garden");
    return;
  }

  if (state.feedback) {
    renderFeedback();
    renderMeta(state.feedback.kind === "move" ? "move" : "food");
    return;
  }

  if (state.activeTab === "garden") renderGarden();
  if (state.activeTab === "food") renderFoodScreen();
  if (state.activeTab === "move") renderMoveScreen();
  if (state.activeTab === "learn") renderLearn();
  if (state.activeTab === "family") renderFamily();
  renderMeta(state.activeTab);
}

function renderMeta(tab) {
  if (!screenMeta) return;
  const item = meta[tab];
  screenMeta.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.text}</p>
    <div>${item.chips.map((chip) => `<span>${chip}</span>`).join("")}</div>
  `;
}

function renderSplash() {
  screen.innerHTML = `
    <section class="splash">
      <span class="splash-orbit"></span>
      <span class="splash-shape"></span>
      <img class="splash-logo" src="./assets/yuanqi-logo.png" alt="绿芽 blooming logo" />
      <p class="splash-copy"><span>让健康习惯</span><span>像小芽一样慢慢长大</span></p>
      <button class="primary-btn" data-action="start" type="button">开始</button>
    </section>
  `;
}

function renderGarden() {
  const level = state.gardenGrowth;
  screen.innerHTML = `
    <section class="page garden-page garden-only">
      <article class="garden-scene">
        <span class="sun"></span>
        <span class="cloud one"></span>
        <span class="cloud two"></span>
        <span class="fence"></span>
        <span class="hill far"></span>
        <span class="hill near"></span>
        ${renderXiaoya("garden")}
        <span class="garden-sign"></span>
        <span class="veggie-bed bed-one"></span>
        <span class="veggie-bed bed-two"></span>
        <span class="tree left"></span>
        <span class="tree right"></span>
        <span class="berry-bush"></span>
        <span class="flower-dot a"></span>
        <span class="flower-dot b"></span>
        <span class="flower-dot c"></span>
        <span class="stone-path"></span>
        <span class="butterfly"></span>
        <span class="river"></span>
        <span class="ground"></span>
      </article>

      <div class="mini-meter">
        <span>花园成长</span>
        <strong>${level}%</strong>
        <i><b style="width:${level}%"></b></i>
      </div>
    </section>
  `;
}

function renderXiaoya(variant = "") {
  const imageByVariant = {
    garden: "xiaoya-standing.png",
    feedback: "xiaoya-jump.png",
    "feedback-float": "xiaoya-standing.png",
    ask: "xiaoya-happy.png"
  };
  const image = imageByVariant[variant] || "xiaoya-standing.png";
  return `
    <img class="xiaoya ${variant}" src="./assets/${image}" alt="AI 伙伴小芽" />
  `;
}

function gardenLine() {
  if (state.foodDone && state.moveDone) return "绿色能量和阳光都到啦！";
  if (state.foodDone) return "花园收到新的食物能量啦！";
  if (state.moveDone) return "运动让小太阳亮起来啦！";
  return "完成一个小任务，花园会发光。";
}

function renderTop(title, badge) {
  const useActionEyebrow = title === "饮食打卡" || title === "运动打卡";
  const eyebrow = useActionEyebrow ? shortGreeting(title) : title;
  const heading = useActionEyebrow ? title : shortGreeting(title);
  return `
    <div class="page-top">
      <div>
        <p class="micro">${eyebrow}</p>
        <h2>${heading}</h2>
      </div>
      <div class="top-actions">
        ${badge ? `<span>${badge}</span>` : ""}
        <button class="voice-chip" data-action="speak-current" type="button" aria-label="语音播报">
          <span class="sr-only">语音播报</span>
        </button>
      </div>
    </div>
  `;
}

function shortGreeting(title) {
  if (title === "饮食打卡") return state.foodStep === "method" ? "选方式" : "食物";
  if (title === "运动打卡") return state.moveStep === "choose" ? "选运动" : "开始";
  if (title === "知识花房") return "今天学一口";
  if (title === "陪伴小屋") return "家人在这";
  return "今天先做啥？";
}

function renderFoodScreen() {
  screen.innerHTML = `
    <section class="page">
      ${renderTop("饮食打卡", "")}
      ${renderFoodRecord()}
    </section>
  `;
}

function renderMoveScreen() {
  screen.innerHTML = `
    <section class="page">
      ${renderTop("运动打卡", "")}
      ${renderMoveRecord()}
    </section>
  `;
}

function renderFoodRecord() {
  if (state.foodStep === "method") {
    return `
      <div class="method-list action-icon-list">
        ${foodMethods.map((item) => `
          <button class="method-option" data-food-method="${item.id}" type="button">
            <span class="method-symbol ${item.id}" aria-hidden="true"></span>
            <strong>${item.name}</strong>
          </button>
        `).join("")}
      </div>
    `;
  }

  if (state.foodMethod === "card") {
    return renderFoodCards();
  }

  const method = foodMethods.find((item) => item.id === state.foodMethod);
  return `
    <article class="capture-card ${state.foodMethod}">
      <span class="method-symbol ${state.foodMethod}" aria-hidden="true"></span>
      <p class="micro">${method.name}</p>
      <h3>${state.foodMethod === "photo" ? "对准餐盘" : "说一句"}</h3>
    </article>
    <button class="primary-btn" data-action="finish-food" type="button">${state.foodMethod === "photo" ? "完成拍照" : "完成语音"}</button>
    <button class="ghost-btn" data-action="back-food-method" type="button">换一种方式</button>
  `;
}

function renderFoodCards() {
  return `
    <div class="watch-grid food-group-grid">
      ${foodGroups.map((item) => `
        <button class="pick-card ${state.selectedFood === item.id ? "is-picked" : ""}" data-food="${item.id}" type="button">
          <span class="food-symbol ${item.id}" aria-hidden="true">
            <img src="./assets/${item.icon}" alt="" />
          </span>
          <strong>${item.name}</strong>
        </button>
      `).join("")}
    </div>

    <button class="primary-btn" data-action="finish-food" type="button">完成饮食</button>
    <button class="ghost-btn" data-action="back-food-method" type="button">换记录方式</button>
  `;
}

function renderMoveRecord() {
  if (state.moveStep === "choose") {
    return `
      <div class="sport-list">
        ${moves.map((item) => `
          <button class="sport-option" data-move="${item.id}" type="button">
            <span class="move-symbol ${item.id}" aria-hidden="true">
              <img src="./assets/${item.icon}" alt="" />
            </span>
            <strong>${item.name}</strong>
          </button>
        `).join("")}
      </div>
    `;
  }

  const move = moves.find((item) => item.id === state.selectedMove);
  return `
    <article class="session-card ${state.moveStep === "active" ? "is-active" : ""}">
      <span class="session-sun move-symbol ${move.id}" aria-hidden="true">
        <img src="./assets/${move.icon}" alt="" />
      </span>
      <p class="micro">${move.name}记录</p>
      <h3>${state.moveStep === "active" ? "正在运动" : "准备好了吗？"}</h3>
      <strong>${formatMoveTime()}</strong>
    </article>
    <button class="primary-btn" data-action="${state.moveStep === "active" ? "finish-move" : "start-move"}" type="button">
      ${state.moveStep === "active" ? "结束记录" : "开始记录"}
    </button>
    <button class="ghost-btn" data-action="back-move-list" type="button">重新选择</button>
  `;
}

let moveTimer = null;

function getMoveElapsedMs() {
  if (state.moveStep !== "active" || !state.moveStartedAt) return state.moveElapsedMs;
  return state.moveElapsedMs + Date.now() - state.moveStartedAt;
}

function formatMoveTime() {
  const totalSeconds = Math.floor(getMoveElapsedMs() / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startMoveTimer() {
  stopMoveTimer();
  moveTimer = window.setInterval(() => {
    if (state.activeTab === "move" && state.moveStep === "active" && !state.feedback) {
      renderMoveScreen();
    }
  }, 1000);
}

function stopMoveTimer() {
  if (!moveTimer) return;
  window.clearInterval(moveTimer);
  moveTimer = null;
}

function renderFeedback() {
  const isMove = state.feedback.kind === "move";
  const isOccasionalFood = state.feedback.variant === "occasional-food";
  screen.innerHTML = `
    <section class="feedback-screen ${isOccasionalFood ? "is-occasional-food" : ""}">
      <button class="voice-chip floating-voice" data-action="speak-current" type="button" aria-label="语音播报">
        <span class="sr-only">语音播报</span>
      </button>
      <div class="feedback-burst" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
      <span class="feedback-ring"></span>
      ${renderXiaoya(isOccasionalFood ? "feedback-float" : "feedback")}
      <h2>${state.feedback.title}</h2>
      <p class="feedback-copy">${state.feedback.message}</p>

      <label class="share-choice">
        <span>分享给家长</span>
        <input data-action="toggle-share" type="checkbox" ${state.shareParent ? "checked" : ""} />
        <i></i>
      </label>

      <button class="primary-btn" data-action="feedback-done" type="button">${state.shareParent ? "分享并回花园" : "只自己保存"}</button>
      <button class="ghost-btn" data-action="${isMove ? "go-move" : "go-food"}" type="button">再记一次</button>
    </section>
  `;
  if (!isOccasionalFood) requestAnimationFrame(() => triggerCelebrate());
  if (state.feedback.id !== state.feedbackSpokenId) {
    state.feedbackSpokenId = state.feedback.id;
    speakText(currentVoiceText());
  }
}

function speakText(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.96;
  utterance.pitch = 1.52;
  utterance.volume = 0.94;
  const voices = window.speechSynthesis.getVoices();
  const warmVoice = voices.find((voice) => /xiaoxiao|xiaoyi|tingting|child|kid|female|婷婷|晓晓|晓伊|美佳/i.test(voice.name))
    || voices.find((voice) => /zh-CN|Chinese|Mandarin|普通话|中文/i.test(voice.lang + voice.name));
  if (warmVoice) utterance.voice = warmVoice;
  window.speechSynthesis.speak(utterance);
}

function currentVoiceText() {
  if (state.feedback) return `${state.feedback.title}！${state.feedback.message}`;
  if (state.activeTab === "garden") return `这里是绿芽 blooming。${gardenLine()}`;
  if (state.activeTab === "food") return "这里是饮食打卡。可以拍照、语音，也可以用卡片记录。";
  if (state.activeTab === "move") return "这里是运动打卡。先选一种运动，再点击开始记录。";
  if (state.activeTab === "learn" && state.askOpen) {
    const selected = askQuestions.find((item) => item.id === state.askQuestion);
    return selected ? `小芽问一问。${selected.question}${selected.answer}` : "小芽问一问。你可以问我喝水、蔬菜和运动的问题。";
  }
  if (state.activeTab === "learn") return "这里是知识花房。今天的小知识是彩虹餐盘。每天吃饭时，试着让餐盘里出现两到三种不同颜色的食物。";
  if (state.activeTab === "family") return "这里是陪伴小屋。妈妈给你发来了鼓励，也有家庭任务可以一起完成。";
  return "欢迎来到绿芽 blooming。";
}

function triggerCelebrate() {
  if ("vibrate" in navigator) navigator.vibrate([70, 40, 110]);
  watch.classList.remove("is-celebrating");
  void watch.offsetWidth;
  watch.classList.add("is-celebrating");
  window.setTimeout(() => watch.classList.remove("is-celebrating"), 900);
}

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function answerFromSpeech(text) {
  const content = text.trim();
  if (!content) return null;
  if (/水|喝/.test(content)) {
    return { question: content, answer: askQuestions.find((item) => item.id === "water").answer };
  }
  if (/菜|蔬菜|水果/.test(content)) {
    return { question: content, answer: askQuestions.find((item) => item.id === "veg").answer };
  }
  if (/运动|跑|跳|累/.test(content)) {
    return { question: content, answer: askQuestions.find((item) => item.id === "move").answer };
  }
  if (/甜|糖|蛋糕|奶茶|炸|薯条/.test(content)) {
    return { question: content, answer: askQuestions.find((item) => item.id === "sweet").answer };
  }
  return {
    question: content,
    answer: "这个问题很好。小芽建议先告诉家长，我们一起找一个照顾身体的办法。"
  };
}

function startAskListening() {
  const Recognition = getSpeechRecognition();
  if (!Recognition) {
    state.customQuestion = "浏览器暂时不能听清语音";
    state.customAnswer = "可以先点下面的问题问小芽。";
    state.askQuestion = "custom";
    renderAskXiaoya();
    speakText(state.customAnswer);
    return;
  }

  const recognition = new Recognition();
  recognition.lang = "zh-CN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  state.listening = true;
  renderAskXiaoya();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const matched = answerFromSpeech(transcript);
    state.customQuestion = matched.question;
    state.customAnswer = matched.answer;
    state.askQuestion = "custom";
  };

  recognition.onerror = () => {
    state.customQuestion = "小芽刚刚没听清";
    state.customAnswer = "可以再说一次，或者点下面的小问题。";
    state.askQuestion = "custom";
  };

  recognition.onend = () => {
    state.listening = false;
    renderAskXiaoya();
    if (state.customAnswer) speakText(state.customAnswer);
  };

  recognition.start();
}

function renderLearn() {
  if (state.askOpen) {
    renderAskXiaoya();
    return;
  }

  screen.innerHTML = `
    <section class="page learn-page">
      <button class="ask-button ask-button-top" data-action="open-ask" type="button">
        <span aria-hidden="true">
          <img src="./assets/xiaoya-happy.png" alt="" />
        </span>
        <strong>小芽问一问</strong>
      </button>
      <article class="seed-card hero-seed rainbow-seed">
        <span class="seed-art rainbow"></span>
        <p class="micro">健康小知识</p>
        <h3>彩虹餐盘</h3>
        <p>吃饭时，试着让餐盘里有 2—3 种颜色。</p>
      </article>
      <section class="quiz-card compact-quiz">
        <h3>${quiz.question}</h3>
        <div class="answer-row">
          ${quiz.answers.map((item) => renderAnswer(item.key, item.text)).join("")}
        </div>
        ${state.quizChoice ? `<p class="result">${state.quizChoice === "C" ? "答对啦！三样都吃，餐盘更有能量。" : "小芽提示：三样都吃一点，更照顾身体。"}</p>` : ""}
      </section>
    </section>
  `;
}

function renderAskXiaoya() {
  const selected = state.askQuestion === "custom"
    ? { question: state.customQuestion, answer: state.customAnswer }
    : askQuestions.find((item) => item.id === state.askQuestion);
  screen.innerHTML = `
    <section class="page ask-page">
      ${renderTop("知识花房", "问小芽")}
      <article class="ask-panel">
        ${renderXiaoya("ask")}
        <p class="micro">小芽问一问</p>
        <h3>${selected ? selected.question : "你想问什么？"}</h3>
        <p>${selected ? selected.answer : "可以问我喝水、蔬菜、运动这些健康小问题。"}</p>
      </article>

      <button class="listen-button ${state.listening ? "is-listening" : ""}" data-action="listen-ask" type="button">
        <span></span>
        <strong>${state.listening ? "小芽在听" : "按一下说问题"}</strong>
        <small>${state.listening ? "说完等一下" : "真实语音识别"}</small>
      </button>

      <div class="ask-list">
        ${askQuestions.slice(0, 2).map((item) => `
          <button class="${state.askQuestion === item.id ? "is-picked" : ""}" data-ask="${item.id}" type="button">${item.question}</button>
        `).join("")}
      </div>

      <button class="ghost-btn" data-action="close-ask" type="button">回到花房</button>
    </section>
  `;
}

function renderAnswer(key, text) {
  return `<button class="${state.quizChoice === key ? "is-picked" : ""}" data-answer="${key}" type="button"><strong>${key}</strong><span>${text}</span></button>`;
}

function renderFamily() {
  const task = familyTasks.find((item) => item.id === state.familyTask);
  screen.innerHTML = `
    <section class="page family-page">
      ${renderTop("陪伴小屋", state.familyRead ? "已收到" : "新鼓励")}

      <article class="family-voice">
        <span class="family-avatar" aria-label="妈妈">
          <img src="./assets/icon-mom.png" alt="" />
        </span>
        <div>
          <p class="micro">妈妈发来鼓励</p>
          <h3>你愿意尝试新食物，真的很棒。</h3>
        </div>
        <button data-action="read-family" type="button">${state.familyRead ? "已听" : "听一听"}</button>
      </article>

      <section class="task-card">
        <div class="task-art ${task.id}">
          <img src="./assets/icon-team.png" alt="" />
        </div>
        <p class="micro">家庭任务</p>
        <h3>${task.title}</h3>
        <p>${task.detail}</p>
      </section>

      <div class="family-tasks">
        ${familyTasks.map((item) => `
          <button class="${state.familyTask === item.id ? "is-picked" : ""}" data-family-task="${item.id}" type="button">
            <strong>${item.title}</strong>
            <span>${item.detail}</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function completeFoodRecord() {
  const food = foodGroups.find((item) => item.id === state.selectedFood);
  const method = foodMethods.find((item) => item.id === state.foodMethod);
  const isSweetTreat = state.foodMethod === "card" && food.id === "treat";
  const isFriedFood = state.foodMethod === "card" && food.id === "fried";
  const isOccasionalFood = isSweetTreat || isFriedFood;
  const message = state.foodMethod === "card"
    ? randomFeedbackLine(food.id, food.line)
    : `${method.name}完成啦，我帮花园加了一份元气。`;
  if (!isOccasionalFood) increaseGardenGrowth(2);
  state.foodDone = true;
  state.feedback = {
    id: `food-${Date.now()}`,
    kind: "food",
    title: feedbackTitleForFood(food.id),
    message,
    variant: isOccasionalFood ? "occasional-food" : "default"
  };
  if (!isOccasionalFood) triggerCelebrate();
}

function completeMoveRecord() {
  const move = moves.find((item) => item.id === state.selectedMove);
  state.moveElapsedMs = getMoveElapsedMs();
  state.moveStartedAt = null;
  stopMoveTimer();
  increaseGardenGrowth(2);
  state.moveDone = true;
  state.feedback = {
    id: `move-${Date.now()}`,
    kind: "move",
    title: "阳光能量到账",
    message: `${move.line} 你坚持完成了，花园小路被点亮。`
  };
  triggerCelebrate();
}

function randomFeedbackLine(groupId, fallback) {
  const lines = foodFeedbackLines[groupId];
  if (!lines?.length) return fallback;
  return lines[Math.floor(Math.random() * lines.length)];
}

function feedbackTitleForFood(groupId) {
  if (groupId === "treat" || groupId === "fried") return "能量提醒";
  if (groupId === "water") return "补水成功";
  return "花园收到能量";
}

function increaseGardenGrowth(amount) {
  state.gardenGrowth = Math.min(100, state.gardenGrowth + amount);
}

function switchTabByStep(step) {
  if (!state.launched || state.feedback) return;
  const current = tabs.indexOf(state.activeTab);
  const next = Math.min(tabs.length - 1, Math.max(0, current + step));
  if (next === current) return;
  state.askOpen = false;
  state.activeTab = tabs[next];
  render();
}

function prepareFoodInitial() {
  state.foodStep = "method";
  state.foodMethod = null;
  state.selectedFood = "vegfruit";
}

function prepareMoveInitial() {
  stopMoveTimer();
  state.moveStep = "choose";
  state.selectedMove = null;
  state.moveStartedAt = null;
  state.moveElapsedMs = 0;
}

function resetFoodFlow() {
  state.feedback = null;
  state.activeTab = "food";
  prepareFoodInitial();
}

function resetMoveFlow() {
  state.feedback = null;
  state.activeTab = "move";
  prepareMoveInitial();
}

screen.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  const foodMethod = event.target.closest("[data-food-method]");
  const food = event.target.closest("[data-food]");
  const move = event.target.closest("[data-move]");
  const answer = event.target.closest("[data-answer]");
  const ask = event.target.closest("[data-ask]");
  const familyTask = event.target.closest("[data-family-task]");

  if (action === "start") {
    state.launched = true;
    render();
    return;
  }

  if (action === "go-food") {
    resetFoodFlow();
    render();
    return;
  }

  if (action === "go-move") {
    resetMoveFlow();
    render();
    return;
  }

  if (action === "go-learn") {
    state.feedback = null;
    state.activeTab = "learn";
    state.askOpen = false;
    render();
    return;
  }

  if (action === "speak-current") {
    speakText(currentVoiceText());
    return;
  }

  if (action === "open-ask") {
    state.askOpen = true;
    renderLearn();
    return;
  }

  if (action === "close-ask") {
    state.askOpen = false;
    renderLearn();
    return;
  }

  if (action === "listen-ask") {
    startAskListening();
    return;
  }

  if (action === "back-food-method") {
    state.foodStep = "method";
    state.foodMethod = null;
    renderFoodScreen();
    return;
  }

  if (action === "finish-food") {
    completeFoodRecord();
    render();
    return;
  }

  if (action === "back-move-list") {
    stopMoveTimer();
    state.moveStep = "choose";
    state.selectedMove = null;
    state.moveStartedAt = null;
    state.moveElapsedMs = 0;
    renderMoveScreen();
    return;
  }

  if (action === "start-move") {
    state.moveStep = "active";
    state.moveStartedAt = Date.now();
    state.moveElapsedMs = 0;
    startMoveTimer();
    renderMoveScreen();
    return;
  }

  if (action === "finish-move") {
    completeMoveRecord();
    render();
    return;
  }

  if (action === "feedback-done") {
    const finishedKind = state.feedback?.kind;
    if (finishedKind === "food") prepareFoodInitial();
    if (finishedKind === "move") prepareMoveInitial();
    state.feedback = null;
    state.activeTab = "garden";
    render();
    return;
  }

  if (action === "read-family") {
    state.familyRead = true;
    speakText("妈妈说，你愿意尝试新食物，真的很棒。");
    renderFamily();
    return;
  }

  if (foodMethod) {
    state.foodMethod = foodMethod.dataset.foodMethod;
    state.foodStep = "record";
    renderFoodScreen();
    return;
  }

  if (food) {
    state.selectedFood = food.dataset.food;
    renderFoodScreen();
    return;
  }

  if (move) {
    stopMoveTimer();
    state.selectedMove = move.dataset.move;
    state.moveStep = "ready";
    state.moveStartedAt = null;
    state.moveElapsedMs = 0;
    renderMoveScreen();
    return;
  }

  if (answer) {
    state.quizChoice = answer.dataset.answer;
    renderLearn();
    return;
  }

  if (ask) {
    state.askQuestion = ask.dataset.ask;
    renderAskXiaoya();
    return;
  }

  if (familyTask) {
    state.familyTask = familyTask.dataset.familyTask;
    renderFamily();
  }
});

screen.addEventListener("change", (event) => {
  if (event.target.matches("[data-action='toggle-share']")) {
    state.shareParent = event.target.checked;
    renderFeedback();
  }
});

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    state.feedback = null;
    state.askOpen = false;
    state.activeTab = button.dataset.tab;
    render();
  });
});

let swipeStartX = 0;
let swipeStartY = 0;
let swipeActive = false;

screen.addEventListener("pointerdown", (event) => {
  swipeStartX = event.clientX;
  swipeStartY = event.clientY;
  swipeActive = true;
});

screen.addEventListener("pointerup", (event) => {
  if (!swipeActive) return;
  swipeActive = false;
  const dx = event.clientX - swipeStartX;
  const dy = event.clientY - swipeStartY;
  if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
  switchTabByStep(dx < 0 ? 1 : -1);
});

render();
