# Modal

A dialog component that displays content on top of the main content using React Portal. Automatically manages focus, body scroll lock, and keyboard interactions.

## Features

- Portals to `document.body` to avoid z-index conflicts
- Locks body scroll when open
- Restores focus to triggering element on close
- Keyboard accessible (Escape to close)
- Click outside to close (configurable)
- Responsive design

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | *required* | Whether the modal is visible |
| `onClose` | `() => void` | *required* | Callback fired when modal should close |
| `title` | `ReactNode` | - | Heading text displayed in the modal header |
| `description` | `ReactNode` | - | Supporting text below the title |
| `children` | `ReactNode` | - | Main content of the modal |
| `footer` | `ReactNode` | - | Footer content (typically action buttons) |
| `showCloseButton` | `boolean` | `true` | Show the X button in the top-right corner |
| `closeOnOverlayClick` | `boolean` | `true` | Close when clicking the backdrop overlay |
| `closeOnEscape` | `boolean` | `true` | Close when pressing Escape key |
| `className` | `string` | - | Additional classes for the modal content |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl' \| 'full'` | `'default'` | Width preset of the modal |

## Size Options

| Value | Width |
|-------|-------|
| `sm` | `max-w-sm` (384px) |
| `default` | `max-w-lg` (512px) |
| `lg` | `max-w-2xl` (672px) |
| `xl` | `max-w-4xl` (896px) |
| `full` | Full viewport (minus 2rem margin) |

## Usage

### Basic Modal

```tsx
import { Modal } from "@plugin-ui/ui";
import { useState } from "react";

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm Action"
        description="This action cannot be undone."
      >
        <p>Are you sure you want to proceed?</p>
      </Modal>
    </>
  );
}
```

### With Footer Actions

```tsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Delete Account"
  description="Permanently delete your account and all data."
  footer={
    <>
      <button variant="outline" onClick={() => setOpen(false)}>
        Cancel
      </button>
      <button variant="destructive" onClick={handleDelete}>
        Delete
      </button>
    </>
  }
>
  <p>This action cannot be undone.</p>
</Modal>
```

### Different Sizes

```tsx
<Modal size="sm" open={open} onClose={onClose} title="Small">
  {/* Compact content */}
</Modal>

<Modal size="lg" open={open} onClose={onClose} title="Large">
  {/* More content */}
</Modal>

<Modal size="full" open={open} onClose={onClose} title="Full Screen">
  {/* Maximum space */}
</Modal>
```

### Custom Close Behavior

```tsx
<Modal
  open={open}
  onClose={onClose}
  title="Read Only"
  // Disable click-outside and escape key
  closeOnOverlayClick={false}
  closeOnEscape={false}
  // Hide close button
  showCloseButton={false}
>
  <p>User must click "Done" to close this modal.</p>
  <footer>
    <button onClick={onClose}>Done</button>
  </footer>
</Modal>
```

## Accessibility

- **Focus Management**: When opened, the modal traps focus within itself. On close, focus returns to the element that triggered it.
- **Keyboard Support**:
  - `Escape` closes the modal (configurable via `closeOnEscape`)
  - `Tab` cycles through focusable elements inside the modal
- **ARIA**: The close button includes `sr-only` text for screen readers.

## Sub-Components

For advanced customization, you can compose modals using exported sub-components:

```tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from "@plugin-ui/ui";
```

These follow the same composition pattern as the main `Modal` but give you full control over layout and structure.
