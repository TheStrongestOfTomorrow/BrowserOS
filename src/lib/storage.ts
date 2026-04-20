/**
 * BrowserOS Storage Utilities
 * Handles virtual filesystem and persistent state
 */
import { openDB } from "idb";
import type { FileSystemNode } from "@/types";

const DB_NAME = "BrowserOS";
const STORE_NAME = "kv";

const dbPromise = typeof window !== "undefined"
  ? openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    })
  : null;

export const kv = {
  async get<T>(key: string): Promise<T | undefined> {
    if (!dbPromise) return undefined;
    const db = await dbPromise;
    return db.get(STORE_NAME, key);
  },
  async set<T>(key: string, value: T): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.put(STORE_NAME, value, key);
  },
  async delete(key: string): Promise<void> {
    if (!dbPromise) return;
    const db = await dbPromise;
    await db.delete(STORE_NAME, key);
  },
};

export async function getItem<T>(key: string): Promise<T | undefined> {
  return kv.get<T>(key);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  return kv.set<T>(key, value);
}

export function resolvePath(cwd: string, path: string): string {
  if (path.startsWith("/")) return path;
  if (path === "~") return "/home/user";

  const parts = cwd.split("/").filter(Boolean);
  const pathParts = path.split("/").filter(Boolean);

  for (const part of pathParts) {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  }

  return "/" + parts.join("/");
}

export function getPathNode(root: FileSystemNode, path: string): FileSystemNode | null {
  if (path === "/") return root;

  const parts = path.split("/").filter(Boolean);
  let current: FileSystemNode = root;

  for (const part of parts) {
    if (!current.children || !current.children[part]) {
      return null;
    }
    current = current.children[part];
  }

  return current;
}
