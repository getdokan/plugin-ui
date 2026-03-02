import { cn } from "@/lib/utils";
import { ChevronRight, Search } from "lucide-react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Input } from "../ui/input";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  useSidebarOptional,
} from "../ui/sidebar";
import { Collapsible } from "@base-ui/react/collapsible";

/* ============================================
   Sidebar provider detection
   ============================================ */

/**
 * Wraps children in SidebarProvider if one isn't already present.
 * This allows LayoutMenu to be used standalone (e.g. in Settings sidebar).
 */
function EnsureSidebarProvider({ children }: { children: ReactNode }) {
  const sidebar = useSidebarOptional();
  if (sidebar) {
    return <>{children}</>;
  }
  return <SidebarProvider defaultOpen>{children}</SidebarProvider>;
}

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
  /** Class applied to every menu item row. */
  menuItemClassName?: string;
  /** Class applied to the active (selected) item. */
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
      searchable = false,
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

    const filteredItems = useMemo(
      () => (items ? filterMenuItems(items, search) : []),
      [items, search]
    );
    const filteredGroups = useMemo(
      () => (groups ? filterGroups(groups, search) : []),
      [groups, search]
    );

    return (
      <EnsureSidebarProvider>
      <SidebarContent
        ref={ref}
        data-slot="layout-menu"
        className={cn(className)}
        {...props}
      >
        {searchable && (
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupContent>
              <LayoutMenuSearch
                value={search}
                onChange={setSearch}
                placeholder={searchPlaceholder}
                className="p-0"
              />
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredGroups.length > 0
          ? filteredGroups.map((group) => (
              <SidebarGroup key={group.id} className={group.className}>
                <SidebarGroupLabel>
                  {renderGroupLabel ? (
                    renderGroupLabel(group)
                  ) : (
                    <>
                      <span>{group.label}</span>
                      {group.secondaryLabel && (
                        <span className="text-muted-foreground/80 ml-1 text-[10px] font-normal normal-case">
                          {group.secondaryLabel}
                        </span>
                      )}
                    </>
                  )}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <MenuItemRenderer
                        key={item.id}
                        item={item}
                        depth={0}
                        activeItemId={activeItemId}
                        menuItemClassName={menuItemClassName}
                        activeItemClassName={activeItemClassName}
                        onItemClick={onItemClick}
                        renderItem={renderItem}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))
          : filteredItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {filteredItems.map((item) => (
                      <MenuItemRenderer
                        key={item.id}
                        item={item}
                        depth={0}
                        activeItemId={activeItemId}
                        menuItemClassName={menuItemClassName}
                        activeItemClassName={activeItemClassName}
                        onItemClick={onItemClick}
                        renderItem={renderItem}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}

        {filteredGroups.length === 0 &&
          filteredItems.length === 0 &&
          search.trim() && (
            <div className="text-muted-foreground px-3 py-6 text-center text-sm">
              No results for &quot;{search}&quot;
            </div>
          )}
      </SidebarContent>
      </EnsureSidebarProvider>
    );
  }
);

LayoutMenu.displayName = "LayoutMenu";

/* ============================================
   MenuItemRenderer — recursive renderer for items
   ============================================ */

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

interface MenuItemRendererProps {
  item: LayoutMenuItemData;
  depth: number;
  activeItemId?: string | null;
  menuItemClassName?: string;
  activeItemClassName?: string;
  onItemClick?: (item: LayoutMenuItemData) => void;
  renderItem?: (item: LayoutMenuItemData, depth: number) => ReactNode;
}

function MenuItemRenderer({
  item,
  depth,
  activeItemId,
  menuItemClassName,
  activeItemClassName,
  onItemClick,
  renderItem,
}: MenuItemRendererProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeItemId != null && item.id === activeItemId;
  const containsActive = useMemo(
    () => hasActiveDescendant(item, activeItemId),
    [item, activeItemId]
  );
  const [open, setOpen] = useState(containsActive);

  // Auto-expand when a descendant becomes active
  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setOpen((o) => !o);
    } else {
      item.onClick?.();
    }
    onItemClick?.(item);
  }, [hasChildren, item, onItemClick]);

  // Custom render
  if (renderItem) {
    return (
      <SidebarMenuItem data-testid={item.testId}>
        {renderItem(item, depth)}
      </SidebarMenuItem>
    );
  }

  // Leaf item (no children) at depth 0
  if (!hasChildren && depth === 0) {
    const comp = item.href ? "a" : "button";
    return (
      <SidebarMenuItem data-testid={item.testId}>

        <SidebarMenuButton
          render={
            comp === "a"
              ? <a href={item.href} />
              : undefined
          }
          tooltip={item.label}
          isActive={isActive}
          onClick={handleClick}
          className={cn(
            menuItemClassName,
            isActive && activeItemClassName,
            item.className,
          )}
          data-active={isActive || undefined}
          disabled={item.disabled}
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

        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Parent item with children at depth 0
  if (hasChildren && depth === 0) {
    return (
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <SidebarMenuItem data-testid={item.testId}>
          <Collapsible.Trigger
            render={
              <SidebarMenuButton
                tooltip={item.label}
                isActive={isActive}
                onClick={() => onItemClick?.(item)}
                className={cn(
                  menuItemClassName,
                  isActive && activeItemClassName,
                  item.className,
                )}
                data-active={isActive || undefined}
                disabled={item.disabled}
              />
            }
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
            <ChevronRight
              className={cn(
                "ml-auto size-4 shrink-0 transition-transform duration-200",
                open && "rotate-90"
              )}
            />
          </Collapsible.Trigger>
          <Collapsible.Panel
            render={
              <SidebarMenuSub />
            }
          >
            {item.children!.map((child) => (
              <SubMenuItemRenderer
                key={child.id}
                item={child}
                depth={depth + 1}
                activeItemId={activeItemId}
                menuItemClassName={menuItemClassName}
                activeItemClassName={activeItemClassName}
                onItemClick={onItemClick}
                renderItem={renderItem}
              />
            ))}
          </Collapsible.Panel>
        </SidebarMenuItem>
      </Collapsible.Root>
    );
  }

  // Items at depth > 0 — rendered by SubMenuItemRenderer
  return null;
}

/* ============================================
   SubMenuItemRenderer — renders children inside SidebarMenuSub
   ============================================ */

function SubMenuItemRenderer({
  item,
  depth,
  activeItemId,
  menuItemClassName,
  activeItemClassName,
  onItemClick,
  renderItem,
}: MenuItemRendererProps) {
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeItemId != null && item.id === activeItemId;
  const containsActive = useMemo(
    () => hasActiveDescendant(item, activeItemId),
    [item, activeItemId]
  );
  const [open, setOpen] = useState(containsActive);

  useEffect(() => {
    if (containsActive) setOpen(true);
  }, [containsActive]);

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setOpen((o) => !o);
    } else {
      item.onClick?.();
    }
    onItemClick?.(item);
  }, [hasChildren, item, onItemClick]);

  if (renderItem) {
    return (
      <SidebarMenuSubItem data-testid={item.testId}>
        {renderItem(item, depth)}
      </SidebarMenuSubItem>
    );
  }

  // Leaf sub-item
  if (!hasChildren) {
    const comp = item.href ? "a" : "button";
    return (
      <SidebarMenuSubItem data-testid={item.testId}>
        <SidebarMenuSubButton
          render={
            comp === "a"
              ? <a href={item.href} />
              : <button type="button" />
          }
          isActive={isActive}
          onClick={handleClick}
          className={cn(
            menuItemClassName,
            isActive && activeItemClassName,
            item.className,
          )}
          data-active={isActive || undefined}
        >
          {item.icon && (
            <span className="flex shrink-0 [&_svg]:size-4">{item.icon}</span>
          )}
          <span className="truncate">{item.label}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  }

  // Nested parent sub-item
  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <SidebarMenuSubItem data-testid={item.testId}>
        <Collapsible.Trigger
          render={
            <SidebarMenuSubButton
              isActive={isActive}
              onClick={() => onItemClick?.(item)}
              className={cn(
                menuItemClassName,
                isActive && activeItemClassName,
                item.className,
              )}
              data-active={isActive || undefined}
            />
          }
        >
          {item.icon && (
            <span className="flex shrink-0 [&_svg]:size-4">{item.icon}</span>
          )}
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <ChevronRight
            className={cn(
              "ml-auto size-4 shrink-0 transition-transform duration-200",
              open && "rotate-90"
            )}
          />
        </Collapsible.Trigger>
        <Collapsible.Panel
          render={
            <SidebarMenuSub />
          }
        >
          {item.children!.map((child) => (
            <SubMenuItemRenderer
              key={child.id}
              item={child}
              depth={depth + 1}
              activeItemId={activeItemId}
              menuItemClassName={menuItemClassName}
              activeItemClassName={activeItemClassName}
              onItemClick={onItemClick}
              renderItem={renderItem}
            />
          ))}
        </Collapsible.Panel>
      </SidebarMenuSubItem>
    </Collapsible.Root>
  );
}
