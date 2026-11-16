import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const libraryRoot = path.resolve(scriptDirectory, '../../glightbox');
const publicDirectory = path.resolve(scriptDirectory, '../public');
const contentDirectory = path.resolve(scriptDirectory, '../src/content/docs');

await mkdir(path.join(publicDirectory, 'dist', 'css'), { recursive: true });
await mkdir(path.join(publicDirectory, 'dist', 'js'), { recursive: true });

await copyFile(path.join(libraryRoot, 'dist', 'css', 'glightbox.css'), path.join(publicDirectory, 'dist', 'css', 'glightbox.css'));
await copyFile(path.join(libraryRoot, 'dist', 'js', 'glightbox.js'), path.join(publicDirectory, 'dist', 'js', 'glightbox.js'));

const changelog = await readFile(path.join(libraryRoot, 'CHANGELOG.md'), 'utf8');
await writeFile(
    path.join(contentDirectory, 'changelog.md'),
    `---
title: Changelog
description: Release notes for GLightbox.
editUrl: https://github.com/tomasvn/glightbox/edit/master/packages/glightbox/CHANGELOG.md
tableOfContents:
  maxHeadingLevel: 2
---

${changelog.replace(/^# .+\r?\n+/, '')}`
);
