const populationInput = document.getElementById("population");
const marginInput = document.getElementById("margin");
const proportionInput = document.getElementById("proportion");
const moodInput = document.getElementById("mood");

const marginValue = document.getElementById("marginValue");
const proportionValue = document.getElementById("proportionValue");
const moodValue = document.getElementById("moodValue");

const sampleSizeEl = document.getElementById("sampleSize");
const respondentsLabel = document.getElementById("respondentsLabel");

const summaryType = document.getElementById("summaryType");
const summaryConfidence = document.getElementById("summaryConfidence");
const summaryMargin = document.getElementById("summaryMargin");
const summaryProportion = document.getElementById("summaryProportion");
const summaryPopulation = document.getElementById("summaryPopulation");

const moodMessage = document.getElementById("moodMessage");
const typeNote = document.getElementById("typeNote");
const formulaText = document.getElementById("formulaText");
const formulaExplain = document.getElementById("formulaExplain");
const langSwitch = document.getElementById("langSwitch");

let selectedType = "survey";
let selectedConfidence = 95;
let currentLang = "ru";

const zScores = { 90: 1.645, 95: 1.96, 99: 2.576 };
const powerZ = 0.84;

const translations = {
  ru: {
    pageTitle: "Калькулятор размера выборки",
    toolLabel: "UX Research Tool",
    titleMain: "Калькулятор размера",
    titleAccent: "выборки",
    subtitle: "Для опросов, CSI и A/B-тестов",
    heroNote: "Быстро считаем выборку — меньше споров, больше данных",
    paramsTitle: "Параметры исследования",
    researchType: "Тип исследования",
    survey: "Опрос",
    abTest: "A/B-тест",
    populationLabel: "Размер генеральной совокупности",
    populationHint: "Сколько всего людей входит в исследуемую группу: клиенты банка, сотрудники конкретной роли, участники процесса",
    peopleShort: "чел.",
    confidenceLabel: "Уровень доверия",
    confidenceHint: "Показывает, насколько можно доверять результатам исследования и считать, что выборка отражает поведение всей исследуемой группы",
    marginLabel: "Допустимая погрешность",
    marginHint: "3-5% — точные замеры<br>5-10% — стандартный UX/продуктовый замер<br>10-15% — быстрый ориентир",
    proportionLabel: "Ожидаемая доля признака",
    proportionHint: "Если заранее неизвестно, оставьте 50%",
    moodLabel: "Насколько вы готовы провести исследование прямо сейчас?",
    moodMin: "совсем не хочется",
    moodMax: "дайте уже респондентов",
    sampleSizeLabel: "Необходимый размер выборки",
    respondents: "респондентов",
    respondentsTotal: "респондентов всего",
    summaryTitle: "Параметры расчёта",
    summaryType: "Тип исследования",
    summaryConfidence: "Уровень доверия",
    summaryMargin: "Допустимая погрешность",
    summaryProportion: "Ожидаемая доля признака",
    summaryPopulation: "Генеральная совокупность",
    formulaTitle: "Формула расчёта",
    surveyNote: "Для опроса используется классическая формула расчёта выборки для доли",
    csiNote: "Для CSI используется формула для доли с небольшим запасом 15%, потому что индекс часто применяется для управленческих решений и регулярного мониторинга",
    abNote: "Для A/B-теста считается общий объём выборки для двух равных групп. Погрешность используется как минимальный детектируемый эффект, мощность принята за 80%",
    formulaExplain: `<p><strong>N</strong> — размер генеральной совокупности</p><p><strong>n₀</strong> — предварительный размер выборки без поправки на размер совокупности</p><p><strong>n</strong> — итоговый размер выборки</p><p><strong>Z</strong> — коэффициент уровня доверия: 90% = 1.645, 95% = 1.96, 99% = 2.576</p><p><strong>p</strong> — ожидаемая доля признака</p><p><strong>e</strong> — допустимая погрешность</p>`,
    lowMood: [["Можно начать с малого", "Даже несколько интервью уже лучше, чем спор без данных"], ["Исследование само себя не проведёт", "Но после старта обычно становится сильно легче"], ["Респонденты не такие страшные", "Большинство просто хотят рассказать, что неудобно"]],
    highMood: [["Отлично! Вы настроены на результат", "С таким настроем исследование точно принесёт полезные инсайты"], ["Полевой этап близко", "Пора превращать гипотезы в реальные данные"], ["Хороший исследовательский настрой", "Респонденты уже мысленно готовы жаловаться на интерфейс"]]
  },
  en: {
    pageTitle: "Sample Size Calculator",
    toolLabel: "UX Research Tool",
    titleMain: "Sample Size",
    titleAccent: "Calculator",
    subtitle: "For surveys, CSI and A/B tests",
    heroNote: "Calculate faster — argue less, research more",
    paramsTitle: "Research parameters",
    researchType: "Research type",
    survey: "Survey",
    abTest: "A/B test",
    populationLabel: "Population size",
    populationHint: "The total number of people in the target group: bank clients, employees in a specific role, or process participants",
    peopleShort: "people",
    confidenceLabel: "Confidence level",
    confidenceHint: "Shows how confident we want to be that the sample reflects the behavior of the full target group",
    marginLabel: "Margin of error",
    marginHint: "3-5% — precise measurement<br>5-10% — standard UX/product measurement<br>10-15% — quick directional estimate",
    proportionLabel: "Expected proportion",
    proportionHint: "If unknown, leave 50%",
    moodLabel: "How ready are you to run this research right now?",
    moodMin: "not ready at all",
    moodMax: "give me respondents",
    sampleSizeLabel: "Required sample size",
    respondents: "respondents",
    respondentsTotal: "respondents total",
    summaryTitle: "Calculation parameters",
    summaryType: "Research type",
    summaryConfidence: "Confidence level",
    summaryMargin: "Margin of error",
    summaryProportion: "Expected proportion",
    summaryPopulation: "Population size",
    formulaTitle: "Calculation formula",
    surveyNote: "For surveys, the calculator uses the classic sample size formula for proportions",
    csiNote: "For CSI, the calculator uses the proportion formula with a 15% buffer, because the index is often used for management decisions and regular monitoring",
    abNote: "For A/B tests, the calculator estimates the total sample size for two equal groups. Margin of error is treated as MDE, and power is set to 80%",
    formulaExplain: `<p><strong>N</strong> — population size</p><p><strong>n₀</strong> — initial sample size before finite population correction</p><p><strong>n</strong> — final sample size</p><p><strong>Z</strong> — confidence coefficient: 90% = 1.645, 95% = 1.96, 99% = 2.576</p><p><strong>p</strong> — expected proportion</p><p><strong>e</strong> — margin of error</p>`,
    lowMood: [["Start small", "Even a few interviews are better than another debate without data"], ["The research will not run itself", "But it usually gets easier once you start"], ["Respondents are not that scary", "Most of them simply want to explain what is inconvenient"]],
    highMood: [["Great! You are ready to move", "With this mindset, the research will bring useful insights"], ["Fieldwork is close", "Time to turn hypotheses into real data"], ["Strong research energy", "Respondents are already mentally preparing to complain about the interface"]]
  }
};

function t(key) { return translations[currentLang][key]; }

function formatNumber(num) {
  return new Intl.NumberFormat(currentLang === "ru" ? "ru-RU" : "en-US").format(num || 0);
}

function parsePopulation(value) {
  return Number(String(value).replace(/\s/g, "").replace(/,/g, "").replace(/\D/g, ""));
}

function applyFinitePopulationCorrection(sample, population) {
  if (!population || population < 1) return 0;
  return sample / (1 + (sample - 1) / population);
}

function getSurveySampleSize() {
  const N = parsePopulation(populationInput.value);
  const e = Number(marginInput.value) / 100;
  const p = Number(proportionInput.value) / 100;
  const Z = zScores[selectedConfidence];
  if (!N || N < 1 || !e || !p) return 0;
  const n0 = (Math.pow(Z, 2) * p * (1 - p)) / Math.pow(e, 2);
  return Math.ceil(applyFinitePopulationCorrection(n0, N));
}

function getCsiSampleSize() {
  const N = parsePopulation(populationInput.value);
  const e = Number(marginInput.value) / 100;
  const p = Number(proportionInput.value) / 100;
  const Z = zScores[selectedConfidence];
  if (!N || N < 1 || !e || !p) return 0;
  const designEffect = 1.15;
  const n0 = ((Math.pow(Z, 2) * p * (1 - p)) / Math.pow(e, 2)) * designEffect;
  return Math.ceil(applyFinitePopulationCorrection(n0, N));
}

function getAbTestSampleSize() {
  const N = parsePopulation(populationInput.value);
  const mde = Number(marginInput.value) / 100;
  const p = Number(proportionInput.value) / 100;
  const Z = zScores[selectedConfidence];
  if (!N || N < 1 || !mde || !p) return 0;
  const samplePerGroup = (2 * Math.pow(Z + powerZ, 2) * p * (1 - p)) / Math.pow(mde, 2);
  return Math.ceil(applyFinitePopulationCorrection(samplePerGroup * 2, N));
}

function getSampleSize() {
  if (selectedType === "csi") return getCsiSampleSize();
  if (selectedType === "ab") return getAbTestSampleSize();
  return getSurveySampleSize();
}

function getTypeName(type) {
  if (type === "survey") return t("survey");
  if (type === "csi") return "CSI";
  if (type === "ab") return t("abTest");
}

function updateStaticText() {
  document.title = t("pageTitle");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  document.querySelectorAll("[data-tooltip-key]").forEach((el) => {
    el.dataset.tooltip = t(el.dataset.tooltipKey);
  });

  langSwitch.textContent = currentLang === "ru" ? "EN" : "RU";
}

function updateTypeContent() {
  if (selectedType === "survey") {
    respondentsLabel.textContent = t("respondents");
    typeNote.textContent = t("surveyNote");
    formulaText.innerHTML = `<p><strong>${currentLang === "ru" ? "Для опроса:" : "For surveys:"}</strong></p><p>n₀ = (Z² × p × (1 − p)) / e²</p><p>n = n₀ / (1 + (n₀ − 1) / N)</p>`;
  }

  if (selectedType === "csi") {
    respondentsLabel.textContent = t("respondents");
    typeNote.textContent = t("csiNote");
    formulaText.innerHTML = `<p><strong>${currentLang === "ru" ? "Для CSI:" : "For CSI:"}</strong></p><p>n₀ = ((Z² × p × (1 − p)) / e²) × 1.15</p><p>n = n₀ / (1 + (n₀ − 1) / N)</p>`;
  }

  if (selectedType === "ab") {
    respondentsLabel.textContent = t("respondentsTotal");
    typeNote.textContent = t("abNote");
    formulaText.innerHTML = `<p><strong>${currentLang === "ru" ? "Для A/B-теста:" : "For A/B tests:"}</strong></p><p>nᵍ = (2 × (Z + 0.84)² × p × (1 − p)) / e²</p><p>n = 2 × nᵍ</p><p>${currentLang === "ru" ? "nᵍ — размер одной группы, 0.84 — коэффициент для мощности 80%" : "nᵍ — one group size, 0.84 — coefficient for 80% power"}</p>`;
  }

  formulaExplain.innerHTML = t("formulaExplain");
}

function updateMoodMessage() {
  const mood = Number(moodInput.value);
  const isLow = mood < 5;
  const messages = isLow ? t("lowMood") : t("highMood");
  const index = Math.min(messages.length - 1, Math.floor((mood / 10) * messages.length));
  const message = messages[index];

  moodMessage.classList.toggle("low", isLow);
  moodMessage.querySelector("h2").textContent = message[0];
  moodMessage.querySelector("p").textContent = message[1];
}

function updateCalculator() {
  const sampleSize = getSampleSize();
  const margin = Number(marginInput.value);
  const proportion = Number(proportionInput.value);
  const population = parsePopulation(populationInput.value);
  const mood = Number(moodInput.value);

  marginValue.textContent = `${margin}%`;
  proportionValue.textContent = `${proportion}%`;
  moodValue.textContent = mood;
  sampleSizeEl.textContent = formatNumber(sampleSize);
  summaryType.textContent = getTypeName(selectedType);
  summaryConfidence.textContent = `${selectedConfidence}%`;
  summaryMargin.textContent = `${margin}%`;
  summaryProportion.textContent = `${proportion}%`;
  summaryPopulation.textContent = formatNumber(population);

  updateTypeContent();
  updateMoodMessage();
}

populationInput.addEventListener("input", (event) => {
  const rawValue = event.target.value.replace(/\D/g, "");
  event.target.value = rawValue ? formatNumber(Number(rawValue)) : "";
  updateCalculator();
});

document.querySelectorAll("#researchType .segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#researchType .segment").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedType = button.dataset.type;
    updateCalculator();
  });
});

document.querySelectorAll("#confidence .segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#confidence .segment").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    selectedConfidence = Number(button.dataset.confidence);
    updateCalculator();
  });
});

[marginInput, proportionInput, moodInput].forEach((input) => {
  input.addEventListener("input", updateCalculator);
});

langSwitch.addEventListener("click", () => {
  const population = parsePopulation(populationInput.value);
  currentLang = currentLang === "ru" ? "en" : "ru";
  populationInput.value = formatNumber(population);
  updateStaticText();
  updateCalculator();
});

updateStaticText();
updateCalculator();
