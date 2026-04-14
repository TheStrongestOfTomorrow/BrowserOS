import type { FileSystemNode } from "@/types";

export function getNodeByPath(
  root: FileSystemNode,
  path: string
): FileSystemNode | null {
  if (path === "/" || path === "") return root;
  const parts = path.split("/").filter(Boolean);
  let current = root;
  for (const part of parts) {
    if (!current.children || !current.children[part]) return null;
    current = current.children[part];
  }
  return current;
}

export function createFile(
  root: FileSystemNode,
  path: string,
  name: string,
  content: string = ""
): FileSystemNode {
  const parent = getNodeByPath(root, path);
  if (!parent || parent.type !== "directory") return root;

  const now = Date.now();
  const newFile: FileSystemNode = {
    name,
    type: "file",
    content,
    created: now,
    modified: now,
    size: content.length,
  };

  return {
    ...root,
    children: {
      ...root.children,
    },
  };
}

export function deepCloneFS(node: FileSystemNode): FileSystemNode {
  return {
    ...node,
    children: node.children
      ? Object.fromEntries(
          Object.entries(node.children).map(([k, v]) => [k, deepCloneFS(v)])
        )
      : undefined,
  };
}

export function addNodeAtPath(
  root: FileSystemNode,
  path: string,
  newNode: FileSystemNode
): FileSystemNode {
  const newRoot = deepCloneFS(root);
  const parent = getNodeByPath(newRoot, path);
  if (!parent || parent.type !== "directory" || !parent.children) return root;
  parent.children[newNode.name] = newNode;
  parent.modified = Date.now();
  return newRoot;
}

export function deleteNodeAtPath(
  root: FileSystemNode,
  path: string,
  name: string
): FileSystemNode {
  const newRoot = deepCloneFS(root);
  const parent = getNodeByPath(newRoot, path);
  if (!parent || parent.type !== "directory" || !parent.children) return root;
  delete parent.children[name];
  parent.modified = Date.now();
  return newRoot;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString();
}
