import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactExample } from './react/Example';

// 渲染 React 示例
ReactDOM.createRoot(document.getElementById('react-root')!).render(
  <React.StrictMode>
    <ReactExample />
  </React.StrictMode>
);

// 动态导入 Vue 示例
import('./vue/main.ts').catch(err => console.error('Failed to load Vue example:', err));