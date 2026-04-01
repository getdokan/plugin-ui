import type { Meta, StoryFn } from "@storybook/react";
import { SlotFillProvider } from "@wordpress/components";
import { Archive, Ban, CheckCircle, Eye, Mail, Pencil, Trash2, UserCheck, Users, UserX } from "lucide-react";
import React, { useState } from "react";
import { Badge, Input } from "../ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { DataViews, type DataViewAction, type DataViewField, type DataViewFilterField, type DataViewState } from "./dataviews";

// Sample data type
interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  role: string;
  joinedAt: string;
}

// Generate sample data
const firstNames = [
  "James", "Emma", "Liam", "Olivia", "Noah", "Ava", "William", "Sophia",
  "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Charlotte", "Alexander",
  "Amelia", "Daniel", "Harper", "Matthew", "Evelyn", "Sebastian", "Aria",
  "Jack", "Chloe", "Owen",
];
const lastNames = [
  "Anderson", "Martinez", "Thompson", "Garcia", "Robinson", "Clark", "Lewis",
  "Walker", "Hall", "Young", "King", "Wright", "Lopez", "Hill", "Scott",
  "Green", "Adams", "Baker", "Nelson", "Carter", "Mitchell", "Perez",
  "Roberts", "Turner", "Phillips",
];

const generateUsers = (count: number): User[] => {
  const statuses: User["status"][] = ["active", "inactive", "pending"];
  const roles = ["Admin", "Editor", "Viewer", "Manager"];

  return Array.from({ length: count }, (_, i) => {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    return {
      id: `user-${i + 1}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      status: statuses[i % 3],
      role: roles[i % 4],
      joinedAt: new Date(2024, i % 12, (i % 28) + 1).toLocaleDateString(),
    };
  });
};

const allUsers = generateUsers(100);

// Field definitions
const fields: DataViewField<User>[] = [
  {
    id: "name",
    label: "Name",
    render: ({ item }) => (
      <div className="font-medium text-foreground">{item.name}</div>
    ),
    getValue: ({ item }) => item.name,
  },
  {
    id: "email",
    label: "Email",
    render: ({ item }) => (
      <span className="text-muted-foreground">{item.email}</span>
    ),
    getValue: ({ item }) => item.email,
  },
  {
    id: "status",
    label: "Status",
    render: ({ item }) => {
      const statusVariants = {
        active: "success",
        inactive: "secondary",
        pending: "warning",
      } as const;
      return (
        <Badge variant={statusVariants[item.status]}>
          {item.status.at(0)?.toUpperCase() + item.status.slice(1)}
        </Badge>
      );
    },
    getValue: ({ item }) => item.status,
  },
  {
    id: "role",
    label: "Role",
    render: ({ item }) => <span>{item.role}</span>,
    getValue: ({ item }) => item.role,
  },
  {
    id: "joinedAt",
    label: "Joined At",
    render: ({ item }) => (
      <span className="text-muted-foreground">{item.joinedAt}</span>
    ),
    getValue: ({ item }) => item.joinedAt,
  },
];

// Actions
const actions: DataViewAction<User>[] = [
  {
    id: "view",
    label: "View",
    icon: <Eye size={16} />,
    callback: (items) => {
      alert(`Viewing: ${items.map(i => i.name).join(", ")}`);
    },
  },
  {
    id: "edit",
    label: "Edit",
    icon: <Pencil size={16} />,
    callback: (items) => {
      alert(`Editing: ${items.map(i => i.name).join(", ")}`);
    },
  },
  {
    id: "delete",
    label: "Delete",
    icon: <Trash2 size={16} />,
    isDestructive: true,
    supportsBulk: true,
    callback: async (items) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert(`Deleted: ${items.map(i => i.name).join(", ")}`);
    },
  },
];

// Helper to create default view state
const createDefaultView = (fieldsToShow: string[] = ["name", "email", "status", "role"]): DataViewState => ({
  type: "table",
  page: 1,
  perPage: 10,
  fields: fieldsToShow,
});

// Helper to paginate data
const paginateData = (data: User[], view: DataViewState) => {
  const page = view.page ?? 1;
  const perPage = view.perPage ?? 10;
  return data.slice((page - 1) * perPage, page * perPage);
};

// Helper to calculate total pages
const getTotalPages = (totalItems: number, perPage: number = 10) => Math.ceil(totalItems / perPage);

const meta: Meta<typeof DataViews> = {
  title: "WordPress/DataViews",
  component: DataViews,
  decorators: [
    (Story) => (
      <SlotFillProvider>
        <Story />
      </SlotFillProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A powerful data table component built on top of WordPress DataViews with responsive layouts, filtering, tabs, pagination, and bulk actions support.

## Required prop: \`namespace\`

Every \`DataViews\` instance must receive a \`namespace\` string. It is used for:

- **Slots**: Renders \`{snake_namespace}_dataviews-before\` and \`{snake_namespace}_dataviews-after\` so host apps can inject content via \`Fill\`.
- **Filter hooks** (when \`wp.hooks\` exists): Table elements can be filtered with \`{snake_namespace}_dataviews_data\`, \`{snake_namespace}_dataviews_view\`, \`{snake_namespace}_dataviews_fields\`, \`{snake_namespace}_dataviews_actions\`, \`{snake_namespace}_dataviews_layouts\`.

## Features
- **Pagination**: Built-in pagination with customizable page size
- **Responsive**: Automatically switches to list view on mobile
- **Tabs**: Support for tabbed navigation
- **Filters**: Dynamic filter system with add/remove filters
- **Bulk Actions**: Select multiple items and perform bulk operations
- **Actions**: Row-level actions (view, edit, delete, etc.)
- **Empty State**: Customizable empty state display
- **Loading State**: Built-in loading indicator
- **Extensibility**: Before/after Slots and WordPress filter hooks (\`{namespace}_dataviews_*\`)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    namespace: {
      description: "Required. Used for Slots (before/after table) and WordPress filter hook names.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
  },
};

export default meta;

/** Basic DataViews table with pagination. Click through pages to see pagination in action. */
export const BasicWithPagination: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView(["name", "email", "status", "role", "joinedAt"]));

  const paginatedData = paginateData(allUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        paginationInfo={{
          totalItems: allUsers.length,
          totalPages: getTotalPages(allUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
BasicWithPagination.storyName = "Basic with Pagination";

/** DataViews with selection and bulk actions. Select items and use bulk delete. */
export const BulkActions: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [selection, setSelection] = useState<string[]>([]);

  const paginatedData = paginateData(allUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        selection={selection}
        onChangeSelection={setSelection}
        paginationInfo={{
          totalItems: allUsers.length,
          totalPages: getTotalPages(allUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
BulkActions.storyName = "Bulk Actions";

/** Destructive actions automatically show an AlertDialog confirmation before executing. Supports both single-row and bulk actions. */
export const DestructiveActions: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [selection, setSelection] = useState<string[]>([]);
  const [users, setUsers] = useState(allUsers);

  const paginatedData = paginateData(users, view);

  const destructiveActions: DataViewAction<User>[] = [
    {
      id: "view",
      label: "View",
      icon: <Eye size={16} />,
      callback: (items) => {
        alert(`Viewing: ${items.map(i => i.name).join(", ")}`);
      },
    },
    {
      id: "edit",
      label: "Edit",
      icon: <Pencil size={16} />,
      callback: (items) => {
        alert(`Editing: ${items.map(i => i.name).join(", ")}`);
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 size={16} />,
      isDestructive: true,
      supportsBulk: true,
      callback: async (items) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const ids = new Set(items.map(i => i.id));
        setUsers(prev => prev.filter(u => !ids.has(u.id)));
        setSelection([]);
      },
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Archive size={16} />,
      isDestructive: true,
      confirmTitle: "Archive Users",
      confirmMessage: "Archived users will be moved to the archive and can be restored later.",
      confirmButtonLabel: "Yes, Archive",
      cancelButtonLabel: "No, Keep",
      supportsBulk: true,
      callback: async (items) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert(`Archived: ${items.map(i => i.name).join(", ")}`);
      },
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={destructiveActions}
        selection={selection}
        onChangeSelection={setSelection}
        paginationInfo={{
          totalItems: users.length,
          totalPages: getTotalPages(users.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
DestructiveActions.storyName = "Destructive Actions";
DestructiveActions.parameters = {
  docs: {
    description: {
      story: `Actions with \`isDestructive: true\` automatically show an AlertDialog confirmation before executing. Async callbacks show a loading spinner on the confirm button until the promise resolves.

- **Delete** uses default confirmation (title = action label, message = generic warning)
- **Archive** uses custom \`confirmTitle\`, \`confirmMessage\`, \`confirmButtonLabel\`, and \`cancelButtonLabel\`

Both support bulk selection. Try selecting multiple rows and using the bulk toolbar. Both callbacks are async with a 1.5s delay to demonstrate the loading spinner.`,
    },
  },
};

/** DataViews with dynamic filters. Click "Add Filter" to add filters. */
export const TabAndFilters: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [activeTab, setActiveTab] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  let filteredUsers = activeTab === "all"
    ? allUsers
    : allUsers.filter(user => user.status === activeTab);

  if (nameFilter) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }

  if (statusFilter) {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }

  const paginatedData = paginateData(filteredUsers, view);

  const filterFields: DataViewFilterField[] = [
    {
      id: "name",
      label: "Name",
      field: (
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            setView(prev => ({ ...prev, page: 1 }));
          }}
          className="w-48"
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      field: (
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        tabs={{
          items: [
            { label: "All", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
          ],
          defaultValue: "all",
          onSelect: (value) => {
            setActiveTab(value);
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
        filter={{
          fields: filterFields,
          onReset: () => {
            setNameFilter("");
            setStatusFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
          onFilterRemove: (filterId) => {
            if (filterId === "name") setNameFilter("");
            if (filterId === "status") setStatusFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
      />
    </div>
  );
};
TabAndFilters.storyName = "Tab and Filters";

/** DataViews with tabs, search in header slot, and one filter (Status). */
export const SearchInHeaderSlot: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");

  const searchTerm = view.search ?? "";
  let filteredUsers = activeTab === "all"
    ? allUsers
    : allUsers.filter(user => user.status === activeTab);

  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (statusFilter) {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }

  const paginatedData = paginateData(filteredUsers, view);

  const filterFields: DataViewFilterField[] = [
    {
      id: "status",
      label: "Status",
      field: (
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        search
        searchPlaceholder="Search by name or email..."
        actions={actions}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        tabs={{
                items: [
            { label: "All", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
            { label: "Pending", value: "pending", icon: Archive },
          ],
          defaultValue: "all",
          onSelect: (value) => {
            setActiveTab(value);
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
        filter={{
          fields: filterFields,
          onReset: () => {
            setStatusFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
          onFilterRemove: (filterId) => {
            if (filterId === "status") {
              setStatusFilter("");
              setView(prev => ({ ...prev, page: 1 }));
            }
          },
        }}
      />
    </div>
  );
};
SearchInHeaderSlot.storyName = "Search in Header Slot";

/** DataViews showing empty state when no data is available. */
export const EmptyState: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={[]}
        fields={fields}
        view={view}
        onChangeView={setView}
        paginationInfo={{
          totalItems: 0,
          totalPages: 0,
        }}
        getItemId={(item) => item.id}
        emptyTitle="No users found"
        emptyDescription="Try adjusting your search or filter to find what you're looking for."
      />
    </div>
  );
};
EmptyState.storyName = "Empty State";

/** DataViews skeleton loading state. Skeleton rows match `view.perPage` and columns match the number of fields. Header (tabs, search) stays visible. */
export const Loading: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView(["name", "email", "status", "role", "joinedAt"]));

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={[]}
        fields={fields}
        view={view}
        onChangeView={setView}
        isLoading={true}
        paginationInfo={{
          totalItems: 0,
          totalPages: 0,
        }}
        getItemId={(item) => item.id}
        search
        searchPlaceholder="Search users..."
        tabs={{
          items: [
            { label: "All Users", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
          ],
          defaultValue: "all",
        }}
      />
    </div>
  );
};
Loading.storyName = "Loading State";

/** DataViews with search functionality enabled. */
export const SearchOnly: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView());

  const searchTerm = view.search ?? "";
  const filteredUsers = searchTerm
    ? allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUsers;

  const paginatedData = paginateData(filteredUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        search
        searchPlaceholder="Search by name or email..."
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};

SearchOnly.storyName = "Search Only";

/** DataViews with only filters and search — no tabs. Click "Add Filter" to add filters. */
export const FiltersOnly: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView(["name", "email", "status", "role", "joinedAt"]));
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  let filteredUsers = [...allUsers];

  // Apply search
  const searchTerm = view.search ?? "";
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (nameFilter) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }

  if (statusFilter) {
    filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
  }

  if (roleFilter) {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
  }

  const paginatedData = paginateData(filteredUsers, view);

  const filterFields: DataViewFilterField[] = [
    {
      id: "name",
      label: "Name",
      field: (
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            setView(prev => ({ ...prev, page: 1 }));
          }}
          className="w-48"
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      field: (
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "role",
      label: "Role",
      field: (
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Editor">Editor</SelectItem>
            <SelectItem value="Viewer">Viewer</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        filter={{
          fields: filterFields,
          onReset: () => {
            setNameFilter("");
            setStatusFilter("");
            setRoleFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
          onFilterRemove: (filterId) => {
            if (filterId === "name") setNameFilter("");
            if (filterId === "status") setStatusFilter("");
            if (filterId === "role") setRoleFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
      />
    </div>
  );
};
FiltersOnly.storyName = "Filters Only";

/** Complete example with all features: tabs, filters, search, selection, and pagination. */
export const FullFeatured: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView(["name", "email", "status", "role", "joinedAt"]));
  const [selection, setSelection] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Apply tab filter
  let filteredUsers = activeTab === "all"
    ? allUsers
    : allUsers.filter(user => user.status === activeTab);

  // Apply search
  const searchTerm = view.search ?? "";
  if (searchTerm) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply name filter
  if (nameFilter) {
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
  }

  // Apply role filter
  if (roleFilter) {
    filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
  }

  const paginatedData = paginateData(filteredUsers, view);

  const filterFields: DataViewFilterField[] = [
    {
      id: "name",
      label: "Name",
      field: (
        <Input
          placeholder="Filter by name..."
          value={nameFilter}
          onChange={(e) => {
            setNameFilter(e.target.value);
            setView(prev => ({ ...prev, page: 1 }));
          }}
          className="w-48"
        />
      ),
    },
    {
      id: "role",
      label: "Role",
      field: (
        <Select
          value={roleFilter}
          onValueChange={(value) => {
            setRoleFilter(value ?? "");
            setView(prev => ({ ...prev, page: 1 }));
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Editor">Editor</SelectItem>
            <SelectItem value="Viewer">Viewer</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        search
        searchPlaceholder="Search by name or email..."
        actions={actions}
        selection={selection}
        onChangeSelection={setSelection}
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
        tabs={{
          items: [
            { label: "All Users", value: "all", icon: Users },
            { label: "Active", value: "active", icon: UserCheck },
            { label: "Inactive", value: "inactive", icon: UserX },
            { label: "Pending", value: "pending", icon: Archive },
          ],
          defaultValue: "all",
          onSelect: (value) => {
            setActiveTab(value);
            setSelection([]);
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
        filter={{
          fields: filterFields,
          onReset: () => {
            setNameFilter("");
            setRoleFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
          onFilterRemove: (filterId) => {
            if (filterId === "name") setNameFilter("");
            if (filterId === "role") setRoleFilter("");
            setView(prev => ({ ...prev, page: 1 }));
          },
        }}
      />
    </div>
  );
};
FullFeatured.storyName = "Full Featured";

/**
 * Poster/hero style layout that displays items as large image cards
 * with overlaid text content.
 */
function PosterGrid({ items }: { items: User[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 py-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-300"
        >
          <div className="absolute bottom-0 left-0 right-0 pt-12 px-4 pb-4 bg-linear-to-t from-black/80 via-black/40 to-transparent text-white">
            <h3 className="mb-1 text-lg font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {item.name}
            </h3>
            <p className="mb-2 text-[13px] opacity-90 overflow-hidden text-ellipsis whitespace-nowrap">
              {item.email}
            </p>
            <div className="flex gap-1.5">
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 capitalize">
                {item.role}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/20 capitalize">
                {item.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Demonstrates a custom poster/hero layout using free composition.
 *
 * This story shows how to:
 * - Use `<DataViews>` as a context provider with custom children
 * - Render a completely custom layout (poster grid) instead of `<DataViews.Layout />`
 * - Still leverage DataViews sub-components for search and pagination
 */
export const LayoutCustomComponent: StoryFn = () => {
  const [view, setView] = useState<DataViewState>({
    type: "table",
    search: "",
    page: 1,
    perPage: 10,
    fields: ["name", "email", "status", "role"],
  });

  const searchTerm = view.search ?? "";
  const filteredUsers = searchTerm
    ? allUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allUsers;

  const paginatedData = paginateData(filteredUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        getItemId={(item) => item.id}
        namespace="dataviews-demo"
        paginationInfo={{
          totalItems: filteredUsers.length,
          totalPages: getTotalPages(filteredUsers.length, view.perPage),
        }}
        data={paginatedData}
        view={view}
        fields={fields}
        onChangeView={setView}
      >
        <div className="p-0.5">
          {DataViews.Search && <DataViews.Search />}
          <PosterGrid items={paginatedData} />
        </div>
        {DataViews.Pagination && (
          <div className="flex items-center justify-between [&>div]:w-full [&>div]:flex [&>div]:justify-between! [&>div]:p-4">
            <DataViews.Pagination />
          </div>
        )}
      </DataViews>
    </div>
  );
};
LayoutCustomComponent.storyName = "Custom Layout Component";

/** Demonstrates fixed and custom column widths using `view.layout.styles` with per-column `width`, `minWidth`, and `maxWidth`. */
export const FixedWidthColumns: StoryFn = () => {
  const [view, setView] = useState<DataViewState>({
    type: "table",
    page: 1,
    perPage: 10,
    fields: ["name", "email", "status", "role", "joinedAt"],
    layout: {
      styles: {
        name: { width: "20%" },
        email: { width: "30%" },
        status: { width: "12%", minWidth: "100px", maxWidth: "150px" },
        role: { width: "10%" },
        joinedAt: { width: "15%" },
      },
    },
  });

  const paginatedData = paginateData(allUsers, view);

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={actions}
        paginationInfo={{
          totalItems: allUsers.length,
          totalPages: getTotalPages(allUsers.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
FixedWidthColumns.storyName = "Fixed Width Columns";
/** Demonstrates how the bulk action toolbar handles many actions with long descriptive labels. Select rows to see the toolbar. */
export const LargeTextBulkActions: StoryFn = () => {
  const [view, setView] = useState<DataViewState>(createDefaultView(["name", "email", "status", "role", "joinedAt"]));
  const [selection, setSelection] = useState<string[]>([]);
  const [users, setUsers] = useState(allUsers);

  const paginatedData = paginateData(users, view);

  const bulkActions: DataViewAction<User>[] = [
    {
      id: "approve-selected",
      label: "Approve Selected Users",
      icon: <CheckCircle size={16} />,
      supportsBulk: true,
      callback: async (items) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert(`Approved: ${items.map(i => i.name).join(", ")}`);
      },
    },
    {
      id: "send-notification",
      label: "Send Email Notification",
      icon: <Mail size={16} />,
      supportsBulk: true,
      callback: async (items) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert(`Notification sent to: ${items.map(i => i.email).join(", ")}`);
      },
    },
    {
      id: "suspend-accounts",
      label: "Suspend User Accounts",
      icon: <Ban size={16} />,
      isDestructive: true,
      supportsBulk: true,
      confirmTitle: "Suspend User Accounts",
      confirmMessage: "Suspended users will lose access to their accounts immediately. You can reactivate them later.",
      confirmButtonLabel: "Yes, Suspend All",
      cancelButtonLabel: "Keep Active",
      callback: async (items) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert(`Suspended: ${items.map(i => i.name).join(", ")}`);
      },
    },
    {
      id: "archive-permanently",
      label: "Archive and Remove from List",
      icon: <Archive size={16} />,
      isDestructive: true,
      supportsBulk: true,
      confirmTitle: "Archive Users Permanently",
      confirmMessage: "Archived users will be removed from all active lists and moved to the archive storage.",
      confirmButtonLabel: "Archive Permanently",
      callback: async (items) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const ids = new Set(items.map(i => i.id));
        setUsers(prev => prev.filter(u => !ids.has(u.id)));
        setSelection([]);
      },
    },
    {
      id: "delete-permanently",
      label: "Delete Permanently from System",
      icon: <Trash2 size={16} />,
      isDestructive: true,
      supportsBulk: true,
      confirmTitle: "Permanently Delete Users",
      confirmMessage: "This will permanently delete the selected users and all associated data. This action cannot be undone.",
      confirmButtonLabel: "Delete Forever",
      callback: async (items) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const ids = new Set(items.map(i => i.id));
        setUsers(prev => prev.filter(u => !ids.has(u.id)));
        setSelection([]);
      },
    },
  ];

  return (
    <div className="p-4">
      <DataViews<User>
        namespace="dataviews-demo"
        data={paginatedData}
        fields={fields}
        view={view}
        onChangeView={setView}
        actions={bulkActions}
        selection={selection}
        onChangeSelection={setSelection}
        paginationInfo={{
          totalItems: users.length,
          totalPages: getTotalPages(users.length, view.perPage),
        }}
        getItemId={(item) => item.id}
      />
    </div>
  );
};
LargeTextBulkActions.storyName = "Large Text Bulk Actions";
LargeTextBulkActions.parameters = {
  docs: {
    description: {
      story: `Demonstrates 5 bulk actions with long, descriptive labels to test how the bulk action toolbar handles large text. Select one or more rows to see the toolbar appear.

- **Approve Selected Users** — non-destructive bulk approval
- **Send Email Notification** — non-destructive bulk email
- **Suspend User Accounts** — destructive with custom confirmation dialog
- **Archive and Remove from List** — destructive, removes items from list
- **Delete Permanently from System** — destructive, permanently removes items

All actions support bulk selection and have async callbacks with loading states.`,
    },
  },
};

FixedWidthColumns.parameters = {
  docs: {
    description: {
      story: `Column widths are controlled via \`view.layout.styles\`, keyed by field ID. Each entry accepts \`width\`, \`minWidth\`, and \`maxWidth\` as CSS string values.

- **Name**: \`width: "20%"\`
- **Email**: \`width: "30%"\`
- **Status**: \`width: "12%"\` with \`minWidth: "100px"\` and \`maxWidth: "150px"\`
- **Role**: \`width: "10%"\`
- **Joined At**: \`width: "15%"\`

Use string values like \`"30%"\`, \`"200px"\`, or \`"10em"\`.`,
    },
  },
};
