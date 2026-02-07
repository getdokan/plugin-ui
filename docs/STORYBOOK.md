# Writing Storybook Stories for Plugin UI

This guide explains how to write Storybook stories for each component in `plugin-ui`.

## Quick start

```bash
npm run storybook
```

Then open **http://localhost:6006/** in your browser.

Stories live next to components: `src/components/ui/ComponentName.stories.js` (or `.tsx` if you use TypeScript).

---

## Story file pattern

One story file per component, colocated with the component:

```
src/components/ui/
  button.tsx
  Button.stories.tsx
  input.tsx
  Input.stories.tsx
```

---

## Basic story template

```tsx
// ComponentName.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./component-name";

const meta = {
  title: "UI/ComponentName",
  component: ComponentName,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Control props and document behavior
  },
} satisfies Meta<typeof ComponentName>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // default props
  },
};
```

- **`meta`**: `title` (sidebar path), `component`, `parameters`, `tags`, `argTypes`.
- **`Story`**: Type from your component props.
- **Named exports**: Each export (e.g. `Default`, `Primary`) becomes a story.
- **Controls**: Stories that use `args` get inputs in the **Controls** panel; when you change a value there, the story updates live. Add a **With controls** story (and `argTypes` for the props you want to tweak) to make this obvious—see **UI/Button**, **UI/Label**, and **UI/Input**.

---

## 1. Simple components (Button, Badge, Input, Label)

**Button example** — variants and sizes as stories:

```tsx
// Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "destructive", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Button" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};
```

**Input example**:

```tsx
// Input.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    type: { control: "select", options: ["text", "email", "password"] },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: "Placeholder" },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...args} />
    </div>
  ),
  args: { placeholder: "you@example.com" },
};
```

---

## 2. Compound components (Modal, Card, Alert)

Compose the full component in the story:

```tsx
// Modal.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  Button,
} from "./index";

const meta = {
  title: "UI/Modal",
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Modal</Button>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalHeader>
            <ModalTitle>Modal title</ModalTitle>
            <ModalDescription>Description here.</ModalDescription>
          </ModalHeader>
          <div className="p-6">Content</div>
          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </ModalFooter>
        </Modal>
      </>
    );
  },
};
```

---

## 3. Components with Base UI (Select, DropdownMenu, AlertDialog)

Use the same compound structure; keep **state** inside the story (e.g. `open`, selected value):

```tsx
// Select.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Option A</SelectItem>
        <SelectItem value="b">Option B</SelectItem>
        <SelectItem value="c">Option C</SelectItem>
      </SelectContent>
    </Select>
  ),
};
```

---

## 4. ArgTypes best practices

- **Control type**: `select` for enums, `boolean` for flags, `text` for strings.
- **Document required props** and sensible defaults in `args`.
- **Actions**: Use `onClick: { action: "clicked" }` to log events in the Actions panel.

```tsx
argTypes: {
  onClick: { action: "clicked" },
  variant: {
    control: "select",
    options: ["default", "secondary"],
    description: "Visual style",
  },
},
```

---

## 5. Decorators (global theme / layout)

All stories run inside the preview decorators (see `.storybook/preview.tsx`), which:

- Import `src/styles.css` (Tailwind + design tokens).
- Wrap the app in `ThemeProvider` with a `.pui-root` container.

So every story already has the correct theme and scoping. For a single story you can add a local decorator:

```tsx
export const DarkBackground: Story = {
  decorators: [
    (Story) => (
      <div className="bg-gray-900 p-4">
        <Story />
      </div>
    ),
  ],
  args: { variant: "outline" },
};
```

---

## 6. Checklist per component

- [ ] Create `ComponentName.stories.tsx` next to `component-name.tsx`.
- [ ] Set `title: "UI/ComponentName"` (or a subgroup like `"UI/Forms/Input"`).
- [ ] Export `meta` with `component` and `argTypes` for main props.
- [ ] Add at least one **Default** story with `args`.
- [ ] Add variant/size stories (e.g. **AllVariants**) with `render` if helpful.
- [ ] For compound components, use `render` and internal state.
- [ ] Use `tags: ["autodocs"]` so Docs tab is generated.

---

## 7. Running and building

- **Dev**: `npm run storybook` — opens the Storybook dev server.
- **Build**: `npm run build-storybook` — outputs static files to `storybook-static/` (add to `.gitignore` if desired).

### Deploy to GitHub Pages (CI/CD)

A GitHub Actions workflow deploys Storybook to GitHub Pages on push to `main` or `master`.

1. **Enable GitHub Pages** in the repo: **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. Push to `main`/`master` (or run the **Deploy Storybook to GitHub Pages** workflow manually). The workflow:
   - Runs `npm ci` and `npm run build-storybook` with `STORYBOOK_BASE_PATH=/<repo-name>/` so assets load correctly.
   - Uploads `storybook-static` and deploys via `actions/deploy-pages`.
3. The site will be at **`https://<owner>.github.io/<repo>/`** (e.g. `https://mrabbani.github.io/plugin-ui/`).

Workflow file: `.github/workflows/deploy-storybook.yml`.

---

## Testing in Storybook

Stories are test cases for your components. Storybook supports several ways to test UIs in the same environment as your stories. See [How to test UIs with Storybook](https://storybook.js.org/docs/writing-tests).

**Types of tests**

| Type | What it does |
|------|----------------|
| **Render tests** | Every story is a smoke test: it passes when the story renders without error. |
| **Interaction tests** | Use a `play` function to simulate user actions and assert with `expect`, `fn`, `userEvent`, `within` from `storybook/test`. Example: **Button → Disabled**. |
| **Accessibility tests** | [@storybook/addon-a11y](https://storybook.js.org/docs/writing-tests/accessibility-testing) runs axe-core on each story. Enable via the **Accessibility** checkbox in the test widget. |
| **Visual tests** | [@chromatic-com/storybook](https://storybook.js.org/docs/writing-tests/visual-testing) (Chromatic) compares story screenshots to baselines. |
| **Snapshot tests** | Compare rendered markup to a stored snapshot. |

**In this project**

- **Interaction:** `Button.stories.jsx` has a **Disabled** story with a `play` function (see Interactions panel).
- **Accessibility:** Addon installed; `parameters.a11y.test: "error"` in preview so violations fail when you run component tests with the Accessibility checkbox on.
- **Visual:** Chromatic addon installed; use a [Chromatic](https://www.chromatic.com/) account to run visual tests.

**More**

- [Interaction testing](https://storybook.js.org/docs/writing-tests/interaction-testing) — play function API, steps, mocks.
- [Accessibility testing](https://storybook.js.org/docs/writing-tests/accessibility-testing) — workflow, CLI/CI, config.
- [Visual testing](https://storybook.js.org/docs/writing-tests/visual-testing) — Chromatic setup.
- [Testing in CI](https://storybook.js.org/docs/writing-tests/test-runner#run-tests-in-ci) — run tests in CI.

---

## 8. Running component tests (with Accessibility)

To run interaction and accessibility checks from the UI:

1. **Expand the test widget** (test runner panel in Storybook).
2. **Check the Accessibility checkbox** so a11y checks run with component tests.
3. **Click “Run component tests”** to execute play functions and accessibility checks.

If any test fails, use the **Accessibility** tab in the bottom panel to inspect violations. The addon highlights violating elements in the preview and explains how to fix them.

**Take it further**

- [Accessibility testing docs](https://storybook.js.org/docs/writing-tests/accessibility-testing) — recommended workflow, CLI/CI, and how to configure checks.

**Accessibility configuration (preview)**

In `.storybook/preview.js`, `parameters.a11y` is set so that:

- **`test: "error"`** — accessibility violations fail component tests (when the Accessibility checkbox is on). Use **`"todo"`** on a story or meta to turn failures into warnings while you fix issues; use **`"off"`** to skip a11y for that story.
- **`config`** — [axe.configure()](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#api-name-axeconfigure) options (e.g. enable/disable rules).
- **`options`** — [axe.run() options](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter) (e.g. `runOnly` for WCAG 2.2 AAA).
- **Per-story:** set `parameters.a11y` or `globals.a11y.manual: true` in a story to override or disable auto checks.

---

## File reference

| File / folder        | Purpose                                      |
|----------------------|----------------------------------------------|
| `.storybook/main.ts` | Storybook config, story globs, addons        |
| `.storybook/preview.tsx` | Global decorators, ThemeProvider, styles |
| `src/components/ui/*.stories.tsx` | One story file per component        |

Use the existing **Button** and **Input** story files (`Button.stories.js`, `Input.stories.js`) as templates for the rest of the components.

---

## 9. Story format in this repo

The included examples use **plain JavaScript** (`.stories.js`) and `React.createElement` so that Storybook builds without extra Babel/TypeScript configuration. For new components you can:

- **Option A (recommended for consistency):** Copy `Button.stories.js` or `Input.stories.js`, rename to `YourComponent.stories.js`, and use `React.createElement` for any custom `render` functions.
- **Option B (TypeScript/JSX):** Use the templates in sections 1–3 above in a `.stories.tsx` file with `import type` and JSX. That requires a Storybook setup that transpiles TypeScript/JSX (e.g. running `npx storybook@latest init` and choosing the TypeScript option, or adding the right loaders in `.storybook/main.ts`).
