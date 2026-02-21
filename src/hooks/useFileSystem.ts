import { useState, useCallback } from 'react';

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileNode[];
}

const INITIAL_FS: FileNode[] = [
  {
    name: 'home',
    type: 'directory',
    children: [
      {
        name: 'user',
        type: 'directory',
        children: [
          { name: 'Documents', type: 'directory', children: [
            { name: 'todo.txt', type: 'file', content: '1. Build browserOS\n2. Conquer the web\n3. Profit' }
          ] },
          { name: 'Pictures', type: 'directory', children: [] },
          { name: 'readme.md', type: 'file', content: '# Welcome to browserOS\nThis is a fully functional web-based OS.' },
        ]
      }
    ]
  },
  {
    name: 'bin',
    type: 'directory',
    children: [
      { name: 'ls', type: 'file', content: 'binary' },
      { name: 'cat', type: 'file', content: 'binary' },
    ]
  }
];

export function useFileSystem() {
  const [fs, setFs] = useState<FileNode[]>(INITIAL_FS);

  const getPath = useCallback((path: string): FileNode | null => {
    const parts = path.split('/').filter(Boolean);
    let current: FileNode | undefined = { name: 'root', type: 'directory', children: fs };

    for (const part of parts) {
      current = current.children?.find(child => child.name === part);
      if (!current) return null;
    }

    return current;
  }, [fs]);

  return { fs, getPath };
}
