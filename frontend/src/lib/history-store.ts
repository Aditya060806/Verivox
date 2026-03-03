const DB_NAME = "verivox-history";
const DB_VERSION = 1;
const STORE_NAME = "analyses";
const CHANNEL_NAME = "verivox-history";

export interface HistoryEntry {
    id?: number;
    type: "text" | "image" | "page";
    title: string;
    score: number;
    verdict: string;
    time: string;
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true,
                });
                store.createIndex("time", "time", { unique: false });
                store.createIndex("type", "type", { unique: false });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function addAnalysis(entry: Omit<HistoryEntry, "id">): Promise<number> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.add(entry);
        req.onsuccess = () => {
            const id = req.result as number;
            broadcast("added", id);
            resolve(id);
        };
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
    });
}

export async function getAllAnalyses(): Promise<HistoryEntry[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
            const items = (req.result as HistoryEntry[]).reverse();
            resolve(items);
        };
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
    });
}

export async function deleteAnalysis(id: number): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => {
            broadcast("deleted", id);
            resolve();
        };
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
    });
}

export async function clearAllAnalyses(): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => {
            broadcast("cleared", 0);
            resolve();
        };
        req.onerror = () => reject(req.error);
        tx.oncomplete = () => db.close();
    });
}

type HistoryChangeCallback = () => void;

function broadcast(action: string, id: number) {
    try {
        const ch = new BroadcastChannel(CHANNEL_NAME);
        ch.postMessage({ action, id });
        ch.close();
    } catch {
        // BroadcastChannel not supported — ignore
    }
}

export function onHistoryChange(cb: HistoryChangeCallback): () => void {
    try {
        const ch = new BroadcastChannel(CHANNEL_NAME);
        ch.onmessage = () => cb();
        return () => ch.close();
    } catch {
        return () => { };
    }
}
