<template>
  <div class="drag-sort-list" style="user-select: none;">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      ref="itemRefs"
      draggable
      @dragstart="handleDragStart(index, $event)"
      @dragend="handleDragEnd($event)"
      @dragover="handleDragOver(index, $event)"
      @drop="handleDrop(index, $event)"
      :style="{
        cursor: 'move',
        padding: '8px',
        margin: '4px 0',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: isDragging && draggingIndex === index ? '#f0f0f0' : 'white',
        userSelect: 'none',
        outline: 'none'
      }"
    >
      <slot
        name="item"
        :item="item"
        :index="index"
        :is-dragging="isDragging && draggingIndex === index"
      ></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { DraggableItem, DragSortOptions, DragSortCore } from '../core/drag-sort';

interface Props {
  items: DraggableItem[];
  options?: DragSortOptions;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:items', items: DraggableItem[]): void;
}>();

const isDragging = ref(false);
const draggingIndex = ref<number | null>(null);
const dragSortCore = ref<DragSortCore | null>(null);
const itemRefs = ref<HTMLElement[]>([]);

// 初始化 DragSortCore
onMounted(() => {
  dragSortCore.value = new DragSortCore({
    ...props.options,
    onDragEnd: (item, oldIndex, newIndex) => {
      if (props.options?.onDragEnd) {
        props.options.onDragEnd(item, oldIndex, newIndex);
      }
    },
    onDrop: (item, oldIndex, newIndex) => {
      if (props.options?.onDrop) {
        props.options.onDrop(item, oldIndex, newIndex);
      }
    }
  });
});

// 监听 options 变化
watch(
  () => props.options,
  (newOptions) => {
    if (dragSortCore.value) {
      dragSortCore.value = new DragSortCore({
        ...newOptions,
        onDragEnd: (item, oldIndex, newIndex) => {
          if (newOptions?.onDragEnd) {
            newOptions.onDragEnd(item, oldIndex, newIndex);
          }
        },
        onDrop: (item, oldIndex, newIndex) => {
          if (newOptions?.onDrop) {
            newOptions.onDrop(item, oldIndex, newIndex);
          }
        }
      });
    }
  },
  { deep: true }
);

// 处理拖拽开始
const handleDragStart = (index: number, event: DragEvent) => {
  event.dataTransfer!.effectAllowed = 'move';
  isDragging.value = true;
  draggingIndex.value = index;
  
  if (dragSortCore.value && itemRefs.value[index]) {
    dragSortCore.value.startDrag(index, itemRefs.value[index], props.items[index]);
  }
};

// 处理拖拽结束
const handleDragEnd = (event: DragEvent) => {
  isDragging.value = false;
  draggingIndex.value = null;
  
  if (dragSortCore.value) {
    dragSortCore.value.endDrag();
  }
};

// 处理拖拽经过
const handleDragOver = (index: number, event: DragEvent) => {
  event.preventDefault();
  
  if (dragSortCore.value && draggingIndex.value !== null && draggingIndex.value !== index) {
    const newItems = dragSortCore.value.handleDragOver(props.items, index);
    if (newItems) {
      emit('update:items', newItems);
    }
  }
};

// 处理放置
const handleDrop = (index: number, event: DragEvent) => {
  event.preventDefault();
  
  if (dragSortCore.value) {
    const newItems = dragSortCore.value.handleDrop(props.items, index);
    if (newItems) {
      emit('update:items', newItems);
    }
  }
  
  // 确保重置状态
  isDragging.value = false;
  draggingIndex.value = null;
};
</script>

<style scoped>
.drag-sort-list {
  width: 100%;
}
</style>