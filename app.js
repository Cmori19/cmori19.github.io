// app.js
(function () {
  const $ = (id) => document.getElementById(id);

 const views = ["dashboard", "todo", "journal", "actions", "habits", "meals", "notes", "goals"];


  /* ---------------------------------------------------------
     DOM references (match your new index.html)
  --------------------------------------------------------- */

  // Topbar
  const topbarMeta = $("topbarMeta");
  const syncStamp = $("syncStamp");
  const btnRefreshDashboard = $("btnRefreshDashboard");
  const btnTheme = $("btnTheme");
  const btnExportPDF = $("btnExportPDF");
  const btnSettings = $("btnSettings");
  const btnAccount = $("btnAccount");
  const btnTabsMenu = $("btnTabsMenu");
  const btnSyncNow = $("btnSyncNow");

  // Tabs menu
  const tabsMenu = $("tabsMenu");
  const tabsMenuBackdrop = $("tabsMenuBackdrop");
  const tabsMenuItems = $("tabsMenuItems");
  const btnSaveTabsMenu = $("btnSaveTabsMenu");

  // Theme modal
  const themeModal = $("themeModal");
  const themeBackdrop = $("themeBackdrop");
  const btnCloseTheme = $("btnCloseTheme");
  const themeSelect = $("themeSelect");
  const fontSelect = $("fontSelect");
  const btnApplyTheme = $("btnApplyTheme");

  // Settings modal (JSON import/export)
  const settingsModal = $("settingsModal");
  const settingsBackdrop = $("settingsBackdrop");
  const btnCloseSettings = $("btnCloseSettings");
  const btnExport = $("btnExport");
  const btnImport = $("btnImport");
  const importFile = $("importFile");
  const exportArea = $("exportArea");

  // Account modal (Firebase assumed by your prior code)
  const accountModal = $("accountModal");
  const accountBackdrop = $("accountBackdrop");
  const btnCloseAccount = $("btnCloseAccount");
  const btnSignIn = $("btnSignIn");
  const btnSignUp = $("btnSignUp");
  const btnSignOut = $("btnSignOut");
  const authEmail = $("authEmail");
  const authPassword = $("authPassword");
  const authStatus = $("authStatus");

  // Login keyboard behaviour (robust)
function isEnterKey(e) {
  return e.key === "Enter" || e.key === "NumpadEnter";
}

authEmail?.addEventListener("keydown", (e) => {
  if (!isEnterKey(e)) return;

  e.preventDefault();
  e.stopPropagation();

  authPassword?.focus();
});

authPassword?.addEventListener("keydown", (e) => {
  if (!isEnterKey(e)) return;

  e.preventDefault();
  e.stopPropagation();

  // Trigger the same logic as clicking "Sign in"
  btnSignIn?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});



  // Export PDF modal
  const exportPdfModal = $("exportPdfModal");
  const exportPdfBackdrop = $("exportPdfBackdrop");
  const btnCloseExportPdf = $("btnCloseExportPdf");
  const expTodo = $("expTodo");
  const expJournal = $("expJournal");
  const expActions = $("expActions");
  const expMeals = $("expMeals");
  const expNotes = $("expNotes");
    const expGoals = $("expGoals");
  const btnRunPdfExport = $("btnRunPdfExport");

  // Dashboard metrics
  const mTodoToday = $("mTodoToday");
  const mTodoWeek = $("mTodoWeek");
  const mTodoPeriodLabel = $("mTodoPeriodLabel");
  const mOpenToday = $("mOpenToday");
  const mHabitWeek = $("mHabitWeek");
  const mHabitPeriodLabel = $("mHabitPeriodLabel");
  const dashPeriodWeek = $("dashPeriodWeek");
  const dashPeriodMonth = $("dashPeriodMonth");
  const dashPeriodYear = $("dashPeriodYear");
  const mJournalRate = $("mJournalRate");
const mJournalPeriodLabel = $("mJournalPeriodLabel");
const avgMood = $("avgMood");
const avgEnergy = $("avgEnergy");
const avgStress = $("avgStress");


  // To-do
  const todoIndexCard = $("todoIndexCard");
  const todoDetailCard = $("todoDetailCard");
  const todoDateList = $("todoDateList");
  const todoDetailDateLabel = $("todoDetailDateLabel");
  const todoNewText = $("todoNewText");
  const btnAddTodo = $("btnAddTodo");
  const btnTodoBack = $("btnTodoBack");
  const btnTodoNewList = $("btnTodoNewList");
  const btnTodoToday = $("btnTodoToday");
  const todoSort = $("todoSort");
  const todoList = $("todoList");

  // To-do new list modal
  const todoNewListModal = $("todoNewListModal");
  const todoNewListBackdrop = $("todoNewListBackdrop");
  const btnCloseTodoNewList = $("btnCloseTodoNewList");
  const todoNewListDate = $("todoNewListDate");
  const btnCreateTodoList = $("btnCreateTodoList");

  // Journal
  const journalIndexCard = $("journalIndexCard");
  const journalDetailCard = $("journalDetailCard");
  const journalDateList = $("journalDateList");
  const journalDetailDateLabel = $("journalDetailDateLabel");
  const jGratitude = $("jGratitude");
  const jObjectives = $("jObjectives");
  const jReflections = $("jReflections");
  const journalMood = $("journalMood");
const journalEnergy = $("journalEnergy");
const journalStress = $("journalStress");
// -----------------------------
// Reflections (tagged)
// -----------------------------
const journalReflections = $("journalReflections");
const journalReflectionsList = $("journalReflectionsList");
const journalReflectionsEmpty = $("journalReflectionsEmpty");
const btnAddReflection = $("btnAddReflection");
const reflectionTagChooser = $("reflectionTagChooser");
const reflectionTagOptions = $("reflectionTagOptions");

btnAddReflection?.addEventListener("click", (e) => {
  e.stopPropagation();

  if (!reflectionTagChooser || !reflectionTagOptions) return;

  const used = new Set(Object.keys(currentReflections));
  const available = REFLECTION_TAGS.filter(t => !used.has(t));

  reflectionTagOptions.innerHTML = "";

  if (!available.length) {
    reflectionTagOptions.innerHTML =
      `<div class="muted">All reflection areas already added.</div>`;
  } else {
    for (const tag of available) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pill";
      btn.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);

      btn.addEventListener("click", () => {
        currentReflections[tag] = "";
        reflectionTagChooser.classList.add("hidden");
        renderReflectionSections();

        debounce("journal_autosave", 300, autosaveJournal);

        // Focus the new textarea
        setTimeout(() => {
          const fields = journalReflectionsList.querySelectorAll("textarea");
          const last = fields[fields.length - 1];
          last?.focus();
        }, 0);
      });

      reflectionTagOptions.appendChild(btn);
    }
  }

  reflectionTagChooser.classList.toggle("hidden");
});

document.addEventListener("click", () => {
  reflectionTagChooser?.classList.add("hidden");
});



const REFLECTION_TAGS = [
  "general",
  "work",
  "fitness",
  "health",
  "nutrition",
  "social",
  "relationships",
  "sleep",
  "money"
];


  const btnSaveJournal = $("btnSaveJournal"); // hidden now, but keep for compatibility
  const btnJournalBack = $("btnJournalBack");
  const btnJournalNewEntry = $("btnJournalNewEntry");
  const journalSearchInput = $("journalSearchInput");
  


  // Journal new entry modal
  const journalNewEntryModal = $("journalNewEntryModal");
  const journalNewEntryBackdrop = $("journalNewEntryBackdrop");
  const btnCloseJournalNewEntry = $("btnCloseJournalNewEntry");
  const journalNewEntryDate = $("journalNewEntryDate");
  const btnCreateJournalEntry = $("btnCreateJournalEntry");

  // Projects / Actions
  const btnActionsViewProjects = $("btnActionsViewProjects");
  const btnActionsViewActions = $("btnActionsViewActions");
  const btnAddProject = $("btnAddProject");
  const btnAddAction = $("btnAddAction");
  const actionsProjectsWrap = $("actionsProjectsWrap");
  const actionsActionsWrap = $("actionsActionsWrap");
  const projectList = $("projectList");
  const archivedProjectList = $("archivedProjectList");
const btnToggleArchivedProjects = $("btnToggleArchivedProjects");
const btnToggleProjectNotes = $("btnToggleProjectNotes");
const projectNotesWrap = $("projectNotesWrap");
const btnToggleProjectActions = $("btnToggleProjectActions");
const projectActionsWrap = $("projectActionsWrap");

btnToggleProjectActions?.addEventListener("click", () => {
  const hidden = projectActionsWrap.classList.toggle("hidden");
  btnToggleProjectActions.textContent = hidden
    ? "Show actions"
    : "Hide actions";
});


btnToggleProjectNotes?.addEventListener("click", () => {
  const hidden = projectNotesWrap.classList.toggle("hidden");
  btnToggleProjectNotes.textContent = hidden
    ? "Show project notes"
    : "Hide project notes";

  // 🔑 Resize AFTER becoming visible
  if (!hidden) {
    requestAnimationFrame(() => {
      autosizeTextarea(projectNotes);
    });
  }
});


const btnToggleProjectNotesLinked = $("btnToggleProjectNotesLinked");
const projectLinkedNotesWrap = $("projectLinkedNotesWrap");
const projectLinkedNotesList = $("projectLinkedNotesList");

btnToggleProjectNotesLinked?.addEventListener("click", () => {
  const hidden = projectLinkedNotesWrap.classList.toggle("hidden");
  btnToggleProjectNotesLinked.textContent = hidden
    ? "Show linked notes"
    : "Hide linked notes";

  if (!hidden) refreshProjectLinkedNotes();
});


async function refreshProjectLinkedNotes() {
  if (!selectedProjectId) return;

  const notes = (await window.DB.getAll(window.DB.STORES.notes))
    .filter(n => !n._deleted && n.projectId === selectedProjectId)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  projectLinkedNotesList.innerHTML = "";

  if (!notes.length) {
    projectLinkedNotesList.innerHTML =
      `<li><div class="muted">No linked notes.</div></li>`;
    return;
  }

  for (const n of notes) {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="list__left">
        <strong>${escapeHtml(n.title || "Untitled")}</strong>
      </div>
      <div class="list__right">
        <span class="muted">
          ${n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : ""}
        </span>
      </div>
    `;

li.addEventListener("click", (ev) => {
  ev.stopPropagation();
  openNoteEditModal(n.id);
});



    projectLinkedNotesList.appendChild(li);
  }
}


  // Project detail pane
  const projectTitle = $("projectTitle");
  const projectMeta = $("projectMeta");
  const projectNotes = $("projectNotes");
  const actionList2 = $("actionList2");
  const actionSort2 = $("actionSort2");

  // Project pane multi-filters (priority + status)
  const actionFilterPriorityBtn2 = $("actionFilterPriorityBtn2");
  const actionFilterPriorityPanel2 = $("actionFilterPriorityPanel2");
  const actionFilterStatusBtn2 = $("actionFilterStatusBtn2");
  const actionFilterStatusPanel2 = $("actionFilterStatusPanel2");

  // All actions view
  const actionList = $("actionList");
  const actionSort = $("actionSort");
  const btnRefreshActions = $("btnRefreshActions");

  const actionFilterProjectBtn = $("actionFilterProjectBtn");
  const actionFilterProjectPanel = $("actionFilterProjectPanel");
  const actionFilterPriorityBtn = $("actionFilterPriorityBtn");
  const actionFilterPriorityPanel = $("actionFilterPriorityPanel");
  const actionFilterStatusBtn = $("actionFilterStatusBtn");
  const actionFilterStatusPanel = $("actionFilterStatusPanel");

  // Action modal
  const actionModal = $("actionModal");
  const noteModal = $("noteModal");
const noteModalBackdrop = $("noteModalBackdrop");
const btnCloseNoteModal = $("btnCloseNoteModal");
const modalNoteTitle = $("modalNoteTitle");
const modalNoteBody = $("modalNoteBody");

  const actionBackdrop = $("actionBackdrop");
  const btnCloseActionModal = $("btnCloseActionModal");
  const modalActionTitle = $("modalActionTitle");
  const modalActionProject = $("modalActionProject");
  const modalActionDue = $("modalActionDue");
  const modalActionPriority = $("modalActionPriority");
  const modalActionStatus = $("modalActionStatus");
  const modalActionNotes = $("modalActionNotes");
  const btnSaveModalAction = $("btnSaveModalAction");
  const btnDeleteAction = $("btnDeleteAction");
  const actionModalTitle = $("actionModalTitle");

  // Habits (daily view removed; weekly/monthly only)
  const habitName = $("habitName");
  const habitFreq = $("habitFreq");
  const btnAddHabit = $("btnAddHabit");
  const btnRefreshHabits = $("btnRefreshHabits");
  const habitList = $("habitList");
  const habitsCard = $("habitsCard");
  const btnToggleHabits = $("btnToggleHabits");
  const habitsListsWrap = $("habitsListsWrap");
  const habitArchivedList = $("habitArchivedList");
  const habitViewWeekly = $("habitViewWeekly");
  const habitViewMonthly = $("habitViewMonthly");
  const habitRefDate = $("habitRefDate");
  const habitWeeklyWrap = $("habitWeeklyWrap");
  const habitMonthlyWrap = $("habitMonthlyWrap");
  const monthlyViewMode = $("monthlyViewMode");
  const monthlyHabitSelectWrap = $("monthlyHabitSelectWrap");
  const monthlyHabitSelect = $("monthlyHabitSelect");

  monthlyHabitSelect?.addEventListener("change", () => {
  refreshHabitTrack();
});


  // Meals
  const mealViewDaily = $("mealViewDaily");
  const mealViewWeekly = $("mealViewWeekly");
  const mealNewName = $("mealNewName");
  const btnAddMeal = $("btnAddMeal");
  const mealRefDate = $("mealRefDate");
  const btnRefreshMeals = $("btnRefreshMeals");
  const mealList = $("mealList");
  const mealsWrap = document.querySelector(".mealsWrap");
  const btnToggleMeals = $("btnToggleMeals");

  const mealDailyWrap = $("mealDailyWrap");
  const mealWeeklyWrap = $("mealWeeklyWrap");

  const mealPickerModal = $("mealPickerModal");
const mealPickerBackdrop = $("mealPickerBackdrop");
const btnCloseMealPicker = $("btnCloseMealPicker");
const mealPickerList = $("mealPickerList");

let mealPickerContext = null; // { dateISO, slot }

btnCloseMealPicker?.addEventListener("click", () => {
  hideModal(mealPickerModal);
  mealPickerContext = null;
});

mealPickerBackdrop?.addEventListener("click", () => {
  hideModal(mealPickerModal);
  mealPickerContext = null;
});



  // Meal modal (edit notes)
  const mealModal = $("mealModal");
  const mealBackdrop = $("mealBackdrop");
  const btnCloseMealModal = $("btnCloseMealModal");
  const mealModalName = $("mealModalName");
  const mealModalNotes = $("mealModalNotes");
  const btnSaveMealModal = $("btnSaveMealModal");
  const btnDeleteMealModal = $("btnDeleteMealModal");
  let editingMealId = null;

  // Notes (iOS-style: index -> detail)
  const notesIndexCard = $("notesIndexCard");
  const notesDetailCard = $("notesDetailCard");
  const btnNewNote = $("btnNewNote");
    const btnNotesCollectionsToggle = document.createElement("button");
  btnNotesCollectionsToggle.className = "btn btn--ghost";
  btnNotesCollectionsToggle.type = "button";
  btnNotesCollectionsToggle.textContent = "Collections";

  const notesSearchInput = $("notesSearchInput");
  const notesList = $("notesList");
  const noteCollectionSelect = $("noteCollectionSelect");
const noteProjectSelect = $("noteProjectSelect");
const notesProjectFilter = $("notesProjectFilter");
  const collectionList = $("collectionList");
const btnAddCollection = $("btnAddCollection");

// Notes — mobile inline collections toggle (NOT a sidebar)
const isNotesMobile = () => window.matchMedia("(max-width: 700px)").matches;

const btnToggleCollectionsInline = document.createElement("button");
btnToggleCollectionsInline.type = "button";
btnToggleCollectionsInline.className = "btn btn--ghost";
btnToggleCollectionsInline.textContent = "Show collections";

// Insert toggle into Notes header (mobile only via CSS)
requestAnimationFrame(() => {
  const header = document.querySelector("#view-notes .notesIndexHeader");
  if (!header) return;

  if (!header.contains(btnToggleCollectionsInline)) {
    header.insertBefore(btnToggleCollectionsInline, header.firstChild);
  }
});

btnToggleCollectionsInline.addEventListener("click", () => {
  if (!isNotesMobile()) return;

  const visible = !collectionList.classList.contains("hidden");
  collectionList.classList.toggle("hidden", visible);
  btnToggleCollectionsInline.textContent =
    visible ? "Show collections" : "Hide collections";
});


// Notes — mobile Collections toggle (one-time setup)
btnNotesCollectionsToggle.classList.add("notesCollectionsToggle");

requestAnimationFrame(() => {
  const notesHeader = document.querySelector("#view-notes .notesIndexHeader");
  if (!notesHeader) return;

  if (!notesHeader.contains(btnNotesCollectionsToggle)) {
    notesHeader.insertBefore(btnNotesCollectionsToggle, notesHeader.firstChild);
  }
});

btnNotesCollectionsToggle.addEventListener("click", () => {
  if (!isNotesMobile()) return;
});

// Safety: close drawer if viewport grows to desktop
window.addEventListener("resize", () => {
  if (!isNotesMobile()) {
  }
});




const btnToggleArchivedCollections = $("btnToggleArchivedCollections");

btnToggleArchivedCollections?.addEventListener("click", () => {
  showArchivedCollections = !showArchivedCollections;
  btnToggleArchivedCollections.textContent = showArchivedCollections
    ? "Hide archived collections"
    : "Show archived collections";
  refreshCollections();
});

const collectionModal = $("collectionModal");
const collectionBackdrop = $("collectionBackdrop");
const btnCloseCollectionModal = $("btnCloseCollectionModal");
const btnSaveCollection = $("btnSaveCollection");
const collectionNameInput = $("collectionNameInput");
const collectionModalTitle = $("collectionModalTitle");

const btnArchiveCollection = $("btnArchiveCollection");
const btnDeleteCollection = $("btnDeleteCollection");


let editingCollectionId = null;

  const btnNotesBack = $("btnNotesBack");
  const projectModal = $("projectModal");
const projectBackdrop = $("projectBackdrop");
const btnCloseProjectModal = $("btnCloseProjectModal");
const btnSaveProject = $("btnSaveProject");
const projectNameInput = $("projectNameInput");
const projectNotesInput = $("projectNotesInput");

// ===============================
// Project modal handlers
// ===============================

// Open project modal
btnAddProject?.addEventListener("click", () => {
  projectNameInput.value = "";
  projectNotesInput.value = "";
  showModal(projectModal);

  requestAnimationFrame(() => {
    projectNameInput.focus();
  });
});


// Close project modal
btnCloseProjectModal?.addEventListener("click", () => {
  hideModal(projectModal);
});

projectBackdrop?.addEventListener("click", () => {
  hideModal(projectModal);
});

// Save project (with notes)
btnSaveProject?.addEventListener("click", async () => {
  const name = (projectNameInput.value || "").trim();
  if (!name) return;

  const p = await window.DB.ensureProject(name);

  await window.DB.updateProject(p.id, {
    notes: projectNotesInput.value || ""
  });

  hideModal(projectModal);
  selectedProjectId = p.id;
  await refreshProjectsAndActions();
});


  const noteTitle = $("noteTitle");
  const noteBody = $("noteBody");
  const noteCreated = $("noteCreated");
  const noteUpdated = $("noteUpdated");
  const btnSaveNote = $("btnSaveNote"); // hidden now, but keep
  const btnDeleteNote = $("btnDeleteNote");

  /* ---------------------------------------------------------
     State
  --------------------------------------------------------- */

  let dashboardPeriod = "Week";
  let mealsListHidden = false;
  let habitsHidden = false;
  let currentReflections = {};


  // Rollover modal state
let rolloverView = "days"; // "days" | "items"
let rolloverSelectedDate = null;



  let currentTodoDate = null;
  let currentJournalDate = null;
  let journalSearchText = "";
  let notesSearchText = "";



  let actionsMode = "projects";
  let selectedProjectId = null;
  let archivedProjectsVisible = false;


  let editingActionId = null;
  let currentNoteId = null;
  let selectedCollectionId = null;
  let showArchivedCollections = false;
  let selectedNotesProjectId = null;
  let notesMode = "all"; // "all" or "collection"



  // Debounce timers for autosave
  const debounceTimers = new Map();

  // Multi-select filter state
  const filterState = {
    actionsProject: new Set(["__ALL__"]),
    actionsPriority: new Set(["Low", "Medium", "High"]),
    actionsStatus: new Set(["Open", "In Progress", "Completed"]),
    projectPriority: new Set(["Low", "Medium", "High"]),
    projectStatus: new Set(["Open", "In Progress", "Completed"]),
    notesProjects: new Set(["__ALL__"]),
notesCollections: new Set(["__ALL__"])
  };

  /* ---------------------------------------------------------
     Utilities
  --------------------------------------------------------- */

  /* ---------------------------------------------------------
   Trash / Bin
--------------------------------------------------------- */

const btnOpenBin = $("btnOpenBin");
const binModal = $("binModal");
const binBackdrop = $("binBackdrop");
const btnCloseBin = $("btnCloseBin");
const binList = $("binList");

const BIN_RETENTION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function showBin() {
  renderBin();
  showModal(binModal);
}

btnOpenBin?.addEventListener("click", showBin);
btnCloseBin?.addEventListener("click", () => hideModal(binModal));
binBackdrop?.addEventListener("click", () => hideModal(binModal));

async function renderBin() {
  if (!binList) return;

  const now = Date.now();
  binList.innerHTML = "";

  const STORES = window.DB.STORES;
  const labelFor = {
    notes: "Note",
    journal: "Journal",
    projects: "Project",
    actions: "Action",
    habits: "Habit",
    meals: "Meal",
    goals: "Goal"
  };

  for (const [storeKey, storeName] of Object.entries(STORES)) {
    const items = await window.DB.getAll(storeName);

    for (const item of items) {
      if (!item._deleted || !item.deletedAt) continue;

      const age = now - item.deletedAt;
      

      const row = document.createElement("div");
      row.className = "menuItem";
      row.style.display = "grid";
      row.style.gridTemplateColumns = "140px 1fr 100px";
      row.style.alignItems = "center";
      row.style.gap = "8px";

      const type = document.createElement("div");
      type.textContent = labelFor[storeKey] || storeKey;

      const label = document.createElement("div");

const main =
  item.title ||
  item.name ||
  item.text ||
  item.date ||
  item.period ||
  "—";

const deletedAt = item.deletedAt
  ? new Date(item.deletedAt).toLocaleString()
  : "—";

label.innerHTML = `
  <div><strong>${escapeHtml(main)}</strong></div>
  <div class="muted">Deleted: ${escapeHtml(deletedAt)}</div>
`;


      const restore = document.createElement("button");
      restore.className = "btn btn--ghost";
      restore.textContent = "Restore";

      restore.addEventListener("click", async () => {
        await window.DB.put(storeName, {
          ...item,
          _deleted: false,
          deletedAt: null,
          updatedAt: Date.now()
        });

        try {
          await window.Sync?.pushItem?.(storeKey, {
            ...item,
            _deleted: false,
            deletedAt: null,
            updatedAt: Date.now()
          });
        } catch {}

        renderBin();
        refreshAfterRestore(storeKey);
      });

      row.appendChild(type);
      row.appendChild(label);
      row.appendChild(restore);
      binList.appendChild(row);
    }
  }

  if (!binList.children.length) {
    binList.innerHTML = `<div class="muted">No recently deleted items.</div>`;
  }
}

function refreshAfterRestore(storeKey) {
  if (storeKey === "notes") refreshNotes();
  if (storeKey === "journal") refreshJournalIndex();
  if (storeKey === "projects" || storeKey === "actions") refreshProjectsAndActions();
  if (storeKey === "habits") refreshHabits();
  if (storeKey === "meals") refreshMeals();
  if (storeKey === "goals") refreshGoals();
}


  async function openNoteEditModal(noteId) {
  currentNoteId = noteId;

  const n = await window.DB.getOne(window.DB.STORES.notes, noteId);
  if (!n || n._deleted) return;

  modalNoteTitle.value = n.title || "";
modalNoteBody.value = n.body || "";

showModal(noteModal);

requestAnimationFrame(() => {
  autosizeTextarea(modalNoteBody);
  modalNoteTitle.focus();
});

}




async function autosaveNoteFromModal() {
  if (!currentNoteId) return;

  const title = (modalNoteTitle.value || "").trim();
  const body = (modalNoteBody.value || "").trim();

  if (!title && !body) return;

  const updatedAt = Date.now();

  await window.DB.updateNote(currentNoteId, {
    title,
    body,
    updatedAt
  });
}

btnCloseNoteModal?.addEventListener("click", () => {
  hideModal(noteModal);
  currentNoteId = null;
});

noteModalBackdrop?.addEventListener("click", () => {
  hideModal(noteModal);
  currentNoteId = null;
});

  function showModal(modal) { modal?.classList.remove("hidden"); }



 

  async function confirmInApp({ title = "Confirm", message = "" }) {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirmModal");
    const titleEl = document.getElementById("confirmTitle");
    const msgEl = document.getElementById("confirmMessage");
    const btnOk = document.getElementById("btnConfirmOk");
    const btnCancel = document.getElementById("btnConfirmCancel");
    const btnClose = document.getElementById("btnCloseConfirm");
    const backdrop = document.getElementById("confirmBackdrop");

    titleEl.textContent = title;
    msgEl.textContent = message;

    const cleanup = (result) => {
      hideModal(modal);
      btnOk.onclick = null;
      btnCancel.onclick = null;
      btnClose.onclick = null;
      backdrop.onclick = null;
      resolve(result);
    };

    btnOk.onclick = () => cleanup(true);
    btnCancel.onclick = () => cleanup(false);
    btnClose.onclick = () => cleanup(false);
    backdrop.onclick = () => cleanup(false);

    showModal(modal);
  });
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}


  function hideModal(modal) { modal?.classList.add("hidden"); }

  function escapeHtml(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function highlightMatch(text, query) {
  if (!query) return escapeHtml(text || "");
  const safe = escapeHtml(text || "");
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return safe.replace(re, `<mark>$1</mark>`);
}


  function pad2(n) { return String(n).padStart(2, "0"); }

  function todayStrISO() {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  async function maybeRunDailyTodoRollover() {
  const today = todayStrISO();
  const last = await window.DB.getSetting("ui.lastTodoRollover", null);

  if (last === today) return;
  if (typeof window.DB.rolloverTodosToToday !== "function") return;

  await window.DB.rolloverTodosToToday(today);
  await window.DB.setSetting("ui.lastTodoRollover", today);

  // Refresh UI after rollover
  refreshTodoIndex();
  refreshTodoDetail();
  refreshDashboard();
}


  function parseISO(yyyyMmDd) {
    const [y, m, d] = (yyyyMmDd || "").split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  function isoToDDMMYYYY(iso) {
    if (!iso) return "—";
    const d = parseISO(iso);
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  function ddmmyyyyForDate(d) {
    return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  function weekdayName(d) {
    return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()];
  }

  function startOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay(); // 0 Sun..6 Sat
    const diff = (day === 0 ? -6 : 1 - day);
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function startOfMonth(date) {
    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function startOfYear(date) {
    const d = new Date(date.getFullYear(), 0, 1);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function dateToISO(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function daysBetweenInclusive(a, b) {
    const da = new Date(a); da.setHours(0, 0, 0, 0);
    const db = new Date(b); db.setHours(0, 0, 0, 0);
    const diff = Math.round((db - da) / (24 * 3600 * 1000));
    return diff + 1;
  }

  function fmtPct(n) {
    if (!isFinite(n)) return "—";
    return `${Math.round(n * 100)}%`;
  }

  function prioRank(p) {
    if (p === "High") return 3;
    if (p === "Medium") return 2;
    return 1;
  }

  function cycleStatus(s) {
    if (s === "Open") return "In Progress";
    if (s === "In Progress") return "Completed";
    return "Open";
  }

  function cyclePriority(p) {
    if (p === "Low") return "Medium";
    if (p === "Medium") return "High";
    return "Low";
  }

  function statusClass(s) {
    if (s === "In Progress") return "status-inprogress";
    if (s === "Completed") return "status-completed";
    return "status-open";
  }

  function prioClass(p) {
    if (p === "High") return "prio-high";
    if (p === "Medium") return "prio-medium";
    return "prio-low";
  }

  function setPressed(btn, on) { btn?.setAttribute("aria-pressed", on ? "true" : "false"); }

  function autosizeTextarea(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 800) + "px";
  }

  function wireAutosize() {
    document.querySelectorAll("textarea.autosize").forEach((ta) => {
      autosizeTextarea(ta);
      ta.addEventListener("input", () => autosizeTextarea(ta));
    });
  }

  function debounce(key, ms, fn) {
    if (debounceTimers.has(key)) clearTimeout(debounceTimers.get(key));
    const t = setTimeout(fn, ms);
    debounceTimers.set(key, t);
  }

  function updateSyncStamp(ts, label = "Last synced") {
    if (!syncStamp) return;
    if (!ts) { syncStamp.textContent = `${label}: —`; return; }
    syncStamp.textContent = `${label}: ${new Date(ts).toLocaleString()}`;
  }

  /* ---------------------------------------------------------
     Multi-select filter helper (Excel-like)
  --------------------------------------------------------- */

  function buildMultiFilter({ button, panel, title, options, stateSet, onApply }) {
    if (!button || !panel) return;

    function renderLabel() {
      const sel = Array.from(stateSet);
      if (!sel.length) return `${title}: None`;
      if (sel.length === options.length) return `${title}: All`;
      return `${title}: ${sel.join(", ")}`;
    }

    function close() {
      panel.classList.add("hidden");
    }

    function open() {
      panel.classList.remove("hidden");
      panel.focus?.();
    }

    function toggle() {
      panel.classList.contains("hidden") ? open() : close();
    }

    function renderPanel() {
      panel.innerHTML = "";
      const h = document.createElement("div");
      h.className = "fpTitle";
      h.textContent = title;
      panel.appendChild(h);

      for (const opt of options) {
        const row = document.createElement("div");
        row.className = "fpItem";

        const lab = document.createElement("label");
        lab.textContent = opt;

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = stateSet.has(opt);

        cb.addEventListener("change", () => {
          if (cb.checked) stateSet.add(opt);
          else stateSet.delete(opt);
        });

        row.appendChild(lab);
        row.appendChild(cb);
        panel.appendChild(row);
      }

      const actions = document.createElement("div");
      actions.className = "fpActions";

      const btnClear = document.createElement("button");
      btnClear.type = "button";
      btnClear.className = "btn btn--ghost";
      btnClear.textContent = "Clear";
      btnClear.addEventListener("click", () => {
        stateSet.clear();
        renderPanel();
      });

      const btnAll = document.createElement("button");
      btnAll.type = "button";
      btnAll.className = "btn btn--ghost";
      btnAll.textContent = "All";
      btnAll.addEventListener("click", () => {
        stateSet.clear();
        options.forEach(o => stateSet.add(o));
        renderPanel();
      });

      const btnApply = document.createElement("button");
      btnApply.type = "button";
      btnApply.className = "btn btn--primary";
      btnApply.textContent = "Apply";
      btnApply.addEventListener("click", () => {
        // Guard: if none selected, treat as all (more usable)
        if (!stateSet.size) options.forEach(o => stateSet.add(o));
        button.textContent = renderLabel();
        close();
        onApply?.();
      });

      actions.appendChild(btnClear);
      actions.appendChild(btnAll);
      actions.appendChild(btnApply);
      panel.appendChild(actions);

      button.textContent = renderLabel();
    }

    button.addEventListener("click", () => {
      renderPanel();
      toggle();
    });

    panel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Enter") {
        e.preventDefault();
        // Apply on Enter
        if (!stateSet.size) options.forEach(o => stateSet.add(o));
        button.textContent = renderLabel();
        close();
        onApply?.();
      }
    });

    document.addEventListener("click", (e) => {
      if (panel.classList.contains("hidden")) return;
      if (panel.contains(e.target) || button.contains(e.target)) return;
      close();
    });

    // Initial label
    button.textContent = renderLabel();
  }

  /* ---------------------------------------------------------
     Topbar / Auth / Sync
  --------------------------------------------------------- */

  function setAuthStatus(text) { if (authStatus) authStatus.textContent = text; }

  function updateTopbar() {
    const online = navigator.onLine ? "Online" : "Offline";
    const user = window.fbAuth && window.fbAuth.currentUser;
    const who = user ? user.email : "Not signed in";
    if (topbarMeta) topbarMeta.textContent = `${online} • ${who}`;
    if (btnSyncNow) btnSyncNow.disabled = !navigator.onLine || !user;
  }

  btnAccount?.addEventListener("click", () => showModal(accountModal));
  btnCloseAccount?.addEventListener("click", () => hideModal(accountModal));
  accountBackdrop?.addEventListener("click", () => hideModal(accountModal));

  btnSignIn?.addEventListener("click", async () => {
    if (!window.fbAuth) { alert("Firebase not initialised."); return; }
    try {
      await window.fbAuth.signInWithEmailAndPassword(authEmail.value.trim(), authPassword.value);
    } catch (e) {
      alert(e.message || String(e));
    }
  });

  btnSignUp?.addEventListener("click", async () => {
    if (!window.fbAuth) { alert("Firebase not initialised."); return; }
    try {
      await window.fbAuth.createUserWithEmailAndPassword(authEmail.value.trim(), authPassword.value);
    } catch (e) {
      alert(e.message || String(e));
    }
  });

  btnSignOut?.addEventListener("click", async () => {
  if (!window.fbAuth) return;

  // 1. Sign out from Firebase
  await window.fbAuth.signOut();

  // 2. Immediately clear all local data
  await window.DB.importAll({}, { overwrite: true });

  // 3. Clear sync timestamps
  await window.DB.setSetting("sync.lastPullAt", 0);
  await window.DB.setSetting("sync.lastAt", 0);

  // 4. Reset UI state
  setAuthStatus("Not signed in.");
  updateTopbar();

  // 5. Return user to dashboard (empty state)
  setTab("dashboard");
});


  if (window.fbAuth) {
  window.fbAuth.onAuthStateChanged(async () => {
    updateTopbar();

    const user = window.fbAuth.currentUser;

    if (user) {
      setAuthStatus(`Signed in as ${user.email}`);

      hideModal(accountModal);

      // --------------------------------------------------
// 🔒 SAFE LOGIN CLEANUP
// --------------------------------------------------
// Remove ONLY data created while logged out (scratch data)
// Preserve all authenticated offline data
// --------------------------------------------------
if (window.Sync && typeof window.Sync.discardUnauthenticatedLocalData === "function") {
  try {
    await window.Sync.discardUnauthenticatedLocalData(user.uid);
  } catch (e) {
    console.warn("Failed to discard unauthenticated local data:", e);
  }
}



      // IMPORTANT: DO NOT delete local data on login
      // Only pull data from Firebase and merge it
      if (window.Sync && typeof window.Sync.initialSync === "function") {
        try {
          await window.Sync.initialSync();
        } catch (e) {
          console.warn("Initial sync failed:", e);
        }
      }

      // Run daily to-do rollover AFTER sync (so cloud does not overwrite it)
const today = todayStrISO();
const lastRollover = await window.DB.getSetting("ui.lastTodoRollover", null);

if (
  lastRollover !== today &&
  typeof window.DB.rolloverTodosToToday === "function"
) {
  await window.DB.rolloverTodosToToday(today);
  await window.DB.setSetting("ui.lastTodoRollover", today);
}

    } else {
  // User just logged out → wipe all local data immediately

  setAuthStatus("Not signed in.");

  // 1. Clear all local IndexedDB data
  await window.DB.importAll({}, { overwrite: true });

  // 2. Clear sync timestamps
  await window.DB.setSetting("sync.lastPullAt", 0);
  await window.DB.setSetting("sync.lastAt", 0);

  // 3. Reset all UI views to empty state
  refreshDashboard();
  refreshTodoIndex();
  refreshJournalIndex();
  refreshProjectsAndActions();
  refreshHabits();
  refreshMeals();
  refreshNotes();

  // 4. Return to dashboard
  setTab("dashboard");
}

  });
}



   window.addEventListener("online", updateTopbar);
  window.addEventListener("offline", updateTopbar);

  // Manual sync
  btnSyncNow?.addEventListener("click", async () => {
    try {
      btnSyncNow.disabled = true;
      btnSyncNow.textContent = "Syncing…";
      if (window.syncNow) await window.syncNow(() => {});
      const ts = Date.now();
      await window.DB.setSetting("sync.lastAt", ts);
      updateSyncStamp(ts, "Last synced");
      btnSyncNow.textContent = "Sync";
      updateTopbar();
      refreshDashboard();
    } catch (e) {
      btnSyncNow.textContent = "Sync";
      updateTopbar();
      alert(e.message || String(e));
    }
  });

  // Autosync every 30 seconds (as requested)
  let autoSyncTimer = null;
  function startAutoSync() {
    if (autoSyncTimer) clearInterval(autoSyncTimer);
    autoSyncTimer = setInterval(async () => {
      try {
        if (!navigator.onLine) return;
        const user = window.fbAuth && window.fbAuth.currentUser;
        if (!user) return;
        if (window.syncNow) await window.syncNow(() => {});
        const ts = Date.now();
        await window.DB.setSetting("sync.lastAt", ts);
        updateSyncStamp(ts, "Last synced");
        updateTopbar();
      } catch {
        updateTopbar();
      }
    }, 30000);
  }

  /* ---------------------------------------------------------
     Tabs visibility (Show/Hide tabs) - fix
  --------------------------------------------------------- */

  const tabLabels = {
    dashboard: "Dashboard",
    todo: "To-do",
    journal: "Journal",
    actions: "Projects",
    habits: "Habits",
    meals: "Meals",
    notes: "Notes", 
    goals: "Goals"
  };

  async function applyTabVisibility() {
    const hidden = (await window.DB.getSetting("ui.hiddenTabs", [])) || [];
    const hiddenSet = new Set(hidden);

    // Hide dashboard metrics when tabs are hidden
const metricMap = {
  journal: "metricJournal",
  habits: "metricHabits"
};

for (const [tab, metricId] of Object.entries(metricMap)) {
  const el = document.getElementById(metricId);
  if (el) {
    el.classList.toggle("hidden", hiddenSet.has(tab));
  }
}


    for (const v of views) {
      const btn = $("tab-" + v);
      if (!btn) continue;
      btn.classList.toggle("hidden", hiddenSet.has(v));
    }

    const currentActive = document.querySelector(".tab.active");
    if (currentActive && currentActive.classList.contains("hidden")) {
      const firstVisible = views.find(v => !$("tab-" + v)?.classList.contains("hidden"));
      if (firstVisible) setTab(firstVisible);
    }
  }

  function showMenu(menu) { menu?.classList.remove("hidden"); }
  function hideMenu(menu) { menu?.classList.add("hidden"); }

  async function openTabsMenu() {
    tabsMenuItems.innerHTML = "";
    const hidden = new Set(((await window.DB.getSetting("ui.hiddenTabs", [])) || []).slice());

    for (const v of views) {
      const row = document.createElement("div");
      row.className = "menuItem";

      const lab = document.createElement("label");
      lab.textContent = tabLabels[v] || v;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !hidden.has(v);
      cb.addEventListener("change", () => {
        if (cb.checked) hidden.delete(v);
        else hidden.add(v);
      });

      row.appendChild(lab);
      row.appendChild(cb);
      tabsMenuItems.appendChild(row);
    }

    btnSaveTabsMenu.onclick = async () => {
      await window.DB.setSetting("ui.hiddenTabs", Array.from(hidden));
      hideMenu(tabsMenu);
      await applyTabVisibility();
    };

    showMenu(tabsMenu);
  }

  btnTabsMenu?.addEventListener("click", openTabsMenu);
  tabsMenuBackdrop?.addEventListener("click", () => hideMenu(tabsMenu));

  /* ---------------------------------------------------------
     Theme & font
  --------------------------------------------------------- */

  function applyThemeAndFont(theme, font) {
    document.body.setAttribute("data-theme", theme);
    document.body.setAttribute("data-font", font);
  }

  btnTheme?.addEventListener("click", async () => {
    const theme = (await window.DB.getSetting("ui.theme", "aurora")) || "aurora";
    const font = (await window.DB.getSetting("ui.font", "system")) || "system";
    themeSelect.value = theme;
    fontSelect.value = font;
    showModal(themeModal);
  });

  themeBackdrop?.addEventListener("click", () => hideModal(themeModal));
  btnCloseTheme?.addEventListener("click", () => hideModal(themeModal));
  btnApplyTheme?.addEventListener("click", async () => {
    const theme = themeSelect.value || "aurora";
    const font = fontSelect.value || "system";
    await window.DB.setSetting("ui.theme", theme);
    await window.DB.setSetting("ui.font", font);
    applyThemeAndFont(theme, font);
    hideModal(themeModal);
  });

  /* ---------------------------------------------------------
     Settings modal (JSON import/export)
  --------------------------------------------------------- */

  btnSettings?.addEventListener("click", () => showModal(settingsModal));
  btnCloseSettings?.addEventListener("click", () => hideModal(settingsModal));
  settingsBackdrop?.addEventListener("click", () => hideModal(settingsModal));

  btnExport?.addEventListener("click", async () => {
    const dump = await window.DB.exportAll();
    exportArea.value = JSON.stringify(dump, null, 2);
  });

  btnImport?.addEventListener("click", async () => {
    const file = importFile.files && importFile.files[0];
    if (!file) { alert("Select a JSON file first."); return; }
    const ok = confirm("This will overwrite your local database. Continue?");
    if (!ok) return;
    const txt = await file.text();
    const data = JSON.parse(txt);
    await window.DB.importAll(data, { overwrite: true });
    alert("Imported.");
    refreshDashboard();
    refreshTodoIndex();
    refreshJournalIndex();
    refreshProjectsAndActions();
    refreshHabits();
    refreshMeals();
    refreshNotes();
  });

    /* ---------------------------------------------------------
     Goals
  --------------------------------------------------------- */

  const goalsViewLong = $("goalsViewLong");
  const goalsViewAnnual = $("goalsViewAnnual");
  const goalsViewMonthly = $("goalsViewMonthly");
  const btnAddGoalPeriod = $("btnAddGoalPeriod");
  const goalsIndexWrap = $("goalsIndexWrap");
  const goalsDetailWrap = $("goalsDetailWrap");

  let goalsMode = "long_term"; // "long_term" | "annual" | "monthly"
  let currentGoalId = null;
  let monthlyYearFilter = null;

  function setSegPressed(btn, on) {
    if (!btn) return;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function monthLabel(yyyyMm) {
    if (!yyyyMm || yyyyMm.length !== 7) return yyyyMm || "—";
    const [y, m] = yyyyMm.split("-");
    const dt = new Date(Number(y), Number(m) - 1, 1);
    const name = dt.toLocaleString(undefined, { month: "long" });
    return `${name} ${y}`;
  }

  async function getAllGoals() {
    return (await window.DB.getAll(window.DB.STORES.goals)).filter(g => g && !g._deleted);
  }

  function showGoalsIndex() {
    goalsIndexWrap?.classList.remove("hidden");
    goalsDetailWrap?.classList.add("hidden");
  }

  function showGoalsDetail() {
    goalsIndexWrap?.classList.add("hidden");
    goalsDetailWrap?.classList.remove("hidden");
  }

  function setGoalsMode(mode) {
    goalsMode = mode;
    currentGoalId = null;

    setSegPressed(goalsViewLong, mode === "long_term");
    setSegPressed(goalsViewAnnual, mode === "annual");
    setSegPressed(goalsViewMonthly, mode === "monthly");

    if (btnAddGoalPeriod) {
      btnAddGoalPeriod.style.display = (mode === "long_term") ? "none" : "";
    }

    showGoalsIndex();
    refreshGoals();
  }

  goalsViewLong?.addEventListener("click", () => setGoalsMode("long_term"));
  goalsViewAnnual?.addEventListener("click", () => setGoalsMode("annual"));
  goalsViewMonthly?.addEventListener("click", () => setGoalsMode("monthly"));

  async function saveGoalDraft(goal) {
  if (!goal || !goal.id) return null;

  const existing = await window.DB.getOne(
    window.DB.STORES.goals,
    goal.id
  );

  const content = goal.content || {};

  // --------------------------------------------------
  // 🔒 SAFETY GUARD:
  // Do not overwrite an existing goal with empty content
  // --------------------------------------------------

  const hasAnyContent =
    Object.values(content).some(
      v => typeof v === "string" && v.trim().length > 0
    );

  if (existing && !hasAnyContent) {
    return existing;
  }

  const rec = await window.DB.upsertGoal({
    id: goal.id,
    type: goal.type,
    period: goal.period,
    content
  });

  try {
    await window.Sync?.pushItem?.("goals", rec);
  } catch {
    /* ignore sync errors */
  }

  return rec;
}


  function renderGoalsEditor(goal, opts = {}) {
    const { showBack } = opts;

    if (!goalsDetailWrap) return;

    goalsDetailWrap.innerHTML = "";

    const header = document.createElement("div");
    header.className = "cardHeader";

    if (showBack) {
      const back = document.createElement("button");
      back.className = "btn btn--ghost";
      back.type = "button";
      back.textContent = "Back";
      back.addEventListener("click", () => {
        currentGoalId = null;
        showGoalsIndex();
        refreshGoals();
      });
      header.appendChild(back);
    }

    const title = document.createElement("div");
    title.className = "cardTitle";

    if (goal.type === "long_term") title.textContent = "Long-term";
    if (goal.type === "annual") title.textContent = `Annual ${goal.period || "—"}`;
    if (goal.type === "monthly") title.textContent = monthLabel(goal.period);

    header.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "cardActions";
    header.appendChild(actions);

        // Delete button (annual / monthly only)
    if (goal.type !== "long_term") {
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn btn--ghost";
      delBtn.textContent = "×";
      delBtn.title = "Delete goal";

      delBtn.addEventListener("click", async () => {
        const ok = await confirmInApp({
          title: "Delete goal",
          message: "Delete this goal? This cannot be undone."
        });
        if (!ok) return;

        await window.DB.deleteGoal(goal.id);

        try {
          await window.Sync?.pushItem?.("goals", {
            ...goal,
            _deleted: true,
            updatedAt: Date.now()
          });
        } catch { /* ignore */ }

        currentGoalId = null;
        showGoalsIndex();
        refreshGoals();
      });

      actions.appendChild(delBtn);
    }


    goalsDetailWrap.appendChild(header);

    const content = goal.content || (goal.content = {});

    // --------------------------------------------------
// Goals editor: merge Health / Nutrition / Sleep
// --------------------------------------------------

// --------------------------------------------------
// Goals editor: merge Health / Nutrition / Sleep
// and place it just after Fitness
// --------------------------------------------------

const mergedHealthTags = ["health", "nutrition", "sleep"];

for (const tag of REFLECTION_TAGS) {

  // Insert merged field immediately after Fitness
  if (tag === "fitness") {
    const field = document.createElement("div");
    field.className = "field";

    const lab = document.createElement("label");
    lab.textContent = "Health / Nutrition / Sleep";
    field.appendChild(lab);

    const ta = document.createElement("textarea");
    ta.className = "textarea autosize";
    ta.rows = 6;

    ta.value = mergedHealthTags
      .map(t => goal.content?.[t]?.trim())
      .filter(Boolean)
      .join("\n\n");

    ta.addEventListener("input", () => {
      const val = ta.value || "";
      for (const t of mergedHealthTags) {
        goal.content[t] = val;
      }
      debounce(`goal_autosave_${goal.id}`, 250, async () => {
        await saveGoalDraft(goal);
      });
      autosizeTextarea(ta);
    });

    field.appendChild(ta);
    goalsDetailWrap.appendChild(field);
    autosizeTextarea(ta);
  }

  // Skip original health / nutrition / sleep fields
  if (mergedHealthTags.includes(tag)) {
    continue;
  }

  // Render all other tags normally
  const field = document.createElement("div");
  field.className = "field";

  const lab = document.createElement("label");
  lab.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
  field.appendChild(lab);

  const ta = document.createElement("textarea");
  ta.className = "textarea autosize";
  ta.rows = 6;
  ta.value = goal.content[tag] || "";

  ta.addEventListener("input", () => {
    goal.content[tag] = ta.value || "";
    debounce(`goal_autosave_${goal.id}`, 250, async () => {
      await saveGoalDraft(goal);
    });
    autosizeTextarea(ta);
  });

  field.appendChild(ta);
  goalsDetailWrap.appendChild(field);
  autosizeTextarea(ta);
}


  }

  async function openGoal(id) {
    const goals = await getAllGoals();
    const g = goals.find(x => x.id === id);
    if (!g) return;

    currentGoalId = id;
    showGoalsDetail();
    renderGoalsEditor(g, { showBack: goalsMode !== "long_term" });
  }

  async function ensureLongTermGoal() {
    const goals = await getAllGoals();
    let g = goals.find(x => x.type === "long_term");
    if (!g) {
      g = await window.DB.upsertGoal({
        id: "long_term",
        type: "long_term",
        period: null,
        content: {}
      });
      try { await window.Sync?.pushItem?.("goals", g); } catch { /* ignore */ }
    }
    return g;
  }

  async function addAnnualGoal() {
    const goals = await getAllGoals();
    const existingYears = new Set(goals.filter(g => g.type === "annual" && g.period).map(g => g.period));
    let y = String(new Date().getFullYear());
    while (existingYears.has(y)) y = String(Number(y) + 1);

    const id = `annual_${y}`;
    const rec = await window.DB.upsertGoal({
      id,
      type: "annual",
      period: y,
      content: {}
    });
    try { await window.Sync?.pushItem?.("goals", rec); } catch { /* ignore */ }

    await refreshGoals();
    await openGoal(id);

    requestAnimationFrame(() => {
      const first = goalsDetailWrap?.querySelector("textarea");
      first?.focus();
    });
  }

  async function addMonthlyGoal() {
    const goals = await getAllGoals();
    const existing = new Set(goals.filter(g => g.type === "monthly" && g.period).map(g => g.period));

    const d = new Date();
    let y = d.getFullYear();
    let m = d.getMonth() + 1;

    function fmt(yy, mm) {
      return `${yy}-${String(mm).padStart(2, "0")}`;
    }

    let p = fmt(y, m);
    while (existing.has(p)) {
      m += 1;
      if (m === 13) { m = 1; y += 1; }
      p = fmt(y, m);
    }

    const id = `monthly_${p}`;
    const rec = await window.DB.upsertGoal({
      id,
      type: "monthly",
      period: p,
      content: {}
    });
    try { await window.Sync?.pushItem?.("goals", rec); } catch { /* ignore */ }

    if (!monthlyYearFilter) monthlyYearFilter = String(y);

    await refreshGoals();
    await openGoal(id);

    requestAnimationFrame(() => {
      const first = goalsDetailWrap?.querySelector("textarea");
      first?.focus();
    });
  }

  const onAddGoal = async (e) => {
  e.preventDefault();
  if (goalsMode === "annual") return addAnnualGoal();
  if (goalsMode === "monthly") return addMonthlyGoal();
};

btnAddGoalPeriod?.addEventListener("click", onAddGoal);
btnAddGoalPeriod?.addEventListener("touchstart", onAddGoal, { passive: false });


  async function refreshGoals() {
    if (!goalsIndexWrap || !goalsDetailWrap) return;

    if (currentGoalId) {
      await openGoal(currentGoalId);
      return;
    }

    showGoalsIndex();
    goalsIndexWrap.innerHTML = "";

    const goals = await getAllGoals();

    if (goalsMode === "long_term") {
      const g = await ensureLongTermGoal();
      currentGoalId = g.id;
      showGoalsDetail();
      goalsDetailWrap.classList.remove("hidden");
      renderGoalsEditor(g, { showBack: false });
      return;
    }

    if (goalsMode === "annual") {
      const list = goals
        .filter(g => g.type === "annual" && g.period)
        .sort((a, b) => (b.period || "").localeCompare(a.period || ""));

      if (!list.length) {
        goalsIndexWrap.innerHTML = `<div class="muted">No annual goals yet. Press + to add a year.</div>`;
        return;
      }

      const stack = document.createElement("div");
      stack.className = "stack";

      for (const g of list) {
        const row = document.createElement("div");
        row.className = "menuItem";
        row.style.cursor = "pointer";

        row.innerHTML = `
          <div>
            <strong>${g.period}</strong>
            <div class="muted">Updated: ${g.updatedAt ? new Date(g.updatedAt).toLocaleString() : "—"}</div>
          </div>
        `;

        row.addEventListener("click", () => openGoal(g.id));
        stack.appendChild(row);
      }

      goalsIndexWrap.appendChild(stack);
      return;
    }

    if (goalsMode === "monthly") {
      const allMonthly = goals
        .filter(g => g.type === "monthly" && g.period)
        .sort((a, b) => (b.period || "").localeCompare(a.period || ""));

      const years = Array.from(new Set(allMonthly.map(g => (g.period || "").slice(0, 4)).filter(Boolean)))
        .sort((a, b) => b.localeCompare(a));

      if (!monthlyYearFilter) monthlyYearFilter = years[0] || String(new Date().getFullYear());
      if (years.length && !years.includes(monthlyYearFilter)) monthlyYearFilter = years[0];

      const filterRow = document.createElement("div");
      filterRow.className = "field";

      const lab = document.createElement("label");
      lab.textContent = "Year";
      filterRow.appendChild(lab);

      const sel = document.createElement("select");
      sel.className = "input";

      if (!years.length) {
        const opt = document.createElement("option");
        opt.value = String(new Date().getFullYear());
        opt.textContent = opt.value;
        sel.appendChild(opt);
      } else {
        for (const y of years) {
          const opt = document.createElement("option");
          opt.value = y;
          opt.textContent = y;
          sel.appendChild(opt);
        }
      }

      sel.value = monthlyYearFilter;
      sel.addEventListener("change", () => {
        monthlyYearFilter = sel.value || monthlyYearFilter;
        refreshGoals();
      });

      filterRow.appendChild(sel);
      goalsIndexWrap.appendChild(filterRow);

      const list = allMonthly.filter(g => (g.period || "").startsWith(monthlyYearFilter + "-"));

      if (!list.length) {
        const empty = document.createElement("div");
        empty.className = "muted";
        empty.textContent = "No monthly goals for this year. Press + to add a month.";
        goalsIndexWrap.appendChild(empty);
        return;
      }

      const stack = document.createElement("div");
      stack.className = "stack";

      for (const g of list) {
        const row = document.createElement("div");
        row.className = "menuItem";
        row.style.cursor = "pointer";

        row.innerHTML = `
          <div>
            <strong>${monthLabel(g.period)}</strong>
            <div class="muted">Updated: ${g.updatedAt ? new Date(g.updatedAt).toLocaleString() : "—"}</div>
          </div>
        `;

        row.addEventListener("click", () => openGoal(g.id));
        stack.appendChild(row);
      }

      goalsIndexWrap.appendChild(stack);
      return;
    }
  }

  // Expose for tab switching
  window.refreshGoals = refreshGoals;


  /* ---------------------------------------------------------
     Export PDF (extended to include Notes)
  --------------------------------------------------------- */

  btnExportPDF?.addEventListener("click", () => showModal(exportPdfModal));
  exportPdfBackdrop?.addEventListener("click", () => hideModal(exportPdfModal));
  btnCloseExportPdf?.addEventListener("click", () => hideModal(exportPdfModal));

  btnRunPdfExport?.addEventListener("click", async () => {
    hideModal(exportPdfModal);

    const dump = await window.DB.exportAll();
    const todos = (dump.todos || []).filter(x => !x._deleted).sort((a, b) => (a.date || "").localeCompare(b.date || "") || (a.createdAt || 0) - (b.createdAt || 0));
    const journal = (dump.journal || []).filter(x => !x._deleted).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    const actions = (dump.actions || []).filter(x => !x._deleted).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    const projects = (dump.projects || []).filter(x => !x._deleted).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const meals = (dump.meals || []).filter(x => !x._deleted).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const mealPlans = (dump.mealPlans || []).filter(x => !x._deleted);
    const notes = (dump.notes || []).filter(x => !x._deleted).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const goals = (dump.goals || []).filter(x => !x._deleted);


    const projName = (id) => (projects.find(p => p.id === id)?.name) || "—";
    const esc = (s) => String(s || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

    const w = window.open("", "_blank");
    if (!w) { alert("Popup blocked. Allow popups then try again."); return; }

    const groupByDate = (arr, key) => {
      const m = new Map();
      for (const x of arr) {
        const d = x[key] || "";
        if (!m.has(d)) m.set(d, []);
        m.get(d).push(x);
      }
      return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    };

    let html = `
      <html><head><meta charset="utf-8">
      <title>Offline Planner Export</title>
      <style>
        body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Arial,sans-serif;color:#111827;margin:28px}
        h1{margin:0 0 10px 0}
        h2{margin:18px 0 8px 0}
        .muted{color:#6b7280;font-size:12px}
        .box{border:1px solid #e5e7eb;border-radius:12px;padding:12px;margin:10px 0}
        ul{padding-left:18px;margin:8px 0}
        li{margin:6px 0}
        .pb{page-break-before:always}
      </style>
      </head><body>
      <h1>Offline Planner Export</h1>
      <div class="muted">Generated: ${new Date().toLocaleString()}</div>
    `;

    if (expTodo.checked) {
      const todoGroups = groupByDate(todos, "date");
      html += `<h2>To-dos</h2>`;
      if (!todoGroups.length) html += `<div class="box muted">No to-dos.</div>`;
      for (const [date, items] of todoGroups) {
        html += `<div class="box"><strong>${esc(isoToDDMMYYYY(date))}</strong><ul>`;
        for (const t of items) {
          html += `<li>
            <strong>${esc(t.text)}</strong>
            <div class="muted">Status: ${esc(t.status)} • Priority: ${esc(t.priority)} • Due: ${esc(t.dueDate ? isoToDDMMYYYY(t.dueDate) : "—")} • Project: ${esc(projName(t.projectId))}</div>
            ${t.notes ? `<div>${esc(t.notes).replaceAll("\n","<br>")}</div>` : ``}
          </li>`;
        }
        html += `</ul></div>`;
      }
    }

    if (expActions.checked) {
      html += `<h2 class="pb">Projects & actions</h2>`;
      if (!projects.length) html += `<div class="box muted">No projects.</div>`;
      else {
        html += `<div class="box"><strong>Projects</strong><ul>`;
        for (const p of projects) html += `<li>${esc(p.name)}</li>`;
        html += `</ul></div>`;
      }

      if (!actions.length) html += `<div class="box muted">No actions.</div>`;
      else {
        for (const a of actions) {
          html += `<div class="box">
            <div><strong>${esc(a.title)}</strong></div>
            <div class="muted">Project: ${esc(projName(a.projectId))} • Priority: ${esc(a.priority)} • Due: ${esc(a.dueDate ? isoToDDMMYYYY(a.dueDate) : "—")}</div>
            <div class="muted">Status: ${esc(a.status)}</div>
            ${a.notes ? `<div style="margin-top:8px">${esc(a.notes).replaceAll("\n","<br>")}</div>` : ``}
          </div>`;
        }
      }
    }

    if (expJournal.checked) {
      html += `<h2 class="pb">Journal</h2>`;
      if (!journal.length) html += `<div class="box muted">No journal entries.</div>`;
      else {
        let first = true;
        for (const j of journal) {
          html += `${first ? `` : `<div class="pb"></div>`}`;
          first = false;
          html += `
            <h2>${esc(isoToDDMMYYYY(j.date))}</h2>
            <div class="box"><div><strong>Gratitude</strong></div><div>${esc(j.gratitude).replaceAll("\n","<br>")}</div></div>
            <div class="box"><div><strong>Objectives</strong></div><div>${esc(j.objectives).replaceAll("\n","<br>")}</div></div>
            <div class="box"><div><strong>Reflections</strong></div><div>${esc(j.reflections).replaceAll("\n","<br>")}</div></div>
          `;
        }
      }
    }

    if (expMeals.checked) {
      html += `<h2 class="pb">Meals</h2>`;
      if (!meals.length) html += `<div class="box muted">No meals.</div>`;
      else {
        html += `<div class="box"><strong>Meals list</strong><ul>`;
        for (const m of meals) html += `<li>${esc(m.name)}</li>`;
        html += `</ul></div>`;
      }

      const byDate = groupByDate(mealPlans, "date");
      if (!byDate.length) html += `<div class="box muted">No meal plans.</div>`;
      for (const [date, items] of byDate) {
        const slotName = (s) => ({ breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" }[s] || s);
        const mealName = (id) => meals.find(m => m.id === id)?.name || "—";
        html += `<div class="box"><strong>${esc(isoToDDMMYYYY(date))}</strong><ul>`;
        for (const it of items) html += `<li>${esc(slotName(it.slot))}: ${esc(mealName(it.mealId))}</li>`;
        html += `</ul></div>`;
      }
    }

    if (expNotes.checked) {
      html += `<h2 class="pb">Notes</h2>`;
      if (!notes.length) html += `<div class="box muted">No notes.</div>`;
      else {
        for (const n of notes) {
          html += `<div class="box">
            <div><strong>${esc(n.title || "Untitled")}</strong></div>
            <div class="muted">Edited: ${esc(n.updatedAt ? new Date(n.updatedAt).toLocaleString() : "—")}</div>
            <div style="margin-top:8px">${esc(n.body || "").replaceAll("\n","<br>")}</div>
          </div>`;
        }
      }
    }
if (expGoals.checked) {
  html += `<h2 class="pb">Goals</h2>`;

  const byType = t => goals.filter(g => g.type === t);

  const renderGoal = g =>
    Object.entries(g.content || {})
      .map(([k,v]) => `<div><strong>${esc(k)}</strong>: ${esc(v).replaceAll("\n","<br>")}</div>`)
      .join("");

  const long = byType("long_term")[0];
  if (long) {
    html += `<div class="box"><strong>Long-term</strong>${renderGoal(long)}</div>`;
  }

  const annual = byType("annual").sort((a,b)=>b.period.localeCompare(a.period));
  for (const g of annual) {
    html += `<div class="box"><strong>Annual ${esc(g.period)}</strong>${renderGoal(g)}</div>`;
  }

  const monthly = byType("monthly").sort((a,b)=>b.period.localeCompare(a.period));
  for (const g of monthly) {
    html += `<div class="box"><strong>${esc(g.period)}</strong>${renderGoal(g)}</div>`;
  }
}

    if (expGoals && expGoals.checked) {
      html += `<h2 class="pb">Goals</h2>`;

      const esc2 = (s) => String(s || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

      const renderContent = (g) => {
        const c = g.content || {};
        let out = "";
        for (const tag of REFLECTION_TAGS) {
          const v = (c[tag] || "").trim();
          out += `<div><strong>${esc2(tag.charAt(0).toUpperCase() + tag.slice(1))}</strong>: ${esc2(v).replaceAll("\n","<br>")}</div>`;
        }
        return out;
      };

      const long = goals.find(g => g.type === "long_term");
      html += `<div class="box"><strong>Long-term</strong>${long ? renderContent(long) : `<div class="muted">—</div>`}</div>`;

      const annual = goals.filter(g => g.type === "annual" && g.period).sort((a, b) => (b.period || "").localeCompare(a.period || ""));
      html += `<div class="box"><strong>Annual</strong></div>`;
      if (!annual.length) html += `<div class="box muted">No annual goals.</div>`;
      for (const g of annual) {
        html += `<div class="box"><strong>${esc2(g.period)}</strong>${renderContent(g)}</div>`;
      }

      const monthly = goals.filter(g => g.type === "monthly" && g.period).sort((a, b) => (b.period || "").localeCompare(a.period || ""));
      html += `<div class="box"><strong>Monthly</strong></div>`;
      if (!monthly.length) html += `<div class="box muted">No monthly goals.</div>`;
      for (const g of monthly) {
        const title = monthLabel(g.period);
        html += `<div class="box"><strong>${esc2(title)}</strong>${renderContent(g)}</div>`;
      }
    }



    html += `</body></html>`;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  });

  /* ---------------------------------------------------------
     Tabs
  --------------------------------------------------------- */

  function setTab(tab) {
    for (const t of views) {
      const v = $("view-" + t);
      const btn = $("tab-" + t);
      if (!v || !btn) continue;
      if (t === tab) {
        v.classList.remove("hidden");
        btn.classList.add("active");
      } else {
        v.classList.add("hidden");
        btn.classList.remove("active");
      }
    }

    if (tab === "dashboard") refreshDashboard();
    if (tab === "todo") refreshTodoIndex();
    if (tab === "journal") {
  // Force journal list rebuild after the tab switch completes
  setTimeout(() => {
    refreshJournalIndex();
  }, 0);
}

       if (tab === "actions") refreshProjectsAndActions();
    if (tab === "habits") { refreshHabits(); refreshHabitTrack(); }
    if (tab === "meals") refreshMeals();
    if (tab === "notes") {
      refreshCollections();
      refreshNotesProjectFilter();
      refreshNotes();
    }
    if (tab === "goals") {
  if (typeof window.refreshGoals === "function") {
    requestAnimationFrame(() => {
      window.refreshGoals();
    });
  }
}

  }


  function initTabs() {
    for (const t of views) {
      const btn = $("tab-" + t);
      if (!btn) continue;
      btn.addEventListener("click", () => setTab(t));
    }
  }

  // Service worker (optional)
  async function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    try { await navigator.serviceWorker.register("service-worker.js"); } catch { /* ignore */ }
  }

  async function openRolloverModal(date = null) {
  const modal = document.getElementById("rolloverModal");
  const content = document.getElementById("rolloverContent");

  if (!modal || !content) return;

  const todos = await window.DB.getAll(window.DB.STORES.todos);

  const failed = todos.filter(
    t =>
      !t._deleted &&
      Array.isArray(t.rolloverFailures) &&
      t.rolloverFailures.length > 0
  );

  // Build map: date -> todos
  const byDate = {};
  for (const t of failed) {
    for (const d of t.rolloverFailures) {
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(t);
    }
  }

  content.innerHTML = "";

  // -----------------------------
  // VIEW 1: LIST OF DAYS
  // -----------------------------
  if (!date) {
    rolloverView = "days";
    rolloverSelectedDate = null;

    const dates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

    if (!dates.length) {
      content.innerHTML = `<div class="muted">No missed to-dos.</div>`;
    } else {
      for (const d of dates) {
        const row = document.createElement("div");
        row.className = "menuItem";
        row.style.cursor = "pointer";

        row.innerHTML = `
          <div>
            <strong>${isoToDDMMYYYY(d)}</strong>
            <div class="muted">${byDate[d].length} missed item(s)</div>
          </div>
        `;

        row.addEventListener("click", () => {
          openRolloverModal(d);
        });

        content.appendChild(row);
      }
    }

    modal.classList.remove("hidden");
    return;
  }

  // -----------------------------
  // VIEW 2: ITEMS FOR ONE DAY
  // -----------------------------
  rolloverView = "items";
  rolloverSelectedDate = date;

  const header = document.createElement("div");
  header.className = "cardHeader";

  header.innerHTML = `
    <div class="cardTitle">${isoToDDMMYYYY(date)}</div>
    <button class="btn btn--ghost" type="button">Back</button>
  `;

  header.querySelector("button").addEventListener("click", () => {
    openRolloverModal();
  });

  content.appendChild(header);

  const list = document.createElement("ul");
  list.className = "list";

  for (const t of byDate[date]) {
    const li = document.createElement("li");
    li.style.cursor = "pointer";

    li.innerHTML = `
      <div class="list__left">
        <div><strong>${escapeHtml(t.text)}</strong></div>
        <div class="muted">Currently on: ${isoToDDMMYYYY(t.date)}</div>
      </div>
    `;

    li.addEventListener("click", async () => {
      // Close modal
      modal.classList.add("hidden");

      // Navigate to the to-do list where the item currently lives
      await window.DB.ensureTodoList(t.date);
      setTab("todo");
      showTodoDetail(t.date);
    });

    list.appendChild(li);
  }

  content.appendChild(list);
  modal.classList.remove("hidden");
}


// Open rollover analysis when clicking to-do completion metric
document.addEventListener("click", (e) => {
  const card = e.target.closest(".metricCard");
  if (!card) return;

  // Only react to the To-do completion card
  const value = card.querySelector("#mTodoWeek");
  if (!value) return;

  openRolloverModal();
});

document.getElementById("btnCloseRollover")?.addEventListener("click", () => {
  document.getElementById("rolloverModal")?.classList.add("hidden");
});

document.getElementById("rolloverBackdrop")?.addEventListener("click", () => {
  document.getElementById("rolloverModal")?.classList.add("hidden");
});






  /* ---------------------------------------------------------
     Dashboard
  --------------------------------------------------------- */

  function setDashboardPeriod(p) {
    dashboardPeriod = p;
    setPressed(dashPeriodWeek, p === "Week");
    setPressed(dashPeriodMonth, p === "Month");
    setPressed(dashPeriodYear, p === "Year");
    refreshDashboard();
  }
  function bindDashboardPeriod(btn, period) {
  if (!btn) return;

  const handler = (e) => {
    e.preventDefault();
    setDashboardPeriod(period);
  };

  btn.addEventListener("click", handler);
  btn.addEventListener("touchstart", handler, { passive: false });
}

bindDashboardPeriod(dashPeriodWeek, "Week");
bindDashboardPeriod(dashPeriodMonth, "Month");
bindDashboardPeriod(dashPeriodYear, "Year");


  async function refreshDashboard() {
    const dump = await window.DB.exportAll();
    const journals = (dump.journal || []).filter(j => !j._deleted);
    const todos = (dump.todos || []).filter(x => !x._deleted);
    const habits = (dump.habits || []).filter(x => !x._deleted && !x.archived);
    const completions = (dump.habitCompletions || []).filter(x => !x._deleted);

    const nowD = new Date();
    function colourForValue(pct) {
  if (!isFinite(pct)) return "#9ca3af"; // grey when no data

  // Clamp between 0 and 1
  const t = Math.max(0, Math.min(1, pct));

  // Red → Orange → Green
  const r = t < 0.5
    ? 220
    : Math.round(220 - (t - 0.5) * 2 * 186);

  const g = t < 0.5
    ? Math.round(38 + t * 2 * 165)
    : 165;

  const b = 38;

  return `rgb(${r}, ${g}, ${b})`;
}
    const today = todayStrISO();

    function todoCompletionForDates(dates) {
  let total = 0;
  let done = 0;

  for (const t of todos) {
    if (t._deleted) continue;

    // Completed on the day
    if (dates.includes(t.date)) {
      total++;
      if (t.status === "Completed") done++;
    }

    

    function journalCompletionForDates(dates) {
  let completedDays = 0;

  for (const d of dates) {
    const entry = journals.find(j => j.date === d);
    if (!entry) continue;

    const hasText =
      (entry.gratitude && entry.gratitude.trim().length > 0) ||
      (entry.objectives && entry.objectives.trim().length > 0) ||
      (entry.reflections && entry.reflections.trim().length > 0);

    if (hasText) completedDays++;
  }

  return dates.length ? completedDays / dates.length : NaN;
}


    // Failed on the day (rolled over)
    if (Array.isArray(t.rolloverFailures)) {
      for (const d of t.rolloverFailures) {
        if (dates.includes(d)) {
          total++;
        }
      }
    }
  }

  return total ? done / total : NaN;
}


    let periodLabel = "This week";
    let dates = [];
    if (dashboardPeriod === "Week") {
      const startW = startOfWeek(nowD);
      for (let i = 0; i < 7; i++) {
        const d = new Date(startW);
        d.setDate(d.getDate() + i);
        dates.push(dateToISO(d));
      }
      periodLabel = "This week";
    } else if (dashboardPeriod === "Month") {
      const start = startOfMonth(nowD);
      const end = new Date(nowD.getFullYear(), nowD.getMonth() + 1, 0);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) dates.push(dateToISO(d));
      periodLabel = "This month";
    } else {
      const start = startOfYear(nowD);
      const end = new Date(nowD.getFullYear(), 11, 31);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) dates.push(dateToISO(d));
      periodLabel = "This year";
    }

    if (mTodoToday) mTodoToday.textContent = fmtPct(todoCompletionForDates([today]));
    if (mTodoWeek) mTodoWeek.textContent = fmtPct(todoCompletionForDates(dates));
    if (mTodoPeriodLabel) mTodoPeriodLabel.textContent = periodLabel;

    if (mJournalRate) {
  mJournalRate.textContent = fmtPct(journalCompletionForDates(dates));
}

function avgForField(field) {
  const values = journals
    .filter(j => dates.includes(j.date))
    .map(j => j[field])
    .filter(v => typeof v === "number");

  if (!values.length) return NaN;

  return values.reduce((a, b) => a + b, 0) / values.length;
}


if (mJournalPeriodLabel) {
  mJournalPeriodLabel.textContent = periodLabel;
}


    if (mJournalRate) {
  mJournalRate.textContent = fmtPct(journalCompletionForDates(dates));
}

if (mJournalPeriodLabel) {
  mJournalPeriodLabel.textContent = periodLabel;
}

function journalCompletionForDates(dates) {
  let completedDays = 0;

  for (const d of dates) {
    const entry = journals.find(j => j.date === d);
    if (!entry) continue;

    const hasText =
      (entry.gratitude && entry.gratitude.trim().length > 0) ||
      (entry.objectives && entry.objectives.trim().length > 0) ||
      (entry.reflections && entry.reflections.trim().length > 0);

    if (hasText) completedDays++;
  }

  return dates.length ? completedDays / dates.length : NaN;
}



    const openToday = todos.filter(t => t.date === today && t.status !== "Completed").length;
    if (mOpenToday) mOpenToday.textContent = String(openToday);

    function periodStatsHabits(startDate) {
      const start = startDate;
      const days = daysBetweenInclusive(start, nowD);
      const denom = habits.length * days;
      if (!denom) return NaN;
      const startStr = dateToISO(start);
      const endStr = dateToISO(nowD);
      const ticks = completions.filter(c => c.date >= startStr && c.date <= endStr).length;
      return ticks / denom;
    }

    let habitStart = startOfWeek(nowD);
    let habitLabel = "This week";
    if (dashboardPeriod === "Month") { habitStart = startOfMonth(nowD); habitLabel = "This month"; }
    if (dashboardPeriod === "Year") { habitStart = startOfYear(nowD); habitLabel = "This year"; }

    if (mHabitWeek) mHabitWeek.textContent = fmtPct(periodStatsHabits(habitStart));
    if (mHabitPeriodLabel) mHabitPeriodLabel.textContent = habitLabel;

    const moodPct = avgForField("mood") / 10;
const energyPct = avgForField("energy") / 10;
const stressPct = avgForField("stress") / 10;

if (avgMood) {
  avgMood.textContent = fmtPct(moodPct);
  avgMood.closest(".metricCircle").style.background =
    colourForValue(moodPct);
}

if (avgEnergy) {
  avgEnergy.textContent = fmtPct(energyPct);
  avgEnergy.closest(".metricCircle").style.background =
    colourForValue(energyPct);
}

if (avgStress) {
  avgStress.textContent = fmtPct(stressPct);
  avgStress.closest(".metricCircle").style.background =
    colourForValue(stressPct);
}



    updateTopbar();
  }

  btnRefreshDashboard?.addEventListener("click", refreshDashboard);

  /* ---------------------------------------------------------
     To-do lists
     - Fix: index now shows created lists (uses todoLists store)
     - Priority filter is multi-select (Excel-like)
     - Clicking a to-do item opens Action modal (no separate to-do modal in new HTML)
  --------------------------------------------------------- */


  function showTodoIndex() {
    todoDetailCard?.classList.add("hidden");
    todoIndexCard?.classList.remove("hidden");
    currentTodoDate = null;
  }

  function showTodoDetail(dateISO) {
  currentTodoDate = dateISO;
  if (todoDetailDateLabel) todoDetailDateLabel.textContent = isoToDDMMYYYY(dateISO);
  todoIndexCard?.classList.add("hidden");
  todoDetailCard?.classList.remove("hidden");

  window.DB.ensureTodoList(dateISO).then(() => {
    if (todoNewText) todoNewText.value = "";
    refreshTodoDetail();
  });
}


  btnTodoBack?.addEventListener("click", refreshTodoIndex);

  btnTodoNewList?.addEventListener("click", () => {
    if (todoNewListDate) todoNewListDate.value = todayStrISO();
    showModal(todoNewListModal);
  });
  todoNewListBackdrop?.addEventListener("click", () => hideModal(todoNewListModal));
  btnCloseTodoNewList?.addEventListener("click", () => hideModal(todoNewListModal));

  btnCreateTodoList?.addEventListener("click", async () => {
    const d = (todoNewListDate?.value) || todayStrISO();
    await window.DB.ensureTodoList(d);
    hideModal(todoNewListModal);
    showTodoDetail(d);
  });

  btnTodoToday?.addEventListener("click", async () => {
    const d = todayStrISO();
    await window.DB.ensureTodoList(d);
    showTodoDetail(d);
  });

  todoSort?.addEventListener("change", refreshTodoIndex);

  async function refreshTodoIndex() {
    showTodoIndex();
    /// FIX: ensure todoLists exist ONLY for dates that actually have todos
const allTodos = (await window.DB.getAll(window.DB.STORES.todos))
  .filter(t => !t._deleted && t.date);

// Count todos per date
const todoCountByDate = new Map();
for (const t of allTodos) {
  todoCountByDate.set(t.date, (todoCountByDate.get(t.date) || 0) + 1);
}

// Ensure lists exist for dates WITH todos
for (const [date, count] of todoCountByDate.entries()) {
  if (count > 0) {
    await window.DB.ensureTodoList(date);
  }
}



    const lists = (await window.DB.getAll(window.DB.STORES.todoLists)).filter(x => !x._deleted);
    const todos = (await window.DB.getAll(window.DB.STORES.todos)).filter(x => !x._deleted);

    const sortMode = todoSort?.value || "dateDesc";
    

    const archivedProjectIds = new Set(
  (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => p.archived)
    .map(p => p.id)
);

const rows = lists
  .map(l => {
    const visibleTodos = todos.filter(t =>
      t.date === l.date &&
      !t._deleted &&
      (!t.projectId || !archivedProjectIds.has(t.projectId))
    );

    const done = visibleTodos.filter(t => t.status === "Completed").length;
    return { date: l.date, total: visibleTodos.length, done };
  })


    rows.sort((a, b) => sortMode === "dateAsc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));

    todoDateList.innerHTML = "";
    if (!rows.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><div class="muted">No to-do lists yet.</div></div>`;
      todoDateList.appendChild(li);
      return;
    }

    for (const x of rows) {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="list__left">
          <div class="titleClamp">
            <div><strong>${isoToDDMMYYYY(x.date)}</strong></div>
            <div class="muted">${x.done}/${x.total} completed</div>
          </div>
        </div>
        <div class="list__right">
          <span class="pill">${x.total} items</span>
        </div>
      `;
      li.addEventListener("click", async () => {
        await window.DB.ensureTodoList(x.date);
        showTodoDetail(x.date);
      });
      todoDateList.appendChild(li);
    }
  }

  async function refreshTodoDetail() {
    if (!currentTodoDate) return;

    const allTodos = await window.DB.getByIndex(
  window.DB.STORES.todos,
  window.DB.idx.todosByDate,
  currentTodoDate
);

const archivedProjectIds = new Set(
  (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => p.archived)
    .map(p => p.id)
);

const items = allTodos.filter(t =>
  !t._deleted &&
  (!t.projectId || !archivedProjectIds.has(t.projectId))
);


items.sort((a, b) => {
  const prio =
    prioRank(b.priority || "Medium") -
    prioRank(a.priority || "Medium");
  if (prio !== 0) return prio;

  const statusRank = s =>
    s === "In Progress" ? 3 :
    s === "Open" ? 2 : 1;

  const status =
    statusRank(b.status || "Open") -
    statusRank(a.status || "Open");
  if (status !== 0) return status;

  return (a.createdAt || 0) - (b.createdAt || 0);
});



    todoList.innerHTML = "";
    if (!items.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><div class="muted">No tasks yet. Add one above.</div></div>`;
      todoList.appendChild(li);
      return;
    }

    for (const t of items) {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.className = "list__left";

      const dot = document.createElement("div");
      dot.className = "todoDot" + (t.status === "Completed" ? " done" : "");

      const title = document.createElement("div");
      title.className = "titleClamp";

      const due = t.dueDate ? isoToDDMMYYYY(t.dueDate) : "—";

let projectLabel = "No project";
if (t.projectId) {
  const p = await window.DB.getOne(window.DB.STORES.projects, t.projectId);
  if (p && !p._deleted) projectLabel = p.name;
}

title.innerHTML = `
  <div class="todoText ${t.status === "Completed" ? "done" : ""}">
    <strong>${escapeHtml(t.text)}</strong>
  </div>
  <div class="muted">
    Project: ${escapeHtml(projectLabel)} • Due: ${escapeHtml(due)}
  </div>
`;


      left.appendChild(dot);
      left.appendChild(title);

      const right = document.createElement("div");
      right.className = "list__right";

      const prio = document.createElement("div");
      prio.className = `prioDot ${prioClass(t.priority || "Medium")}`;
      prio.title = `Priority: ${t.priority || "Medium"}`;

      const statusBtn = document.createElement("button");
      statusBtn.type = "button";
      statusBtn.className = `statusBtn ${statusClass(t.status || "Open")}`;
      statusBtn.textContent = t.status || "Open";

      if (typeof t.notes === "string" && t.notes.trim().length > 0) {
  const note = document.createElement("div");
  note.className = "notesIcon";
  note.title = "Has notes";
  note.textContent = "✎";
  right.appendChild(note);
}


      right.appendChild(prio);
      right.appendChild(statusBtn);

      li.appendChild(left);
      li.appendChild(right);

      dot.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const next = t.status === "Completed" ? "Open" : "Completed";
        await window.DB.updateTodo(t.id, { status: next });
        await refreshTodoDetail();
        await refreshProjectsAndActions();
        await refreshDashboard();
              });

      statusBtn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const next = cycleStatus(t.status || "Open");
        await window.DB.updateTodo(t.id, { status: next });
        await refreshTodoDetail();
        await refreshProjectsAndActions();
        await refreshDashboard();
              });

      const delBtn = document.createElement("button");
delBtn.type = "button";
delBtn.className = "iconBtn";
delBtn.title = "Delete task";
delBtn.textContent = "🗑";

delBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation();
  const ok = confirm("Delete this task?");
  if (!ok) return;

  await window.DB.deleteTodo(t.id);
  await refreshTodoDetail();
  await refreshProjectsAndActions();
  await refreshDashboard();
});

right.appendChild(delBtn);

      prio.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const next = cyclePriority(t.priority || "Medium");
        await window.DB.updateTodo(t.id, { priority: next });
        await refreshTodoDetail();
        await refreshProjectsAndActions();
      });

      // In the new UI, clicking a to-do opens the Action modal (same underlying record via actionId)
      li.addEventListener("click", async () => {
        if (t.actionId) openActionModal(t.actionId);
        else {
          // Ensure linkage exists (db.js upsertTodo normally ensures it, but guard anyway)
          const saved = await window.DB.upsertTodo({ id: t.id, date: t.date, text: t.text, status: t.status, priority: t.priority, dueDate: t.dueDate, notes: t.notes, projectId: t.projectId });
          if (saved?.actionId) openActionModal(saved.actionId);
        }
      });

      todoList.appendChild(li);
    }
  }

  btnAddTodo?.addEventListener("click", async () => {
  if (!currentTodoDate) {
    const d = todayStrISO();
    await window.DB.ensureTodoList(d);
    showTodoDetail(d);
  }

    const text = (todoNewText.value || "").trim();
    if (!text) return;

    await window.DB.ensureTodoList(currentTodoDate);

    await window.DB.upsertTodo({
      date: currentTodoDate,
      text,
      status: "Open",
      priority: "Medium",
      notes: "",
      dueDate: "",
      projectId: null
    });

    todoNewText.value = "";
    await refreshTodoDetail();
    await refreshProjectsAndActions();
    await refreshDashboard();
  });

  todoNewText?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnAddTodo.click();
    }
  });

  /* ---------------------------------------------------------
     Journal
     - Index -> detail
     - Autosave while typing (no manual Save required)
  --------------------------------------------------------- */

  function showJournalIndex() {
    journalDetailCard?.classList.add("hidden");
    journalIndexCard?.classList.remove("hidden");
    currentJournalDate = null;
  }

  function showJournalDetail(dateISO) {
    currentJournalDate = dateISO;
    if (journalDetailDateLabel) journalDetailDateLabel.textContent = isoToDDMMYYYY(dateISO);
    journalIndexCard?.classList.add("hidden");
    journalDetailCard?.classList.remove("hidden");
    loadJournalDetail();

    requestAnimationFrame(() => {
  jGratitude.focus();
});

  }

  btnJournalBack?.addEventListener("click", async () => {
  // IMPORTANT: force-save journal before returning to list
  await autosaveJournal();
  await refreshJournalIndex();
});


  btnJournalNewEntry?.addEventListener("click", () => {
    if (journalNewEntryDate) journalNewEntryDate.value = todayStrISO();
    showModal(journalNewEntryModal);
  });
  journalNewEntryBackdrop?.addEventListener("click", () => hideModal(journalNewEntryModal));
  btnCloseJournalNewEntry?.addEventListener("click", () => hideModal(journalNewEntryModal));

  btnCreateJournalEntry?.addEventListener("click", async () => {
    const d = journalNewEntryDate.value || todayStrISO();
    hideModal(journalNewEntryModal);
    showJournalDetail(d);
  });

  journalSearchInput?.addEventListener("input", () => {
  journalSearchText = journalSearchInput.value.toLowerCase();
  refreshJournalIndex();
});


  async function refreshJournalIndex() {
  showJournalIndex();

  if (journalSearchInput) {
    journalSearchInput.value = journalSearchText;
  }

  const all = await window.DB.getAll(window.DB.STORES.journal);

  const dates = all
  .filter(j => !j._deleted)
  .filter(j => {
    if (!journalSearchText) return true;

    const text =
      (j.gratitude || "") +
      (j.objectives || "") +
      (typeof j.reflections === "object"
        ? Object.values(j.reflections).join(" ")
        : "");

    return text.toLowerCase().includes(journalSearchText);
  })
  .map(j => j.date)
  .sort((a, b) => b.localeCompare(a));


  journalDateList.innerHTML = "";

  if (!dates.length) {
    const li = document.createElement("li");
    li.innerHTML = `<div class="list__left"><div class="muted">No journal entries yet.</div></div>`;
    journalDateList.appendChild(li);
    return;
  }

  for (const d of dates) {
    const rec = all.find(j => !j._deleted && j.date === d);
    if (!rec) continue;

    let preview = "";

if (journalSearchText) {
  const allText =
    (rec.gratitude || "") + " " +
    (rec.objectives || "") + " " +
    (rec.reflections && typeof rec.reflections === "object"
      ? Object.values(rec.reflections).join(" ")
      : "");

  const idx = allText.toLowerCase().indexOf(journalSearchText);
  if (idx !== -1) {
    preview = allText.slice(Math.max(0, idx - 40), idx + 40);
  }
} else {
  preview =
    rec.gratitude ||
    rec.objectives ||
    (
      rec.reflections &&
      typeof rec.reflections === "object" &&
      Object.values(rec.reflections).find(v => v && v.trim())
    ) ||
    "";
}


    const li = document.createElement("li");

    li.innerHTML = `
      <div class="list__left">
        <div class="titleClamp">
          <div><strong>${isoToDDMMYYYY(d)}</strong></div>
<div class="muted">${
  preview
    ? highlightMatch(String(preview), journalSearchText)
    : "—"
}</div>

        </div>
      </div>
      <div class="list__right"></div>
    `;

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "iconBtn";
    delBtn.title = "Delete journal entry";
    delBtn.textContent = "🗑";

    delBtn.addEventListener("click", async (ev) => {
      ev.stopPropagation();
      const ok = await confirmInApp({
        title: "Delete journal entry",
        message: "Delete this journal entry?"
      });
      if (!ok) return;

      await window.DB.deleteJournal(d);
      await refreshJournalIndex();
      await refreshDashboard();
    });

    li.querySelector(".list__right").appendChild(delBtn);

    li.addEventListener("click", () => showJournalDetail(d));

    journalDateList.appendChild(li);
  }
}


  async function loadJournalDetail() {
    if (!currentJournalDate) return;
    const rec = (await window.DB.getOne(window.DB.STORES.journal, currentJournalDate));
    // Initialise tagged reflections state
currentReflections = rec?.reflections && typeof rec.reflections === "object"
  ? { ...rec.reflections }
  : {};

renderReflectionSections();

    jGratitude.value = rec?.gratitude || "";
    jObjectives.value = rec?.objectives || "";
    // -----------------------------
// TEMP: render tagged reflections (read-only for now)
// -----------------------------
const reflections = rec?.reflections || {};

const orderedTags = [
  "general",
  "work",
  "fitness",
  "social",
  "relationships",
  "sleep",
  "money"
];

for (const tag of orderedTags) {
  if (!reflections[tag]) continue;

  const ta = document.createElement("textarea");
  ta.className = "textarea autosize";
  ta.rows = 3;
  ta.value = reflections[tag];

  const wrapper = document.createElement("div");
  wrapper.className = "field";

  const label = document.createElement("label");
  label.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);

  wrapper.appendChild(label);
  wrapper.appendChild(ta);

  jReflections.parentElement.appendChild(wrapper);

  autosizeTextarea(ta);
}

    journalMood.value = rec?.mood ?? "";
journalEnergy.value = rec?.energy ?? "";
journalStress.value = rec?.stress ?? "";
    autosizeTextarea(jGratitude);
    autosizeTextarea(jObjectives);
    autosizeTextarea(jReflections);
  }

  async function autosaveJournal() {
  if (!currentJournalDate) return;

  const existing = await window.DB.getOne(
    window.DB.STORES.journal,
    currentJournalDate
  );

  const gratitude = jGratitude.value || "";
  const objectives = jObjectives.value || "";

  // Clean reflections
  let cleanedReflections = {};
  if (currentReflections && typeof currentReflections === "object") {
    for (const [k, v] of Object.entries(currentReflections)) {
      if (typeof v === "string" && v.trim().length > 0) {
        cleanedReflections[k] = v;
      }
    }
  }

  // 🔒 SAFETY GUARD:
  // Do NOT overwrite an existing entry with completely empty content
  const hasAnyContent =
    gratitude.trim() ||
    objectives.trim() ||
    Object.keys(cleanedReflections).length > 0;

  if (!hasAnyContent && existing) {
    return;
  }

  const payload = {
    date: currentJournalDate,
    gratitude,
    objectives,
    mood: journalMood.value ? Number(journalMood.value) : null,
    energy: journalEnergy.value ? Number(journalEnergy.value) : null,
    stress: journalStress.value ? Number(journalStress.value) : null,
    reflections: cleanedReflections
  };

  await window.DB.upsertJournal(payload);
}



  [jGratitude, jObjectives, jReflections].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", () => {
      autosizeTextarea(el);
      debounce("journal_autosave", 300, autosaveJournal);
    });
  });

  [journalMood, journalEnergy, journalStress].forEach(el => {
  el?.addEventListener("input", () => {
    debounce("journal_autosave", 300, autosaveJournal);
  });
});


  // Keep button for backwards compatibility, but not required
  btnSaveJournal?.addEventListener("click", async () => {
    await autosaveJournal();
    alert("Saved.");
    await refreshJournalIndex();
  });

  /* ---------------------------------------------------------
     Projects & Actions
     - Actions created from to-dos automatically via DB layer
     - +Action reliably shows in list (refresh after save)
     - Filters are multi-select (Project, Priority, Status)
     - Project pane: add/view notes; see actions for selected project
  --------------------------------------------------------- */

  function setActionsMode(mode) {
    actionsMode = mode;
    const isProjects = mode === "projects";
    setPressed(btnActionsViewProjects, isProjects);
    setPressed(btnActionsViewActions, !isProjects);
    actionsProjectsWrap?.classList.toggle("hidden", !isProjects);
    actionsActionsWrap?.classList.toggle("hidden", isProjects);
  }

  btnActionsViewProjects?.addEventListener("click", () => { setActionsMode("projects"); refreshProjectsAndActions(); });
  btnActionsViewActions?.addEventListener("click", () => { setActionsMode("actions"); refreshProjectsAndActions(); });

  async function getProjectsActive() {
  return (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => !p._deleted && !p.archived)
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
}

function renderReflectionSections() {
  if (!journalReflectionsList || !journalReflectionsEmpty) return;

  journalReflectionsList.innerHTML = "";

  const tags = Object.keys(currentReflections);

  // Empty state
  journalReflectionsEmpty.classList.toggle("hidden", tags.length > 0);

  for (const tag of REFLECTION_TAGS) {
    if (!(tag in currentReflections)) continue;

    const wrapper = document.createElement("div");
    wrapper.className = "field";

    const labelRow = document.createElement("div");
    labelRow.style.display = "flex";
    labelRow.style.justifyContent = "space-between";
    labelRow.style.alignItems = "center";

    const label = document.createElement("label");
    label.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn--ghost";
    removeBtn.textContent = "×";
    removeBtn.title = "Remove reflection";

    labelRow.appendChild(label);
    labelRow.appendChild(removeBtn);

    const ta = document.createElement("textarea");
    ta.className = "textarea autosize";
    ta.rows = 3;
    ta.value = currentReflections[tag] || "";

    ta.addEventListener("input", () => {
      currentReflections[tag] = ta.value;
      debounce("journal_autosave", 300, autosaveJournal);
      autosizeTextarea(ta);
    });

    removeBtn.addEventListener("click", async () => {
  if (ta.value.trim()) {
    const ok = await confirmInApp({
      title: "Remove reflection",
      message: `Remove ${label.textContent} reflection?`
    });
    if (!ok) return;
  }

  // Permanently remove the reflection key
  delete currentReflections[tag];

  // Re-render UI
  renderReflectionSections();

  // Immediately persist the removal
  await autosaveJournal();
});


    wrapper.appendChild(labelRow);
    wrapper.appendChild(ta);
    journalReflectionsList.appendChild(wrapper);

    autosizeTextarea(ta);
  }
}


  async function populateProjectSelect(selectEl, includeNone = true) {
    const projects = await getProjectsActive();
    selectEl.innerHTML = "";
    if (includeNone) {
      const o = document.createElement("option");
      o.value = "None";
      o.textContent = "No project";
      selectEl.appendChild(o);
    }
    for (const p of projects) {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = p.name;
      selectEl.appendChild(o);
    }
  }

  function buildProjectFilterPanel(projects) {
    // Project filter includes: All, None, each project
    const opts = ["All", "None", ...projects.map(p => p.name)];
    // Store selected by special tokens: "__ALL__", "__NONE__", or projectId values.
    // For UI display we map back.
    const state = filterState.actionsProject;

    buildMultiFilter({
      button: actionFilterProjectBtn,
      panel: actionFilterProjectPanel,
      title: "Project",
      options: opts,
      stateSet: (function () {
        // A proxy Set of labels for panel toggling; on Apply we reconcile to ids.
        // To keep this simple, we store labels in a hidden temp set and convert.
        const labelSet = new Set();
        if (state.has("__ALL__")) labelSet.add("All");
        if (state.has("__NONE__")) labelSet.add("None");
        for (const p of projects) if (state.has(p.id)) labelSet.add(p.name);
        // Replace methods to keep panel in sync
        labelSet._commit = () => {
          state.clear();
          if (labelSet.has("All")) state.add("__ALL__");
          if (labelSet.has("None")) state.add("__NONE__");
          for (const p of projects) if (labelSet.has(p.name)) state.add(p.id);
        };
        return labelSet;
      })(),
      onApply: () => {
        // Commit label selections into id selections
        const labelSet = arguments.callee.caller?.arguments?.[0]?.stateSet; // not reliable
        // Instead: rebuild from panel checkboxes by reading the panel DOM
        const picked = new Set();
        actionFilterProjectPanel.querySelectorAll("input[type=checkbox]").forEach((cb, i) => {
          if (!cb.checked) return;
          const label = opts[i];
          picked.add(label);
        });
        filterState.actionsProject.clear();
        if (picked.has("All") || !picked.size) filterState.actionsProject.add("__ALL__");
        if (picked.has("None")) filterState.actionsProject.add("__NONE__");
        for (const p of projects) if (picked.has(p.name)) filterState.actionsProject.add(p.id);
        refreshActionsUI();
      }
    });
  }

  buildMultiFilter({
    button: actionFilterPriorityBtn,
    panel: actionFilterPriorityPanel,
    title: "Priority",
    options: ["Low", "Medium", "High"],
    stateSet: filterState.actionsPriority,
    onApply: () => refreshActionsUI()
  });

  buildMultiFilter({
    button: actionFilterStatusBtn,
    panel: actionFilterStatusPanel,
    title: "Status",
    options: ["Open", "In Progress", "Completed"],
    stateSet: filterState.actionsStatus,
    onApply: () => refreshActionsUI()
  });

  buildMultiFilter({
    button: actionFilterPriorityBtn2,
    panel: actionFilterPriorityPanel2,
    title: "Priority",
    options: ["Low", "Medium", "High"],
    stateSet: filterState.projectPriority,
    onApply: () => refreshActionsForProject()
  });

  buildMultiFilter({
    button: actionFilterStatusBtn2,
    panel: actionFilterStatusPanel2,
    title: "Status",
    options: ["Open", "In Progress", "Completed"],
    stateSet: filterState.projectStatus,
    onApply: () => refreshActionsForProject()
  });

  async function buildNotesFilters() {
  // ---------- Projects ----------
  const projects = (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => !p._deleted && !p.archived);

  buildMultiFilter({
    button: notesProjectFilterBtn,
    panel: notesProjectFilterPanel,
    title: "Projects",
    options: ["All", ...projects.map(p => p.name)],
    stateSet: new Set(
      filterState.notesProjects.has("__ALL__")
        ? ["All"]
        : projects.filter(p => filterState.notesProjects.has(p.id)).map(p => p.name)
    ),
    onApply: () => {
      const picked = new Set();
      notesProjectFilterPanel
        .querySelectorAll("input[type=checkbox]")
        .forEach((cb, i) => {
          if (!cb.checked) return;
          const label = i === 0 ? "All" : projects[i - 1].id;
          picked.add(label);
        });

      filterState.notesProjects.clear();
      if (picked.has("All") || picked.size === 0) {
        filterState.notesProjects.add("__ALL__");
      } else {
        picked.forEach(id => filterState.notesProjects.add(id));
      }

      refreshNotes();
    }
  });

  // ---------- Collections ----------
  const collections = (await window.DB.getAll(window.DB.STORES.collections))
    .filter(c => !c._deleted && !c.archived);

  buildMultiFilter({
    button: notesCollectionFilterBtn,
    panel: notesCollectionFilterPanel,
    title: "Collections",
    options: ["All", ...collections.map(c => c.name)],
    stateSet: new Set(
      filterState.notesCollections.has("__ALL__")
        ? ["All"]
        : collections.filter(c => filterState.notesCollections.has(c.id)).map(c => c.name)
    ),
    onApply: () => {
      const picked = new Set();
      notesCollectionFilterPanel
        .querySelectorAll("input[type=checkbox]")
        .forEach((cb, i) => {
          if (!cb.checked) return;
          const label = i === 0 ? "All" : collections[i - 1].id;
          picked.add(label);
        });

      filterState.notesCollections.clear();
      if (picked.has("All") || picked.size === 0) {
        filterState.notesCollections.add("__ALL__");
      } else {
        picked.forEach(id => filterState.notesCollections.add(id));
      }

      refreshNotes();
    }
  });
}



  
  btnToggleArchivedProjects?.addEventListener("click", async () => {
  archivedProjectsVisible = !archivedProjectsVisible;

  archivedProjectList.classList.toggle("hidden", !archivedProjectsVisible);
  btnToggleArchivedProjects.textContent = archivedProjectsVisible
    ? "Hide archived projects"
    : "Show archived projects";

  // CRITICAL: re-render projects so archived ones are actually added to the DOM
  await refreshProjectsAndActions();
});



  btnAddAction?.addEventListener("click", async () => {
    await refreshProjectsAndActions(); // ensure modal project list is current
    openActionModal(null);
  });

  function openActionModal(editId = null) {
    editingActionId = editId;

    if (!editId) {
  actionModalTitle.textContent = "New action";
  modalActionTitle.value = "";
  modalActionDue.value = "";
  modalActionNotes.value = "";
  modalActionPriority.value = "Medium";
  modalActionStatus.value = "Open";
  modalActionProject.value = "None";
  btnDeleteAction.classList.add("hidden");
  showModal(actionModal);

  requestAnimationFrame(() => {
    modalActionTitle.focus();
  });

  return;
}





    actionModalTitle.textContent = "Edit action";
    btnDeleteAction.classList.remove("hidden");
    showModal(actionModal);
    loadActionIntoModal(editId);
  }
  

  async function loadActionIntoModal(id) {
    const a = await window.DB.getOne(window.DB.STORES.actions, id);
    if (!a || a._deleted) return;

    await populateProjectSelect(modalActionProject, true);

    modalActionTitle.value = a.title || "";
    modalActionDue.value = a.dueDate || "";
    modalActionPriority.value = a.priority || "Medium";
    modalActionStatus.value = a.status || "Open";
    modalActionNotes.value = a.notes || "";
    modalActionProject.value = a.projectId || "None";
    autosizeTextarea(modalActionNotes);
  }

  btnCloseActionModal?.addEventListener("click", () => hideModal(actionModal));
  actionBackdrop?.addEventListener("click", () => hideModal(actionModal));

  btnSaveModalAction?.addEventListener("click", async () => {
    const title = (modalActionTitle.value || "").trim();
    if (!title) { alert("Title required."); return; }

    const projectId = (modalActionProject.value === "None") ? null : (modalActionProject.value || null);
    const dueDate = modalActionDue.value || "";
    const notes = modalActionNotes.value || "";
    const priority = modalActionPriority.value || "Medium";
    const status = modalActionStatus.value || "Open";

    const saved = await window.DB.upsertAction({
      id: editingActionId || undefined,
      title,
      projectId,
      status,
      priority,
      dueDate,
      notes
    });

    await window.DB.syncTodosFromAction(saved.id);


    hideModal(actionModal);

    // Sync linked to-dos from action changes (db.js provides helper)
    if (saved?.id) await window.DB.syncTodosFromAction(saved.id);

    await refreshProjectsAndActions(); // critical to fix “created action not showing”
    await refreshTodoDetail();
    await refreshDashboard();
  });

  btnDeleteAction?.addEventListener("click", async () => {
    if (!editingActionId) return;
    const ok = confirm("Delete this action?");
    if (!ok) return;
    await window.DB.deleteAction(editingActionId);
    hideModal(actionModal);
    await refreshProjectsAndActions();
    await refreshTodoDetail();
    await refreshDashboard();
  });

  btnRefreshActions?.addEventListener("click", refreshActionsUI);
  actionSort?.addEventListener("change", refreshActionsUI);

  async function refreshProjectsAndActions() {
    // Projects list + modal project dropdown + filters
    const projects = await getProjectsActive();
    const allProjects = await window.DB.getAll(window.DB.STORES.projects);

const archivedProjects = allProjects
  .filter(p => !p._deleted && p.archived)
  .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  


    // Modal project select
    await populateProjectSelect(modalActionProject, true);

    // Build project filter panel for All Actions view
    buildProjectFilterPanel(projects);

    // Render project list
    projectList.innerHTML = "";
    archivedProjectList.innerHTML = "";
    if (!projects.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><div class="muted">No projects yet. Add one to organise actions.</div></div>`;
      projectList.appendChild(li);
      selectedProjectId = null;
    } else {
      if (!selectedProjectId) selectedProjectId = projects[0].id;

      for (const p of projects) {
  const li = document.createElement("li");
  if (p.id === selectedProjectId) li.classList.add("active");
  li.innerHTML = `
    <div class="list__left">
      <div class="titleClamp">
        <div><strong>${escapeHtml(p.name)}</strong></div>
        <div class="muted">Tap to view</div>
      </div>
    </div>
    <div class="list__right"><span class="pill">Project</span></div>
  `;
  

  li.addEventListener("click", async () => {
  selectedProjectId = p.id;
  setActionsMode("projects");

  await refreshProjectsAndActions(); // 🔑 re-render list to update highlight
  await refreshActionsForProject();
  await loadProjectPane();
});


  /// Archive / Unarchive button
const archiveBtn = document.createElement("button");
archiveBtn.type = "button";
archiveBtn.className = "btn btn--ghost";
archiveBtn.textContent = "Archive";

archiveBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation();

  const ok = await confirmInApp({
  title: "Archive project",
  message: "Archive this project?\n\nIts actions and notes will be hidden but not deleted."
});
if (!ok) return;

  if (!ok) return;

  await window.DB.archiveProject(p.id);

  // Clear selection if needed
  if (selectedProjectId === p.id) {
    selectedProjectId = null;
  }

  await refreshProjectsAndActions();
  await refreshActionsUI();
  await refreshTodoDetail();
  await refreshDashboard();
});


// Delete button (cascades to actions and todos)
const delBtn = document.createElement("button");
delBtn.type = "button";
delBtn.className = "iconBtn";
delBtn.title = "Delete project";
delBtn.textContent = "🗑";

delBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation(); // prevent triggering li click
  const ok = await confirmInApp({
  title: "Delete project",
  message: "Delete this project and all its actions?"
});
if (!ok) return;

  if (!ok) return;

  await window.DB.deleteProject(p.id);

  // Clear selected project to avoid dangling state
  if (selectedProjectId === p.id) {
    selectedProjectId = null;
  }

  await refreshProjectsAndActions();
  await refreshActionsUI();
  await refreshTodoDetail();
  await refreshDashboard();
});


// Attach buttons to the right side
const right = li.querySelector(".list__right");
right?.appendChild(archiveBtn);
right?.appendChild(delBtn);


  // Append the li to the project list
  projectList.appendChild(li);
}



    }

// Render archived projects (collapsed by default)
if (archivedProjectsVisible) {
  if (!archivedProjects.length) {
    const li = document.createElement("li");
    li.innerHTML = `<div class="list__left"><div class="muted">No archived projects.</div></div>`;
    archivedProjectList.appendChild(li);
  } else {
    for (const p of archivedProjects) {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="list__left">
          <div class="titleClamp">
            <div><strong>${escapeHtml(p.name)}</strong></div>
            <div class="muted">Archived</div>
          </div>
        </div>
        <div class="list__right"></div>
      `;

      const unarchiveBtn = document.createElement("button");
      unarchiveBtn.type = "button";
      unarchiveBtn.className = "btn btn--ghost";
      unarchiveBtn.textContent = "Unarchive";

      unarchiveBtn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        await window.DB.unarchiveProject(p.id);

        archivedProjectsVisible = false;
        archivedProjectList.classList.add("hidden");
        btnToggleArchivedProjects.textContent = "Show archived projects";

        await refreshProjectsAndActions();
        await refreshActionsUI();
        await refreshDashboard();
      });

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "iconBtn";
      delBtn.textContent = "🗑";
      delBtn.title = "Delete project";

      delBtn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const ok = confirm("Delete this archived project and all its actions?");
        if (!ok) return;

        await window.DB.deleteProject(p.id);

        await refreshProjectsAndActions();
        await refreshActionsUI();
        await refreshDashboard();
      });

      li.querySelector(".list__right").appendChild(unarchiveBtn);
      li.querySelector(".list__right").appendChild(delBtn);

      archivedProjectList.appendChild(li);
    }
  }
}
    await loadProjectPane();
    await refreshActionsUI();
    await refreshActionsForProject();
  }

  async function loadProjectPane() {
    projectNotesWrap?.classList.add("hidden");
btnToggleProjectNotes.textContent = "Show project notes";

// Reset collapsible sections when switching projects
if (loadProjectPane._lastProject !== selectedProjectId) {
  projectActionsWrap?.classList.add("hidden");
  btnToggleProjectActions.textContent = "Show actions";

  projectLinkedNotesWrap?.classList.add("hidden");
  btnToggleProjectNotesLinked.textContent = "Show linked notes";
}

loadProjectPane._lastProject = selectedProjectId;





    if (!selectedProjectId) {
      if (projectTitle) projectTitle.textContent = "Project";
      if (projectMeta) projectMeta.textContent = "—";
      if (projectNotes) projectNotes.value = "";
      return;
    }
    const p = await window.DB.getOne(window.DB.STORES.projects, selectedProjectId);
    if (!p || p._deleted) return;

    if (projectTitle) projectTitle.textContent = p.name || "Project";
    if (projectMeta) projectMeta.textContent = `Created: ${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"}`;
    if (projectNotes) {
      projectNotes.value = p.notes || "";
      autosizeTextarea(projectNotes);
    }
  }

  // Autosave project notes
  projectNotes?.addEventListener("input", () => {
    autosizeTextarea(projectNotes);
    debounce("project_notes_autosave", 300, async () => {
      if (!selectedProjectId) return;
      await window.DB.updateProject(selectedProjectId, { notes: projectNotes.value || "" });
    });
  });

  async function refreshActionsUI() {
    const projects = (await window.DB.getAll(window.DB.STORES.projects))
  .filter(p => !p._deleted && !p.archived);
    let actions = (await window.DB.getAll(window.DB.STORES.actions)).filter(a => !a._deleted);

    const projName = (id) => projects.find(p => p.id === id)?.name || "—";

    const prioSet = filterState.actionsPriority;
    const statusSet = filterState.actionsStatus;
    const projSel = filterState.actionsProject;

    const archivedProjectIds = new Set(
  (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => p.archived)
    .map(p => p.id)
);

actions = actions.filter(a => !archivedProjectIds.has(a.projectId));


    let filtered = actions.filter(a => statusSet.has(a.status || "Open"));
    filtered = filtered.filter(a => prioSet.has(a.priority || "Medium"));

    // Project filter logic:
    // If "__ALL__" selected, accept all; otherwise accept selected ids and/or none
    if (!projSel.has("__ALL__")) {
      const allowNone = projSel.has("__NONE__");
      const allowIds = new Set(Array.from(projSel).filter(x => x !== "__NONE__" && x !== "__ALL__"));
      filtered = filtered.filter(a => {
        if (!a.projectId) return allowNone;
        return allowIds.has(a.projectId);
      });
    }

    const sortMode = actionSort?.value || "dueAsc";

    filtered.sort((a, b) => {
  // 1. Priority
  const prio =
    prioRank(b.priority || "Medium") -
    prioRank(a.priority || "Medium");
  if (prio !== 0) return prio;

  // 2. Status
  const statusRank = s =>
    s === "In Progress" ? 3 :
    s === "Open" ? 2 : 1;

  const status =
    statusRank(b.status || "Open") -
    statusRank(a.status || "Open");
  if (status !== 0) return status;

  // 3. Due date (earliest first, empty last)
  const da = a.dueDate || "9999-99-99";
  const db = b.dueDate || "9999-99-99";
  if (da !== db) return da.localeCompare(db);

  // 4. Created date (newest first)
  return (b.createdAt || 0) - (a.createdAt || 0);
});



    actionList.innerHTML = "";
    if (!filtered.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><div class="muted">No actions match the current filters.</div></div>`;
      actionList.appendChild(li);
      return;
    }

    for (const a of filtered) {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.className = "list__left";

      const due = a.dueDate ? isoToDDMMYYYY(a.dueDate) : "—";

      const title = document.createElement("div");
      title.className = "titleClamp";
      title.innerHTML = `
        <div><strong>${escapeHtml(a.title)}</strong></div>
        <div class="muted">Project: ${escapeHtml(projName(a.projectId))} • Deadline: ${escapeHtml(due)}</div>
      `;
      left.appendChild(title);

      const right = document.createElement("div");
      right.className = "list__right";

      if (typeof a.notes === "string" && a.notes.trim().length > 0) {
  const note = document.createElement("div");
  note.className = "notesIcon";
  note.title = "Has notes";
  note.textContent = "✎";
  right.appendChild(note);
}

// SEND TO TODAY button
const today = todayStrISO();
const todosToday = (await window.DB.getAll(window.DB.STORES.todos))
  .some(t => !t._deleted && t.actionId === a.id && t.date === today);

if (!todosToday && a.status !== "Completed") {
  const btnSend = document.createElement("button");
  btnSend.type = "button";
  btnSend.className = "btn btn--ghost";
  btnSend.textContent = "Send to today";

  btnSend.addEventListener("click", async (ev) => {
    ev.stopPropagation();
    btnSend.disabled = true;
btnSend.remove();
    await window.DB.ensureTodoList(today);
    await window.DB.upsertTodo({
      date: today,
      text: a.title,
      status: "Open",
      priority: a.priority || "Medium",
      notes: a.notes || "",
      dueDate: a.dueDate || "",
      projectId: a.projectId || null,
      actionId: a.id
    });
    await refreshTodoDetail();
    await refreshActionsForProject();
    await refreshDashboard();
  });

  right.appendChild(btnSend);
}


      const prio = document.createElement("div");
      prio.className = `prioDot ${prioClass(a.priority || "Medium")}`;
      prio.title = `Priority: ${a.priority || "Medium"}`;

      const statusBtn = document.createElement("button");
      statusBtn.type = "button";
      statusBtn.className = `statusBtn ${statusClass(a.status || "Open")}`;
      statusBtn.textContent = a.status || "Open";

      right.appendChild(prio);
      right.appendChild(statusBtn);

      li.appendChild(left);
      li.appendChild(right);

      prio.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const next = cyclePriority(a.priority || "Medium");
        await window.DB.updateAction(a.id, { priority: next });
        await window.DB.syncTodosFromAction(a.id);
        await refreshActionsUI();
        await refreshTodoDetail();
      });

      statusBtn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const next = cycleStatus(a.status || "Open");
        await window.DB.updateAction(a.id, { status: next });
        await window.DB.syncTodosFromAction(a.id);
        await refreshActionsUI();
        await refreshTodoDetail();
        await refreshDashboard();
      });

      const delBtn = document.createElement("button");
delBtn.type = "button";
delBtn.className = "iconBtn";
delBtn.title = "Delete action";
delBtn.textContent = "🗑";

delBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation();
  const ok = await confirmInApp({
  title: "Delete action",
  message: "Delete this action and all linked to-dos?"
});
if (!ok) return;

  if (!ok) return;

  await window.DB.deleteAction(a.id);
  await refreshActionsUI();
  await refreshTodoDetail();
  await refreshDashboard();
});

right.appendChild(delBtn);


      li.addEventListener("click", () => openActionModal(a.id));
      actionList.appendChild(li);
    }
  }

  async function refreshActionsForProject() {
    let actions = (await window.DB.getAll(window.DB.STORES.actions)).filter(a => !a._deleted);

    const prioSet = filterState.projectPriority;
    const statusSet = filterState.projectStatus;

    const archivedProjectIds = new Set(
  (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => p.archived)
    .map(p => p.id)
);

actions = actions.filter(a => !archivedProjectIds.has(a.projectId));


    let filtered = actions.filter(a => statusSet.has(a.status || "Open"));
    filtered = filtered.filter(a => prioSet.has(a.priority || "Medium"));

    if (selectedProjectId) filtered = filtered.filter(a => a.projectId === selectedProjectId);

    const sortMode = actionSort2?.value || "dueAsc";
    filtered.sort((a, b) => {
  // 1. Priority
  const prio =
    prioRank(b.priority || "Medium") -
    prioRank(a.priority || "Medium");
  if (prio !== 0) return prio;

  // 2. Status
  const statusRank = s =>
    s === "In Progress" ? 3 :
    s === "Open" ? 2 : 1;

  const status =
    statusRank(b.status || "Open") -
    statusRank(a.status || "Open");
  if (status !== 0) return status;

  // 3. Due date (earliest first, empty last)
  const da = a.dueDate || "9999-99-99";
  const db = b.dueDate || "9999-99-99";
  if (da !== db) return da.localeCompare(db);

  // 4. Created date (newest first)
  return (b.createdAt || 0) - (a.createdAt || 0);
});



    actionList2.innerHTML = "";
    if (!filtered.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><div class="muted">No actions for this project (with current filters).</div></div>`;
      actionList2.appendChild(li);
      return;
    }

    for (const a of filtered) {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.className = "list__left";
      const due = a.dueDate ? isoToDDMMYYYY(a.dueDate) : "—";

      const title = document.createElement("div");
      title.className = "titleClamp";
      title.innerHTML = `
        <div><strong>${escapeHtml(a.title)}</strong></div>
        <div class="muted">Deadline: ${escapeHtml(due)}</div>
      `;
      left.appendChild(title);

      const right = document.createElement("div");
      right.className = "list__right";

      if (typeof a.notes === "string" && a.notes.trim().length > 0) {
  const note = document.createElement("div");
  note.className = "notesIcon";
  note.title = "Has notes";
  note.textContent = "✎";
  right.appendChild(note);
}

      const prio = document.createElement("div");
      prio.className = `prioDot ${prioClass(a.priority || "Medium")}`;
      prio.title = `Priority: ${a.priority || "Medium"}`;

      const statusBtn = document.createElement("button");
      statusBtn.type = "button";
      statusBtn.className = `statusBtn ${statusClass(a.status || "Open")}`;
      statusBtn.textContent = a.status || "Open";

      right.appendChild(prio);
      right.appendChild(statusBtn);

      li.appendChild(left);
      li.appendChild(right);

      prio.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const next = cyclePriority(a.priority || "Medium");
        await window.DB.updateAction(a.id, { priority: next });
        await window.DB.syncTodosFromAction(a.id);
        await refreshActionsForProject();
        await refreshTodoDetail();
      });

      statusBtn.addEventListener("click", async (ev) => {
        ev.stopPropagation();
        const next = cycleStatus(a.status || "Open");
        await window.DB.updateAction(a.id, { status: next });
        await window.DB.syncTodosFromAction(a.id);
        await refreshActionsForProject();
        await refreshTodoDetail();
        await refreshDashboard();
      });

      li.addEventListener("click", () => openActionModal(a.id));
      actionList2.appendChild(li);
    }
  }

  /* ---------------------------------------------------------
     Habits
     - Daily view removed (weekly/monthly only)
     - Monthly aggregate: orange if some, green if all
  --------------------------------------------------------- */

  let habitTrackMode = "weekly";

  function setHabitTrackMode(mode) {
    habitTrackMode = mode;
    setPressed(habitViewWeekly, mode === "weekly");
    setPressed(habitViewMonthly, mode === "monthly");

    habitWeeklyWrap?.classList.toggle("hidden", mode !== "weekly");
habitMonthlyWrap?.classList.toggle("hidden", mode !== "monthly");

// 🔑 SHOW habit filter ONLY in monthly view
monthlyHabitSelectWrap?.classList.toggle("hidden", mode !== "monthly");

refreshHabitTrack();


  }

  habitViewWeekly?.addEventListener("click", () => setHabitTrackMode("weekly"));
  habitViewMonthly?.addEventListener("click", () => setHabitTrackMode("monthly"));

  habitRefDate?.addEventListener("change", refreshHabitTrack);
  
  btnAddHabit?.addEventListener("click", async () => {
    const name = (habitName.value || "").trim();
    if (!name) return;
    const freq = habitFreq.value || "Daily";
    await window.DB.upsertHabit({ name, frequency: freq, archived: false });
    habitName.value = "";
    await refreshHabits();
    await refreshHabitTrack();
    await refreshDashboard();
  });

  habitName?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnAddHabit.click();
    }
  });

  btnToggleHabits?.addEventListener("click", () => {
  habitsHidden = !habitsHidden;

  // Hide/show ONLY the habits lists pane
  habitsListsWrap.classList.toggle("hidden", habitsHidden);

  // Update button text
  btnToggleHabits.textContent = habitsHidden
    ? "Show habits"
    : "Hide habits";
});



  btnRefreshHabits?.addEventListener("click", async () => {
    await refreshHabits();
    await refreshHabitTrack();
    await refreshDashboard();
  });

  async function refreshHabits() {
    const all = await window.DB.getAll(window.DB.STORES.habits);
    const active = all.filter(h => !h._deleted && !h.archived).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const archived = all.filter(h => !h._deleted && !!h.archived).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    habitList.innerHTML = "";
    habitList.classList.toggle("hidden", habitsHidden);
    habitArchivedList.innerHTML = "";

monthlyHabitSelect.innerHTML = "";

const defaultOpt = document.createElement("option");
defaultOpt.value = "";
defaultOpt.textContent = "All habits";
monthlyHabitSelect.appendChild(defaultOpt);
    for (const h of active) {
      const opt = document.createElement("option");
      opt.value = h.id;
      opt.textContent = `${h.name} (${h.frequency})`;
      monthlyHabitSelect.appendChild(opt);
    }


    if (!active.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><div class="muted">No active habits. Add one above.</div></div>`;
      habitList.appendChild(li);
    } else {
      for (const h of active) {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="list__left">
            <div>
              <div><strong>${escapeHtml(h.name)}</strong></div>
              <div class="muted">${escapeHtml(h.frequency)}</div>
            </div>
          </div>
          <div class="list__right">
<button class="btn btn--ghost" type="button" data-action="archive">Archive</button>
<button class="iconBtn" type="button" data-action="delete" title="Delete habit">×</button>
          </div>
        `;
        const archiveBtn = li.querySelector('[data-action="archive"]');
const deleteBtn = li.querySelector('[data-action="delete"]');

archiveBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation();
  await window.DB.updateHabit(h.id, { archived: true });
  await refreshHabits();
  await refreshHabitTrack();
  await refreshDashboard();
});

deleteBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation();

  const ok = await confirmInApp({
    title: "Delete habit",
    message: "Delete this habit and all its history?"
  });
  if (!ok) return;

  await window.DB.deleteHabit(h.id);
  await refreshHabits();
  await refreshHabitTrack();
  await refreshDashboard();
});

        habitList.appendChild(li);
      }
    }

    if (!archived.length) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><div class="muted">No archived habits.</div></div>`;
      habitArchivedList.appendChild(li);
    } else {
      for (const h of archived) {
        const li = document.createElement("li");
        li.innerHTML = `
          <div class="list__left">
            <div>
              <div><strong>${escapeHtml(h.name)}</strong></div>
              <div class="muted">${escapeHtml(h.frequency)}</div>
            </div>
          </div>
          <div class="list__right">
<button class="btn btn--ghost" type="button" data-action="unarchive">Unarchive</button>
<button class="iconBtn" type="button" data-action="delete" title="Delete habit">🗑</button>
          </div>
        `;
        const unarchiveBtn = li.querySelector('[data-action="unarchive"]');
const deleteBtn = li.querySelector('[data-action="delete"]');

unarchiveBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation();
  await window.DB.updateHabit(h.id, { archived: false });
  await refreshHabits();
  await refreshHabitTrack();
  await refreshDashboard();
});

deleteBtn.addEventListener("click", async (ev) => {
  ev.stopPropagation();

  const ok = await confirmInApp({
    title: "Delete habit",
    message: "Delete this habit and all its history?"
  });
  if (!ok) return;

  await window.DB.deleteHabit(h.id);
  await refreshHabits();
  await refreshHabitTrack();
  await refreshDashboard();
});

        habitArchivedList.appendChild(li);
      }
    }
  }

  async function refreshHabitTrack() {
    if (!habitRefDate.value) habitRefDate.value = todayStrISO();

    const ref = parseISO(habitRefDate.value);
    const habitsAll = await window.DB.getAll(window.DB.STORES.habits);
    const habits = habitsAll.filter(h => !h._deleted && !h.archived).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const completionsAll = await window.DB.getAll(window.DB.STORES.habitCompletions);
    const completions = completionsAll.filter(c => !c._deleted);

    if (habitTrackMode === "weekly") renderHabitWeekly(habits, completions, ref);
    else renderHabitMonthly(habits, completions, ref);

  }

  function isTicked(completions, habitId, dateISO) {
    return completions.some(c => c.habitId === habitId && c.date === dateISO && !c._deleted);
  }

  async function toggleTick(habitId, dateISO) {
    const all = await window.DB.getAll(window.DB.STORES.habitCompletions);
    const existing = all.find(c => !c._deleted && c.habitId === habitId && c.date === dateISO) || null;

    if (existing) await window.DB.deleteHabitCompletion(existing.id);
    else await window.DB.upsertHabitCompletion({ habitId, date: dateISO });

    await refreshHabitTrack();
    await refreshDashboard();
  }

  function renderHabitWeekly(habits, completions, refDate) {
    habitWeeklyWrap.innerHTML = "";
    if (!habits.length) {
      habitWeeklyWrap.innerHTML = `<div class="muted">No active habits.</div>`;
      return;
    }

    const start = startOfWeek(refDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    const grid = document.createElement("div");
    grid.className = "habitGrid--weekly";

    const head0 = document.createElement("div");
    head0.className = "cell head";
    head0.textContent = "Habit";
    grid.appendChild(head0);

    const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (let i = 0; i < 7; i++) {
      const c = document.createElement("div");
      c.className = "cell head";
      // Requested: weekday name and date stacked
      c.innerHTML = `<div>${names[i]}</div><div class="small">${ddmmyyyyForDate(days[i])}</div>`;
      grid.appendChild(c);
    }

    for (const h of habits) {
      const r0 = document.createElement("div");
      r0.className = "cell";
      r0.innerHTML = `<div><strong>${escapeHtml(h.name)}</strong></div><div class="small">${escapeHtml(h.frequency)}</div>`;
      grid.appendChild(r0);

      for (const d of days) {
        const ds = dateToISO(d);
        const ticked = isTicked(completions, h.id, ds);
        const cell = document.createElement("div");
        cell.className = "cell " + (ticked ? "done" : "");
        cell.textContent = ticked ? "✓" : "";
        cell.title = ddmmyyyyForDate(d);
        cell.addEventListener("click", () => toggleTick(h.id, ds));
        grid.appendChild(cell);
      }
    }

    habitWeeklyWrap.appendChild(grid);
  }

  function renderHabitMonthly(habits, completions, refDate) {
    habitMonthlyWrap.innerHTML = "";
    if (!habits.length) {
      habitMonthlyWrap.innerHTML = `<div class="muted">No active habits.</div>`;
      return;
    }

    const year = refDate.getFullYear();
    const month = refDate.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const daysInMonth = last.getDate();

const mode = monthlyHabitSelect?.value ? "byHabit" : "aggregate";

    const makeCell = (txt, cls) => {
      const c = document.createElement("div");
      c.className = "cell " + (cls || "");
      c.textContent = txt;
      return c;
    };

    const grid = document.createElement("div");
    grid.className = "grid grid--month";

    const weekHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for (const wh of weekHeaders) grid.appendChild(makeCell(wh, "head"));

    const jsDay = first.getDay();
    const offset = (jsDay === 0 ? 6 : jsDay - 1);
    for (let i = 0; i < offset; i++) grid.appendChild(makeCell("", "off"));

    if (mode === "byHabit") {
      const habitId = monthlyHabitSelect.value || habits[0].id;
      if (!monthlyHabitSelect.value) monthlyHabitSelect.value = habitId;

      for (let day = 1; day <= daysInMonth; day++) {
        const d = new Date(year, month, day);
        const ds = dateToISO(d);
        const ticked = isTicked(completions, habitId, ds);
        const cell = makeCell(String(day), ticked ? "done" : "");
        cell.title = ddmmyyyyForDate(d);
        cell.addEventListener("click", () => toggleTick(habitId, ds));
        grid.appendChild(cell);
      }

      habitMonthlyWrap.appendChild(grid);
      return;
    }

    // Aggregate mode: green if all, orange if some, blank if none
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const ds = dateToISO(d);

      const tickedCount = habits.reduce((acc, h) => acc + (isTicked(completions, h.id, ds) ? 1 : 0), 0);
      const allDone = tickedCount === habits.length && habits.length > 0;
      const someDone = tickedCount > 0 && tickedCount < habits.length;

      const cls = allDone ? "done" : (someDone ? "partial" : "");
      const cell = makeCell(String(day), cls);
      cell.title = `${ddmmyyyyForDate(d)} (${tickedCount}/${habits.length})`;

      cell.addEventListener("click", async () => {
        const all = await window.DB.getAll(window.DB.STORES.habitCompletions);
        const existing = all.filter(c => !c._deleted && c.date === ds);

        if (allDone) {
          for (const h of habits) {
            const ex = existing.find(c => c.habitId === h.id) || null;
            if (ex) await window.DB.deleteHabitCompletion(ex.id);
          }
        } else {
          for (const h of habits) {
            const ex = existing.find(c => c.habitId === h.id) || null;
            if (!ex) await window.DB.upsertHabitCompletion({ habitId: h.id, date: ds });
          }
        }

        await refreshHabitTrack();
        await refreshDashboard();
      });

      grid.appendChild(cell);
    }

    habitMonthlyWrap.appendChild(grid);
  }

  /* ---------------------------------------------------------
     Meals
     - Fix overflow handled by CSS; weekly wrap scrollable
     - Daily header: weekday + date stacked
     - Click a meal to edit notes in mealModal
  --------------------------------------------------------- */

  async function openMealPicker(dateISO, slot) {
  mealPickerContext = { dateISO, slot };

  const meals = (await window.DB.getAll(window.DB.STORES.meals))
    .filter(m => !m._deleted)
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  mealPickerList.innerHTML = "";

  if (!meals.length) {
    mealPickerList.innerHTML =
      `<li><div class="muted">No meals yet.</div></li>`;
  } else {
    for (const m of meals) {
      const li = document.createElement("li");
      li.innerHTML = `<div class="list__left"><strong>${escapeHtml(m.name)}</strong></div>`;

      li.addEventListener("click", async () => {
        await setMealPlan(dateISO, slot, m.id);
        hideModal(mealPickerModal);
        mealPickerContext = null;
      });

      mealPickerList.appendChild(li);
    }
  }

  showModal(mealPickerModal);
}


  let mealMode = "daily";

  function setMealMode(mode) {
    mealMode = mode;
    setPressed(mealViewDaily, mode === "daily");
    setPressed(mealViewWeekly, mode === "weekly");
    mealDailyWrap?.classList.toggle("hidden", mode !== "daily");
    mealWeeklyWrap?.classList.toggle("hidden", mode !== "weekly");
    refreshMeals();
  }

  mealViewDaily?.addEventListener("click", () => setMealMode("daily"));
  mealViewWeekly?.addEventListener("click", () => setMealMode("weekly"));

  btnAddMeal?.addEventListener("click", async () => {
    const name = (mealNewName.value || "").trim();
    if (!name) return;
    await window.DB.upsertMeal({ name, notes: "" });
    mealNewName.value = "";
    await refreshMeals();
  });

  mealNewName?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      btnAddMeal.click();
    }
  });

  btnRefreshMeals?.addEventListener("click", refreshMeals);
  btnToggleMeals?.addEventListener("click", () => {
  mealsListHidden = !mealsListHidden;

  // Hide/show the entire meal list column (including header)
  const listColumn = mealsWrap?.children?.[0];
  if (listColumn) {
    listColumn.classList.toggle("hidden", mealsListHidden);
  }

  // Adjust layout so planner fills space
  mealsWrap.classList.toggle("twoCol", !mealsListHidden);
  mealsWrap.classList.toggle("stack", mealsListHidden);

  btnToggleMeals.textContent = mealsListHidden
    ? "Show meal list"
    : "Hide meal list";
});


  mealRefDate?.addEventListener("change", refreshMeals);

  function slotLabel(s) {
    return ({ breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" }[s] || s);
  }

  function weekDaysFrom(refISO) {
    const ref = parseISO(refISO);
    const start = startOfWeek(ref);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }

  async function refreshMeals() {
    if (!mealRefDate.value) mealRefDate.value = todayStrISO();

    const meals = (await window.DB.getAll(window.DB.STORES.meals)).filter(m => !m._deleted).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    const plans = (await window.DB.getAll(window.DB.STORES.mealPlans)).filter(p => !p._deleted);

    mealList.innerHTML = "";
    mealsWrap.classList.toggle("twoCol", !mealsListHidden);
mealsWrap.classList.toggle("stack", mealsListHidden);
    for (const m of meals) {
      const row = document.createElement("div");
      row.className = "mealRow";
      row.draggable = true;
      row.dataset.mealId = m.id;
      row.innerHTML = `
        <div class="mealPill" title="Click to edit notes">${escapeHtml(m.name)}</div>
        <button class="btn btn--ghost" type="button">Delete</button>
      `;
      row.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/plain", m.id);
      });
      row.querySelector("button").addEventListener("click", async (ev) => {
        ev.stopPropagation();
        await window.DB.deleteMeal(m.id);
        await refreshMeals();
      });
      // Click to edit meal notes
      row.querySelector(".mealPill").addEventListener("click", async (ev) => {
        ev.stopPropagation();
        await openMealModal(m.id);
      });
      mealList.appendChild(row);
    }

    if (mealMode === "daily") {
      renderMealDaily(plans, meals, mealRefDate.value);
    } else {
      renderMealWeekly(plans, meals, mealRefDate.value);
    }
  }

  function findPlan(plans, dateISO, slot) {
    return plans.find(p => p.date === dateISO && p.slot === slot && !p._deleted) || null;
  }

  async function setMealPlan(dateISO, slot, mealId) {
    await window.DB.upsertMealPlan({ date: dateISO, slot, mealId });
    await refreshMeals();
  }

  async function clearMealPlan(dateISO, slot) {
    const all = await window.DB.getAll(window.DB.STORES.mealPlans);
    const ex = all.find(p => !p._deleted && p.date === dateISO && p.slot === slot) || null;
    if (ex) await window.DB.deleteMealPlan(ex.id);
    await refreshMeals();
  }

  function dropZone(el, onDrop) {
    el.addEventListener("dragover", (e) => { e.preventDefault(); });
    el.addEventListener("drop", (e) => {
      e.preventDefault();
      const mealId = e.dataTransfer.getData("text/plain");
      if (mealId) onDrop(mealId);
    });
  }

  function renderMealDaily(plans, meals, dateISO) {
    mealDailyWrap.innerHTML = "";
    const slots = ["breakfast", "lunch", "snack", "dinner"];

    const dObj = parseISO(dateISO);
    const head = document.createElement("div");
    head.className = "mealHead";
    // Requested: weekday + date stacked
    head.innerHTML = `<div><strong>${weekdayName(dObj)}</strong><div class="small">${ddmmyyyyForDate(dObj)}</div></div><div class="muted">Drag meals into slots</div>`;
    mealDailyWrap.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "mealGrid mealGrid--daily";

    for (const s of slots) {
      const cell = document.createElement("div");
      cell.className = "mealSlot";

      const existing = findPlan(plans, dateISO, s);
      const mealName = existing ? (meals.find(m => m.id === existing.mealId)?.name || "—") : "";

      cell.innerHTML = `
  <div class="mealSlotHead">
    ${slotLabel(s)}
    <button class="btn btn--ghost mealAddBtn" type="button">+</button>
  </div>

  <div class="mealSlotBody ${mealName ? "" : "empty"}">
    ${mealName
      ? `<span class="mealPill">${escapeHtml(mealName)}</span>`
      : `<span class="muted">${isTouchDevice() ? "Tap +" : "Drop here"}</span>`}
  </div>

  <button class="iconBtn" type="button" title="Clear">×</button>
`;


      const body = cell.querySelector(".mealSlotBody");
      dropZone(body, (mealId) => setMealPlan(dateISO, s, mealId));

      // Mobile: + button to select meal
if (isTouchDevice()) {
  const addBtn = cell.querySelector(".mealAddBtn");

  addBtn?.addEventListener("click", (ev) => {
  ev.stopPropagation();
  openMealPicker(dateISO, s);
});

}


      cell.querySelector('button.iconBtn[title="Clear"]')?.addEventListener("click", () => clearMealPlan(dateISO, s));

      grid.appendChild(cell);
    }

    mealDailyWrap.appendChild(grid);
  }

  function renderMealWeekly(plans, meals, refISO) {
    mealWeeklyWrap.innerHTML = "";

    const days = weekDaysFrom(refISO);
    const slots = ["breakfast", "lunch", "snack", "dinner"];

    const grid = document.createElement("div");
    grid.className = "mealGrid mealGrid--weekly";

    const corner = document.createElement("div");
    corner.className = "cell head";
    corner.textContent = "Slot";
    grid.appendChild(corner);

    for (let i = 0; i < 7; i++) {
      const d = days[i];
      const h = document.createElement("div");
      h.className = "cell head";
      // Requested: weekday + date stacked
      h.innerHTML = `<div>${weekdayName(d)}</div><div class="small">${ddmmyyyyForDate(d)}</div>`;
      grid.appendChild(h);
    }

    for (const s of slots) {
      const slotHead = document.createElement("div");
      slotHead.className = "cell head";
      slotHead.textContent = slotLabel(s);
      grid.appendChild(slotHead);

      for (let i = 0; i < 7; i++) {
        const d = days[i];
        const dateISO = dateToISO(d);
        const existing = findPlan(plans, dateISO, s);
        const mealName = existing ? (meals.find(m => m.id === existing.mealId)?.name || "—") : "";

        const cell = document.createElement("div");
        cell.className = "cell mealCell";
        cell.innerHTML = `
  <div class="mealCellBody ${mealName ? "" : "empty"}">
    ${mealName
      ? `<span class="mealPill">${escapeHtml(mealName)}</span>`
      : `<span class="muted">${isTouchDevice() ? "+" : "Drop"}</span>`}
  </div>

<button class="btn btn--ghost mealAddBtn" type="button">+</button>
  <button class="iconBtn" type="button" title="Clear">×</button>
`;


        const body = cell.querySelector(".mealCellBody");
        dropZone(body, (mealId) => setMealPlan(dateISO, s, mealId));
        // Mobile: + button to select meal
if (isTouchDevice()) {
  const addBtn = cell.querySelector(".mealAddBtn");

  addBtn?.addEventListener("click", (ev) => {
  ev.stopPropagation();
  openMealPicker(dateISO, s);
});

}

btnCloseMealPicker?.addEventListener("click", () => {
  hideModal(mealPickerModal);
  mealPickerContext = null;
});

mealPickerBackdrop?.addEventListener("click", () => {
  hideModal(mealPickerModal);
  mealPickerContext = null;
});


        cell.querySelector('button.iconBtn[title="Clear"]')?.addEventListener("click", () => clearMealPlan(dateISO, s));

        grid.appendChild(cell);
      }
    }

    mealWeeklyWrap.appendChild(grid);
  }

  async function openMealModal(mealId) {
    editingMealId = mealId;
    const m = await window.DB.getOne(window.DB.STORES.meals, mealId);
    if (!m || m._deleted) return;

    mealModalName.value = m.name || "";
mealModalNotes.value = m.notes || "";

showModal(mealModal);

// IMPORTANT: resize AFTER modal is visible
requestAnimationFrame(() => {
  autosizeTextarea(mealModalNotes);
});

  }

  btnCloseMealModal?.addEventListener("click", () => hideModal(mealModal));
  mealBackdrop?.addEventListener("click", () => hideModal(mealModal));

  btnSaveMealModal?.addEventListener("click", async () => {
    if (!editingMealId) return;
    await window.DB.updateMeal(editingMealId, {
      name: (mealModalName.value || "").trim() || "Meal",
      notes: mealModalNotes.value || ""
    });
    hideModal(mealModal);
    await refreshMeals();
  });

  btnDeleteMealModal?.addEventListener("click", async () => {
    if (!editingMealId) return;
    const ok = confirm("Delete this meal?");
    if (!ok) return;
    await window.DB.deleteMeal(editingMealId);
    editingMealId = null;
    hideModal(mealModal);
    await refreshMeals();
  });

  // Autosave meal notes while typing (requested)
  mealModalNotes?.addEventListener("input", () => {
    autosizeTextarea(mealModalNotes);
    debounce("meal_notes_autosave", 300, async () => {
      if (!editingMealId) return;
      await window.DB.updateMeal(editingMealId, { notes: mealModalNotes.value || "" });
    });
  });

  /* ---------------------------------------------------------
     Notes (iOS-style)
     - Index list -> click opens detail view
     - Autosave on typing
  --------------------------------------------------------- */

  btnNotesBack?.addEventListener("click", async () => {
  await autosaveNote();
  showNotesIndex();
  await refreshNotes();
});


  function showNotesIndex() {
    notesDetailCard?.classList.add("hidden");
    notesIndexCard?.classList.remove("hidden");
    currentNoteId = null;
  }

  notesSearchInput?.addEventListener("input", () => {
  notesSearchText = notesSearchInput.value.toLowerCase();
  refreshNotes();
});


  function showNotesDetail() {
    notesIndexCard?.classList.add("hidden");
    notesDetailCard?.classList.remove("hidden");
  }

  async function refreshNotesProjectFilter() {
  if (!notesProjectFilter) return;

  const projects = (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => !p._deleted && !p.archived)
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  notesProjectFilter.innerHTML = `<option value="">All projects</option>`;

  for (const p of projects) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    notesProjectFilter.appendChild(opt);
  }

  notesProjectFilter.value = selectedNotesProjectId || "";
}


  async function refreshCollections() {
  const collections = (await window.DB.getAll(window.DB.STORES.collections))
  .filter(c => !c._deleted)
  .filter(c => showArchivedCollections || !c.archived);


  collectionList.innerHTML = "";

  // All notes
  const allLi = document.createElement("li");
  allLi.textContent = "All notes";
  allLi.className = selectedCollectionId === null ? "active" : "";
  allLi.onclick = () => {
  notesMode = "all";
  selectedCollectionId = null;
  showNotesIndex();
  refreshNotes();
  refreshCollections();
};

  collectionList.appendChild(allLi);

 


  for (const c of collections) {
    const li = document.createElement("li");
li.textContent = c.name + (c.archived ? " (archived)" : "");
    li.className = selectedCollectionId === c.id ? "active" : "";
    li.onclick = () => {
  notesMode = "collection";
  selectedCollectionId = c.id;
  showNotesIndex();
  refreshNotes();
  refreshCollections();
};

const openCollectionEditor = async () => {
  editingCollectionId = c.id;

  collectionModalTitle.textContent = "Edit collection";
  collectionNameInput.value = c.name;

  btnArchiveCollection.textContent = c.archived ? "Unarchive" : "Archive";

  btnArchiveCollection.onclick = async () => {
    if (c.archived) {
      await window.DB.unarchiveCollection(c.id);
    } else {
      await window.DB.archiveCollection(c.id);
    }

    hideModal(collectionModal);
    await refreshCollections();
    await refreshNotes();
  };

  btnDeleteCollection.onclick = async () => {
    const ok = await confirmInApp({
      title: "Delete collection",
      message: "Delete this collection? Notes will remain."
    });
    if (!ok) return;

    await window.DB.deleteCollection(c.id);
    hideModal(collectionModal);
    await refreshCollections();
    await refreshNotes();
  };

  btnArchiveCollection.style.display = "";
  btnDeleteCollection.style.display = "";

  showModal(collectionModal);
};

/* Desktop: native double click */
li.addEventListener("dblclick", openCollectionEditor);

/* Mobile: double-tap detection */
let lastTap = 0;

li.addEventListener("touchend", (e) => {
  if (!isNotesMobile()) return;

  const now = Date.now();
  if (now - lastTap < 300) {
    e.preventDefault();
    openCollectionEditor();
  }
  lastTap = now;
});




    collectionList.appendChild(li);
  }
}
btnAddCollection?.addEventListener("click", () => {
  editingCollectionId = null;
  collectionModalTitle.textContent = "New collection";
  collectionNameInput.value = "";

  btnArchiveCollection.style.display = "none";
  btnDeleteCollection.style.display = "none";

  showModal(collectionModal);
});


btnCloseCollectionModal?.addEventListener("click", () => hideModal(collectionModal));
collectionBackdrop?.addEventListener("click", () => hideModal(collectionModal));

btnSaveCollection?.addEventListener("click", async () => {
  const name = (collectionNameInput.value || "").trim();
  if (!name) return;

  if (editingCollectionId) {
    const existing = await window.DB.getOne(window.DB.STORES.collections, editingCollectionId);
    if (!existing) return;

    await window.DB.put(window.DB.STORES.collections, {
      ...existing,
      name,
      updatedAt: Date.now()
    });
  } else {
    await window.DB.put(window.DB.STORES.collections, {
  id: crypto.randomUUID(),
  name,
  archived: false,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  _deleted: false
});

  }

  hideModal(collectionModal);
  await refreshCollections();
  await refreshNotes();
});


async function populateNotesProjectFilter() {
  const projects = (await window.DB.getAll(window.DB.STORES.projects))
    .filter(p => !p._deleted && !p.archived);

  notesProjectFilter.innerHTML = `<option value="">All projects</option>`;

  for (const p of projects) {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    notesProjectFilter.appendChild(opt);
  }
}


  async function refreshNotes() {
  showNotesIndex();
  await buildNotesFilters();


  if (notesSearchInput) {
    notesSearchInput.value = notesSearchText;
  }

  // --------------------------------------------------
  // Load collections to determine archived ones
  // --------------------------------------------------
  const collections = await window.DB.getAll(window.DB.STORES.collections);

  const archivedCollectionIds = new Set(
    collections
      .filter(c => !c._deleted && c.archived)
      .map(c => c.id)
  );

  // --------------------------------------------------
  // Load notes (exclude deleted + archived collections)
  // --------------------------------------------------
  const notes = (await window.DB.getAll(window.DB.STORES.notes))
  .filter(n => !n._deleted)
  .filter(n => !n.archived)
  .filter(n => !n.collectionId || !archivedCollectionIds.has(n.collectionId))
  .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));


  notesList.innerHTML = "";

  if (!notes.length) {
    const li = document.createElement("li");
    li.innerHTML = `<div class="list__left"><div class="muted">No notes yet. Create one.</div></div>`;
    notesList.appendChild(li);
    return;
  }

  let filteredNotes = notes;

  // --------------------------------------------------
  // Text search filter
  // --------------------------------------------------
  if (notesSearchText) {
    filteredNotes = filteredNotes.filter(n => {
      const text =
        ((n.title || "") + (n.body || "")).toLowerCase();
      return text.includes(notesSearchText);
    });
  }

 // ---------- Project filter ----------
const projSet = filterState.notesProjects;
if (!projSet.has("__ALL__")) {
  filteredNotes = filteredNotes.filter(n =>
    n.projectId && projSet.has(n.projectId)
  );
}

// ---------- Collection filter ----------
const colSet = filterState.notesCollections;
if (!colSet.has("__ALL__")) {
  filteredNotes = filteredNotes.filter(n =>
    n.collectionId && colSet.has(n.collectionId)
  );
}


  // --------------------------------------------------
  // Render notes
  // --------------------------------------------------
  for (const n of filteredNotes) {
    const li = document.createElement("li");

    const title = (n.title || "Untitled").trim() || "Untitled";
    const updated = n.updatedAt
      ? new Date(n.updatedAt).toLocaleString()
      : "—";

    let projectName = null;

    if (n.projectId) {
      const p = await window.DB.getOne(window.DB.STORES.projects, n.projectId);
      if (p && !p._deleted) {
        projectName = p.name;
      }
    }

    li.innerHTML = `
  <div class="noteRow">
    <div class="noteCol noteCol--title">
      <strong>${escapeHtml(title)}</strong>
    </div>

    ${
      notesSearchText
        ? `<div class="noteCol" style="grid-column: 2 / span 2; font-size:12px; color:var(--muted)">
             ${highlightMatch((n.body || "").slice(0, 120), notesSearchText)}
           </div>`
        : `
           <div class="noteCol noteCol--project">
             ${projectName ? escapeHtml(projectName) : ""}
           </div>
           <div class="noteCol noteCol--date">
             ${escapeHtml(updated)}
           </div>
         `
    }
  </div>
`;


    li.addEventListener("click", () => openNote(n.id));
    notesList.appendChild(li);
  }
}


  async function openNote(id) {
    currentNoteId = id;
    const n = await window.DB.getOne(window.DB.STORES.notes, id);
    if (!n || n._deleted) return;

    showNotesDetail();

    noteTitle.value = n.title || "";
    noteBody.value = n.body || "";

    // Populate collection selector
const collections = (await window.DB.getAll(window.DB.STORES.collections))
  .filter(c => !c._deleted);

noteCollectionSelect.innerHTML = `<option value="">No collection</option>`;
for (const c of collections) {
  const opt = document.createElement("option");
  opt.value = c.id;
  opt.textContent = c.name;
  noteCollectionSelect.appendChild(opt);
}
noteCollectionSelect.value = n.collectionId || "";

// Populate project selector
const projects = (await window.DB.getAll(window.DB.STORES.projects))
  .filter(p => !p._deleted && !p.archived);

noteProjectSelect.innerHTML = `<option value="">No project</option>`;
for (const p of projects) {
  const opt = document.createElement("option");
  opt.value = p.id;
  opt.textContent = p.name;
  noteProjectSelect.appendChild(opt);
}
noteProjectSelect.value = n.projectId || "";


    noteCreated.textContent = n.createdAt ? new Date(n.createdAt).toLocaleString() : "—";
    noteUpdated.textContent = n.updatedAt ? new Date(n.updatedAt).toLocaleString() : "—";

    autosizeTextarea(noteBody);
  }


  noteCollectionSelect?.addEventListener("change", () => {
  autosaveNote();
});

noteProjectSelect?.addEventListener("change", () => {
  autosaveNote();
});


  notesProjectFilter?.addEventListener("change", () => {
  selectedNotesProjectId = notesProjectFilter.value || null;
  refreshNotes();
});

 btnNewNote?.addEventListener("click", async () => {

    

  const input = {
    title: "",
    body: ""
  };

  if (notesMode === "collection" && selectedCollectionId) {
    input.collectionId = selectedCollectionId;
  }

  if (selectedNotesProjectId) {
    input.projectId = selectedNotesProjectId;
  }

  const rec = await window.DB.upsertNote(input);

  await refreshNotes();
  await openNote(rec.id);

  requestAnimationFrame(() => {
    noteTitle.focus();
    noteTitle.select();
  });
});



  async function autosaveNote() {
  if (!currentNoteId) return;

  const existing = await window.DB.getOne(
    window.DB.STORES.notes,
    currentNoteId
  );
  if (!existing || existing._deleted) return;

  const title = (noteTitle.value || "").trim();
  const body = (noteBody.value || "").trim();

  const now = Date.now();
  const createdAt = existing.createdAt || now;
  const ageMs = now - createdAt;

  const hasAnyContent = title.length > 0 || body.length > 0;

  // --------------------------------------------------
  // 🔒 SAFE AUTO-DELETE RULE (drafts only)
  // --------------------------------------------------
  // Auto-delete ONLY if:
  // - note has NEVER had content
  // - still empty
  // - very recently created (draft)
  // --------------------------------------------------

  const neverHadContent =
    !(existing.title && existing.title.trim()) &&
    !(existing.body && existing.body.trim());

  const DRAFT_WINDOW_MS = 60 * 1000; // 60 seconds

  if (
    !hasAnyContent &&
    neverHadContent &&
    ageMs < DRAFT_WINDOW_MS
  ) {
    await window.DB.deleteNote(currentNoteId);
    currentNoteId = null;
    await refreshNotes();
    return;
  }

  // --------------------------------------------------
  // 🔒 NEVER overwrite existing content with empty UI
  // --------------------------------------------------
  if (!hasAnyContent) {
    return;
  }

  const updatedAt = now;

  await window.DB.updateNote(currentNoteId, {
    title,
    body,
    collectionId: noteCollectionSelect.value || null,
    projectId: noteProjectSelect.value || null,
    updatedAt
  });

  noteUpdated.textContent = new Date(updatedAt).toLocaleString();
}



  noteTitle?.addEventListener("input", () => debounce("note_autosave", 250, autosaveNote));
  noteTitle?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    noteBody.focus();
  }
});
  noteBody?.addEventListener("input", () => {
    autosizeTextarea(noteBody);
    debounce("note_autosave", 250, autosaveNote);
  });

  btnSaveNote?.addEventListener("click", async () => {
    await autosaveNote();
    alert("Saved.");
  });

  btnDeleteNote?.addEventListener("click", async () => {
    if (!currentNoteId) return;
    const ok = await confirmInApp({
  title: "Delete note",
  message: "Delete this note?"
});
if (!ok) return;

    if (!ok) return;
    await window.DB.deleteNote(currentNoteId);
    currentNoteId = null;
    noteTitle.value = "";
    noteBody.value = "";
    noteCreated.textContent = "—";
    noteUpdated.textContent = "—";
    await refreshNotes();
  });

  /* ---------------------------------------------------------
     Init
  --------------------------------------------------------- */

  async function init() {

    // --------------------------------------------------
// Trash retention: purge items deleted > 7 days ago
// --------------------------------------------------
try {
  const cutoff = Date.now() - BIN_RETENTION_MS;
  if (window.DB.purgeDeletedOlderThan) {
    await window.DB.purgeDeletedOlderThan(cutoff);
  }
} catch (e) {
  console.warn("Trash purge failed:", e);
}

    if (!window.DB) {
      alert("DB layer not available. Check that db.js is loading and defines window.DB.");
      return;
    }

    await window.DB.init();
    

    initTabs();
    await initServiceWorker();
    wireAutosize();

    const theme = (await window.DB.getSetting("ui.theme", "aurora")) || "aurora";
    const font = (await window.DB.getSetting("ui.font", "system")) || "system";
    applyThemeAndFont(theme, font);

    await applyTabVisibility();

    if (!habitRefDate.value) habitRefDate.value = todayStrISO();
    if (!mealRefDate.value) mealRefDate.value = todayStrISO();

    // Restore last sync stamp if present
    const lastSync = await window.DB.getSetting("sync.lastAt", null);
    updateSyncStamp(lastSync, "Last synced");

    setDashboardPeriod("Week");
    setActionsMode(actionsMode);
    setHabitTrackMode("weekly");
    setMealMode("daily");

    updateTopbar();
    startAutoSync();

// Open rollover analysis when clicking the to-do completion card
const todoMetricValue = document.getElementById("mTodoWeek");


document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    maybeRunDailyTodoRollover();
  }
});

await maybeRunDailyTodoRollover();




    setTab("dashboard");
    await refreshCollections();
    await buildNotesFilters();
    await refreshNotesProjectFilter();

  }

  init();
})();
