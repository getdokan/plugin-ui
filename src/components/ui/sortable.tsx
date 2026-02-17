"use strict";

import * as React from "react";
import {
  DndContext,
  type DndContextProps,
  DragOverlay,
  type DragOverlayProps,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type UniqueIdentifier,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

interface SortableProps<TData extends { id: UniqueIdentifier }> extends DndContextProps {
  items: TData[];
  onValueChange?: (items: TData[]) => void;
  onMove?: (event: DragEndEvent) => void;
  strategy?: SortingStrategy;
  children: React.ReactNode;
  overlay?: React.ReactNode;
  /**
   * Whether to wrap the component in a DndContext.
   * Set to false if you are providing your own DndContext at a higher level (e.g. for multiple lists).
   * @default true
   */
  container?: boolean;
}

const Sortable = <TData extends { id: UniqueIdentifier }>({
  items,
  onValueChange,
  onMove,
  strategy = verticalListSortingStrategy,
  children,
  overlay,
  sensors: propSensors,
  collisionDetection = closestCenter,
  container = true,
  ...props
}: SortableProps<TData>) => {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
  const defaultSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const sensors = propSensors ?? defaultSensors;

  const content = (
    <SortableContext items={items} strategy={strategy}>
      {children}
    </SortableContext>
  );

  if (!container) return content;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={(event) => setActiveId(event.active.id)}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over.id);

          if (oldIndex !== -1 && newIndex !== -1) {
            onValueChange?.(arrayMove(items, oldIndex, newIndex));
          }
        }
        onMove?.(event);
        setActiveId(null);
      }}
      onDragCancel={() => setActiveId(null)}
      {...props}
    >
      {content}
      {overlay && (
        <DragOverlay>
          {activeId ? overlay : null}
        </DragOverlay>
      )}
    </DndContext>
  );
};

// --- Sortable Item Context ---
interface SortableItemContextValue {
  attributes: React.HTMLAttributes<HTMLElement>;
  listeners: any; // dnd-kit uses a complex type here, but any is safe for context
  setActivatorNodeRef: (element: HTMLElement | null) => void;
  isDragging?: boolean;
}

const SortableItemContext = React.createContext<SortableItemContextValue | null>(null);

function useSortableItemContext() {
  const context = React.useContext(SortableItemContext);
  if (!context) {
    throw new Error("useSortableItemContext must be used within a SortableItem");
  }
  return context;
}

// --- Sortable Item ---
interface SortableItemProps extends Omit<useRender.ComponentProps<"div">, "id"> {
  id: UniqueIdentifier;
  disabled?: boolean;
  /**
   * Whether to use a drag handle.
   * If true, listeners will be attached to the SortableDragHandle component.
   * If false, listeners will be attached to the SortableItem itself.
   */
  useHandle?: boolean;
}

const SortableItem = ({
  id,
  children,
  render,
  className,
  disabled,
  useHandle = false,
  ...props
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const contextValue = React.useMemo(
    () => ({
      attributes,
      listeners,
      setActivatorNodeRef,
      isDragging,
    }),
    [attributes, listeners, setActivatorNodeRef, isDragging]
  );

  const element = useRender({
    render,
    defaultTagName: "div",
    ref: setNodeRef,
    state: {
      isDragging,
    },
    props: mergeProps<"div">(
      {
        children,
        style,
        className: cn(
          "relative",
          isDragging && "z-50",
          !useHandle && "cursor-grab",
          className
        ),
        ...(!useHandle ? attributes : {}),
        ...(!useHandle ? listeners : {}),
      },
      props
    ),
  });

  return (
    <SortableItemContext.Provider value={contextValue}>
      {element}
    </SortableItemContext.Provider>
  );
};

// --- Sortable Drag Handle ---
interface SortableDragHandleProps extends useRender.ComponentProps<"button"> {}

const SortableDragHandle = React.forwardRef<HTMLButtonElement, SortableDragHandleProps>(
  ({ className, render, ...props }, ref) => {
    const { attributes, listeners, setActivatorNodeRef } = useSortableItemContext();

    return useRender({
      render,
      defaultTagName: "button",
      ref: [setActivatorNodeRef, ref],
      props: mergeProps<"button">(
        {
          className: cn("cursor-grab", className),
          ...attributes,
          ...listeners,
        },
        props
      ),
    });
  }
);
SortableDragHandle.displayName = "SortableDragHandle";

interface SortableProviderProps extends DndContextProps {
  children: React.ReactNode;
}

const SortableProvider = ({ children, sensors: propSensors, ...props }: SortableProviderProps) => {
  const defaultSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const sensors = propSensors ?? defaultSensors;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} {...props}>
      {children}
    </DndContext>
  );
};

export {
  Sortable,
  SortableItem,
  SortableDragHandle,
  SortableProvider,
  DragOverlay,
  type SortableProps,
  type SortableItemProps,
  type SortableDragHandleProps,
  type SortableProviderProps,
};
