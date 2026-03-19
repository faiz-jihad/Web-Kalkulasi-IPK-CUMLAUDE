let semesterCount = 0;
let totalSemesterNormal = 8;
let ipsChart = null;
let ipkChart = null;
let gaugeChart = null;

window.onload = () => {
    console.log("Application Loading...");
    try {
        // Initial setup
        const savedData = localStorage.getItem("smartIpkData");
        if (savedData) {
            console.log("Restoring saved data...");
            const data = JSON.parse(savedData);
            document.getElementById("jenjang").value = data.jenjang || "S1";
            setTotalSemester(false);
            semesterCount = 0;
            document.getElementById("semesters").innerHTML = "";
            data.semesters.forEach((s) => {
                semesterCount++;
                renderSemester(semesterCount, s.ips, s.sks);
            });
        } else {
            setTotalSemester(true);
        }

        // Initialize Charts with delay to ensure DOM and library are ready
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                initCharts();
                calculateAll();
            } else {
                console.error("Chart.js not found!");
            }
        }, 300);

        // UI Components
        if (window.lucide) lucide.createIcons();
        
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(() => {});
        }

        // Handle shared data
        const sharedData = new URLSearchParams(window.location.search).get('data');
        if (sharedData) {
            try {
                const decoded = atob(sharedData);
                localStorage.setItem("smartIpkData", decoded);
                window.history.replaceState({}, document.title, window.location.pathname);
                location.reload();
            } catch (e) {
                console.error("Shared data error:", e);
            }
        }
    } catch (error) {
        console.error("Critical Init Error:", error);
    }
};

function initCharts() {
    console.log("Initializing Charts...");
    try {
        const ipsCtx = document.getElementById("ipsChart");
        const ipkCtx = document.getElementById("ipkChart");
        const gaugeCtx = document.getElementById("gauge");

        if (!ipsCtx || !ipkCtx || !gaugeCtx) {
            console.error("Canvas elements missing!");
            return;
        }

        ipsChart = new Chart(ipsCtx.getContext("2d"), {
            type: "bar",
            data: {
                labels: [],
                datasets: [{ label: "IPS", data: [], backgroundColor: "#2563eb", borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 4 } } }
        });

        ipkChart = new Chart(ipkCtx.getContext("2d"), {
            type: "line",
            data: {
                labels: [],
                datasets: [{ label: "IPK", data: [], borderColor: "#10b981", tension: 0.4, fill: true, backgroundColor: "rgba(16, 185, 129, 0.1)" }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 4 } } }
        });

        gaugeChart = new Chart(gaugeCtx.getContext("2d"), {
            type: "doughnut",
            data: {
                labels: ["Peluang", "Sisa"],
                datasets: [{ data: [0, 100], backgroundColor: ["#2563eb", "#f1f5f9"], borderWidth: 0, circumference: 180, rotation: 270 }]
            },
            options: { cutout: "80%", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        });
        
        console.log("Charts Initialized Successfully");
    } catch (e) {
        console.error("Chart Init Exception:", e);
    }
}

function calculateAll() {
    console.log("Calculating...");
    try {
        const ipsArr = [];
        const sksArr = [];
        for (let i = 1; i <= semesterCount; i++) {
            const ips = parseFloat(document.getElementById(`ips-${i}`)?.value) || 0;
            const sks = parseFloat(document.getElementById(`sks-${i}`)?.value) || 20;
            ipsArr.push(ips);
            sksArr.push(sks);
        }

        let totalSKS = 0, totalBobot = 0;
        const ipkCumul = [];
        ipsArr.forEach((ips, i) => {
            totalSKS += sksArr[i];
            totalBobot += ips * sksArr[i];
            ipkCumul.push(totalSKS ? totalBobot / totalSKS : 0);
        });

        const currentIPK = totalSKS ? totalBobot / totalSKS : 0;
        document.getElementById("totalIPK").textContent = currentIPK.toFixed(2);

        const jenjang = document.getElementById("jenjang").value;
        const target = jenjang === "S1" ? 3.51 : 3.75;
        const predikat = currentIPK >= target ? "Cumlaude" : currentIPK >= 3.0 ? "Sangat Memuaskan" : "Cukup";
        
        const predEl = document.getElementById("predikat");
        predEl.textContent = predikat;
        predEl.className = `badge-status ${currentIPK >= target ? 'badge-success' : 'badge-warning'}`;

        // Update Charts if initialized
        if (ipsChart && ipkChart && gaugeChart) {
            const labels = ipsArr.map((_, i) => "Sem " + (i + 1));
            ipsChart.data.labels = labels;
            ipsChart.data.datasets[0].data = ipsArr;
            ipsChart.update();

            ipkChart.data.labels = labels;
            ipkChart.data.datasets[0].data = ipkCumul;
            ipkChart.update();

            const prob = Math.max(5, Math.min(95, 100 - ((target - currentIPK) * 50)));
            gaugeChart.data.datasets[0].data = [prob, 100 - prob];
            gaugeChart.update();
            document.getElementById("probText").textContent = `${Math.round(prob)}% Chance`;
        }
    } catch (e) {
        console.error("Calculation Error:", e);
    }
}

function setTotalSemester(reset = true) {
    const jenjang = document.getElementById("jenjang").value;
    totalSemesterNormal = (jenjang === "D3" ? 6 : jenjang === "S1" ? 8 : 4);
    if (reset) {
        document.getElementById("semesters").innerHTML = "";
        semesterCount = 0;
        addSemester();
    }
    calculateAll();
}

function addSemester() {
    semesterCount++;
    renderSemester(semesterCount);
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
        const el = document.getElementById(`semester-${semesterCount}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

function renderSemester(index, ips = "", sks = "") {
    const container = document.getElementById("semesters");
    const div = document.createElement("div");
    div.className = "semester-item";
    div.id = `semester-${index}`;
    div.innerHTML = `
        <h4>Semester ${index}</h4>
        <div class="input-group">
            <label class="small">IPS</label>
            <input id="ips-${index}" type="number" step="0.01" value="${ips}" onchange="calculateAll(); saveData();">
        </div>
        <div class="input-group">
            <label class="small">SKS</label>
            <input id="sks-${index}" type="number" value="${sks || 20}" onchange="calculateAll(); saveData();">
        </div>
        <button class="btn btn-danger" onclick="this.parentElement.remove(); calculateAll(); saveData();">
            <i data-lucide="trash-2"></i>
        </button>
    `;
    container.appendChild(div);
}

function showToast(message, color = "var(--accent)") {
    const t = document.createElement("div");
    t.className = "toast";
    t.style.background = color;
    t.style.display = "block";
    t.style.opacity = "1";
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => {
        t.style.opacity = "0";
        setTimeout(() => t.remove(), 500);
    }, 3000);
}

function exportToPDF() { showToast("Generating Report..."); }
function shareDashboard() {
    const data = localStorage.getItem("smartIpkData");
    if (!data) return showToast("No data to share", "var(--danger)");
    const url = `${window.location.origin}${window.location.pathname}?data=${btoa(data)}`;
    navigator.clipboard.writeText(url).then(() => showToast("Link Copied!"));
}

function saveData() {
    const semesters = [];
    for (let i = 1; i <= semesterCount; i++) {
        const ips = document.getElementById(`ips-${i}`);
        const sks = document.getElementById(`sks-${i}`);
        if (ips && sks) semesters.push({ ips: parseFloat(ips.value) || 0, sks: parseFloat(sks.value) || 0 });
    }
    localStorage.setItem("smartIpkData", JSON.stringify({ jenjang: document.getElementById("jenjang").value, semesters }));
}

function resetData() {
    if (confirm("Reset all data?")) {
        localStorage.removeItem("smartIpkData");
        location.reload();
    }
}
function askAI() { document.getElementById("chatOutput").textContent = "Fokus pada SKS tinggi untuk peningkatan IPK yang signifikan."; }
function clearChat() { document.getElementById("chatOutput").textContent = ""; }
