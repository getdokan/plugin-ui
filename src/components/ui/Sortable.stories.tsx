import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { GripVertical, X, Pencil, Check } from "lucide-react";
import {
  horizontalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import {
  Sortable,
  SortableItem,
  SortableDragHandle,
} from "./sortable";
import { Button } from "./button";
import { Input } from "./input";
import { Switch } from "./switch";

const meta = {
  title: "UI/Sortable",
  component: Sortable,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Sortable>;

export default meta;

type Story = StoryObj<typeof meta>;

const initialItems = [
  { id: "1", content: "Item 1" },
  { id: "2", content: "Item 2" },
  { id: "3", content: "Item 3" },
  { id: "4", content: "Item 4" },
  { id: "5", content: "Item 5" },
];

export const AdvancedCustomUI: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState([
        { id: "1", label: "Dashboard", checked: false },
        { id: "2", label: "Products", checked: true },
        { id: "3", label: "Address", checked: true },
        { id: "4", label: "Request Quotes", checked: true },
        { id: "5", label: "Coupons", checked: true },
        { id: "6", label: "Reports", checked: true },
        { id: "7", label: "Delivery Time", checked: true },
        { id: "8", label: "Reviews", checked: true },
        { id: "9", label: "Withdraw", checked: false },
      ]);
      const [editingId, setEditingId] = useState<string | null>("3");

      const toggleChecked = (id: string) => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
          )
        );
      };

      return (
        <div className="w-[600px] overflow-hidden rounded-lg border bg-background shadow-sm">
          <Sortable items={items} onValueChange={setItems}>
            <div className="flex flex-col">
              {items.map((item) => (
                <SortableItem
                  key={item.id}
                  id={item.id}
                  useHandle
                  className="group border-b last:border-0"
                >
                  <div className="flex h-14 items-center gap-4 px-4 py-2 transition-colors hover:bg-muted/30">
                    <SortableDragHandle className="text-muted-foreground/50 hover:text-foreground">
                      <GripVertical className="size-5" />
                    </SortableDragHandle>

                    <div className="flex flex-1 items-center">
                      {editingId === item.id ? (
                        <div className="relative flex-1">
                          <Input
                            defaultValue={item.label}
                            className="h-9 border-primary/50 ring-primary/20 focus-visible:border-primary focus-visible:ring-primary/30"
                            autoFocus
                          />
                          <button
                            onClick={() => setEditingId(null)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {editingId === item.id ? (
                        <Button
                          variant="outline"
                          size="icon-sm"
                          className="h-8 w-8 border-muted"
                          onClick={() => setEditingId(null)}
                        >
                          <Check className="size-4 text-muted-foreground" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="h-8 w-8 text-muted-foreground/50 hover:bg-muted hover:text-foreground"
                          onClick={() => setEditingId(item.id)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      )}
                      <Switch
                        checked={item.checked}
                        onCheckedChange={() => toggleChecked(item.id)}
                      />
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Vertical: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState(initialItems);
      return (
        <div className="w-80">
          <Sortable items={items} onValueChange={setItems}>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id}>
                  <div className="flex items-center justify-between rounded-md border bg-card p-4 shadow-sm">
                    <span>{item.content}</span>
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const WithDragHandle: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState(initialItems);
      return (
        <div className="w-80">
          <Sortable items={items} onValueChange={setItems}>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} useHandle>
                  <div className="flex items-center gap-3 rounded-md border bg-card p-3 shadow-sm">
                    <SortableDragHandle className="text-muted-foreground hover:text-foreground">
                      <GripVertical className="size-5" />
                    </SortableDragHandle>
                    <span className="flex-1 font-medium">{item.content}</span>
                    <Button variant="ghost" size="icon-sm">
                      <X className="size-4" />
                    </Button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Horizontal: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState(initialItems);
      return (
        <div className="w-full max-w-2xl overflow-x-auto p-4">
          <Sortable
            items={items}
            onValueChange={setItems}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-3">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} className="shrink-0">
                  <div className="flex h-20 w-32 items-center justify-center rounded-lg border bg-card shadow-sm">
                    {item.content}
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const Grid: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState([
        ...initialItems,
        { id: "6", content: "Item 6" },
        { id: "7", content: "Item 7" },
        { id: "8", content: "Item 8" },
        { id: "9", content: "Item 9" },
      ]);
      return (
        <div className="w-[500px] p-4">
          <Sortable
            items={items}
            onValueChange={setItems}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-4">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id}>
                  <div className="flex aspect-square items-center justify-center rounded-xl border-2 bg-card text-lg font-bold shadow-sm transition-colors hover:border-primary/50">
                    {item.content.split(" ")[1]}
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const CustomGapsAndPadding: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState(initialItems);
      return (
        <div className="rounded-xl border bg-muted/30 p-8 shadow-inner">
          <Sortable items={items} onValueChange={setItems}>
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} useHandle>
                  <div className="group flex items-center gap-4 rounded-2xl bg-background p-6 shadow-md transition-all hover:shadow-lg">
                    <SortableDragHandle className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <GripVertical className="size-6" />
                    </SortableDragHandle>
                    <div className="flex-1">
                      <h4 className="font-bold">{item.content}</h4>
                      <p className="text-sm text-muted-foreground">Customizable padding and gaps</p>
                    </div>
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const DragOverlayExample: Story = {
  render: () => {
    function Demo() {
      const [items, setItems] = useState(initialItems);
      return (
        <div className="w-80">
          <Sortable
            items={items}
            onValueChange={setItems}
            overlay={
               <div className="flex items-center gap-3 rounded-md border border-primary bg-primary/10 p-3 shadow-xl backdrop-blur-sm">
                 <GripVertical className="size-5 text-primary" />
                 <span className="font-bold text-primary">Dragging...</span>
               </div>
            }
          >
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <SortableItem key={item.id} id={item.id} useHandle>
                  <div className="flex items-center gap-3 rounded-md border bg-card p-3 shadow-sm">
                    <SortableDragHandle className="text-muted-foreground">
                      <GripVertical className="size-5" />
                    </SortableDragHandle>
                    <span className="flex-1">{item.content}</span>
                  </div>
                </SortableItem>
              ))}
            </div>
          </Sortable>
        </div>
      );
    }
    return <Demo />;
  },
};

export const MultipleLists: Story = {
  render: () => {
    function Demo() {
      const [itemsA, setItemsA] = useState([
        { id: "A1", content: "A1" },
        { id: "A2", content: "A2" },
      ]);
      const [itemsB, setItemsB] = useState([
        { id: "B1", content: "B1" },
        { id: "B2", content: "B2" },
      ]);

      return (
        <div className="flex gap-8 p-4">
          <div className="w-48 space-y-4">
             <h3 className="font-bold">List A</h3>
             <Sortable items={itemsA} onValueChange={setItemsA}>
                <div className="min-h-[100px] rounded-lg border bg-muted/50 p-2 space-y-2">
                  {itemsA.map(item => (
                    <SortableItem key={item.id} id={item.id}>
                      <div className="rounded border bg-card p-2 shadow-sm text-center">{item.content}</div>
                    </SortableItem>
                  ))}
                </div>
             </Sortable>
          </div>
          <div className="w-48 space-y-4">
             <h3 className="font-bold">List B</h3>
             <Sortable items={itemsB} onValueChange={setItemsB}>
                <div className="min-h-[100px] rounded-lg border bg-muted/50 p-2 space-y-2">
                  {itemsB.map(item => (
                    <SortableItem key={item.id} id={item.id}>
                      <div className="rounded border bg-card p-2 shadow-sm text-center">{item.content}</div>
                    </SortableItem>
                  ))}
                </div>
             </Sortable>
          </div>
        </div>
      );
    }
    return <Demo />;
  },
};
