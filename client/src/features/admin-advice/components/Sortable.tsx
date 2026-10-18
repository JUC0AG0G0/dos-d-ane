import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/utils/cn';

/**
 * Liste réordonnable par glisser-déposer (souris, tactile ou clavier : Espace
 * pour saisir, flèches, Espace pour déposer). onMove reçoit les positions de
 * départ et d'arrivée.
 */
export function SortableList({
  ids,
  onMove,
  children,
}: {
  ids: string[];
  onMove: (from: number, to: number) => void;
  children: ReactNode;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    onMove(ids.indexOf(String(active.id)), ids.indexOf(String(over.id)));
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

/**
 * Élément réordonnable d'une SortableList : une ligne de tableau (tr) ou un
 * bloc (div). children reçoit la poignée à placer dans la ligne.
 */
export function SortableItem({
  id,
  as = 'div',
  className,
  onClick,
  children,
}: {
  id: string;
  as?: 'div' | 'tr';
  className?: string;
  /** Clic sur la ligne (hors poignée) : ouvre la modification. */
  onClick?: () => void;
  children: (handle: ReactNode) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    position: 'relative',
    zIndex: isDragging ? 10 : undefined,
  };
  const handle = (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      onClick={(event) => event.stopPropagation()}
      className="flex cursor-grab touch-none items-center rounded p-0.5 text-muted-foreground hover:text-foreground active:cursor-grabbing"
      aria-label="Déplacer"
    >
      <GripVertical className="size-4" />
    </button>
  );
  const props = {
    ref: setNodeRef,
    style,
    className: cn(
      className,
      onClick && 'cursor-pointer',
      isDragging && 'bg-muted shadow-sm',
    ),
    onClick,
  };
  return as === 'tr' ? (
    <TableRow {...props}>{children(handle)}</TableRow>
  ) : (
    <div {...props}>{children(handle)}</div>
  );
}
