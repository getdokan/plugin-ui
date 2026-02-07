# DataViews Component

A powerful data table component built on top of WordPress DataViews with responsive layouts, filtering, tabs, pagination, and bulk actions support.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import {
  DataViews,
  type DataViewAction,
  type DataViewField,
  type DataViewLayouts,
  type DataViewState,
  type DataViewFilterField,
  type DataViewFilterProps
} from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
import { useState } from 'react';
import { DataViews, type DataViewState, type DataViewField } from "@wedevs/plugin-ui";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
];

const fields: DataViewField<User>[] = [
  {
    id: 'name',
    label: 'Name',
    render: ({ item }) => <span>{item.name}</span>,
  },
  {
    id: 'email',
    label: 'Email',
    render: ({ item }) => <span>{item.email}</span>,
  },
  {
    id: 'status',
    label: 'Status',
    render: ({ item }) => <span>{item.status}</span>,
  },
];

function MyTable() {
  const [view, setView] = useState<DataViewState>({
    type: 'table',
    page: 1,
    perPage: 10,
    sort: {},
    filters: [],
    search: '',
    fields: ['name', 'email', 'status'],
  });

  return (
    <DataViews<User>
      data={users}
      fields={fields}
      view={view}
      onChangeView={setView}
      paginationInfo={{
        totalItems: users.length,
        totalPages: 1,
      }}
    />
  );
}
```

## Props

### DataViews Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `Item[]` | required | Array of data items to display |
| `fields` | `DataViewField<Item>[]` | required | Field definitions for columns |
| `view` | `DataViewState` | required | Current view state (pagination, sorting, filters) |
| `onChangeView` | `(view: DataViewState) => void` | required | Callback when view state changes |
| `paginationInfo` | `{ totalItems: number; totalPages: number }` | required | Pagination information |
| `actions` | `DataViewAction<Item>[]` | `[]` | Row actions (edit, delete, etc.) |
| `selection` | `string[]` | `[]` | Array of selected item IDs |
| `onChangeSelection` | `(items: string[]) => void` | - | Callback when selection changes |
| `search` | `boolean` | `true` | Enable/disable search |
| `searchLabel` | `string` | - | Placeholder text for search input |
| `isLoading` | `boolean` | `false` | Show loading state |
| `responsive` | `boolean` | `true` | Auto-switch to list view on mobile |
| `getItemId` | `(item: Item) => string` | - | Function to get unique ID from item |
| `onClickItem` | `(item: Item) => void` | - | Callback when row is clicked |
| `isItemClickable` | `(item: Item) => boolean` | - | Determine if row is clickable |
| `empty` | `JSX.Element` | - | Custom empty state component |
| `emptyIcon` | `JSX.Element` | - | Icon for empty state |
| `emptyTitle` | `string` | `"No data found"` | Title for empty state |
| `emptyDescription` | `string` | - | Description for empty state |
| `header` | `JSX.Element` | - | Custom header component |
| `tabs` | `TabsProps` | - | Tab configuration |
| `filter` | `DataViewFilterProps` | - | Filter configuration |
| `defaultLayouts` | `DataViewLayouts` | `{ table: { density: 'comfortable' }, list: {} }` | Layout configuration |

### DataViewField Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique field identifier |
| `label` | `string` | Column header label |
| `render` | `({ item }) => ReactNode` | Render function for cell content |
| `getValue` | `({ item }) => any` | Get raw value (for sorting/filtering) |
| `enableSorting` | `boolean` | Enable column sorting (default: false) |
| `enableHiding` | `boolean` | Allow column to be hidden (default: false) |

### DataViewAction Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique action identifier |
| `label` | `string` | Action button label |
| `icon` | `ReactNode` | Action icon |
| `callback` | `(items: Item[]) => void` | Action callback function |
| `isPrimary` | `boolean` | Show as primary action |
| `isDestructive` | `boolean` | Style as destructive action |
| `isEligible` | `(item: Item) => boolean` | Determine if action is available |
| `supportsBulk` | `boolean` | Enable for bulk selection |

## With Actions

```tsx
import { Pencil, Trash2, Eye } from 'lucide-react';

const actions: DataViewAction<User>[] = [
  {
    id: 'view',
    label: 'View',
    icon: <Eye size={16} />,
    callback: (items) => {
      console.log('View:', items[0]);
    },
  },
  {
    id: 'edit',
    label: 'Edit',
    icon: <Pencil size={16} />,
    isPrimary: true,
    callback: (items) => {
      console.log('Edit:', items[0]);
    },
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2 size={16} />,
    isDestructive: true,
    callback: (items) => {
      console.log('Delete:', items);
    },
    supportsBulk: true,
  },
];

<DataViews<User>
  data={users}
  fields={fields}
  view={view}
  onChangeView={setView}
  actions={actions}
  paginationInfo={{
    totalItems: users.length,
    totalPages: 1,
  }}
/>
```

## With Selection (Bulk Actions)

```tsx
function TableWithSelection() {
  const [view, setView] = useState<DataViewState>({
    type: 'table',
    page: 1,
    perPage: 10,
    sort: {},
    filters: [],
    search: '',
    fields: ['name', 'email', 'status'],
  });

  const [selection, setSelection] = useState<string[]>([]);

  const bulkActions: DataViewAction<User>[] = [
    {
      id: 'bulk-delete',
      label: 'Delete Selected',
      icon: <Trash2 size={16} />,
      isDestructive: true,
      supportsBulk: true,
      callback: (items) => {
        console.log('Delete items:', items);
        setSelection([]);
      },
    },
    {
      id: 'bulk-export',
      label: 'Export Selected',
      supportsBulk: true,
      callback: (items) => {
        console.log('Export items:', items);
      },
    },
  ];

  return (
    <DataViews
      data={users}
      fields={fields}
      view={view}
      onChangeView={setView}
      actions={bulkActions}
      selection={selection}
      onChangeSelection={setSelection}
      paginationInfo={{
        totalItems: users.length,
        totalPages: 1,
      }}
    />
  );
}
```

## With Tabs

```tsx
import { Users, UserCheck, UserX } from 'lucide-react';

function TableWithTabs() {
  const [view, setView] = useState<DataViewState>({
    type: 'table',
    page: 1,
    perPage: 10,
    sort: {},
    filters: [],
    search: '',
    fields: ['name', 'email', 'status'],
  });

  const [activeTab, setActiveTab] = useState('all');
  const [filteredData, setFilteredData] = useState(users);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'all') {
      setFilteredData(users);
    } else {
      setFilteredData(users.filter(user => user.status === tab));
    }
  };

  return (
    <DataViews
      data={filteredData}
      fields={fields}
      view={view}
      onChangeView={setView}
      paginationInfo={{
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / view.perPage),
      }}
      tabs={{
        tabs: [
          { label: 'All Users', value: 'all', icon: Users },
          { label: 'Active', value: 'active', icon: UserCheck },
          { label: 'Inactive', value: 'inactive', icon: UserX },
        ],
        initialTab: 'all',
        onSelect: handleTabChange,
      }}
    />
  );
}
```

## With Tabs and Header Slot

```tsx
import { Button } from "@wedevs/plugin-ui";
import { Plus, Download } from 'lucide-react';

<DataViews
  data={users}
  fields={fields}
  view={view}
  onChangeView={setView}
  paginationInfo={{
    totalItems: users.length,
    totalPages: 1,
  }}
  tabs={{
    tabs: [
      { label: 'All', value: 'all' },
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
    ],
    initialTab: 'all',
    onSelect: (tab) => console.log('Tab selected:', tab),
    headerSlot: [
      <Button key="export" variant="outline" size="sm">
        <Download size={16} className="mr-2" />
        Export
      </Button>,
      <Button key="add" size="sm">
        <Plus size={16} className="mr-2" />
        Add User
      </Button>,
    ],
  }}
/>
```

## With Filters

```tsx
import { Input, Select } from "@wedevs/plugin-ui";
import { type DataViewFilterField } from "@wedevs/plugin-ui";

function TableWithFilters() {
  const [view, setView] = useState<DataViewState>({
    type: 'table',
    page: 1,
    perPage: 10,
    sort: {},
    filters: [],
    search: '',
    fields: ['name', 'email', 'status'],
  });

  const [nameFilter, setNameFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filterFields: DataViewFilterField[] = [
    {
      id: 'name',
      label: 'Name',
      field: (
        <Input
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      ),
    },
    {
      id: 'status',
      label: 'Status',
      field: (
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      ),
    },
  ];

  const handleFilterReset = () => {
    setNameFilter('');
    setStatusFilter('');
  };

  const handleFilterRemove = (filterId: string) => {
    if (filterId === 'name') setNameFilter('');
    if (filterId === 'status') setStatusFilter('');
  };

  return (
    <DataViews
      data={users}
      fields={fields}
      view={view}
      onChangeView={setView}
      paginationInfo={{
        totalItems: users.length,
        totalPages: 1,
      }}
      tabs={{
        tabs: [
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
        ],
        initialTab: 'all',
        onSelect: () => {},
      }}
      filter={{
        fields: filterFields,
        onReset: handleFilterReset,
        onFilterRemove: handleFilterRemove,
        labels: {
          addFilter: 'Add Filter',
          removeFilter: 'Remove filter',
          reset: 'Reset',
        },
      }}
    />
  );
}
```

## Custom Empty State

```tsx
import { FileSearch, Inbox } from 'lucide-react';

// Using props
<DataViews
  data={[]}
  fields={fields}
  view={view}
  onChangeView={setView}
  paginationInfo={{
    totalItems: 0,
    totalPages: 0,
  }}
  emptyIcon={<Inbox size={52} />}
  emptyTitle="No users found"
  emptyDescription="Try adjusting your search or filters to find what you're looking for."
/>

// Using custom component
<DataViews
  data={[]}
  fields={fields}
  view={view}
  onChangeView={setView}
  paginationInfo={{
    totalItems: 0,
    totalPages: 0,
  }}
  empty={
    <div className="text-center py-20">
      <FileSearch className="mx-auto h-16 w-16 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No results</h3>
      <p className="text-muted-foreground">Create your first user to get started.</p>
      <Button className="mt-4">Add User</Button>
    </div>
  }
/>
```

## Clickable Rows

```tsx
<DataViews
  data={users}
  fields={fields}
  view={view}
  onChangeView={setView}
  paginationInfo={{
    totalItems: users.length,
    totalPages: 1,
  }}
  onClickItem={(item) => {
    console.log('Row clicked:', item);
    // Navigate to detail page
    window.location.href = `/users/${item.id}`;
  }}
  isItemClickable={(item) => item.status === 'active'}
/>
```

## Responsive Behavior

The component automatically switches from table to list view on mobile devices (< 768px width). You can disable this behavior:

```tsx
<DataViews
  data={users}
  fields={fields}
  view={view}
  onChangeView={setView}
  responsive={false}
  paginationInfo={{
    totalItems: users.length,
    totalPages: 1,
  }}
/>
```

## Server-Side Pagination

```tsx
import { useEffect, useState } from 'react';

function ServerPaginatedTable() {
  const [view, setView] = useState<DataViewState>({
    type: 'table',
    page: 1,
    perPage: 10,
    sort: {},
    filters: [],
    search: '',
    fields: ['name', 'email', 'status'],
  });

  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/users?page=${view.page}&perPage=${view.perPage}&search=${view.search}`
        );
        const result = await response.json();
        setData(result.data);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [view.page, view.perPage, view.search]);

  return (
    <DataViews
      data={data}
      fields={fields}
      view={view}
      onChangeView={setView}
      isLoading={isLoading}
      paginationInfo={{
        totalItems,
        totalPages,
      }}
    />
  );
}
```

## Complete Example

```tsx
import { useState, useEffect } from 'react';
import {
  DataViews,
  Button,
  Input,
  Badge,
  type DataViewState,
  type DataViewField,
  type DataViewAction,
  type DataViewFilterField,
} from "@wedevs/plugin-ui";
import { Pencil, Trash2, Eye, Plus, Download, Users, UserCheck, UserX } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
  createdAt: string;
}

const users: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', role: 'Admin', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'inactive', role: 'User', createdAt: '2024-02-20' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', status: 'pending', role: 'Editor', createdAt: '2024-03-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', status: 'active', role: 'User', createdAt: '2024-04-05' },
];

const statusColors = {
  active: 'success',
  inactive: 'secondary',
  pending: 'warning',
} as const;

function UsersTable() {
  const [view, setView] = useState<DataViewState>({
    type: 'table',
    page: 1,
    perPage: 10,
    sort: {},
    filters: [],
    search: '',
    fields: ['name', 'email', 'status', 'role', 'createdAt'],
  });

  const [selection, setSelection] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [nameFilter, setNameFilter] = useState('');
  const [filteredData, setFilteredData] = useState(users);

  // Filter data based on tab and name filter
  useEffect(() => {
    let result = users;
    
    if (activeTab !== 'all') {
      result = result.filter(user => user.status === activeTab);
    }
    
    if (nameFilter) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    setFilteredData(result);
  }, [activeTab, nameFilter]);

  const fields: DataViewField<User>[] = [
    {
      id: 'name',
      label: 'Name',
      render: ({ item }) => (
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.email}</div>
        </div>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      render: ({ item }) => <span>{item.email}</span>,
    },
    {
      id: 'status',
      label: 'Status',
      render: ({ item }) => (
        <Badge variant={statusColors[item.status]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Badge>
      ),
    },
    {
      id: 'role',
      label: 'Role',
      render: ({ item }) => <span>{item.role}</span>,
    },
    {
      id: 'createdAt',
      label: 'Created',
      render: ({ item }) => (
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  const actions: DataViewAction<User>[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: <Eye size={16} />,
      callback: (items) => {
        console.log('View user:', items[0]);
      },
    },
    {
      id: 'edit',
      label: 'Edit User',
      icon: <Pencil size={16} />,
      isPrimary: true,
      callback: (items) => {
        console.log('Edit user:', items[0]);
      },
    },
    {
      id: 'delete',
      label: 'Delete User',
      icon: <Trash2 size={16} />,
      isDestructive: true,
      supportsBulk: true,
      callback: (items) => {
        console.log('Delete users:', items);
        setSelection([]);
      },
    },
  ];

  const filterFields: DataViewFilterField[] = [
    {
      id: 'name',
      label: 'Name',
      field: (
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      ),
    },
  ];

  return (
    <DataViews
      data={filteredData}
      fields={fields}
      view={view}
      onChangeView={setView}
      actions={actions}
      selection={selection}
      onChangeSelection={setSelection}
      paginationInfo={{
        totalItems: filteredData.length,
        totalPages: Math.ceil(filteredData.length / view.perPage),
      }}
      emptyTitle="No users found"
      emptyDescription="Try adjusting your filters or add a new user."
      tabs={{
        tabs: [
          { label: 'All Users', value: 'all', icon: Users },
          { label: 'Active', value: 'active', icon: UserCheck },
          { label: 'Inactive', value: 'inactive', icon: UserX },
        ],
        initialTab: 'all',
        onSelect: setActiveTab,
        headerSlot: [
          <Button key="export" variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export
          </Button>,
          <Button key="add" size="sm">
            <Plus size={16} className="mr-2" />
            Add User
          </Button>,
        ],
      }}
      filter={{
        fields: filterFields,
        onReset: () => setNameFilter(''),
        onFilterRemove: () => setNameFilter(''),
        labels: {
          addFilter: 'Add Filter',
          removeFilter: 'Remove',
          reset: 'Reset All',
        },
      }}
      onClickItem={(item) => {
        console.log('Row clicked:', item);
      }}
    />
  );
}

export default UsersTable;
```

## Type Definitions

```tsx
// View state for controlling the DataView
interface DataViewState {
  type: 'table' | 'list';
  page: number;
  perPage: number;
  sort: {
    field?: string;
    direction?: 'asc' | 'desc';
  };
  filters: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  search: string;
  fields: string[];
}

// Field definition for columns
interface DataViewField<Item> {
  id: string;
  label: string;
  render: (props: { item: Item }) => React.ReactNode;
  getValue?: (props: { item: Item }) => any;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

// Action definition for row/bulk actions
interface DataViewAction<Item> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  callback: (items: Item[]) => void;
  isPrimary?: boolean;
  isDestructive?: boolean;
  isEligible?: (item: Item) => boolean;
  supportsBulk?: boolean;
}

// Filter field definition
interface DataViewFilterField {
  id: string;
  label: string;
  field: React.ReactNode;
}

// Filter props
interface DataViewFilterProps {
  fields: DataViewFilterField[];
  onFilterRemove?: (filterId: string) => void;
  onReset?: () => void;
  openOnMount?: boolean;
  openSelectorSignal?: number;
  onFirstFilterAdded?: () => void;
  onActiveFiltersChange?: (count: number) => void;
  buttonPopOverAnchor?: HTMLElement | null;
  className?: string;
  labels?: {
    removeFilter?: string;
    addFilter?: string;
    reset?: string;
  };
}

// Tab definition
interface Tab {
  label: string;
  value: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

// Tabs props
interface TabsProps {
  tabs: Tab[];
  onSelect?: (tabValue: string) => void;
  initialTab?: string;
  headerSlot?: React.ReactNode[];
  className?: string;
}
```

## Notes

- The component is built on WordPress DataViews and requires `@wordpress/dataviews` as a peer dependency
- Responsive behavior switches to list view on screens narrower than 768px
- Sorting and column hiding are disabled by default; enable them per-field if needed
- When using tabs with filters, a filter button is automatically added to the header slot
- The bulk action toolbar appears when items are selected
