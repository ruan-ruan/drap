export interface DraggableItem {
  id: string | number;
  [key: string]: any;
}

export interface DragSortOptions {
  onDragStart?: (item: DraggableItem, index: number) => void;
  onDragEnd?: (item: DraggableItem, index: number, newIndex: number) => void;
  onDragOver?: (item: DraggableItem, index: number) => void;
  onDragLeave?: (item: DraggableItem, index: number) => void;
  onDrop?: (item: DraggableItem, index: number, newIndex: number) => void;
  animationDuration?: number;
}

export class DragSortCore {
  private options: DragSortOptions;
  private draggingIndex: number | null = null;
  private draggedElement: HTMLElement | null = null;

  constructor(options: DragSortOptions = {}) {
    this.options = options;
  }

  public startDrag(index: number, element: HTMLElement, item: DraggableItem) {
    this.draggingIndex = index;
    this.draggedElement = element;
    
    element.style.opacity = '0.5';
    element.style.zIndex = '1000';
    
    if (this.options.onDragStart) {
      this.options.onDragStart(item, index);
    }
  }

  public endDrag() {
    if (this.draggedElement) {
      this.draggedElement.style.opacity = '1';
      this.draggedElement.style.position = '';
      this.draggedElement.style.zIndex = '';
    }
    
    this.draggingIndex = null;
    this.draggedElement = null;
  }

  public handleDragOver(items: DraggableItem[], index: number) {
    if (this.draggingIndex === null || this.draggingIndex === index) {
      return items;
    }

    const newItems = [...items];
    const [draggedItem] = newItems.splice(this.draggingIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    if (this.options.onDragOver) {
      this.options.onDragOver(draggedItem, index);
    }

    return newItems;
  }

  public handleDrop(items: DraggableItem[], index: number) {
    if (this.draggingIndex === null) {
      return items;
    }

    const newItems = [...items];
    const [draggedItem] = newItems.splice(this.draggingIndex, 1);
    newItems.splice(index, 0, draggedItem);
    
    const newIndex = index;
    
    if (this.options.onDragEnd) {
      this.options.onDragEnd(draggedItem, this.draggingIndex, newIndex);
    }

    if (this.options.onDrop) {
      this.options.onDrop(draggedItem, this.draggingIndex, newIndex);
    }

    this.endDrag();
    return newItems;
  }

  public getDraggingIndex() {
    return this.draggingIndex;
  }
}