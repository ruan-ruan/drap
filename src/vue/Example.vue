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
    <div style="margin-top: 20px;">
      <h3>当前顺序:</h3>
      <ul>
        <li v-for="item in items" :key="item.id">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DragSortList from './DragSortList.vue';
import { DraggableItem } from '../core/drag-sort';

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

<style scoped>
/* 自定义样式 */
</style>