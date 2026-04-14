import type { FileSystemNode } from "@/types";
import { getNodeByPath } from "./filesystem";

const STORAGE_KEY = "browseros-filesystem";

export function saveFileSystem(fs: FileSystemNode): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fs));
  } catch {
    // Storage full or unavailable
  }
}

export function loadFileSystem(): FileSystemNode | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function readOPFSFile(path: string): Promise<string | null> {
  try {
    const root = await navigator.storage.getDirectory();
    const parts = path.split("/").filter(Boolean);
    let dir = root;
    for (let i = 0; i < parts.length - 1; i++) {
      dir = await dir.getDirectoryHandle(parts[i]);
    }
    const fileHandle = await dir.getFileHandle(parts[parts.length - 1]);
    const file = await fileHandle.getFile();
    return await file.text();
  } catch {
    return null;
  }
}

export async function writeOPFSFile(path: string, content: string): Promise<void> {
  try {
    const root = await navigator.storage.getDirectory();
    const parts = path.split("/").filter(Boolean);
    let dir = root;
    for (let i = 0; i < parts.length - 1; i++) {
      dir = await dir.getDirectoryHandle(parts[i], { create: true });
    }
    const fileHandle = await dir.getFileHandle(parts[parts.length - 1], { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
  } catch {
    // OPFS not available
  }
}

export function resolvePath(currentPath: string, relativePath: string): string {
  if (relativePath.startsWith("/")) return relativePath;
  const parts = currentPath.split("/").filter(Boolean);
  const relParts = relativePath.split("/").filter(Boolean);
  for (const part of relParts) {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  }
  return "/" + parts.join("/");
}

export function getPathNode(fs: FileSystemNode, path: string): FileSystemNode | null {
  return getNodeByPath(fs, path);
}
