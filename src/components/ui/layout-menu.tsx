import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Input } from "./input";
import { useLayout } from "./layout";

/* ============================================
   Types: multi-label nested menu items
   ============================================ */

export interface LayoutMenuItemData {
  id: string;
  label: string;
  /** Secondary line (description, badge, etc.) */
  secondaryLabel?: string;
  href?: string;
  onClick?: () => void;
  children?: LayoutMenuItemData[];
  icon?: ReactNode;
  disabled?: boolean;
  /** Custom className for the item row */
  className?: string;
  /** Test ID for e2e selectors — rendered as `data-testid` on the interactive element */
  testId?: string;
}

export interface LayoutMenuGroupData {
  id: string;
  label: string;
  /** Optional secondary label for the group header */
  secondaryLabel?: string;
  items: LayoutMenuItemData[];
  className?: string;
}

/* ============================================
   Safe layout hook (fallback for standalone use)
   ============================================ */

function useLayoutSafe() {
  try {
    return useLayout();
  } catch {
    return null;
  }
}

/* ============================================
   Filter nested items by search query
   ============================================ */

function matchesSearch(item: LayoutMenuItemData, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const label = item.label.toLowerCase();
  const secondary = (item.secondaryLabel ?? "").toLowerCase();
  if (label.includes(q) || secondary.includes(q)) return true;
  if (item.children?.some((c) => matchesSearch(c, q))) return true;
  return false;
}

function filterMenuItems(
  items: LayoutMenuItemData[],
  query: string
): LayoutMenuItemData[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items
    .map((item) => {
      const childMatch = item.children?.length
        ? filterMenuItems(item.children, query)
        : [];
      const selfMatch = matchesSearch(item, query);
      if (selfMatch) return item;
      if (childMatch.length > 0) return { ...item, children: childMatch };
      return null;
    })
    .filter(Boolean) as LayoutMenuItemData[];
}

function filterGroups(
  groups: LayoutMenuGroupData[],
  query: string
): LayoutMenuGroupData[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups
    .map((grp) => ({
      ...grp,
      items: filterMenuItems(grp.items, query),
    }))
    .filter((grp) => grp.items.length > 0);
}

/* ============================================
   LayoutMenuSearch
   ============================================ */

export interface LayoutMenuSearchProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export const LayoutMenuSearch = forwardRef<
  HTMLDivElement,
  LayoutMenuSearchProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Search menu…",
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-slot="layout-menu-search"
        className={cn("shrink-0 p-2", className)}
        {...props}
      >
        <div className="relative">
          <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            type="search"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className={cn("h-8 pl-8", inputClassName)}
            aria-label="Search menu"
          />
        </div>
      </div>
    );
  }
);

LayoutMenuSearch.displayName = "LayoutMenuSearch";

/* ============================================
   LayoutMenu (search + list container)
   ============================================ */

export interface LayoutMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Flat list of items (no groups) */
  items?: LayoutMenuItemData[];
  /** Grouped items (sections with labels); takes precedence over items */
  groups?: LayoutMenuGroupData[];
  /** Search is shown when searchable is true */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Id of the currently selected/active item (e.g. current page). Item is styled and has aria-current. */
  activeItemId?: string | null;
  /** Class applied to every menu item row. Use to customize hover/focus, e.g. "hover:bg-primary/10 focus-visible:ring-primary". */
  menuItemClassName?: string;
  /** Class applied to the active (selected) item. Use to customize active state, e.g. "bg-primary text-primary-foreground". */
  activeItemClassName?: string;
  /** Called when any menu item row is clicked (parent or leaf). Parent click still toggles expand. */
  onItemClick?: (item: LayoutMenuItemData) => void;
  /** Custom render for each item */
  renderItem?: (item: LayoutMenuItemData, depth: number) => ReactNode;
  /** Custom render for group header */
  renderGroupLabel?: (group: LayoutMenuGroupData) => ReactNode;
  className?: string;
}

export const LayoutMenu = forwardRef<HTMLDivElement, LayoutMenuProps>(
  (
    {
      items = [],
      groups,
      searchable = true,
      searchPlaceholder,
      activeItemId,
      menuItemClassName,
      activeItemClassName,
      onItemClick,
      renderItem,
      renderGroupLabel,
      className,
      ...props
    },
    ref
  ) => {
    const [search, setSearch] = useState("");
    const menuContainerRef = useRef<HTMLDivElement>(null);
    const layout = useLayoutSafe();
    const collapsed = layout ? !layout.sidebarOpen : false;
    const isLeft = layout?.sidebarPosition === "left";

    const filteredItems = useMemo(
      () => (items ? filterMenuItems(items, search) : []),
      [items, search]
    );
    const filteredGroups = useMemo(
      () => (groups ? filterGroups(groups, search) : []),
      [groups, search]
    );

    const handleMenuKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.getAttribute("role") !== "menuitem") return;
        const container = menuContainerRef.current;
        if (!container) return;

        const items = Array.from(
          container.querySelectorAll<HTMLElement>('[role="menuitem"]')
        );
        const currentIndex = items.indexOf(target);
        if (currentIndex === -1) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (currentIndex < items.length - 1) {
              items[currentIndex + 1].focus();
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (currentIndex > 0) {
              items[currentIndex - 1].focus();
            }
            break;
          case "ArrowRight": {
            e.preventDefault();
            const hasPopup = target.getAttribute("aria-haspopup") === "true";
            const expanded = target.getAttribute("aria-expanded") === "true";
            if (hasPopup && !expanded) {
              (target as HTMLButtonElement).click();
              setTimeout(() => {
                const submenu =
                  target.nextElementSibling?.querySelector<HTMLElement>(
                    '[role="menuitem"]'
                  );
                submenu?.focus();
              }, 0);
            } else if (hasPopup && expanded) {
              const firstChild =
                target.nextElementSibling?.querySelector<HTMLElement>(
                  '[role="menuitem"]'
                );
              firstChild?.focus();
            }
            break;
          }
          case "ArrowLeft": {
            e.preventDefault();
            const currentUl = target.closest('ul[role="menu"]');
            const parentLi = currentUl?.parentElement;
            if (parentLi) {
              const parentMenuitem = parentLi.querySelector<HTMLElement>(
                '[role="menuitem"]'
              );
              if (parentMenuitem && parentMenuitem !== target) {
                parentMenuitem.focus();
                const parentExpanded =
                  parentMenuitem.getAttribute("aria-expanded") === "true";
                if (parentExpanded) {
                  (parentMenuitem as HTMLButtonElement).click();
                }
              }
            }
            break;
          }
          case "Home":
            e.preventDefault();
            items[0]?.focus();
            break;
          case "End":
            e.preventDefault();
            items[items.length - 1]?.focus();
            break;
          default:
            break;
        }
      },
      []
    );

    return (
      <div
        ref={ref}
        data-slot="layout-menu"
        className={cn(
          "flex flex-1 flex-col",
          collapsed ? "overflow-visible" : "overflow-hidden",
          className
        )}
        {...props}
      >
        {searchable && !collapsed && (
          <LayoutMenuSearch
            value={search}
            onChange={setSearch}
            placeholder={searchPlaceholder}
          />
        )}
        <div
          ref={menuContainerRef}
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            collapsed && "overflow-visible"
          )}
          role="group"
          aria-label="Navigation menu"
          onKeyDown={handleMenuKeyDown}
        >
          {filteredGroups.length > 0
            ? filteredGroups.map((group) => (
                <LayoutMenuGroup
                  key={group.id}
                  group={group}
                  collapsed={collapsed}
                  isLeft={isLeft}
                  activeItemId={activeItemId}
                  menuItemClassName={menuItemClassName}
                  activeItemClassName={activeItemClassName}
                  onItemClick={onItemClick}
                  renderItem={renderItem}
                  renderGroupLabel={renderGroupLabel}
                />
              ))
            : filteredItems.length > 0 && (
                <LayoutMenuItemList
                  items={filteredItems}
                  depth={0}
                  collapsed={collapsed}
                  isLeft={isLeft}
                  activeItemId={activeItemId}
                  menuItemClassName={menuItemClassName}
                  activeItemClassName={activeItemClassName}
                  onItemClick={onItemClick}
                  renderItem={renderItem}
                />
              )}
          {filteredGroups.length === 0 &&
            filteredItems.length === 0 &&
            search.trim() && (
              <div className="text-muted-foreground px-3 py-6 text-center text-sm">
                No results for &quot;{search}&quot;
              </div>
            )}
        </div>
      </div>
    );
  }
);

LayoutMenu.displayName = "LayoutMenu";

/* ============================================
   LayoutMenuGroup
   ============================================ */

interface LayoutMenuGroupInternalProps {
  group: LayoutMenuGroupData;
  collapsed?: boolean;
  isLeft?: boolean;
  activeItemId?: string | null;
  menuItemClassName?: string;
  activeItemClassName?: string;
  onItemClick?: (item: LayoutMenuItemData) => void;
  renderItem?: (item: LayoutMenuItemData, depth: number) => ReactNode;
  renderGroupLabel?: (group: LayoutMenuGroupData) => ReactNode;
}

function LayoutMenuGroup({
  group,
  collapsed,
  isLeft,
  activeItemId,
  menuItemClassName,
  activeItemClassName,
  onItemClick,
  renderItem,
  renderGroupLabel,
}: LayoutMenuGroupInternalProps) {
  return (
    <div data-slot="layout-menu-group" className={cn("py-1", group.className)}>
      {!collapsed && (
        <div
          data-slot="layout-menu-group-label"
          className="text-muted-foreground flex flex-col gap-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider"
        >
          {renderGroupLabel ? (
            renderGroupLabel(group)
          ) : (
            <>
              <span>{group.label}</span>
              {group.secondaryLabel && (
                <span className="text-muted-foreground/80 text-[10px] font-normal normal-case">
                  {group.secondaryLabel}
                </span>
              )}
            </>
          )}
        </div>
      )}
      {collapsed && (
        <div className="mx-auto my-1 h-px w-6 bg-border" />
      )}
      <LayoutMenuItemList
        items={group.items}
        depth={0}
        collapsed={collapsed}
        isLeft={isLeft}
        activeItemId={activeItemId}
        menuItemClassName={menuItemClassName}
        activeItemClassName={activeItemClassName}
        onItemClick={onItemClick}
        renderItem={renderItem}
      />
    </div>
  );
}

/* ============================================
   LayoutMenuItemList (recursive)
   ============================================ */

interface LayoutMenuItemListProps {
  items: LayoutMenuItemData[];
  depth: number;
  collapsed?: boolean;
  isLeft?: boolean;
  activeItemId?: string | null;
  menuItemClassName?: string;
  activeItemClassName?: string;
  onItemClick?: (item: LayoutMenuItemData) => void;
  renderItem?: (item: LayoutMenuItemData, depth: number) => ReactNode;
}

function LayoutMenuItemList({
  items,
  depth,
  collapsed,
  isLeft,
  activeItemId,
  menuItemClassName,
  activeItemClassName,
  onItemClick,
  renderItem,
}: LayoutMenuItemListProps) {
  return (
    <ul className="list-none px-1 py-0.5" role="menu">
      {items.map((item) => (
        <LayoutMenuItemNode
          key={item.id}
          item={item}
          depth={depth}
          collapsed={collapsed}
          isLeft={isLeft}
          activeItemId={activeItemId}
          menuItemClassName={menuItemClassName}
          activeItemClassName={activeItemClassName}
          onItemClick={onItemClick}
          renderItem={renderItem}
        />
      ))}
    </ul>
  );
}

/* ============================================
   LayoutMenuItemNode (single item or expandable parent)
   ============================================ */

interface LayoutMenuItemNodeProps {
  item: LayoutMenuItemData;
  depth: number;
  collapsed?: boolean;
  isLeft?: boolean;
  activeItemId?: string | null;
  menuItemClassName?: string;
  activeItemClassName?: string;
  onItemClick?: (item: LayoutMenuItemData) => void;
  renderItem?: (item: LayoutMenuItemData, depth: number) => ReactNode;
}

/**
 * Check if any descendant of an item matches the active ID.
 * Used to auto-expand parent items that contain the active selection.
 */
function hasActiveDescendant(
  item: LayoutMenuItemData,
  activeId: string | null | undefined
): boolean {
  if (!activeId || !item.children) return false;
  return item.children.some(
    (child) =>
      child.id === activeId || hasActiveDescendant(child, activeId)
  );
}

function LayoutMenuItemNode({
  item,
  depth,
  collapsed,
  isLeft,
  activeItemId,
  menuItemClassName,
  activeItemClassName,
  onItemClick,
  renderItem,
}: LayoutMenuItemNodeProps) {
  const containsActive = useMemo(
    () => hasActiveDescendant(item, activeItemId),
    [item, activeItemId]
  );
  const [open, setOpen] = useState(containsActive);
  const hasChildren = item.children && item.children.length > 0;

  // Auto-expand when a descendant becomes active (e.g. programmatic navigation)
  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  const handleToggle = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (hasChildren) {
          setOpen((o) => !o);
          onItemClick?.(item);
        } else {
          item.onClick?.();
          onItemClick?.(item);
        }
      }
      // ArrowRight / ArrowLeft are handled by the menu container for focus movement
    },
    [hasChildren, item, onItemClick]
  );

  const isActive = activeItemId != null && item.id === activeItemId;

  // Collapsed mode: only show top-level items (depth 0) with icon-only
  // Items with children get a hover flyout showing submenu (WordPress-style)
  // Items without children are just clickable icons
  if (collapsed && depth === 0) {
    return (
      <li
        data-slot="layout-menu-item"
        data-depth={depth}
        data-testid={item.testId}
        className={cn("relative rounded-md", hasChildren && "group/flyout")}
        role="none"
      >
        <CollapsedMenuItemIcon
          item={item}
          isActive={isActive}
          menuItemClassName={menuItemClassName}
          activeItemClassName={activeItemClassName}
          onItemClick={onItemClick}
        />
        {/* Flyout panel on hover — only for items with children */}
        {hasChildren && (
          <div
            className={cn(
              "pointer-events-none invisible absolute top-0 z-50 min-w-44 opacity-0 transition-[opacity,visibility] duration-150",
              "group-hover/flyout:pointer-events-auto group-hover/flyout:visible group-hover/flyout:opacity-100",
              isLeft ? "left-full ml-1" : "right-full mr-1"
            )}
          >
            <div className="rounded-md border border-border bg-popover py-1 shadow-lg">
              {/* Parent label as flyout header */}
              <div className="px-3 py-1.5 text-sm font-medium">
                {item.label}
              </div>
              {/* Submenu items */}
              <div className="border-t border-border">
                <FlyoutMenuItemList
                  items={item.children!}
                  onItemClick={onItemClick}
                  menuItemClassName={menuItemClassName}
                  activeItemClassName={activeItemClassName}
                  activeItemId={activeItemId}
                />
              </div>
            </div>
          </div>
        )}
      </li>
    );
  }

  // Collapsed mode: hide nested items (they appear in flyout)
  if (collapsed && depth > 0) {
    return null;
  }

  const content = renderItem ? (
    renderItem(item, depth)
  ) : (
    <LayoutMenuItemRow
      item={item}
      depth={depth}
      hasChildren={hasChildren}
      open={open}
      isActive={isActive}
      menuItemClassName={menuItemClassName}
      activeItemClassName={activeItemClassName}
      onToggle={handleToggle}
      onItemClick={onItemClick}
      onKeyDown={handleKeyDown}
    />
  );

  return (
    <li
      data-slot="layout-menu-item"
      data-depth={depth}
      data-testid={item.testId}
      className="rounded-md"
      role="none"
    >
      {content}
      {hasChildren && open && (
        <LayoutMenuItemList
          items={item.children!}
          depth={depth + 1}
          activeItemId={activeItemId}
          menuItemClassName={menuItemClassName}
          activeItemClassName={activeItemClassName}
          onItemClick={onItemClick}
          renderItem={renderItem}
        />
      )}
    </li>
  );
}

/* ============================================
   CollapsedMenuItemIcon (icon-only button for collapsed rail)
   ============================================ */

interface CollapsedMenuItemIconProps {
  item: LayoutMenuItemData;
  isActive: boolean;
  menuItemClassName?: string;
  activeItemClassName?: string;
  onItemClick?: (item: LayoutMenuItemData) => void;
}

function CollapsedMenuItemIcon({
  item,
  isActive,
  menuItemClassName,
  activeItemClassName,
  onItemClick,
}: CollapsedMenuItemIconProps) {
  const handleClick = useCallback(() => {
    item.onClick?.();
    onItemClick?.(item);
  }, [item, onItemClick]);

  const Comp = item.href ? "a" : "button";
  const compProps =
    item.href
      ? {
          href: item.href,
          onClick: () => onItemClick?.(item),
        }
      : {
          type: "button" as const,
          onClick: handleClick,
        };

  return (
    <Comp
      role="menuitem"
      tabIndex={0}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      data-active={isActive || undefined}
      className={cn(
        "flex w-full cursor-pointer items-center justify-center rounded-md p-2 text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        menuItemClassName,
        isActive && "bg-accent text-accent-foreground font-medium",
        isActive && activeItemClassName,
        item.className
      )}
      disabled={item.disabled}
      {...compProps}
    >
      {item.icon ? (
        <span className="flex shrink-0 [&_svg]:size-4">{item.icon}</span>
      ) : (
        <span className="flex size-4 items-center justify-center text-xs font-medium">
          {item.label.charAt(0).toUpperCase()}
        </span>
      )}
    </Comp>
  );
}

/* ============================================
   FlyoutMenuItemList (flat list inside flyout panel)
   ============================================ */

interface FlyoutMenuItemListProps {
  items: LayoutMenuItemData[];
  onItemClick?: (item: LayoutMenuItemData) => void;
  menuItemClassName?: string;
  activeItemClassName?: string;
  activeItemId?: string | null;
}

function FlyoutMenuItemList({
  items,
  onItemClick,
  menuItemClassName,
  activeItemClassName,
  activeItemId,
}: FlyoutMenuItemListProps) {
  return (
    <ul className="list-none py-1" role="menu">
      {items.map((item) => (
        <FlyoutMenuItem
          key={item.id}
          item={item}
          onItemClick={onItemClick}
          menuItemClassName={menuItemClassName}
          activeItemClassName={activeItemClassName}
          activeItemId={activeItemId}
        />
      ))}
    </ul>
  );
}

interface FlyoutMenuItemProps {
  item: LayoutMenuItemData;
  onItemClick?: (item: LayoutMenuItemData) => void;
  menuItemClassName?: string;
  activeItemClassName?: string;
  activeItemId?: string | null;
}

function FlyoutMenuItem({
  item,
  onItemClick,
  menuItemClassName,
  activeItemClassName,
  activeItemId,
}: FlyoutMenuItemProps) {
  const isActive = activeItemId != null && item.id === activeItemId;
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = useCallback(() => {
    item.onClick?.();
    onItemClick?.(item);
  }, [item, onItemClick]);

  const Comp = item.href ? "a" : "button";
  const compProps =
    item.href
      ? {
          href: item.href,
          onClick: () => onItemClick?.(item),
        }
      : {
          type: "button" as const,
          onClick: handleClick,
        };

  return (
    <li role="none">
      <Comp
        role="menuitem"
        tabIndex={0}
        aria-current={isActive ? "page" : undefined}
        data-active={isActive || undefined}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:bg-accent focus:text-accent-foreground",
          menuItemClassName,
          isActive && "bg-accent text-accent-foreground font-medium",
          isActive && activeItemClassName,
          item.className
        )}
        disabled={item.disabled}
        {...compProps}
      >
        {item.icon && (
          <span className="flex shrink-0 [&_svg]:size-4">{item.icon}</span>
        )}
        <span className="truncate">{item.label}</span>
      </Comp>
      {hasChildren && (
        <FlyoutMenuItemList
          items={item.children!}
          onItemClick={onItemClick}
          menuItemClassName={menuItemClassName}
          activeItemClassName={activeItemClassName}
          activeItemId={activeItemId}
        />
      )}
    </li>
  );
}

/* ============================================
   LayoutMenuItemRow (default row: icon, labels, chevron)
   ============================================ */

interface LayoutMenuItemRowProps {
  item: LayoutMenuItemData;
  depth: number;
  hasChildren: boolean;
  open: boolean;
  isActive: boolean;
  menuItemClassName?: string;
  activeItemClassName?: string;
  onToggle: () => void;
  onItemClick?: (item: LayoutMenuItemData) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

function LayoutMenuItemRow({
  item,
  depth,
  hasChildren,
  open,
  isActive,
  menuItemClassName,
  activeItemClassName,
  onToggle,
  onItemClick,
  onKeyDown,
}: LayoutMenuItemRowProps) {
  const paddingLeft = 12 + depth * 12;

  const handleRowClick = useCallback(() => {
    if (hasChildren) {
      onToggle();
    } else {
      item.onClick?.();
    }
    onItemClick?.(item);
  }, [hasChildren, onToggle, item, onItemClick]);

  const Comp = item.href && !hasChildren ? "a" : "button";
  const compProps =
    item.href && !hasChildren
      ? {
          href: item.href,
          onClick: () => onItemClick?.(item),
        }
      : {
          type: "button" as const,
          onClick: handleRowClick,
        };

  return (
    <Comp
      role="menuitem"
      tabIndex={0}
      aria-haspopup={hasChildren ? "menu" : undefined}
      aria-expanded={hasChildren ? open : undefined}
      aria-current={isActive ? "page" : undefined}
      onKeyDown={onKeyDown}
      data-active={isActive || undefined}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        menuItemClassName,
        isActive && "bg-accent text-accent-foreground font-medium",
        isActive && activeItemClassName,
        item.className
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      disabled={item.disabled}
      {...compProps}
    >
      {item.icon && (
        <span className="flex shrink-0 [&_svg]:size-4">{item.icon}</span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{item.label}</span>
        {item.secondaryLabel && (
          <span
            className={cn(
              "block truncate text-xs",
              isActive ? "opacity-90" : "text-muted-foreground"
            )}
          >
            {item.secondaryLabel}
          </span>
        )}
      </span>
      {hasChildren && (
        <span className="shrink-0 [&_svg]:size-4" aria-hidden>
          {open ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </span>
      )}
    </Comp>
  );
}
