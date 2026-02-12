import React, { useState, useRef, useCallback } from 'react';
import { DraggableItem, DragSortOptions, DragSortCore } from '../core/drag-sort';

interface DragSortListProps {
  items: DraggableItem[];
  onItemsChange: (items: DraggableItem[]) => void;
  options?: DragSortOptions;
  renderItem: (item: DraggableItem, index: number, isDragging: boolean) => React.ReactNode;
}

export const DragSortList: React.FC<DragSortListProps> = ({
  items,
  onItemsChange,
  options = {},
  renderItem
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const dragSortCoreRef = useRef<DragSortCore | null>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  // 初始化 DragSortCore
  React.useEffect(() => {
    dragSortCoreRef.current = new DragSortCore({
      ...options,
      onDragEnd: (item, oldIndex, newIndex) => {
        if (options.onDragEnd) {
          options.onDragEnd(item, oldIndex, newIndex);
        }
      },
      onDrop: (item, oldIndex, newIndex) => {
        if (options.onDrop) {
          options.onDrop(item, oldIndex, newIndex);
        }
      }
    });
  }, [options]); // 只在组件挂载或 options 变化时初始化

  // 处理拖拽开始
  const handleDragStart = useCallback((index: number, e: React.DragEvent<HTMLElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
    setDraggingIndex(index);
    
    if (dragSortCoreRef.current && itemRefs.current[index]) {
      dragSortCoreRef.current.startDrag(index, itemRefs.current[index]!, items[index]);
    }
  }, [items]);

  // 处理拖拽结束
  const handleDragEnd = useCallback((e: React.DragEvent<HTMLElement>) => {
    setIsDragging(false);
    setDraggingIndex(null);
    
    if (dragSortCoreRef.current) {
      dragSortCoreRef.current.endDrag();
    }
  }, []);

  // 处理拖拽经过
  const handleDragOver = useCallback((index: number, e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    
    if (dragSortCoreRef.current && draggingIndex !== null && draggingIndex !== index) {
      const newItems = dragSortCoreRef.current.handleDragOver(items, index);
      if (newItems) {
        onItemsChange(newItems);
      }
    }
  }, [draggingIndex, items, onItemsChange]);

  // 处理放置
  const handleDrop = useCallback((index: number, e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    
    if (dragSortCoreRef.current) {
      const newItems = dragSortCoreRef.current.handleDrop(items, index);
      if (newItems) {
        onItemsChange(newItems);
      }
    }
    
    // 确保重置状态
    setIsDragging(false);
    setDraggingIndex(null);
  }, [items, onItemsChange]);

  // 更新 itemRefs
  const updateItemRef = useCallback((index: number, ref: HTMLElement | null) => {
    itemRefs.current[index] = ref;
  }, []);

  return (
    <div className="drag-sort-list" style={{ userSelect: 'none' }}>
      {items.map((item, index) => (
        <div
          key={item.id}
          ref={(ref) => updateItemRef(index, ref)}
          draggable
          onDragStart={(e) => handleDragStart(index, e)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(index, e)}
          onDrop={(e) => handleDrop(index, e)}
          style={{
            cursor: 'move',
            padding: '8px',
            margin: '4px 0',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: isDragging && draggingIndex === index ? '#f0f0f0' : 'white',
            userSelect: 'none',
            outline: 'none'
          }}
        >
          {renderItem(item, index, isDragging && draggingIndex === index)}
        </div>
      ))}
    </div>
  );
};