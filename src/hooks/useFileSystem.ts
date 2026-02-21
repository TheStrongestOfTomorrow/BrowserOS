import { useState, useCallback, useEffect } from 'react';

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
  const [fs, setFs] = useState<FileNode[]>(() => {
    const saved = localStorage.getItem('browseros-fs');
    return saved ? JSON.parse(saved) : INITIAL_FS;
  });

  useEffect(() => {
    localStorage.setItem('browseros-fs', JSON.stringify(fs));
  }, [fs]);

  const getPath = useCallback((path: string): FileNode | null => {
    if (path === '/' || path === '') return { name: 'root', type: 'directory', children: fs };
    const parts = path.split('/').filter(Boolean);
    let current: FileNode | undefined = { name: 'root', type: 'directory', children: fs };

    for (const part of parts) {
      current = current.children?.find(child => child.name === part);
      if (!current) return null;
    }

    return current;
  }, [fs]);

  const writeFile = useCallback((path: string, content: string) => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev)); // Deep clone
      const parts = path.split('/').filter(Boolean);
      const fileName = parts.pop();
      if (!fileName) return prev;

      let current: FileNode = { name: 'root', type: 'directory', children: newFs };
      for (const part of parts) {
        const next = current.children?.find(child => child.name === part && child.type === 'directory');
        if (!next) return prev; // Path not found
        current = next;
      }

      if (!current.children) current.children = [];
      const existingFile = current.children.find(child => child.name === fileName && child.type === 'file');
      if (existingFile) {
        existingFile.content = content;
      } else {
        current.children.push({ name: fileName, type: 'file', content });
      }

      return newFs;
    });
  }, []);

  const mkdir = useCallback((path: string) => {
    setFs(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const parts = path.split('/').filter(Boolean);
      const dirName = parts.pop();
      if (!dirName) return prev;

      let current: FileNode = { name: 'root', type: 'directory', children: newFs };
      for (const part of parts) {
        const next = current.children?.find(child => child.name === part && child.type === 'directory');
        if (!next) return prev;
        current = next;
      }

      if (!current.children) current.children = [];
      if (!current.children.find(child => child.name === dirName)) {
        current.children.push({ name: dirName, type: 'directory', children: [] });
      }

      return newFs;
    });
  }, []);

  return { fs, getPath, writeFile, mkdir };
}
