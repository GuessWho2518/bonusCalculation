// Переключение между вкладками
function openTab(tabName) {
  const tabs = document.getElementsByClassName("tab");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active");
  }

  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].classList.remove("active");
  }

  document.getElementById(tabName).classList.add("active");
  event.currentTarget.classList.add("active");
}

// ===== РАСЧЁТ ПРЕМИИ =====
function calculatePremium() {
  // Сброс ошибок
  document.querySelectorAll(".error").forEach((el) => {
    el.style.display = "none";
  });

  // Получение данных
  const grade = parseInt(document.getElementById("grade").value);
  const hours = parseInt(document.getElementById("hours").value);
  const rating = parseInt(document.getElementById("personal_rating").value);
  const knowledge = parseInt(document.getElementById("knowledge_level").value);
  const fcr = parseInt(document.getElementById("fcr").value);

  // Валидация
  let hasError = false;
  if (!hours || hours < 1) {
    document.getElementById("hours_error").textContent = "Введите часы ≥1";
    document.getElementById("hours_error").style.display = "block";
    hasError = true;
  }
  if (isNaN(rating) || rating < 0) {
    document.getElementById("rating_error").textContent = "Введите рейтинг ≥0%";
    document.getElementById("rating_error").style.display = "block";
    hasError = true;
  }
  if (isNaN(knowledge) || knowledge < 0) {
    document.getElementById("knowledge_error").textContent =
      "Введите знания ≥0%";
    document.getElementById("knowledge_error").style.display = "block";
    hasError = true;
  }
  if (isNaN(fcr) || fcr < 0) {
    document.getElementById("fcr_error").textContent = "Введите FCR ≥0%";
    document.getElementById("fcr_error").style.display = "block";
    hasError = true;
  }
  if (hasError) return;

  // Ставка за час
  const rates = { 1: 255, 2: 265, 3: 275 };
  const hourlyRate = rates[grade];

  // Расчёт процентов премии
  const ratingBonus = calculateRatingBonus(rating);
  const knowledgeBonus = calculateKnowledgeBonus(knowledge);
  const fcrBonus = calculateFcrBonus(fcr);
  const totalBonusPercent = ratingBonus + knowledgeBonus + fcrBonus;

  // Итоговая премия
  const baseBonus = hours * hourlyRate * 0.3;
  const finalBonus = baseBonus * (totalBonusPercent / 100);
  const totalAmount = hours * hourlyRate + finalBonus + 5;

  // Вывод
  document.getElementById("premiumResult").innerHTML = `
                <h3>Результат расчёта</h3>
                <p>Зарплата: ${(hours * hourlyRate).toFixed(2)} руб.</p>
                
                <div class="breakdown">
                    <h4>Детализация премии:</h4>
                    <p>Базовая премия (30%): <span class="highlight">${baseBonus.toFixed(
                      2
                    )} руб.</span></p>
                    <p>Рейтинг: +${ratingBonus}%</p>
                    <p>Знания: +${knowledgeBonus}%</p>
                    <p>FCR: +${fcrBonus}%</p>
                    <hr>
                    <p>Общий множитель: <span class="highlight">${totalBonusPercent}%</span></p>
                    <p>Итоговая премия: <span class="highlight">${finalBonus.toFixed(
                      2
                    )} руб.</span></p>
                </div>
                
                <p><strong>Всего к выплате: <span class="highlight">${totalAmount.toFixed(
                  2
                )} руб.</span></strong></p>
            `;
  document.getElementById("premiumResult").style.display = "block";
}

function calculateRatingBonus(rating) {
  if (rating < 75) return 0;
  if (rating < 85) return 33;
  if (rating < 100) return 55;
  if (rating < 115) return 65;
  return 70;
}

function calculateKnowledgeBonus(knowledge) {
  if (knowledge < 75) return 0;
  if (knowledge < 80) return 5;
  if (knowledge < 85) return 10;
  if (knowledge < 90) return 15;
  if (knowledge < 95) return 20;
  return 25;
}

function calculateFcrBonus(fcr) {
  if (fcr >= 115) return 0;
  if (fcr >= 105) return 5;
  if (fcr > 100) return 15;
  if (fcr >= 90) return 25;
  return 40;
}

// ===== РАСЧЁТ AHT =====
const timeInput = document.getElementById("totalTime");

// Автоматическое форматирование времени
timeInput.addEventListener("input", function (e) {
  let value = e.target.value.replace(/\D/g, "");
  if (value.length > 6) value = value.substr(0, 6);

  let formatted = "";
  if (value.length > 0) {
    formatted = value.substr(0, 2);
    if (value.length > 2) {
      formatted += ":" + value.substr(2, 2);
      if (value.length > 4) {
        formatted += ":" + value.substr(4, 2);
      }
    }
  }

  e.target.value = formatted;
  validateTimeInput();
});

timeInput.addEventListener("blur", validateTimeInput);

function validateTimeInput() {
  const errorElement = document.getElementById("timeError");
  const digits = timeInput.value.replace(/\D/g, "");
  const padded = digits.padStart(6, "0");

  errorElement.style.display = "none";

  if (digits.length === 0) return;

  if (digits.length !== 6) {
    errorElement.textContent = "Введите 6 цифр (например: 013045 для 01:30:45)";
    errorElement.style.display = "block";
    return;
  }

  const hours = parseInt(padded.substr(0, 2));
  const minutes = parseInt(padded.substr(2, 2));
  const seconds = parseInt(padded.substr(4, 2));

  if (hours > 23) {
    errorElement.textContent = "Часы не могут быть больше 23";
    errorElement.style.display = "block";
    return;
  }

  if (minutes > 59) {
    errorElement.textContent = "Минуты не могут быть больше 59";
    errorElement.style.display = "block";
    return;
  }

  if (seconds > 59) {
    errorElement.textContent = "Секунды не могут быть больше 59";
    errorElement.style.display = "block";
    return;
  }
}

function parseTimeToSeconds(timeStr) {
  const digits = timeStr.replace(/\D/g, "");
  const padded = digits.padStart(6, "0");

  const hours = parseInt(padded.substr(0, 2));
  const minutes = parseInt(padded.substr(2, 2));
  const seconds = parseInt(padded.substr(4, 2));

  return hours * 3600 + minutes * 60 + seconds;
}

function formatTimeFromSeconds(totalSeconds) {
  totalSeconds = Math.round(totalSeconds);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0")
  ].join(":");
}

function calculateAHT() {
  document.getElementById("timeError").style.display = "none";
  document.getElementById("countError").style.display = "none";

  validateTimeInput();
  if (document.getElementById("timeError").style.display === "block") {
    return;
  }

  const timeInputValue = document.getElementById("totalTime").value;
  const chatCount = parseInt(document.getElementById("chatCount").value);

  if (isNaN(chatCount) || chatCount <= 0) {
    document.getElementById("countError").textContent =
      "Введите число больше 0";
    document.getElementById("countError").style.display = "block";
    return;
  }

  const totalSeconds = parseTimeToSeconds(timeInputValue);
  const ahtSeconds = totalSeconds / chatCount;
  const ahtFormatted = formatTimeFromSeconds(ahtSeconds);

  document.getElementById("ahtResult").innerHTML = `
                <h3>Среднее время обработки (AHT)</h3>
                <p style="font-size: 24px; margin: 10px 0;" class="highlight">${ahtFormatted}</p>
                <div class="breakdown">
                    <p>Общее время: ${timeInputValue}</p>
                    <p>Количество чатов: ${chatCount}</p>
                </div>
            `;
  document.getElementById("ahtResult").style.display = "block";
}
