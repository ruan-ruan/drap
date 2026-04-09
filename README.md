# drap

一个轻量级的拖拽排序库，支持 React 18 和 Vue 3。

## 特性

- ✅ 支持 React 18 和 Vue 3
- ✅ 轻量级核心实现
- ✅ 支持自定义样式
- ✅ 支持拖拽事件回调
- ✅ 响应式设计

## 安装

```bash
# 使用 npm
npm install drap

# 使用 yarn
yarn add drap

# 使用 pnpm
pnpm add drap
```

## 核心 API

### `DraggableItem` 接口

```typescript
export interface DraggableItem {
  id: string | number;
  [key: string]: any;
}
```

### `DragSortOptions` 接口

```typescript
export interface DragSortOptions {
  onDragStart?: (item: DraggableItem, index: number) => void;
  onDragEnd?: (item: DraggableItem, index: number, newIndex: number) => void;
  onDragOver?: (item: DraggableItem, index: number) => void;
  onDragLeave?: (item: DraggableItem, index: number) => void;
  onDrop?: (item: DraggableItem, index: number, newIndex: number) => void;
  animationDuration?: number;
}
```

## React 使用示例

```tsx
import React, { useState } from 'react';
import { DragSortList } from 'drap/react';
import { DraggableItem } from 'drap/core';

const initialItems: DraggableItem[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' }
];

export const ReactExample: React.FC = () => {
  const [items, setItems] = useState<DraggableItem[]>(initialItems);

  const handleItemsChange = (newItems: DraggableItem[]) => {
    setItems(newItems);
    console.log('Items changed:', newItems);
  };

  const handleDragStart = (item: DraggableItem, index: number) => {
    console.log('Drag started:', item.name, 'at index', index);
  };

  const handleDragEnd = (item: DraggableItem, oldIndex: number, newIndex: number) => {
    console.log('Drag ended:', item.name, 'from index', oldIndex, 'to', newIndex);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>React 18 拖拽排序示例</h2>
      <DragSortList
        items={items}
        onItemsChange={handleItemsChange}
        options={{
          onDragStart: handleDragStart,
          onDragEnd: handleDragEnd
        }}
        renderItem={(item, _index, isDragging) => (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{item.name}</span>
            {isDragging && <span>拖拽中...</span>}
          </div>
        )}
      />
    </div>
  );
};
```

## Vue 使用示例

```vue
<template>
  <div style="padding: 20px; max-width: 400px;">
    <h2>Vue 3 拖拽排序示例</h2>
    <DragSortList
      v-model:items="items"
      :options="{
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd
      }"
    >
      <template #item="{ item, index, isDragging }">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span>{{ item.name }}</span>
          <span v-if="isDragging">拖拽中...</span>
        </div>
      </template>
    </DragSortList>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DragSortList from 'drap/vue';
import { DraggableItem } from 'drap/core';

const initialItems: DraggableItem[] = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' }
];

const items = ref<DraggableItem[]>(initialItems);

const handleDragStart = (item: DraggableItem, index: number) => {
  console.log('Drag started:', item.name, 'at index', index);
};

const handleDragEnd = (item: DraggableItem, oldIndex: number, newIndex: number) => {
  console.log('Drag ended:', item.name, 'from index', oldIndex, 'to', newIndex);
};
</script>
```

## 组件 API

### React `DragSortList` 组件

#### Props

| 属性 | 类型 | 描述 | 必需 |
|------|------|------|------|
| `items` | `DraggableItem[]` | 可拖拽的项目数组 | 是 |
| `onItemsChange` | `(items: DraggableItem[]) => void` | 项目顺序变化时的回调 | 是 |
| `options` | `DragSortOptions` | 拖拽选项 | 否 |
| `renderItem` | `(item: DraggableItem, index: number, isDragging: boolean) => React.ReactNode` | 自定义项目渲染函数 | 是 |

### Vue `DragSortList` 组件

#### Props

| 属性 | 类型 | 描述 | 必需 |
|------|------|------|------|
| `items` | `DraggableItem[]` | 可拖拽的项目数组（支持 v-model） | 是 |
| `options` | `DragSortOptions` | 拖拽选项 | 否 |

#### Slots

| 名称 | 描述 | 作用域 |
|------|------|--------|
| `item` | 自定义项目渲染 | `{ item: DraggableItem, index: number, isDragging: boolean }` |

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## 许可证

MIT

