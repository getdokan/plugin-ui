import type { Meta, StoryFn } from "@storybook/react";
import { SlotFillProvider } from "@wordpress/components";
import { useState } from "react";
import {
  DataForm,
  useFormValidity,
  type DataFormSchema,
  type DataViewField,
} from "./../ui";
import { Button } from "../ui/button";

interface SamplePost {
  title: string;
  status: string;
  author: number;
  email: string;
  date: string;
  sticky: boolean;
  description: string;
  tags: string[];
  password?: string;
}

const fields: DataViewField<SamplePost>[] = [
  {
    id: "title",
    label: "Title",
    type: "text",
  },
  {
    id: "status",
    label: "Status",
    type: "text",
    Edit: "radio",
    elements: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
      { value: "private", label: "Private" },
    ],
  },
  {
    id: "author",
    label: "Author",
    type: "integer",
    elements: [
      { value: 1, label: "Jane" },
      { value: 2, label: "John" },
      { value: 3, label: "Alice" },
    ],
    setValue: ({ value }) => ({ author: Number(value) }),
  },
  {
    id: "email",
    label: "Email",
    type: "email",
  },
  {
    id: "date",
    label: "Date",
    type: "date",
  },
  {
    id: "sticky",
    label: "Sticky",
    type: "boolean",
    Edit: "toggle",
  },
  {
    id: "description",
    label: "Description",
    type: "text",
    Edit: "textarea",
  },
  {
    id: "tags",
    label: "Tags",
    type: "array",
    placeholder: "Enter comma-separated tags",
    elements: [
      { value: "astronomy", label: "Astronomy" },
      { value: "photography", label: "Photography" },
      { value: "travel", label: "Travel" },
    ],
  },
  {
    id: "password",
    label: "Password",
    type: "text",
    isVisible: (item: SamplePost) => item.status !== "private",
  },
];

const initialPost: SamplePost = {
  title: "Hello, World!",
  status: "draft",
  author: 1,
  email: "hello@wordpress.org",
  date: "2026-01-01",
  sticky: false,
  description: "This is a sample description.",
  tags: ["photography"],
};

const meta: Meta<typeof DataForm> = {
  title: "WordPress/DataForm",
  component: DataForm,
  decorators: [
    (Story) => (
      <SlotFillProvider>
        <div className="max-w-2xl p-4">
          <Story />
        </div>
      </SlotFillProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
A schema-driven form component re-exported from \`@wordpress/dataviews\`. Fields are described once and rendered through one of several \`Layout\` types (regular, panel, card, row, details), with validation supplied via the \`useFormValidity\` hook.

## Basic usage

\`\`\`tsx
import { DataForm, type DataViewField, type DataFormSchema } from "@wedevs/plugin-ui";

const fields: DataViewField<MyItem>[] = [/* ... */];
const form: DataFormSchema = { layout: { type: "regular" }, fields: ["title", "status"] };

<DataForm<MyItem>
  data={item}
  fields={fields}
  form={form}
  onChange={(edits) => setItem((prev) => ({ ...prev, ...edits }))}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;

/** Standard top-to-bottom form. The default layout for most edit screens. */
export const RegularLayout: StoryFn = () => {
  const [post, setPost] = useState<SamplePost>(initialPost);

  const form: DataFormSchema = {
    layout: { type: "regular", labelPosition: "top" },
    fields: ["title", "status", "author", "email", "date", "sticky", "description", "tags", "password"],
  };

  return (
    <DataForm<SamplePost>
      data={post}
      fields={fields}
      form={form}
      onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
    />
  );
};

/** Side-by-side label and field — useful for compact admin pages. */
export const RegularLayoutSideLabels: StoryFn = () => {
  const [post, setPost] = useState<SamplePost>(initialPost);

  const form: DataFormSchema = {
    layout: { type: "regular", labelPosition: "side" },
    fields: ["title", "status", "author", "email", "date"],
  };

  return (
    <DataForm<SamplePost>
      data={post}
      fields={fields}
      form={form}
      onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
    />
  );
};

/** Each field is a clickable row that opens a dropdown — mirrors the WP block inspector. */
export const PanelLayoutDropdown: StoryFn = () => {
  const [post, setPost] = useState<SamplePost>(initialPost);

  const form: DataFormSchema = {
    layout: { type: "panel", labelPosition: "side", openAs: "dropdown" },
    fields: ["title", "status", "author", "email", "date", "tags"],
  };

  return (
    <DataForm<SamplePost>
      data={post}
      fields={fields}
      form={form}
      onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
    />
  );
};

/** Same panel rows, but each opens a modal with apply/cancel buttons. */
export const PanelLayoutModal: StoryFn = () => {
  const [post, setPost] = useState<SamplePost>(initialPost);

  const form: DataFormSchema = {
    layout: {
      type: "panel",
      labelPosition: "top",
      openAs: { type: "modal", applyLabel: "Apply", cancelLabel: "Cancel" },
    },
    fields: ["title", "status", "author", "tags"],
  };

  return (
    <DataForm<SamplePost>
      data={post}
      fields={fields}
      form={form}
      onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
    />
  );
};

/** Group fields into a collapsible card with a header. */
export const CardLayout: StoryFn = () => {
  const [post, setPost] = useState<SamplePost>(initialPost);

  const form: DataFormSchema = {
    layout: { type: "regular" },
    fields: [
      {
        id: "details",
        label: "Post details",
        layout: { type: "card", withHeader: true, isCollapsible: true, isOpened: true },
        children: ["title", "status", "author"],
      },
      {
        id: "meta",
        label: "Metadata",
        layout: { type: "card", withHeader: true, isCollapsible: true, isOpened: false },
        children: ["email", "date", "tags"],
      },
    ],
  };

  return (
    <DataForm<SamplePost>
      data={post}
      fields={fields}
      form={form}
      onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
    />
  );
};

/** Render multiple fields on a single horizontal row. */
export const RowLayout: StoryFn = () => {
  const [post, setPost] = useState<SamplePost>(initialPost);

  const form: DataFormSchema = {
    layout: { type: "regular", labelPosition: "top" },
    fields: [
      "title",
      {
        id: "row",
        label: "Author & date",
        layout: { type: "row", alignment: "start" },
        children: ["author", "date"],
      },
      "description",
    ],
  };

  return (
    <DataForm<SamplePost>
      data={post}
      fields={fields}
      form={form}
      onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
    />
  );
};

/** Validate fields with the `useFormValidity` hook. The save button stays disabled until the form is valid. */
export const WithValidation: StoryFn = () => {
  const [post, setPost] = useState<SamplePost>({ ...initialPost, title: "", email: "" });

  const validatedFields: DataViewField<SamplePost>[] = fields.map((field) => {
    if (field.id === "title") {
      return { ...field, isValid: { required: { value: true, message: "Title is required" } } };
    }
    if (field.id === "email") {
      return {
        ...field,
        isValid: {
          required: { value: true, message: "Email is required" },
          custom: (value: unknown) =>
            typeof value === "string" && /.+@.+\..+/.test(value)
              ? undefined
              : { message: "Enter a valid email address" },
        },
      };
    }
    return field;
  });

  const form: DataFormSchema = {
    layout: { type: "regular", labelPosition: "top" },
    fields: ["title", "email", "status"],
  };

  const { validity, isValid } = useFormValidity(post, validatedFields, form);

  return (
    <div className="space-y-4">
      <DataForm<SamplePost>
        data={post}
        fields={validatedFields}
        form={form}
        validity={validity}
        onChange={(edits) => setPost((prev) => ({ ...prev, ...edits }))}
      />
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {isValid ? "Form is valid" : "Fix the highlighted fields"}
        </span>
        <Button
          disabled={!isValid}
          onClick={() => alert(`Saved: ${JSON.stringify(post, null, 2)}`)}>
          Save
        </Button>
      </div>
    </div>
  );
};
