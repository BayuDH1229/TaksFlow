let tasks = [
  {
    id: 1,
    title: "Submit final project report",
    priority: "high",
    due: "Due in 3 hours",
    done: false,
  },
  {
    id: 2,
    title: "Client presentation slides",
    priority: "high",
    due: "Due Tomorrow, 9 AM",
    done: false,
  },
  {
    id: 3,
    title: "Review contract documents",
    priority: "medium",
    due: "Due Tomorrow, 2 PM",
    done: false,
  },
  {
    id: 4,
    title: "Reply to client emails",
    priority: "medium",
    due: "",
    done: false,
  },
  {
    id: 5,
    title: "Update portfolio website",
    priority: "low",
    due: "",
    done: false,
  },
  {
    id: 6,
    title: "Team standup meeting notes",
    priority: "low",
    due: "Due Today, 6 PM",
    done: false,
  },
];

let selectedPriority = "high";
let activeFilter = "all";
let nextId = 7;
let currentPage = "home";

const pConfig = {
  high: {
    label: "High Priority",
    dot: "bg-red-400",
    badge: "bg-red-50 text-red-500",
    border: "border-red-100",
  },
  medium: {
    label: "Medium",
    dot: "bg-orange-400",
    badge: "bg-orange-50 text-orange-500",
    border: "border-orange-100",
  },
  low: {
    label: "Low",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-500",
    border: "border-blue-100",
  },
};

/* ---- SIDEBAR TOGGLE ---- */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  sidebar.classList.toggle("open");
  overlay.classList.toggle("active");
}

function closeSidebarMobile() {
  if (window.innerWidth <= 768) {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");
    sidebar.classList.remove("open");
    overlay.classList.remove("active");
  }
}

/* ---- NAVIGATION ---- */
function navigate(page) {
  currentPage = page;
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");

  // Desktop nav
  document.querySelectorAll(".nav-link").forEach((l) => {
    l.classList.toggle("active", l.dataset.page === page);
    l.classList.toggle("text-gray-500", l.dataset.page !== page);
  });

  // Mobile nav
  ["home", "tasks", "settings"].forEach((p) => {
    const isActive = p === page;
    document.getElementById("mob-" + p + "-bg").style.background = isActive
      ? "#eff4ff"
      : "";
    document.getElementById("mob-" + p + "-icon").style.color = isActive
      ? "#3b6cf7"
      : "#98a2b3";
    document.getElementById("mob-" + p + "-label").style.color = isActive
      ? "#3b6cf7"
      : "#98a2b3";
    document.getElementById("mob-" + p + "-label").style.fontWeight = isActive
      ? "700"
      : "500";
  });

  if (page === "home") renderHome();
  if (page === "tasks") renderTasks();
  window.scrollTo(0, 0);
}

/* ---- HOME ---- */
function renderHome() {
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const remaining = total - done;
  const pct = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("home-completed").textContent = done;
  document.getElementById("home-remaining").textContent = remaining;
  document.getElementById("home-high").textContent = tasks.filter(
    (t) => !t.done && t.priority === "high",
  ).length;
  document.getElementById("home-total").textContent = total;

  // Ring
  const circumference = 251.2;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById("progress-ring").style.strokeDashoffset = offset;
  document.getElementById("ring-pct").textContent = pct + "%";
  document.getElementById("ring-done").textContent = done;
  document.getElementById("ring-left").textContent = remaining;

  // Priority list
  const pending = tasks.filter((t) => !t.done).slice(0, 3);
  const plist = document.getElementById("priority-list");
  const noPri = document.getElementById("no-priority");
  document.getElementById("top-badge").textContent = `Top ${pending.length}`;

  if (!pending.length) {
    plist.innerHTML = "";
    noPri.classList.remove("hidden");
    return;
  }
  noPri.classList.add("hidden");
  plist.innerHTML = pending
    .map((t) => {
      const c = pConfig[t.priority];
      return `<div class="flex items-center gap-4 px-4 py-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer" onclick="navigate('tasks')">
        <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot}"></div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-800 text-sm truncate">${t.title}</div>
          ${t.due ? `<div class="text-gray-400 text-xs mt-0.5 flex items-center gap-1"><svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>${t.due}</div>` : ""}
        </div>
        <span class="chip ${c.badge} flex-shrink-0">${t.priority === "high" ? "🔴" : t.priority === "medium" ? "🟠" : "🔵"} ${t.priority}</span>
      </div>`;
    })
    .join("");
}

/* ---- TASKS ---- */
function setFilter(f) {
  activeFilter = f;
  document.querySelectorAll(".filter-btn").forEach((b) => {
    b.style.background = b.dataset.filter === f ? "#E7ECFE" : "#eff4ff";
    b.style.color = b.dataset.filter === f ? "#3b6cf7" : "#000000";
    b.style.fontWeight = b.dataset.filter === f ? "700" : "500";
    b.style.opacity = b.dataset.filter === f ? "1" : "0.6";
  });
  renderTasks();
}

function renderTasks() {
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  document.getElementById("task-progress-text").textContent =
    `${done} / ${total}`;
  document.getElementById("task-progress-bar").style.width = total
    ? `${(done / total) * 100}%`
    : "0%";

  let filtered =
    activeFilter === "all"
      ? tasks
      : tasks.filter((t) => t.priority === activeFilter);
  const pending = filtered.filter((t) => !t.done);
  const completed = filtered.filter((t) => t.done);

  const sections = document.getElementById("task-sections");
  const empty = document.getElementById("task-empty");

  if (!filtered.length) {
    sections.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");

  let html = "";
  if (pending.length) {
    html += `<div>
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Today (${pending.length})</h3>
        <div class="space-y-2">${pending.map(taskCard).join("")}</div>
      </div>`;
  }
  if (completed.length) {
    html += `<div>
        <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Completed (${completed.length})</h3>
        <div class="space-y-2">${completed.map(taskCard).join("")}</div>
      </div>`;
  }
  sections.innerHTML = html;
}

function taskCard(t) {
  const c = pConfig[t.priority];
  return `<div class="task-card ${t.done ? "task-done" : ""} bg-white rounded-2xl px-4 py-4 shadow-sm border ${t.done ? "border-green-100" : c.border} flex items-center gap-4 group" style="position: relative; overflow: hidden;" data-task-id="${t.id}">
      <!-- Success Overlay -->
      <div class="success-overlay" id="success-overlay-${t.id}">
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="sparkle"></div>
        <div class="success-checkmark">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
      
      <button onclick="toggleTask(${t.id})" class="w-9 h-9 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all hover:scale-110 ${t.done ? "bg-green-400 border-green-400" : "border-gray-200 hover:border-blue-300"}">
        ${t.done ? `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>` : ""}
      </button>
      <div class="flex-1 min-w-0">
        <div class="task-title font-semibold text-gray-800 text-sm leading-snug">${t.title}</div>
        <div class="flex items-center gap-2 mt-1.5 flex-wrap">
          <span class="chip ${t.done ? "bg-green-50 text-green-600" : c.badge}">
            <span class="w-1.5 h-1.5 rounded-full ${t.done ? "bg-green-400" : c.dot}"></span>
            ${t.done ? "Completed" : c.label}
          </span>
          ${t.due ? `<span class="text-xs text-gray-400 flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>${t.due}</span>` : ""}
        </div>
      </div>
      <button onclick="deleteTask(${t.id})" class="delete-btn w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 transition-all flex-shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
      </button>
    </div>`;
}

function toggleTask(id) {
  const t = tasks.find((t) => t.id === id);
  if (!t) return;
  
  // Jika task belum selesai, tampilkan animasi success dulu
  if (!t.done) {
    const overlay = document.getElementById(`success-overlay-${id}`);
    if (overlay) {
      overlay.classList.add('active');
      
      // Setelah animasi selesai (1.2 detik), mark as done dan render ulang
      setTimeout(() => {
        t.done = true;
        renderTasks();
        if (currentPage === "home") renderHome();
      }, 1200);
    } else {
      // Fallback jika overlay tidak ditemukan
      t.done = true;
      renderTasks();
      if (currentPage === "home") renderHome();
    }
  } else {
    // Jika task sudah completed, langsung uncheck tanpa animasi
    t.done = false;
    renderTasks();
    if (currentPage === "home") renderHome();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
  renderHome();
}

/* ---- MODAL ---- */
function openModal() {
  document.getElementById("modal").classList.add("active");
  setTimeout(() => document.getElementById("task-input").focus(), 100);
  selectPriority("high");
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  document.getElementById("task-input").value = "";
  document.getElementById("due-input").value = "";
}

function selectPriority(p) {
  selectedPriority = p;
  ["high", "medium", "low"].forEach((x) => {
    const btn = document.getElementById("btn-" + x);
    btn.classList.toggle("selected", x === p);
    btn.style.opacity = x === p ? "1" : "0.5";
  });
}

function addTask() {
  const title = document.getElementById("task-input").value.trim();
  const input = document.getElementById("task-input");
  if (!title) {
    input.style.borderColor = "#f04438";
    input.style.boxShadow = "0 0 0 3px rgba(240,68,56,0.15)";
    setTimeout(() => {
      input.style.borderColor = "";
      input.style.boxShadow = "";
    }, 1500);
    return;
  }
  const due = document.getElementById("due-input").value.trim();
  tasks.unshift({
    id: nextId++,
    title,
    priority: selectedPriority,
    due: due ? "Due " + due : "",
    done: false,
  });
  closeModal();
  renderTasks();
  renderHome();
}

/* ---- KEYBOARD ---- */
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" &&
    document.getElementById("modal").classList.contains("active")
  )
    addTask();
  if (e.key === "Escape") closeModal();
});

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("modal")) closeModal();
});

// Init
navigate("home");
setFilter("all");
