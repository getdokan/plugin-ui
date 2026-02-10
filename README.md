# @wedevs/plugin-ui

Reusable UI components for WordPress plugins. Built with React and designed to work seamlessly with the WordPress admin environment.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Building the Package](#building-the-package)
- [Importing Styles](#importing-styles)
- [Usage Examples](#usage-examples)
- [Components](#components)
- [Theme & Variables Mapping](#theme--variables-mapping)
- [Theme Presets](#theme-presets)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Peer Dependencies](#peer-dependencies)
- [License](#license)

## Installation

### Step 1: Add to Your Project

Add the package to your `package.json` dependencies:

**Option A: Via GitHub (Recommended)**
```json
{
  "dependencies": {
    "@wedevs/plugin-ui": "git+https://github.com/getdokan/plugin-ui.git"
  }
}
```

**Option B: Local Development**
If you are developing locally and want to link the package:
```json
{
  "dependencies": {
    "@wedevs/plugin-ui": "file:../path/to/plugin-ui"
  }
}
```

### Step 2: Install Dependencies

Run the installation command:
```bash
npm install
```

### Step 3: Import Styles

Import the CSS file in your main entry point:
```tsx
import '@wedevs/plugin-ui/styles.css';
```

## Quick Start

### Step 1: Import Components

```tsx
import { TextField, Button, Alert, Badge } from '@wedevs/plugin-ui';
```

### Step 2: Use Components

```tsx
const MyComponent = () => {
    const [text, setText] = useState('');
    
    return (
        <div className="space-y-4">
            <Alert variant="success" label="Success">
                The implementation is working perfectly!
            </Alert>

            <Badge variant="info" label="New Feature" />

            <TextField 
                value={text} 
                onChange={setText} 
                placeholder="Enter some text..."
            />

            <Button variant="primary">Click Me</Button>
        </div>
    );
};
```

## Development Setup

### Step 0: Node Version

This project requires **Node.js 24**. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your Node version.

```bash
# Use the Node version specified in .nvmrc
nvm use
```

### Step 1: Clone the Repository

```bash
git clone https://github.com/getdokan/plugin-ui.git
cd plugin-ui
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Package

```bash
npm run build
```

This will:
- Compile TypeScript files to JavaScript (`dist/`)
- Process CSS with PostCSS and Tailwind (`dist/styles.css`)

### Step 4: Link for Local Development (Optional)

If you want to use this package in another project during development:

```bash
# In plugin-ui directory
npm link

# In your consuming project
npm link @wedevs/plugin-ui
```

## Building the Package

### Full Build

Build both TypeScript and CSS:
```bash
npm run build
```

This runs:
1. `npm run build:ts` - Compiles TypeScript to JavaScript
2. `npm run build:css` - Processes CSS with PostCSS/Tailwind

### Build TypeScript Only

```bash
npm run build:ts
```

### Build CSS Only

```bash
npm run build:css
```

### Build Output

After building, you'll find:
- **JavaScript**: `dist/**/*.js` (compiled from TypeScript)
- **Type Definitions**: `dist/**/*.d.ts` (TypeScript declarations)
- **CSS**: `dist/styles.css` (processed stylesheet)

## Importing Styles

### Step 1: Import in Your Main Entry Point

In your main application file (e.g., `src/index.tsx` or `src/admin/index.tsx`):

```tsx
import '@wedevs/plugin-ui/styles.css';
```

### Step 2: Ensure Tailwind CSS 4 Setup

This package requires **Tailwind CSS 4**. In your main CSS file:

```css
@import "tailwindcss";

/* Optional: Override plugin-ui CSS variables */
:root {
    --plugin-ui-primary: #6366f1;
    --plugin-ui-primary-hover: #4f46e5;
}
```

### Step 3: Verify Styles are Loaded

Check your browser's developer tools to ensure `styles.css` is loaded correctly.

## Usage Examples

### Form with Validation

```tsx
import { TextField, Button, Alert, FieldLabel } from '@wedevs/plugin-ui';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        // Handle login
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <Alert variant="error" label="Error">
                    {error}
                </Alert>
            )}
            
            <FieldLabel label="Email" required>
                <TextField
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Enter your email"
                />
            </FieldLabel>

            <FieldLabel label="Password" required>
                <PasswordField
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                />
            </FieldLabel>

            <Button type="submit" variant="primary">
                Login
            </Button>
        </form>
    );
};
```

### Data Display with Filters

```tsx
import { SearchInput, Badge, Modal, List } from '@wedevs/plugin-ui';

const DataView = () => {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search..."
                />
                <Button onClick={() => setIsModalOpen(true)}>
                    Add New
                </Button>
            </div>

            <List>
                <List.Item>
                    <div className="flex items-center justify-between">
                        <span>Item 1</span>
                        <Badge variant="success" label="Active" />
                    </div>
                </List.Item>
            </List>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add New Item"
            >
                {/* Modal content */}
            </Modal>
        </div>
    );
};
```

## Components

### Feedback & Status
- **`Alert`** - Notice/Message with variants (success, info, warning, error)
- **`Badge`** - Status indicator (requires `label` prop)
- **`InfoBox`** - Informational block with title and content
- **`Tooltip`** - Hover tooltip for additional information

### Actions
- **`Button`** - Styled buttons with multiple variants and loading states
- **`Link`** - Styled link component
- **`SocialButton`** - Social media login buttons (Google, etc.)

### Form Controls
- **`TextField`** - Standard text input
- **`NumberField`** - Numeric input with validation
- **`TextArea`** - Multi-line text input
- **`PasswordField`** - Secure password input with show/hide toggle
- **`Select`** - Dropdown selection with search
- **`Checkbox`** & **`CheckboxGroup`** - Boolean and multiple selection
- **`Radio`** & **`RadioCapsule`** - Single selection from a group
- **`Switch`** - Toggle switch component
- **`FieldLabel`** - Wrapper for input labels with descriptions
- **`ColorPicker`** - Color selection input
- **`TimePicker`** - Time selection input
- **`FileUpload`** - File upload with drag & drop
- **`MediaUploader`** - WordPress Media Library integration

### Specialized Inputs
- **`SearchInput`** - Input with search icon and clearing logic
- **`DebouncedInput`** - Input that delays `onChange` execution
- **`CustomizeRadio`** - Rich radio options (Cards, Templates, etc.)
- **`AsyncSelect`** - Async data loading select components
  - `ProductAsyncSelect`
  - `VendorAsyncSelect`
  - `OrderAsyncSelect`
  - `CouponAsyncSelect`

### Rich Text & Content
- **`RichText`** - Quill-based rich text editor
- **`CopyField`** - Read-only field with copy functionality
- **`ShowHideField`** - Field with show/hide toggle

### Lists & Layout
- **`List`** - Versatile list display for activities or items
- **`Modal`** - Accessible dialog windows
- **`Popover`** - Popover component for additional content
- **`Repeater`** - Repeating field groups
- **`Filter`** - Filter component for data views

### Utilities
- **`VisitStore`** - Store visit link component

## Theme & Variables Mapping

Design tokens (ThemeTokens) are converted to CSS variables and wired into Tailwind’s theme. For a full description of how tokens map to base CSS variables and to Tailwind theme variables, see **[docs/VARIABLES-MAPPING.md](docs/VARIABLES-MAPPING.md)**.

Summary:

- **ThemeTokens** (camelCase in JS) → **Base CSS variables** (e.g. `--primary-foreground`) via `tokensToCssVariables()` in `ThemeProvider`.
- **Base variables** → **Tailwind theme** via `@theme inline` in `styles.css` (e.g. `--color-primary: var(--primary)`).
- Custom token keys are converted the same way (`camelCase` → `--kebab-case`).

## Theme Presets

The package includes **theme presets** — ready-made light/dark token sets you can pass to `ThemeProvider`. For the full list, usage with `ThemeProvider`, and how to extend them with `createTheme` / `createDarkTheme`, see **[docs/THEME-PRESETS.md](docs/THEME-PRESETS.md)**.

Quick example:

```tsx
import { ThemeProvider, dokanTheme, dokanDarkTheme } from "@wedevs/plugin-ui";

<ThemeProvider pluginId="dokan" tokens={dokanTheme} darkTokens={dokanDarkTheme}>
  <App />
</ThemeProvider>
```

Available presets: `defaultTheme`, `dokanTheme`, `blueTheme`, `greenTheme`, `amberTheme`, `slateTheme` (and their `*DarkTheme` variants). Use `createTheme(tokens)` or `createDarkTheme(tokens)` to build a custom theme from a base.

## Project Structure

```
plugin-ui/
├── src/
│   ├── components/       # React components
│   │   ├── Alert.tsx
│   │   ├── Button.tsx
│   │   ├── TextField.tsx
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   │   ├── useClickOutside.ts
│   │   ├── useClipboard.ts
│   │   └── useToggle.ts
│   ├── utils/            # Utility functions
│   │   └── classnames.ts
│   ├── types/            # TypeScript type definitions
│   ├── styles.css        # Main stylesheet (Tailwind + custom)
│   └── index.ts          # Main entry point
├── dist/                 # Build output (generated)
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── styles.css        # Compiled CSS
│   └── index.js
├── package.json
├── tsconfig.json         # TypeScript configuration
├── postcss.config.js     # PostCSS configuration
└── README.md
```

## Available Scripts

### Development
```bash
# Build the entire package (TypeScript + CSS)
npm run build

# Build TypeScript only
npm run build:ts

# Build CSS only
npm run build:css

# Run type checking without emitting files
npm run typecheck

# Lint source files
npm run lint
```

### Build Process

1. **TypeScript Compilation** (`build:ts`)
   - Compiles `.ts` and `.tsx` files to JavaScript
   - Generates type definitions (`.d.ts` files)
   - Output: `dist/**/*.js` and `dist/**/*.d.ts`

2. **CSS Processing** (`build:css`)
   - Processes `src/styles.css` with PostCSS
   - Applies Tailwind CSS 4 transformations
   - Output: `dist/styles.css`

3. **Automatic Build** (`prepare`)
   - Runs automatically on `npm install`
   - Ensures package is built before publishing

## Peer Dependencies

This package requires the following peer dependencies. Make sure they are installed in your consuming project:

### WordPress Packages
- `@wordpress/block-editor` >= 12.0.0
- `@wordpress/components` >= 19.0.0
- `@wordpress/element` >= 4.0.0
- `@wordpress/hooks` >= 3.0.0
- `@wordpress/i18n` >= 4.0.0

### React
- `react` >= 17.0.0
- `react-dom` >= 17.0.0

### Other
- `quill` >= 1.3.0 (for RichText component)

## Development Workflow

### Step 1: Make Changes

Edit files in the `src/` directory:
- Components: `src/components/*.tsx`
- Styles: `src/styles.css`
- Hooks: `src/hooks/*.ts`
- Utils: `src/utils/*.ts`

### Step 2: Build

After making changes, rebuild the package:
```bash
npm run build
```

### Step 3: Test

If using `npm link`, changes will be reflected in your consuming project after rebuilding.

### Step 4: Type Check

Verify TypeScript types are correct:
```bash
npm run typecheck
```

### Step 5: Lint

Check code quality:
```bash
npm run lint
```

## Troubleshooting

### Styles Not Loading

1. Ensure you've imported the CSS:
   ```tsx
   import '@wedevs/plugin-ui/styles.css';
   ```

2. Verify Tailwind CSS 4 is set up in your project

3. Check that `dist/styles.css` exists after building

### Type Errors

1. Run `npm run typecheck` to see all type errors
2. Ensure all peer dependencies are installed
3. Check TypeScript version compatibility

### Build Issues

1. Clear `dist/` directory and rebuild:
   ```bash
   rm -rf dist && npm run build
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## License

GPL-2.0-or-later
