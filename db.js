// db.js (replace your existing file with this)
(function () {
  const DB_NAME = "offline_planner_db";
  const DB_VERSION = 7;

  const STORES = {
    settings: "settings",
    projects: "projects",
    actions: "actions",
    todos: "todos",
    todoLists: "todoLists",
    journal: "journal",
    habits: "habits",
    habitCompletions: "habitCompletions",
    meals: "meals",
    mealPlans: "mealPlans",
    collections: "collections",
    notes: "notes"
  };

  const idx = {
    todosByDate: "byDate",
    journalByDate: "byDate",
    actionsByProject: "byProject",
    mealPlansByDate: "byDate"
  };

  let db = null;

  function nowTs() { return Date.now(); }
  function uid() { return (crypto?.randomUUID ? crypto.randomUUID() : ("id_" + Math.random().toString(16).slice(2) + "_" + Date.now())); }

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const d = req.result;

        const ensureStore = (name, opts) => {
          if (!d.objectStoreNames.contains(name)) d.createObjectStore(name, opts);
        };

        ensureStore(STORES.settings, { keyPath: "key" });
        ensureStore(STORES.projects, { keyPath: "id" });
        ensureStore(STORES.actions, { keyPath: "id" });
        ensureStore(STORES.todos, { keyPath: "id" });
        ensureStore(STORES.todoLists, { keyPath: "date" });
        ensureStore(STORES.journal, { keyPath: "date" });
        ensureStore(STORES.habits, { keyPath: "id" });
        ensureStore(STORES.habitCompletions, { keyPath: "id" });
        ensureStore(STORES.meals, { keyPath: "id" });
        ensureStore(STORES.mealPlans, { keyPath: "id" });
        ensureStore(STORES.notes, { keyPath: "id" });
        ensureStore(STORES.collections, { keyPath: "id" });


        const sTodos = req.transaction.objectStore(STORES.todos);
        if (!sTodos.indexNames.contains(idx.todosByDate)) sTodos.createIndex(idx.todosByDate, "date", { unique: false });

        const sActions = req.transaction.objectStore(STORES.actions);
        if (!sActions.indexNames.contains(idx.actionsByProject)) sActions.createIndex(idx.actionsByProject, "projectId", { unique: false });

        const sMealPlans = req.transaction.objectStore(STORES.mealPlans);
        if (!sMealPlans.indexNames.contains(idx.mealPlansByDate)) sMealPlans.createIndex(idx.mealPlansByDate, "date", { unique: false });

        const sJournal = req.transaction.objectStore(STORES.journal);
        if (!sJournal.indexNames.contains(idx.journalByDate)) sJournal.createIndex(idx.journalByDate, "date", { unique: true });
      };

      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function nowTs() { return Date.now(); }

  function currentUid() {
  return window.fbAuth?.currentUser?.uid || null;
}



  function tx(storeNames, mode = "readonly") {
    if (!Array.isArray(storeNames)) storeNames = [storeNames];
    return db.transaction(storeNames, mode);
  }

  function getAll(store) {
    return new Promise((resolve, reject) => {
      const t = tx(store, "readonly");
      const s = t.objectStore(store);
      const r = s.getAll();
      r.onsuccess = () => resolve(r.result || []);
      r.onerror = () => reject(r.error);
    });
  }

  function getOne(store, key) {
    return new Promise((resolve, reject) => {
      const t = tx(store, "readonly");
      const s = t.objectStore(store);
      const r = s.get(key);
      r.onsuccess = () => resolve(r.result || null);
      r.onerror = () => reject(r.error);
    });
  }

  function put(store, value) {
  return new Promise((resolve, reject) => {
    const t = tx(store, "readwrite");
    const s = t.objectStore(store);
    const r = s.put(value);

    r.onsuccess = async () => {
  try {
    // IMPORTANT: never attempt Firebase sync when logged out
    if (
      window.fbAuth &&
      window.fbAuth.currentUser &&
      window.Sync &&
      typeof window.Sync.pushItem === "function"
    ) {
      await window.Sync.pushItem(store, value);
    }
  } catch (e) {
    console.warn("Sync push failed:", e);
  }
  resolve(value);
};


    r.onerror = () => reject(r.error);
  });
}


  function del(store, key) {
    return new Promise((resolve, reject) => {
      const t = tx(store, "readwrite");
      const s = t.objectStore(store);
      const r = s.delete(key);
      r.onsuccess = () => resolve(true);
      r.onerror = () => reject(r.error);
    });
  }

  function markDeleted(store, key) {
    return new Promise(async (resolve, reject) => {
      try {
        const rec = await getOne(store, key);
        if (!rec) return resolve(true);
        rec._deleted = true;
        rec.deletedAt = nowTs();
        await put(store, rec);
        resolve(true);
      } catch (e) { reject(e); }
    });
  }

  function getByIndex(store, indexName, value) {
    return new Promise((resolve, reject) => {
      const t = tx(store, "readonly");
      const s = t.objectStore(store);
      const i = s.index(indexName);
      const r = i.getAll(value);
      r.onsuccess = () => resolve(r.result || []);
      r.onerror = () => reject(r.error);
    });
  }

  async function setSetting(key, value) {
    await put(STORES.settings, { key, value, updatedAt: nowTs() });
  }

  async function getSetting(key, fallback = null) {
    const rec = await getOne(STORES.settings, key);
    return rec ? rec.value : fallback;
  }

  async function ensureTodoList(dateISO) {
    const ex = await getOne(STORES.todoLists, dateISO);
    if (ex && !ex._deleted) return ex;
    const rec = { date: dateISO, createdAt: nowTs(), _deleted: false };
    await put(STORES.todoLists, rec);
    return rec;
  }

  async function ensureProject(name) {
    const all = await getAll(STORES.projects);
    const ex = all.find(p => !p._deleted && (p.name || "").toLowerCase() === name.toLowerCase());
    if (ex) return ex;

    const rec = {
  id: uid(),
  name,
  notes: "",
  archived: false,
  createdAt: nowTs(),
  updatedAt: nowTs(),
  _deleted: false
};
    await put(STORES.projects, rec);
    return rec;
  }

  async function updateProject(id, patch) {
    const p = await getOne(STORES.projects, id);
    if (!p || p._deleted) return null;
    Object.assign(p, patch || {});
    p.updatedAt = nowTs();
    await put(STORES.projects, p);
    return p;
  }

  async function archiveProject(id) {
  const p = await getOne(STORES.projects, id);
  if (!p || p._deleted) return null;

  // Archive project
  p.archived = true;
  p.updatedAt = nowTs();
  await put(STORES.projects, p);

  // Archive all notes linked to this project
  const notes = await getAll(STORES.notes);
  for (const n of notes) {
    if (!n._deleted && n.projectId === id) {
      n.archived = true;
      n.updatedAt = nowTs();
      await put(STORES.notes, n);
    }
  }

  return p;
}


async function unarchiveProject(id) {
  const p = await getOne(STORES.projects, id);
  if (!p || p._deleted) return null;

  // Unarchive project
  p.archived = false;
  p.updatedAt = nowTs();
  await put(STORES.projects, p);

  // Unarchive notes linked to this project
  const notes = await getAll(STORES.notes);
  for (const n of notes) {
    if (!n._deleted && n.projectId === id) {
      n.archived = false;
      n.updatedAt = nowTs();
      await put(STORES.notes, n);
    }
  }

  return p;
}


  async function upsertAction(input) {
    const id = input.id || uid();
    const existing = await getOne(STORES.actions, id);

    const rec = existing && !existing._deleted ? existing : {
  id,
  createdAt: nowTs(),
  ownerUid: currentUid(),
  archived: false,
  _deleted: false
};



    rec.title = input.title || rec.title || "";
    rec.projectId = (input.projectId === undefined ? rec.projectId : input.projectId) || null;
    rec.status = input.status || rec.status || "Open";
    rec.priority = input.priority || rec.priority || "Medium";
    rec.dueDate = input.dueDate || rec.dueDate || "";
    rec.notes = input.notes || rec.notes || "";
    rec.updatedAt = nowTs();

    await put(STORES.actions, rec);
    return rec;
  }

  async function updateAction(id, patch) {
    const a = await getOne(STORES.actions, id);
    if (!a || a._deleted) return null;
    Object.assign(a, patch || {});
    a.updatedAt = nowTs();
    await put(STORES.actions, a);
    return a;
  }

  async function deleteAction(id) {
  const a = await getOne(STORES.actions, id);
  if (!a || a._deleted) return;

  // Mark action as deleted WITH updatedAt
  a._deleted = true;
  a.deletedAt = nowTs();
  a.updatedAt = nowTs();
  await put(STORES.actions, a);

  // Also delete any linked to-dos (with updatedAt)
  const todos = await getAll(STORES.todos);
  const linked = todos.filter(t => !t._deleted && t.actionId === id);

  for (const t of linked) {
    t._deleted = true;
    t.deletedAt = nowTs();
    t.updatedAt = nowTs();
    await put(STORES.todos, t);
  }
}


async function deleteProject(id) {
  const p = await getOne(STORES.projects, id);
  if (!p || p._deleted) return;

  // Mark project as deleted WITH updatedAt
  p._deleted = true;
  p.deletedAt = nowTs();
  p.updatedAt = nowTs();
  await put(STORES.projects, p);

  // Soft-delete all related actions
  const actions = await getAll(STORES.actions);
  const linked = actions.filter(a => !a._deleted && a.projectId === id);

  for (const a of linked) {
    await deleteAction(a.id);
  }
}




  async function upsertTodo(input) {
    const id = input.id || uid();
    const existing = await getOne(STORES.todos, id);

    const rec = existing && !existing._deleted ? existing : {
  id,
  createdAt: nowTs(),
  ownerUid: currentUid(), // 🔑 ADD THIS
  _deleted: false
};


    function currentUid() {
  return window.fbAuth?.currentUser?.uid || null;
}


    rec.date = input.date || rec.date;
    rec.text = input.text || rec.text || "";
    rec.status = input.status || rec.status || "Open";
    rec.priority = input.priority || rec.priority || "Medium";
    rec.notes = input.notes || rec.notes || "";
    rec.dueDate = input.dueDate || rec.dueDate || "";
    rec.projectId = (input.projectId === undefined ? rec.projectId : input.projectId) || null;
    rec.actionId = (input.actionId === undefined ? rec.actionId : input.actionId) || null;
    rec.updatedAt = nowTs();

    await ensureTodoList(rec.date);

    // 🔒 ACTION LINKING RULE
// If actionId is PROVIDED, NEVER create a new action
if (rec.actionId) {
  const linked = await getOne(STORES.actions, rec.actionId);

  // If action exists locally, sync fields FROM todo → action
  if (linked && !linked._deleted) {
    await updateAction(linked.id, {
      title: rec.text,
      projectId: rec.projectId,
      status: rec.status,
      priority: rec.priority,
      dueDate: rec.dueDate,
      notes: rec.notes
    });
  }

} else {
  // No actionId → this is a todo-originated action
  const linked = await upsertAction({
    title: rec.text,
    projectId: rec.projectId,
    status: rec.status,
    priority: rec.priority,
    dueDate: rec.dueDate,
    notes: rec.notes
  });

  rec.actionId = linked.id;
}


    await put(STORES.todos, rec);
    return rec;
  }

  async function updateTodo(id, patch) {
    const t = await getOne(STORES.todos, id);
    if (!t || t._deleted) return null;

    Object.assign(t, patch || {});
    t.updatedAt = nowTs();
    await put(STORES.todos, t);

    if (t.actionId) {
      await updateAction(t.actionId, {
        title: t.text,
        projectId: t.projectId,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        notes: t.notes
      });
    }
    return t;
  }

  async function deleteTodo(id) {
  const t = await getOne(STORES.todos, id);
  if (!t || t._deleted) return;

  t._deleted = true;
  t.deletedAt = nowTs();
  t.updatedAt = nowTs(); // CRITICAL: ensures delete wins in sync

  await put(STORES.todos, t);
}

async function deleteJournal(date) {
  const j = await getOne(STORES.journal, date);
  if (!j || j._deleted) return;

  j._deleted = true;
  j.deletedAt = nowTs();
  j.updatedAt = nowTs(); // CRITICAL

  await put(STORES.journal, j);
}



  async function rolloverTodosToToday(todayISO) {
  // Work out yesterday explicitly
  const today = new Date(todayISO);
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayISO =
    `${yesterday.getFullYear()}-` +
    `${String(yesterday.getMonth() + 1).padStart(2, "0")}-` +
    `${String(yesterday.getDate()).padStart(2, "0")}`;

  const todos = await getAll(STORES.todos);

  const toMove = [];

  for (const t of todos) {
    if (t._deleted) continue;
    if (!t.date) continue;
    if (t.date !== yesterdayISO) continue;
    if (t.status === "Completed") continue;

    toMove.push(t);
  }

  if (!toMove.length) return;

  // Perform writes in a controlled sequence
  for (const t of toMove) {
    if (!Array.isArray(t.rolloverFailures)) {
      t.rolloverFailures = [];
    }

    t.rolloverFailures.push(yesterdayISO);
    t.date = todayISO;
    t.updatedAt = nowTs();

    await put(STORES.todos, t);
  }

  await ensureTodoList(todayISO);
}




  async function syncTodosFromAction(actionId) {
    const a = await getOne(STORES.actions, actionId);
    if (!a || a._deleted) return;

    const todos = await getAll(STORES.todos);
    const linked = todos.filter(t => !t._deleted && t.actionId === actionId);

    for (const t of linked) {
      t.text = a.title;
      t.projectId = a.projectId || null;
      t.status = a.status || "Open";
      t.priority = a.priority || "Medium";
      t.dueDate = a.dueDate || "";
      t.notes = a.notes || "";
      t.updatedAt = nowTs();
      await put(STORES.todos, t);
    }
  }

  async function upsertJournal(input) {
  const date = input.date;
  if (!date) return null;

  const existing = await getOne(STORES.journal, date);

  const rec = existing && !existing._deleted
    ? existing
    : {
        date: date,
        createdAt: nowTs(),
        ownerUid: currentUid(),
        _deleted: false
      };

  rec.gratitude = input.gratitude ?? rec.gratitude ?? "";
  rec.objectives = input.objectives ?? rec.objectives ?? "";
// -----------------------------
// Reflections (tagged) — REPLACE, NOT MERGE
// -----------------------------

// Backward compatibility: old string reflections → { general: text }
if (typeof rec.reflections === "string") {
  rec.reflections = rec.reflections.trim()
    ? { general: rec.reflections }
    : {};
}

// IMPORTANT:
// Reflections are fully owned by the UI.
// If provided, they must REPLACE existing reflections.
if ("reflections" in input) {
  if (input.reflections && typeof input.reflections === "object") {
    rec.reflections = input.reflections;
  } else {
    rec.reflections = {};
  }
}

// Ensure reflections is always an object
if (!rec.reflections || typeof rec.reflections !== "object") {
  rec.reflections = {};
}

  rec.mood = input.mood ?? rec.mood ?? null;
rec.energy = input.energy ?? rec.energy ?? null;
rec.stress = input.stress ?? rec.stress ?? null;
  rec.updatedAt = nowTs();

  await put(STORES.journal, rec);
  return rec;
}


  async function upsertHabit(input) {
    const id = input.id || uid();
    const existing = await getOne(STORES.habits, id);
    const rec = existing && !existing._deleted ? existing : {
  id,
  createdAt: nowTs(),
  ownerUid: currentUid(), // 🔑 ADD THIS
  _deleted: false
};

    rec.name = input.name || rec.name || "";
    rec.frequency = input.frequency || rec.frequency || "Daily";
    rec.archived = !!input.archived;
    rec.updatedAt = nowTs();
    await put(STORES.habits, rec);
    return rec;
  }

  async function updateHabit(id, patch) {
    const h = await getOne(STORES.habits, id);
    if (!h || h._deleted) return null;
    Object.assign(h, patch || {});
    h.updatedAt = nowTs();
    await put(STORES.habits, h);
    return h;
  }

  async function deleteHabit(id) {
  const h = await getOne(STORES.habits, id);
  if (!h || h._deleted) return;

  // 1. Delete the habit itself
  h._deleted = true;
  h.deletedAt = nowTs();
  h.updatedAt = nowTs();
  await put(STORES.habits, h);

  // 2. Delete all related habit completions
  const allCompletions = await getAll(STORES.habitCompletions);
  const related = allCompletions.filter(
    c => !c._deleted && c.habitId === id
  );

  for (const c of related) {
    c._deleted = true;
    c.deletedAt = nowTs();
    c.updatedAt = nowTs();
    await put(STORES.habitCompletions, c);
  }
}


  async function upsertHabitCompletion(input) {
    const id = input.id || uid();
    const existing = await getOne(STORES.habitCompletions, id);
    const rec = existing && !existing._deleted ? existing : {
  id,
  createdAt: nowTs(),
  ownerUid: currentUid(), // 🔑 ADD THIS
  _deleted: false
};

    rec.habitId = input.habitId;
    rec.date = input.date;
    rec.updatedAt = nowTs();
    await put(STORES.habitCompletions, rec);
    return rec;
  }

  async function deleteHabitCompletion(id) {
  const c = await getOne(STORES.habitCompletions, id);
  if (!c || c._deleted) return;

  c._deleted = true;
  c.deletedAt = nowTs();
  c.updatedAt = nowTs(); // CRITICAL: ensures delete wins

  await put(STORES.habitCompletions, c);
}


  async function upsertMeal(input) {
    const id = input.id || uid();
    const existing = await getOne(STORES.meals, id);
    const rec = existing && !existing._deleted ? existing : {
  id,
  createdAt: nowTs(),
  ownerUid: currentUid(), // 🔑 ADD THIS
  _deleted: false
};

    rec.name = input.name || rec.name || "";
    rec.notes = input.notes ?? rec.notes ?? "";
    rec.updatedAt = nowTs();
    await put(STORES.meals, rec);
    return rec;
  }

  async function updateMeal(id, patch) {
    const m = await getOne(STORES.meals, id);
    if (!m || m._deleted) return null;
    Object.assign(m, patch || {});
    m.updatedAt = nowTs();
    await put(STORES.meals, m);
    return m;
  }

  async function deleteMeal(id) { await markDeleted(STORES.meals, id); }

  async function upsertMealPlan(input) {
    const all = await getAll(STORES.mealPlans);
    const ex = all.find(p => !p._deleted && p.date === input.date && p.slot === input.slot) || null;
    const id = ex ? ex.id : uid();
    const rec = ex && !ex._deleted ? ex : { id, createdAt: nowTs(), _deleted: false };
    rec.date = input.date;
    rec.slot = input.slot;
    rec.mealId = input.mealId;
    rec.updatedAt = nowTs();
    await put(STORES.mealPlans, rec);
    return rec;
  }

  async function deleteMealPlan(id) { await markDeleted(STORES.mealPlans, id); }

  async function upsertNote(input) {
    const id = input.id || uid();
    const existing = await getOne(STORES.notes, id);
    const rec = existing && !existing._deleted ? existing : {
  id,
  createdAt: nowTs(),
  ownerUid: currentUid(), // 🔑 ADD THIS
  _deleted: false
};

    rec.title = input.title ?? rec.title ?? "Untitled";
    rec.body = input.body ?? rec.body ?? "";
    rec.collectionId = input.collectionId ?? rec.collectionId ?? null;
    rec.updatedAt = input.updatedAt || nowTs();
    await put(STORES.notes, rec);
    return rec;
  }

  async function updateNote(id, patch) {
    const n = await getOne(STORES.notes, id);
    if (!n || n._deleted) return null;
    Object.assign(n, patch || {});
    n.updatedAt = nowTs();
    await put(STORES.notes, n);
    return n;
  }

  async function deleteNote(id) { await markDeleted(STORES.notes, id); }

  async function exportAll() {
    const out = {};
    for (const k of Object.values(STORES)) out[k] = await getAll(k);
    return out;
  }

  async function importAll(data, opts = { overwrite: false }) {
    if (!data || typeof data !== "object") return;
    if (opts.overwrite) {
      for (const k of Object.values(STORES)) {
        const all = await getAll(k);
        for (const r of all) {
          const key = (k === STORES.settings) ? r.key : (r.id || r.date);
          if (key !== undefined) await del(k, key);
        }
      }
    }
    for (const [store, rows] of Object.entries(data)) {
      if (!Object.values(STORES).includes(store)) continue;
      if (!Array.isArray(rows)) continue;
      for (const r of rows) {
        if (!r) continue;
        await put(store, r);
      }
    }
  }

  async function init() {
  db = await openDb();

  // Ensure collections have archived flag
  const collections = await getAll(STORES.collections);
  for (const c of collections) {
    if (typeof c.archived !== "boolean") {
      c.archived = false;
      c.updatedAt = nowTs();
      await put(STORES.collections, c);
    }
  }

  // Ensure notes have archived flag
  const notes = await getAll(STORES.notes);
  for (const n of notes) {
    if (typeof n.archived !== "boolean") {
      n.archived = false;
      n.updatedAt = nowTs();
      await put(STORES.notes, n);
    }
  }
}



  // ===============================
// Collections helpers
// ===============================

async function archiveCollection(id) {
  const c = await getOne(STORES.collections, id);
  if (!c || c._deleted) return;
  c.archived = true;
  c.updatedAt = nowTs();
  await put(STORES.collections, c);
}

async function unarchiveCollection(id) {
  const c = await getOne(STORES.collections, id);
  if (!c || c._deleted) return;
  c.archived = false;
  c.updatedAt = nowTs();
  await put(STORES.collections, c);
}

async function deleteCollection(id) {
  const c = await getOne(STORES.collections, id);
  if (!c || c._deleted) return;

  // Soft-delete collection
  c._deleted = true;
  c.deletedAt = nowTs();
  c.updatedAt = nowTs();
  await put(STORES.collections, c);

  // Remove collectionId from notes (notes remain)
  const notes = await getAll(STORES.notes);
  for (const n of notes) {
    if (n.collectionId === id && !n._deleted) {
      n.collectionId = null;
      n.updatedAt = nowTs();
      await put(STORES.notes, n);
    }
  }
}


  window.DB = {
    STORES,
    idx,
    init,
    getAll,
    getOne,
    getByIndex,
    put,
    exportAll,
    importAll,
    setSetting,
    getSetting,
    ensureTodoList,
    ensureProject,
    updateProject,
    upsertAction,
    updateAction,
    deleteAction,
    upsertTodo,
    updateTodo,
    deleteTodo,
    syncTodosFromAction,
    upsertJournal,
    upsertHabit,
    updateHabit,
    upsertHabitCompletion,
    deleteHabitCompletion,
    upsertMeal,
    updateMeal,
    deleteMeal,
    upsertMealPlan,
    deleteMealPlan,
    upsertNote,
    updateNote,
    archiveProject,
unarchiveProject,
deleteProject,
rolloverTodosToToday,
deleteJournal,
deleteHabit,
archiveCollection,
unarchiveCollection,
deleteCollection,
    deleteNote
  };
})();
