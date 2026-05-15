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

let selectedType = "Опрос";
let selectedConfidence = 95;

const zScores = {
  90: 1.645,
  95: 1.96,
  99: 2.576
};

const powerZ = 0.84;

const lowMoodMessages = [
  {
    title: "Можно начать с малого",
    text: "Даже несколько интервью уже лучше, чем спор без данных"
  },
  {
    title: "Исследование само себя не проведёт",
    text: "Но после старта обычно становится сильно легче"
  },
  {
    title: "Респонденты не такие страшные",
    text: "Большинство просто хотят рассказать, что неудобно"
  }
];

const highMoodMessages = [
  {
    title: "Отлично! Вы настроены на результат",
    text: "С таким настроем исследование точно принесёт полезные инсайты"
  },
  {
    title: "Полевой этап близко",
    text: "Пора превращать гипотезы в реальные данные"
  },
  {
    title: "Хороший исследовательский настрой",
    text: "Респонденты уже мысленно готовы жаловаться на интерфейс"
  }
];

function formatNumber(num) {
  return new Intl.NumberFormat("ru-RU").format(num || 0);
}

function parsePopulation(value) {
  return Number(String(value).replace(/\s/g, "").replace(/\D/g, ""));
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
  const n = applyFinitePopulationCorrection(n0, N);

  return Math.ceil(n);
}

function getCsiSampleSize() {
  const N = parsePopulation(populationInput.value);
  const e = Number(marginInput.value) / 100;
  const p = Number(proportionInput.value) / 100;
  const Z = zScores[selectedConfidence];

  if (!N || N < 1 || !e || !p) return 0;

  const designEffect = 1.15;
  const n0 = ((Math.pow(Z, 2) * p * (1 - p)) / Math.pow(e, 2)) * designEffect;
  const n = applyFinitePopulationCorrection(n0, N);

  return Math.ceil(n);
}

function getAbTestSampleSize() {
  const N = parsePopulation(populationInput.value);
  const mde = Number(marginInput.value) / 100;
  const p = Number(proportionInput.value) / 100;
  const Z = zScores[selectedConfidence];

  if (!N || N < 1 || !mde || !p) return 0;

  const samplePerGroup =
    (2 * Math.pow(Z + powerZ, 2) * p * (1 - p)) /
    Math.pow(mde, 2);

  const totalSample = samplePerGroup * 2;
  const correctedTotal = applyFinitePopulationCorrection(totalSample, N);

  return Math.ceil(correctedTotal);
}

function getSampleSize() {
  if (selectedType === "CSI") {
    return getCsiSampleSize();
  }

  if (selectedType === "A/B-тест") {
    return getAbTestSampleSize();
  }

  return getSurveySampleSize();
}

function updateTypeContent() {
  if (selectedType === "Опрос") {
    respondentsLabel.textContent = "респондентов";

    typeNote.textContent =
      "Для опроса используется классическая формула расчёта выборки для доли";

    formulaText.innerHTML = `
      <p><strong>Для опроса:</strong></p>
      <p>n₀ = (Z² × p × (1 − p)) / e²</p>
      <p>n = n₀ / (1 + (n₀ − 1) / N)</p>
    `;
  }

  if (selectedType === "CSI") {
    respondentsLabel.textContent = "респондентов";

    typeNote.textContent =
      "Для CSI используется формула для доли с небольшим запасом 15%, потому что индекс часто применяется для управленческих решений и регулярного мониторинга";

    formulaText.innerHTML = `
      <p><strong>Для CSI:</strong></p>
      <p>n₀ = ((Z² × p × (1 − p)) / e²) × 1.15</p>
      <p>n = n₀ / (1 + (n₀ − 1) / N)</p>
    `;
  }

  if (selectedType === "A/B-тест") {
    respondentsLabel.textContent = "респондентов всего";

    typeNote.textContent =
      "Для A/B-теста считается общий объём выборки для двух равных групп. Погрешность используется как минимальный детектируемый эффект, мощность принята за 80%";

    formulaText.innerHTML = `
      <p><strong>Для A/B-теста:</strong></p>
      <p>nᵍ = (2 × (Z + 0.84)² × p × (1 − p)) / e²</p>
      <p>n = 2 × nᵍ</p>
      <p>nᵍ — размер одной группы, 0.84 — коэффициент для мощности 80%</p>
    `;
  }
}

function updateMoodMessage() {
  const mood = Number(moodInput.value);
  const isLow = mood < 5;

  const messages = isLow ? lowMoodMessages : highMoodMessages;
  const index = Math.min(messages.length - 1, Math.floor((mood / 10) * messages.length));
  const message = messages[index];

  moodMessage.classList.toggle("low", isLow);
  moodMessage.querySelector("h2").textContent = message.title;
  moodMessage.querySelector("p").textContent = message.text;
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

  summaryType.textContent = selectedType;
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
    document.querySelectorAll("#researchType .segment").forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    selectedType = button.dataset.type;
    updateCalculator();
  });
});

document.querySelectorAll("#confidence .segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#confidence .segment").forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");
    selectedConfidence = Number(button.dataset.confidence);
    updateCalculator();
  });
});

[marginInput, proportionInput, moodInput].forEach((input) => {
  input.addEventListener("input", updateCalculator);
});

updateCalculator();


const langSwitch = document.getElementById("langSwitch");

let currentLang = "ru";

const translations = {
  ru: {
    tool: "UX Research Tool",
    titleMain: "Калькулятор размера",
    titleAccent: "выборки",
    subtitle: "Для опросов, CSI и предварительной оценки аудитории A/B-тестов",
    heroNote: "Быстро считаем выборку — меньше споров, больше данных"
  },
  en: {
    tool: "UX Research Tool",
    titleMain: "Sample Size",
    titleAccent: "Calculator",
    subtitle: "For surveys, CSI and preliminary A/B-test audience estimation",
    heroNote: "Calculate faster — argue less, research more"
  }
};

langSwitch.addEventListener("click", () => {
  currentLang = currentLang === "ru" ? "en" : "ru";

  document.getElementById("toolLabel").textContent = translations[currentLang].tool;
  document.getElementById("titleMain").textContent = translations[currentLang].titleMain;
  document.getElementById("titleAccent").textContent = translations[currentLang].titleAccent;
  document.getElementById("subtitle").textContent = translations[currentLang].subtitle;
  document.getElementById("heroNote").textContent = translations[currentLang].heroNote;

  langSwitch.textContent = currentLang === "ru" ? "EN" : "RU";
});
