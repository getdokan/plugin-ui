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
| `children` | `ReactNode` | - | Modal content (use sub-components for structure) |
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
import { Modal, ModalHeader, ModalTitle, ModalDescription } from "@plugin-ui/ui";
import { useState } from "react";

function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalHeader>
          <ModalTitle>Confirm Action</ModalTitle>
          <ModalDescription>This action cannot be undone.</ModalDescription>
        </ModalHeader>
        <div className="p-8">
          <p>Are you sure you want to proceed?</p>
        </div>
      </Modal>
    </>
  );
}
```

### With Footer Actions

```tsx
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@plugin-ui/ui";

<Modal open={open} onClose={() => setOpen(false)}>
  <ModalHeader>
    <ModalTitle>Delete Account</ModalTitle>
    <ModalDescription>Permanently delete your account and all data.</ModalDescription>
  </ModalHeader>
  <div className="p-8">
    <p>This action cannot be undone.</p>
  </div>
  <ModalFooter>
    <button variant="outline" onClick={() => setOpen(false)}>Cancel</button>
    <button variant="destructive" onClick={handleDelete}>Delete</button>
  </ModalFooter>
</Modal>
```

### Different Sizes

```tsx
<Modal size="sm" open={open} onClose={onClose}>
  <ModalHeader><ModalTitle>Small</ModalTitle></ModalHeader>
  <div className="p-8">Compact content</div>
</Modal>

<Modal size="lg" open={open} onClose={onClose}>
  <ModalHeader><ModalTitle>Large</ModalTitle></ModalHeader>
  <div className="p-8">More content</div>
</Modal>

<Modal size="full" open={open} onClose={onClose}>
  <ModalHeader><ModalTitle>Full Screen</ModalTitle></ModalHeader>
  <div className="p-8">Maximum space</div>
</Modal>
```

### Custom Close Behavior

```tsx
<Modal
  open={open}
  onClose={onClose}
  closeOnOverlayClick={false}
  closeOnEscape={false}
  showCloseButton={false}
>
  <ModalHeader>
    <ModalTitle>Read Only</ModalTitle>
  </ModalHeader>
  <div className="p-8">
    <p>User must click "Done" to close this modal.</p>
  </div>
  <ModalFooter>
    <button onClick={onClose}>Done</button>
  </ModalFooter>
</Modal>
```

### Custom Styling

```tsx
<Modal open={open} onClose={onClose}>
  <ModalHeader className="border-red-500">
    <ModalTitle className="text-red-500">Custom Styled</ModalTitle>
  </ModalHeader>
  <div className="p-8">Content</div>
</Modal>
```

## Accessibility

- **Focus Management**: When opened, the modal traps focus within itself. On close, focus returns to the element that triggered it.
- **Keyboard Support**:
  - `Escape` closes the modal (configurable via `closeOnEscape`)
  - `Tab` cycles through focusable elements inside the modal
- **ARIA**: The close button includes `sr-only` text for screen readers.

## Sub-Components

The Modal uses a composition API. Import sub-components to structure your modal:

```tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
  ModalOverlay,
} from "@plugin-ui/ui";
```

| Sub-Component | Purpose |
|---------------|---------|
| `ModalHeader` | Header container with border |
| `ModalTitle` | Heading (`<h2>`) with default styling |
| `ModalDescription` | Description text with padding |
| `ModalFooter` | Footer container with border and button layout |
| `ModalContent` | Main content container (rarely used directly) |
| `ModalOverlay` | Backdrop overlay (rarely used directly) |
| `ModalClose` | Close button (rarely used directly) |

All sub-components accept `className` prop for custom styling.
