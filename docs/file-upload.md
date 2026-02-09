# FileUpload Component

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`FileUpload` renders an upload CTA area. It supports two variants: a centered button with description, or a compact button + clickable text layout. You can either use the built-in WordPress media handler or handle the file selection yourself.

## Component Dependency
- `@base-ui/react` `Button` for the trigger.
- `@/components/ui/card` for the wrapper container.
- `@/lib/WpMedia` for default WordPress media selection.
- `@/lib/utils` for class merging.

## Quick Overview
```jsx
import { FileUpload } from "@wedevs/plugin-ui";

<FileUpload
  btnText="Upload file"
  description="Accept file: jpg, png. Up to 25 MB"
  onUpload={(file) => console.log(file)}
/>
```

## Features
- Two layout variants: `button` and `button-text`.
- Built-in integration with WordPress media modal via `handlerType="default"`.
- Custom handling mode via `handlerType="custom"` to hook up your own input logic.
- Customizable styles through `className` and variant-specific containers.

## Props API
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `btnText` | `string` | No | - | Text for the primary button. |
| `text` | `string` | No | - | Secondary clickable text (for `button-text` variant). |
| `description` | `string` | No | - | Helper text under/next to the button. |
| `onUpload` | `(file: IWpMediaData \| any \| null) => void` | Yes | - | Called when a file is selected (from WP media or custom handler). |
| `className` | `string` | No | - | Extra classes for the wrapper card. |
| `variant` | `'button' \| 'button-text'` | No | `'button'` | Visual/layout variant. |
| `handlerType` | `'default' \| 'custom'` | No | `'default'` | Selects WordPress media picker or custom click handler. |

## Usage Examples

### 1. Default (WordPress media)
```jsx
<FileUpload
  btnText="Upload file"
  description="Accept file: jpg, png. Up to 25 MB"
  onUpload={(file) => console.log(file)}
/>
```

### 2. Button + text layout
```jsx
<FileUpload
  variant="button-text"
  btnText="Upload"
  text="Click to upload"
  description="Accept file: jpg, png. Up to 25 MB"
  onUpload={(file) => console.log(file)}
/>
```

### 3. Custom handler
Use `handlerType="custom"` to implement your own file picker.
```jsx
<FileUpload
  handlerType="custom"
  btnText="Choose file"
  onUpload={(file) => {/* open your custom input and call onUpload */}}
/>
```