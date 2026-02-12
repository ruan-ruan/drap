import React, { useState } from 'react';
import { DragSortList } from './DragSortList';
import { DraggableItem } from '../core/drag-sort';

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
      <div style={{ marginTop: '20px' }}>
        <h3>当前顺序:</h3>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};