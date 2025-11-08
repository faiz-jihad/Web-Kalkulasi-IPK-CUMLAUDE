
let semesterCount = 0;
let totalSemesterNormal = 8;
let ipsChart, ipkChart, gaugeChart;
window.onload = () => {
  try {
    initCharts();
    const savedData = localStorage.getItem("smartIpkData");
    if (savedData) {
      const data = JSON.parse(savedData);
      document.getElementById("jenjang").value = data.jenjang || "S1";
      setTotalSemester(false);
      semesterCount = data.semesters.length;
      data.semesters.forEach((semester, index) =>
        renderSemester(index + 1, semester.ips, semester.sks)
      );
      calculateAll();
    } else {
      setTotalSemester(true);
    }
  } catch (error) {
    console.error("Error initializing application:", error);
  }
};
function initCharts() {
  try {
    const ipsCtx = document.getElementById("ipsChart").getContext("2d");
    const ipkCtx = document.getElementById("ipkChart").getContext("2d");
    const gaugeCtx = document.getElementById("gauge").getContext("2d");

    // IPS
    ipsChart = new Chart(ipsCtx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "IPS",
            data: [],
            backgroundColor: "#2563eb88",
            borderColor: "#2563eb",
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 4,
            title: { display: true, text: "IPS" },
          },
          x: {
            title: { display: true, text: "Semester" },
          },
        },
        plugins: {
          legend: { display: false },
        },
      },
    });
    ipkChart = new Chart(ipkCtx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "IPK kumulatif",
            data: [],
            borderColor: "#10b981",
            tension: 0.3,
            borderWidth: 3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 4,
            title: { display: true, text: "IPK" },
          },
          x: {
            title: { display: true, text: "Semester" },
          },
        },
      },
    });
    gaugeChart = new Chart(gaugeCtx, {
      type: "doughnut",
      data: {
        labels: ["Peluang", "Sisa"],
        datasets: [
          {
            data: [0, 100],
            backgroundColor: ["#10b981", "#e6eef6"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        cutout: "70%",
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
    });
  } catch (error) {
    console.error("Error initializing charts:", error);
  }
}

/**
 * Updates chart data and refreshes displays.
 * @param {number[]} ipsData - Array of IPS values per semester
 * @param {number[]} ipkData - Array of cumulative IPK values
 * @param {Object} projection - Projection data with labels and data arrays
 */
function updateCharts(ipsData, ipkData, projection = []) {
  try {
    const labels = ipsData.map((_, i) => "S" + (i + 1));
    ipsChart.data.labels = labels;
    ipsChart.data.datasets[0].data = ipsData;
    ipsChart.update();

    ipkChart.data.labels = labels.concat(projection.labels || []);
    ipkChart.data.datasets[0].data = ipkData.concat(projection.data || []);
    ipkChart.update();
  } catch (error) {
    console.error("Error updating charts:", error);
  }
}

/**
 * Updates the probability gauge chart and text display.
 * @param {number} percent - Probability percentage (0-100)
 */
function updateGauge(percent) {
  try {
    const p = Math.max(0, Math.min(100, Math.round(percent)));
    gaugeChart.data.datasets[0].data = [p, 100 - p];
    gaugeChart.update();
    document.getElementById(
      "probText"
    ).textContent = `Peluang Cumlaude ≈ ${p}%`;
  } catch (error) {
    console.error("Error updating gauge:", error);
  }
}

/* ============================
   UI: Semester Management
   ============================ */

/**
 * Sets the total number of semesters based on the selected academic level.
 * @param {boolean} reset - Whether to reset the UI and add the first semester
 */
function setTotalSemester(reset = true) {
  try {
    const jenjang = document.getElementById("jenjang").value;
    totalSemesterNormal = getSemesterCountForJenjang(jenjang);
    if (reset) {
      document.getElementById("semesters").innerHTML = "";
      semesterCount = 0;
      addSemester();
    }
    calculateAll();
  } catch (error) {
    console.error("Error setting total semester:", error);
  }
}

/**
 * Gets the standard semester count for a given academic level.
 * @param {string} jenjang - Academic level (D3, S1, S2, S3)
 * @returns {number} Number of semesters
 */
function getSemesterCountForJenjang(jenjang) {
  const semesterMap = {
    D3: 6,
    S1: 8,
    S2: 4,
    S3: 6,
  };
  return semesterMap[jenjang] || 8; // Default to S1
}

/**
 * Adds a new semester to the UI.
 */
function addSemester() {
  try {
    semesterCount++;
    renderSemester(semesterCount);
    saveData();
  } catch (error) {
    console.error("Error adding semester:", error);
  }
}

/**
 * Renders a semester input block in the UI.
 * @param {number} index - Semester number
 * @param {string|number} ips - Initial IPS value
 * @param {string|number} sks - Initial SKS value
 */
function renderSemester(index, ips = "", sks = "") {
  try {
    const container = document.getElementById("semesters");
    const div = document.createElement("div");
    div.className = "semester";
    div.id = `semester-${index}`;
    div.innerHTML = `
      <h4>Semester ${index}</h4>
      <div class="row inline">
        <label style="flex:1">
          <div class="small">IPS</div>
          <input id="ips-${index}" type="number" step="0.01" min="0" max="4" value="${ips}" onchange="onInputChange(${index})" placeholder="0.00">
        </label>
        <label style="width:140px">
          <div class="small">SKS</div>
          <input id="sks-${index}" type="number" min="1" value="${
      sks || 3
    }" onchange="onInputChange(${index})" placeholder="SKS">
        </label>
        <div style="display:flex;align-items:center">
          <button class="btn-danger" onclick="removeSpecific(${index})" title="Hapus semester">Hapus</button>
        </div>
      </div>
    `;
    container.appendChild(div);
    calculateAll();
  } catch (error) {
    console.error("Error rendering semester:", error);
  }
}

/**
 * Removes a specific semester and reorders the remaining ones.
 * @param {number} idx - Semester index to remove
 */
function removeSpecific(idx) {
  try {
    const el = document.getElementById(`semester-${idx}`);
    if (!el) return;
    el.remove();
    // Rebuild indexes to maintain 1..N sequence
    const nodes = Array.from(document.querySelectorAll(".semester"));
    document.getElementById("semesters").innerHTML = "";
    semesterCount = 0;
    nodes.forEach((node) => {
      const ipsValue = node.querySelector("input[id^=ips-]").value;
      const sksValue = node.querySelector("input[id^=sks-]").value;
      semesterCount++;
      renderSemester(semesterCount, ipsValue, sksValue);
    });
    saveData();
    calculateAll();
  } catch (error) {
    console.error("Error removing specific semester:", error);
  }
}

/**
 * Removes the last semester.
 */
function removeSemester() {
  try {
    if (semesterCount > 0) {
      document.getElementById(`semester-${semesterCount}`).remove();
      semesterCount--;
      saveData();
      calculateAll();
    }
  } catch (error) {
    console.error("Error removing semester:", error);
  }
}

/**
 * Handles input changes for a specific semester, validates IPS values.
 * @param {number} i - Semester index
 */
function onInputChange(i) {
  try {
    const ipsInput = document.getElementById(`ips-${i}`);
    let ips = parseFloat(ipsInput.value) || 0;
    // Clamp IPS between 0 and 4
    ips = Math.max(0, Math.min(4, ips));
    ipsInput.value = ips.toFixed(2);
    calculateAll();
    saveData();
  } catch (error) {
    console.error("Error handling input change:", error);
  }
}

/* ============================
   Core calculations & AI heuristics
   ============================ */

function calculateAll() {
  // gather data
  const ipsArr = [];
  const sksArr = [];
  for (let i = 1; i <= semesterCount; i++) {
    const ips = parseFloat(document.getElementById(`ips-${i}`)?.value) || 0;
    const sks = parseFloat(document.getElementById(`sks-${i}`)?.value) || 0;
    ipsArr.push(Number(ips.toFixed(2)));
    sksArr.push(sks);
  }

  // cumulative IPK per semester
  let totalSKS = 0,
    totalBobot = 0;
  const ipkCumul = [];
  for (let i = 0; i < ipsArr.length; i++) {
    totalSKS += sksArr[i];
    totalBobot += ipsArr[i] * sksArr[i];
    ipkCumul.push(totalSKS ? Number((totalBobot / totalSKS).toFixed(4)) : 0);
  }
  const currentIPK = totalSKS ? totalBobot / totalSKS : 0;

  // trend analysis
  const trend = analyzeTrend(ipsArr);

  // determine predikat & target
  const jenjang = document.getElementById("jenjang").value;
  const { target, predikat, color } = getPredikat(currentIPK, jenjang);

  // remaining semesters and SKS avg heuristic
  const remainingSem = Math.max(0, totalSemesterNormal - semesterCount);
  const avgSks = semesterCount > 0 ? totalSKS / semesterCount : 20;

  const { neededIPS, message, feasible } = getNextTarget(
    currentIPK,
    totalSKS,
    totalBobot,
    target,
    avgSks,
    remainingSem
  );

  // probability heuristic
  const prob = estimateProbability(
    currentIPK,
    trend.avgDelta,
    neededIPS,
    avgRecent(ipsArr, 3),
    remainingSem
  );

  // update UI & charts
  document.getElementById(
    "totalIPK"
  ).textContent = `Total IPK: ${currentIPK.toFixed(2)}`;
  const predEl = document.getElementById("predikat");
  predEl.textContent = `Predikat: ${predikat} (target Cumlaude: ${target.toFixed(
    2
  )})`;
  predEl.style.color = color;

  const t = document.getElementById("targetNext");
  t.textContent = message;

  updateGauge(prob);
  updateCharts(
    ipsArr,
    ipkCumul,
    generateProjection(ipkCumul, remainingSem, neededIPS)
  );
  renderInsights(trend, currentIPK, neededIPS, remainingSem, feasible);

  saveData();
}

/* ============ Trend analysis (simple linear heuristics) ============ */
function analyzeTrend(ipsArr) {
  if (ipsArr.length <= 1)
    return { avgDelta: 0, slope: 0, note: "Cukup sedikit data" };
  const deltas = [];
  for (let i = 1; i < ipsArr.length; i++)
    deltas.push(ipsArr[i] - ipsArr[i - 1]);
  const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  // slope via simple least squares
  const n = ipsArr.length;
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;
  for (let i = 0; i < n; i++) {
    const x = i + 1;
    const y = ipsArr[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const note = avgDelta > 0.05 ? "Naik" : avgDelta < -0.05 ? "Turun" : "Stabil";
  return {
    avgDelta: Number(avgDelta.toFixed(3)),
    slope: Number(slope.toFixed(4)),
    note,
  };
}

/* ============ Predict required IPS per remaining semester ============ */
function getNextTarget(
  ipk,
  totalSKS,
  totalBobot,
  target,
  nextSks,
  remainingSem
) {
  if (remainingSem <= 0) {
    if (ipk >= target)
      return {
        neededIPS: 0,
        message: "Sudah semester akhir — kamu memenuhi target!",
        feasible: true,
      };
    return {
      neededIPS: Infinity,
      message:
        "Sudah semester akhir — tidak ada semester tersisa untuk memperbaiki IPK.",
      feasible: false,
    };
  }
  const totalSksFinal = totalSKS + nextSks * remainingSem;
  const targetTotalBobot = target * totalSksFinal;
  const sisaBobot = targetTotalBobot - totalBobot;
  const neededIPS = sisaBobot / (nextSks * remainingSem);
  const feasible = neededIPS <= 4;
  let message = "";
  if (ipk >= target) message = " Kamu sudah di jalur Cumlaude — pertahankan!";
  else if (!feasible)
    message = `⚠ Tidak realistis: butuh IPS rata-rata ${neededIPS.toFixed(
      2
    )} (>4.00) di ${remainingSem} semester tersisa.`;
  else
    message = ` Butuh IPS rata-rata ≈ ${neededIPS.toFixed(
      2
    )} di ${remainingSem} semester tersisa untuk mencapai IPK ${target.toFixed(
      2
    )}.`;
  return { neededIPS, message, feasible };
}

/* ============ Predikat rules ============ */
function getPredikat(ipk, jenjang) {
  let target = 3.5;
  if (jenjang === "S1") target = 3.51;
  else if (jenjang === "S2") target = 3.7;
  else if (jenjang === "S3") target = 3.8;
  let predikat = "Cukup",
    color = "var(--muted)";
  if (ipk >= target) {
    predikat = "Cumlaude ";
    color = "var(--accent)";
  } else if (ipk >= 3) {
    predikat = "Sangat Memuaskan";
    color = "#f59e0b";
  } else if (ipk >= 2.75) {
    predikat = "Memuaskan";
    color = "#eab308";
  }
  return { target, predikat, color };
}

/* ============ Probability heuristic ============
   Heuristic combining:
   - Current IPK distance to target
   - Recent IPS trend
   - Needed IPS
   - Remaining semesters
   Returns percentage 0..100
================================================================= */
function estimateProbability(
  currentIPK,
  avgDelta,
  neededIPS,
  recentAvgIPS,
  remainingSem
) {
  if (remainingSem <= 0)
    return currentIPK >= 0
      ? currentIPK >= currentIPK
        ? currentIPK >= currentIPK
          ? 100
          : 50
        : 50
      : 0;
  // base on closeness:
  const baseDist = Math.max(0, neededIPS - recentAvgIPS);
  // transform to score: smaller baseDist -> higher score
  let score = 50; // neutral
  if (baseDist <= 0)
    score = 85 + Math.min(15, Math.round(Math.abs(baseDist) * 20));
  // already achieving
  else {
    // if neededIPS >4 it's very low
    if (neededIPS > 4) score = 6;
    else {
      // factor in trend: positive avgDelta improves chance
      const trendBoost = Math.max(-10, Math.min(20, Math.round(avgDelta * 40)));
      // factor in remainingSem: more semesters better
      const remBoost = Math.min(20, remainingSem * 6);
      // factor in how far neededIPS is from 4 (easier if neededIPS much below 4)
      const difficulty = Math.round((4 - neededIPS) * 12); 
      score = 20 + difficulty + trendBoost + remBoost;
    }
  }
  // clamp
  score = Math.max(2, Math.min(98, score));
  return score;
}

/* ============ Projections for chart ============ */
function generateProjection(ipkCumul, remainingSem, neededIPS) {
  if (remainingSem <= 0) return { labels: [], data: [] };
  // simple projection: extend last ipk using neededIPS assuming avg SKS same as last semester
  const lastIPK = ipkCumul.length ? ipkCumul[ipkCumul.length - 1] : 0;
  const projLabels = [];
  const projData = [];
  let totalSKS = 0,
    totalBobot = 0;
  // We'll simulate by adding remainingSem points which gradually approach target if neededIPS feasible
  for (let s = 1; s <= remainingSem; s++) {
    projLabels.push("P" + s);
    // naive incremental: assume each future semester IPS = neededIPS (if finite) else 4 or current
    const futureIPS = isFinite(neededIPS) ? neededIPS : 4.0;
    // approximate: new cumulative IPK moves towards target
    let simulatedIPK =
      lastIPK + (futureIPS - lastIPK) * (s / (remainingSem + 1));
    // clamp
    simulatedIPK = Math.max(0, Math.min(4, simulatedIPK));
    projData.push(Number(simulatedIPK.toFixed(3)));
  }
  return { labels: projLabels, data: projData };
}

/* ============ Helpers ============ */
function avgRecent(arr, n) {
  if (!arr.length) return 0;
  const slice = arr.slice(Math.max(0, arr.length - n));
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

/* ============================
   Simulation features
   ============================ */
function runSimulation() {
  const target = parseFloat(document.getElementById("simTarget").value) || 0;
  // re-use current stats
  let totalSKS = 0,
    totalBobot = 0;
  for (let i = 1; i <= semesterCount; i++) {
    const ips = parseFloat(document.getElementById(`ips-${i}`)?.value) || 0;
    const sks = parseFloat(document.getElementById(`sks-${i}`)?.value) || 0;
    totalSKS += sks;
    totalBobot += ips * sks;
  }
  const remainingSem = Math.max(0, totalSemesterNormal - semesterCount);
  const avgSks = semesterCount > 0 ? totalSKS / semesterCount : 20;
  if (remainingSem <= 0) {
    document.getElementById("simResult").textContent =
      "Sudah semester akhir — tidak ada sisa semester untuk simulasi.";
    return;
  }
  const totalSksFinal = totalSKS + avgSks * remainingSem;
  const neededTotalBobot = target * totalSksFinal;
  const sisa = neededTotalBobot - totalBobot;
  const neededIPS = sisa / (avgSks * remainingSem);
  const difficulty =
    neededIPS > 4
      ? "Mustahil"
      : neededIPS > 3.6
      ? "Sangat Sulit"
      : neededIPS > 3.2
      ? "Sulit"
      : neededIPS > 2.9
      ? "Menantang"
      : "Realistis";
  document.getElementById(
    "simResult"
  ).textContent = `Untuk target IPK ${target.toFixed(
    2
  )}, diperlukan rata-rata IPS ≈ ${
    isFinite(neededIPS) ? neededIPS.toFixed(2) : "—"
  } per semester selama ${remainingSem} semester tersisa. Evaluasi: ${difficulty}.`;
}

/* ============================
   Mini chat (rule-based suggestions)
   ============================ */
function askAI() {
  const q = (document.getElementById("chatInput").value || "")
    .trim()
    .toLowerCase();
  if (!q) {
    document.getElementById("chatOutput").textContent =
      "Tulis pertanyaan dahulu.";
    return;
  }

  const ips = [];
  const sks = [];
  for (let i = 1; i <= semesterCount; i++) {
    ips.push(parseFloat(document.getElementById(`ips-${i}`)?.value) || 0);
    sks.push(parseFloat(document.getElementById(`sks-${i}`)?.value) || 0);
  }
  const trend = analyzeTrend(ips);
  const recent = avgRecent(ips, 3);

  let reply =
    'Maaf, saya belum paham. Coba tanya: "cara naik IPS", "strategi semester depan", atau "berapa IPS butuh cumlaude".';
  if (q.includes("naik") || q.includes("meningkat") || q.includes("cara")) {
    reply = `Rekomendasi umum:\n• Review materi yang sering muncul di ujian (prioritas 20% materi berdampak 80%).\n• Fokus pada mata kuliah dengan bobot SKS besar — peningkatan kecil di sana berdampak besar ke IPK.\n• Jika IPS rata-rata terakhir ${recent.toFixed(
      2
    )}, target realistis kenaikan per semester ≈ 0.10–0.25.\n• Teknik: belajar aktif, summary tiap minggu, tanya dosen asisten, kelompok belajar terjadwal.`;
  } else if (q.includes("cumlaude") || q.includes("target")) {
    let totalSKS = 0,
      totalBobot = 0;
    for (let i = 0; i < ips.length; i++) {
      totalSKS += sks[i];
      totalBobot += ips[i] * sks[i];
    }
    const jenjang = document.getElementById("jenjang").value;
    const { target } = getPredikat(totalBobot / (totalSKS || 1), jenjang);
    const avgSks = ips.length > 0 ? totalSKS / ips.length : 20;
    const remainingSem = Math.max(0, totalSemesterNormal - ips.length);
    const { neededIPS } = getNextTarget(
      totalBobot / (totalSKS || 1),
      totalSKS,
      totalBobot,
      target,
      avgSks,
      remainingSem
    );
    if (!isFinite(neededIPS))
      reply = `Dengan sisa semester ${remainingSem}, tidak realistis mencapai Cumlaude (butuh IPS > 4.00). Pertimbangkan opsi: memperpanjang studi untuk menambah semester agar beban SKS per semester menurun.`;
    else
      reply = `Untuk Cumlaude (target ${target.toFixed(
        2
      )}), diperlukan IPS rata-rata ~${neededIPS.toFixed(
        2
      )} pada ${remainingSem} semester tersisa. Jika itu >3.8, fokus ke SKS besar dan pertahankan konsistensi.`;
  } else if (q.includes("strategi") || q.includes("semester depan")) {
    reply = `Strategi semester depan:\n• Pilih kombinasi SKS yang realistis (jangan overload). \n• Prioritaskan nilai A/B+ pada mata kuliah berkredit besar. \n• Alokasikan mingguan: 50% tugas & 50% review. \n• Gunakan catatan aktif (flashcards) & latihan soal lama.`;
  }

  document.getElementById("chatOutput").innerText = reply;
}

function clearChat() {
  document.getElementById("chatInput").value = "";
  document.getElementById("chatOutput").textContent = "";
}

/* ============================
   Insights rendering
   ============================ */
function renderInsights(trend, currentIPK, neededIPS, remainingSem, feasible) {
  const el = document.createElement("div");
  el.innerHTML = `
    <div style="margin-top:10px">
      <div class="insight"><strong>Insight:</strong> Tren IPS: <span class="badge">${
        trend.note
      }</span> (rata-rata perubahan per semester: ${trend.avgDelta.toFixed(
    3
  )})</div>
      <div class="insight">Estimasi IPK saat ini: <strong>${currentIPK.toFixed(
        3
      )}</strong></div>
      <div class="insight">${
        remainingSem > 0
          ? feasible
            ? `Butuh IPS ≈ ${neededIPS.toFixed(
                2
              )} per semester selama ${remainingSem} semester`
            : "Butuh IPS > 4.00 — tidak realistis tanpa strategi lain"
          : "Sudah semester akhir"
      }</div>
    </div>
  `;
  const container = document.getElementById("targetNext");
  container.parentNode.replaceChild(el, container);
  el.id = "targetNext";
}

/* ============================
   Persistence
   ============================ */
function saveData() {
  const jenjang = document.getElementById("jenjang").value;
  const semesters = [];
  for (let i = 1; i <= semesterCount; i++) {
    const ips = parseFloat(document.getElementById(`ips-${i}`)?.value) || 0;
    const sks = parseFloat(document.getElementById(`sks-${i}`)?.value) || 0;
    semesters.push({ ips, sks });
  }
  localStorage.setItem("smartIpkData", JSON.stringify({ jenjang, semesters }));
}

function resetData() {
  if (confirm("Hapus semua data dan mulai ulang?")) {
    localStorage.removeItem("smartIpkData");
    location.reload();
  }
}
