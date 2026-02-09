# FileView Component

- [Introduction](#introduction)
- [Component Dependency](#component-dependency)
- [Quick Overview](#quick-overview)
- [Features](#features)
- [Props API](#props-api)
- [Usage Examples](#usage-examples)

## Introduction
`FileView` is a component used to display file information, typically used after a file has been uploaded. It supports both generic files and image previews.

## Component Dependency
- `lucide-react` for icons.
- `@/components/ui/card` for the container.
- `@/lib/utils` for class merging.

## Quick Overview
```jsx
import { FileView } from "@wedevs/plugin-ui";

const Example = () => {
  return (
    <FileView
      fileName="document.pdf"
      fileSize="1.2 MB"
      onRemove={() => console.log("Removed")}
    />
  );
};
```

## Features
- Supports image previews with `fileType="image"`.
- Generic file icon for other file types.
- Displays file name and size.
- Optional remove button with `onRemove` callback.
- Highly customizable via various `className` props.

## Props API
| Prop | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| `fileName` | `string` | Yes | - | The name of the file. |
| `fileSize` | `string` | Yes | - | The size of the file. |
| `fileType` | `'image' \| 'file'` | No | `'file'` | The type of the file. |
| `imageUrl` | `string` | No | `''` | The URL of the image (used if `fileType="image"`). |
| `onRemove` | `() => void` | No | - | Callback when the remove button is clicked. |
| `className` | `string` | No | - | Root container class name. |
| `closeBtnClassName` | `string` | No | - | Remove button class name. |
| `fileInfoClassName` | `string` | No | - | File info container class name. |
| `fileNameClassName` | `string` | No | - | File name text class name. |
| `fileSizeClassName` | `string` | No | - | File size text class name. |
| `infoWrapperClassName` | `string` | No | - | Info wrapper class name. |
| `fileWrapperClassName` | `string` | No | - | File icon/image wrapper class name. |
| `fileClassName` | `string` | No | - | File icon or image class name. |

## Usage Examples

### 1. Basic File View
```jsx
<FileView
  fileName="report.docx"
  fileSize="450 KB"
/>
```

### 2. Image Preview with Remove Button
```jsx
<FileView
  fileType="image"
  fileName="profile.jpg"
  fileSize="2.1 MB"
  imageUrl="https://example.com/profile.jpg"
  onRemove={() => handleRemove()}
/>
```
