// sync.js — delta-based, event-driven sync
(function () {
  const STORE_LIST = [
    "projects",
    "actions",
    "todos",
    "todoLists",
    "journal",
    "habits",
    "habitCompletions",
    "meals",
    "mealPlans",
    "notes",
    "goals",
    "settings"
  ];

  function isOnline() {
    return navigator.onLine;
  }

  function getUser() {
    return window.fbAuth?.currentUser || null;
  }

  function getDb() {
    return window.fbDb || null;
  }

  function now() {
    return Date.now();
  }

  function storePath(uid, store) {
    return `users/${uid}/stores/${store}/items`;
  }

  function getId(store, obj) {
    if (!obj) return null;
    if (store === "journal") return obj.date;
    if (store === "settings") return obj.key;
    return obj.id;
  }

  /* -------------------------------------------------------
     PUSH — single item
  ------------------------------------------------------- */

  async function pushItem(store, item) {
  const uid = window.fbAuth?.currentUser?.uid || null;

  // 🔒 Never sync records created while logged out or owned by another user
  if (!uid) return;

    if (!isOnline()) return;
    const user = getUser();
    const db = getDb();
    if (!user || !db) return;

    const id = getId(store, item);
    if (!id) return;

    const ref = db.doc(`${storePath(user.uid, store)}/${id}`);
await ref.set(item, { merge: true });

// 🔑 Clear dirty flag locally after successful push
const storeName = window.DB.STORES[store] || store;
await window.DB.put(storeName, {
  ...item,
  _dirty: false
});
  }

  /* -------------------------------------------------------
     PULL — deltas only
  ------------------------------------------------------- */

  async function pullDeltas() {
    if (!isOnline()) return;
    if (!getUser()) {
  console.warn("[SYNC] Skipped pull: user not authenticated");
  return;
}    const user = getUser();
    const db = getDb();
    if (!user || !db) return;

    const lastPull = (await window.DB.getSetting("sync.lastPullAt", 0)) || 0;
    let newestSeen = lastPull;

    for (const store of STORE_LIST) {
      const col = db
        .collection(storePath(user.uid, store))
        .where("updatedAt", ">", lastPull);

      const snap = await col.get();
      if (snap.empty) continue;

      for (const doc of snap.docs) {
        const data = doc.data();
        if (!data) continue;

        const id = getId(store, data);
        if (!id) continue;

        const storeName = window.DB.STORES[store] || store;
const id2 = getId(store, data);
if (!id2) continue;

const local = await window.DB.getOne(storeName, id2);

/* ---------- CONTENT SAFETY (journals & notes only) ---------- */
if (store === "journal" || store === "notes") {
  if (local && !local._deleted) {
    const localHasContent =
      (local.gratitude && local.gratitude.trim()) ||
      (local.objectives && local.objectives.trim()) ||
      (local.body && local.body.trim()) ||
      (local.reflections && Object.keys(local.reflections || {}).length > 0);

    const remoteHasContent =
      (data.gratitude && data.gratitude.trim()) ||
      (data.objectives && data.objectives.trim()) ||
      (data.body && data.body.trim()) ||
      (data.reflections && Object.keys(data.reflections || {}).length > 0);

    if (localHasContent && !remoteHasContent) {
      continue;
    }
  }
}

/* ---------- TIMESTAMP SAFETY (all stores) ---------- */
if (local && !local._deleted) {
  const localTs = local.updatedAt || 0;
  const remoteTs = data.updatedAt || 0;

  if (localTs > remoteTs) {
    continue;
  }
}

/* ---------- APPLY REMOTE RECORD ---------- */
await window.DB.put(storeName, {
  ...data,
  _dirty: false
});

        newestSeen = Math.max(newestSeen, data.updatedAt || 0);
      }
    }

    if (newestSeen > lastPull) {
      await window.DB.setSetting("sync.lastPullAt", newestSeen);
      updateSyncStamp(newestSeen);
    }
  }

  /* -------------------------------------------------------
     PUBLIC API
  ------------------------------------------------------- */

  let syncTimer = null;

  function startBackgroundPull() {
    if (syncTimer) clearInterval(syncTimer);

    syncTimer = setInterval(() => {
      pullDeltas().catch(() => {});
    }, 120000); // every 2 minutes
  }

  function updateSyncStamp(ts) {
    const el = document.getElementById("syncStamp");
    if (!el) return;
    el.textContent = ts
      ? `Last synced: ${new Date(ts).toLocaleString()}`
      : "Last synced: —";
  }

  async function initialSync() {
  await pushAllDirty();   // 🔑 push offline edits first
  await pullDeltas();     // then pull cloud
  startBackgroundPull();
}


 async function discardUnauthenticatedLocalData(uid) {
  const stores = Object.values(window.DB.STORES);

  for (const store of stores) {
    const items = await window.DB.getAll(store);

    for (const item of items) {
      // Only remove data explicitly created while logged OUT
      if (item.ownerUid === null) {
        const key =
          item.id ??
          item.date ??
          item.key;

        if (key !== undefined) {
          await window.DB.del(store, key);
        }
      }
    }
  }
}


async function fullPullAllFromCloud() {
  if (!navigator.onLine) return;

  const user = window.fbAuth?.currentUser;
  const db = window.fbDb;
  if (!user || !db) return;

  // IMPORTANT: ignore any previous sync timestamps
  let newestSeen = 0;

  for (const store of STORE_LIST) {
    const col = db.collection(`users/${user.uid}/stores/${store}/items`);
    const snap = await col.get();

    if (snap.empty) continue;

    for (const doc of snap.docs) {
      const data = doc.data();
      if (!data) continue;

      const id =
        store === "journal" ? data.date :
        store === "settings" ? data.key :
        data.id;

      if (!id) continue;

const storeName = window.DB.STORES[store] || store;

// 🔒 Journal safety: never overwrite richer local content
if (store === "journal") {
  const local = await window.DB.getOne(storeName, data.date);

  if (local && !local._deleted) {
    const localHasText =
      (local.gratitude && local.gratitude.trim()) ||
      (local.objectives && local.objectives.trim()) ||
      (local.reflections && Object.keys(local.reflections || {}).length > 0);

    const remoteHasText =
      (data.gratitude && data.gratitude.trim()) ||
      (data.objectives && data.objectives.trim()) ||
      (data.reflections && Object.keys(data.reflections || {}).length > 0);

    // 🔑 If local has content and remote does not → SKIP overwrite
    if (localHasText && !remoteHasText) {
      continue;
    }
  }
}

await window.DB.put(storeName, data);
      newestSeen = Math.max(newestSeen, data.updatedAt || 0);
    }
  }

  if (newestSeen > 0) {
    await window.DB.setSetting("sync.lastPullAt", newestSeen);
  }
}

async function pushAllDirty() {
  if (!navigator.onLine) return;

  const user = window.fbAuth?.currentUser;
  if (!user) return;

  let hasDirty = false;

  // 🔑 FIRST PASS: detect if anything is dirty
  for (const store of STORE_LIST) {
    const storeName = window.DB.STORES[store] || store;
    const items = await window.DB.getAll(storeName);

    if (items.some(item => item && item._dirty)) {
      hasDirty = true;
      break;
    }
  }

  // 🔑 GUARD: nothing to push → exit early
  if (!hasDirty) return;

  // 🔁 SECOND PASS: push dirty records
  for (const store of STORE_LIST) {
    const storeName = window.DB.STORES[store] || store;
    const items = await window.DB.getAll(storeName);

    for (const item of items) {
      if (item && item._dirty) {
        try {
          await pushItem(store, item);
        } catch {
          // leave dirty; retry later
        }
      }
    }
  }
}





  window.Sync = {
  pushItem,
  initialSync,
  fullPullAllFromCloud,
  discardUnauthenticatedLocalData
};

  
})();
