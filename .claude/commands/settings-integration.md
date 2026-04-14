---
name: "Settings Integration"
description: Guide for integrating plugin-ui <Settings> into a WordPress plugin — covers PHP schema, REST API, frontend wiring, CSS, testing, and common pitfalls.
category: Integration
tags: [settings, plugin-ui, wordpress, php, rest-api, react]
---

You are helping a developer integrate the `@wedevs/plugin-ui` `<Settings>` component into a WordPress plugin.

When invoked with `/settings-integration`, read the current codebase to understand the integration state, then guide, scaffold, or fix whatever the user asks.

---

## First-Time Setup

### 1. Install the package

plugin-ui is a **private weDevs package** — not on npm. Choose based on your intent:

**Using plugin-ui (consumer — no changes needed):**

```bash
# Install directly from GitHub
pnpm add github:getdokan/plugin-ui
```

Or pin a specific tag/branch:

```bash
pnpm add github:getdokan/plugin-ui#main
pnpm add github:getdokan/plugin-ui#v2.0.0
```

**Contributing to plugin-ui (local development):**

Clone plugin-ui alongside your plugin, then reference it by local path:

```json
// package.json
"dependencies": {
    "@wedevs/plugin-ui": "file:../plugin-ui"
}
```

```bash
pnpm install
```

With the local path approach, changes you make in `../plugin-ui/src` are picked up after rebuilding plugin-ui (`pnpm run build` inside plugin-ui). If TypeScript types drift after a rebuild, force-copy the updated dist:

```bash
cp -r ../plugin-ui/dist/* node_modules/@wedevs/plugin-ui/dist/
```

### 2. Peer dependencies

```bash
pnpm add react react-dom @wordpress/i18n @wordpress/api-fetch @wordpress/hooks
pnpm add -D @types/react @types/react-dom
```

### 3. Enqueue in PHP

```php
wp_enqueue_script(
    'my-plugin-admin',
    plugin_dir_url(__FILE__) . 'assets/js/main.js',
    [ 'wp-element', 'wp-i18n', 'wp-api-fetch', 'wp-hooks' ],
    MY_PLUGIN_VERSION,
    true
);
wp_enqueue_style(
    'my-plugin-admin',
    plugin_dir_url(__FILE__) . 'assets/css/main.css',
    [],
    MY_PLUGIN_VERSION
);
// Provide REST nonce for apiFetch
wp_add_inline_script(
    'my-plugin-admin',
    sprintf(
        'wp.apiFetch.use( wp.apiFetch.createNonceMiddleware( "%s" ) );',
        wp_create_nonce( 'wp_rest' )
    ),
    'after'
);
```

### 4. Mount point in PHP template

```php
// In your admin page callback
echo '<div id="my-plugin-settings"></div>';
```

### 5. React entry point

```tsx
// src/index.tsx
import { createRoot } from 'react-dom/client';
import './index.css';
import MyApp from './apps/my-plugin';

const mountPoint = document.getElementById('my-plugin-settings');
if (mountPoint) {
    createRoot(mountPoint).render(<MyApp />);
}
```

---

## Architecture Overview

The integration has two layers that must stay in sync:

```
PHP (Backend)                        React (Frontend)
─────────────────────────────────    ────────────────────────────────────
AbstractSettingsSchema               useSettings hook
  └─ get_schema() → flat array  ──►  schema[] → plugin-ui <Settings>
  └─ save(data)                 ◄──  onSave(treeValues)
  └─ get_option_key()                useSettingsPage hook (query params)

WP_REST_Controller
  └─ GET  /settings/schema      ──►  schemaEndpoint
  └─ GET  /settings             ──►  (values merged into schema)
  └─ POST /settings             ◄──  saveEndpoint
```

---

## PHP Backend

### 1. AbstractSettingsSchema

Every integration extends this abstract class. The key contract:

```php
abstract class AbstractSettingsSchema implements SettingsSchemaInterface {
    abstract protected function slug(): string; // e.g. 'my-integration'

    // Override to add integration-specific pages/sections/fields
    protected function pages(): array   { return []; }
    protected function sections(): array { return []; }
    protected function fields(array $settings): array { return []; }

    // Override to add integration-specific sanitization
    protected function sanitize(array $data): array {
        return $this->sanitize_common($data); // always call parent
    }
}
```

**Option key** is derived from `slug()` — check your base class implementation for the exact pattern (e.g. `my_plugin_{slug}_settings`).

### 2. Field Definition Structure

```php
[
    'id'             => 'tag_line',           // CRITICAL: must match WP REST args key for nested objects
    'type'           => 'field',
    'variant'        => 'text',               // see variant table below
    'label'          => __('Tag Line', 'my-plugin'),
    'section_id'     => 'app_identity',       // groups this field under its section
    'value'          => $settings['tag_line'] ?? '',
    'description'    => __('App tagline text.', 'my-plugin'),
]
```

**Available variants:**
| Variant | Use for |
|---|---|
| `text` | Plain text input |
| `show_hide` | Secrets/passwords — eye toggle button |
| `color_picker` | Hex color values |
| `switch` | Boolean toggle |
| `wp_media_upload` | Image/media URLs |
| `number` | Numeric values |
| `select` | Dropdown |
| `textarea` | Multi-line text |
| `rich_text` | WYSIWYG editor |

**Never use `'password'` variant** — use `'show_hide'` instead.

### 3. Section-Grouped Payload (Critical)

plugin-ui's `enrichNode()` **always overwrites** any PHP-set `dependency_key` with:
```
child.dependency_key = parent.dependency_key + '.' + child.id
```

So a field `id='tag_line'` under section `id='app_identity'` gets `dependency_key='app_identity.tag_line'`.

`handleOnSave` splits on `.` to build `treeValues`:
```json
{ "app_identity": { "tag_line": "My App", "app_logo": "https://..." } }
```

**PHP `sanitize()` must read section-grouped data:**
```php
protected function sanitize(array $data): array {
    $result = $this->sanitize_common($data); // handles common sections

    if (isset($data['app_identity'])) {
        $s = $data['app_identity'];
        $result['tag_line'] = sanitize_text_field($s['tag_line'] ?? '');
        $result['app_logo'] = esc_url_raw($s['app_logo'] ?? '');
    }
    return $result;
}
```

### 4. Nested Object Fields and WP REST Args

For nested objects, field **IDs must match the WP REST args property names**:

```php
// CORRECT — field id matches REST args property key
[ 'id' => 'app_id',      'section_id' => 'push_notifications', ... ]
[ 'id' => 'api_key',     'section_id' => 'push_notifications', ... ]

// WRONG — WP REST strips 'push_app_id' (not in registered properties)
[ 'id' => 'push_app_id', 'section_id' => 'push_notifications', ... ]
```

WP REST **strips unknown properties** from registered `object` args. If stripped, the object becomes `{}` and `required: true` properties fail validation.

**Set `'required' => false` on nested properties** to allow partial saves:
```php
'push_notifications' => [
    'required'   => false,
    'type'       => 'object',
    'properties' => [
        'app_id'  => [ 'required' => false, 'type' => 'string', 'default' => '' ],
        'api_key' => [ 'required' => false, 'type' => 'string', 'default' => '' ],
    ],
],
```

### 5. Partial Save / Merge Pattern

`save()` must **merge** with existing data, not overwrite:
```php
public function save(array $data): void {
    $existing  = get_option($this->get_option_key(), []);
    $sanitized = $this->sanitize($data);
    update_option($this->get_option_key(), array_merge($existing, $sanitized), false);
}
```

The frontend only sends the current page's sections on save. `array_merge` ensures other sections are preserved.

### 6. sanitize_hex_color Gotcha

`sanitize_hex_color()` returns `null` for invalid hex strings. Always use real hex values in defaults and tests (e.g. `'#FF9472'`, not placeholder strings like `'#MYCOLOR'`).

---

## Frontend

### 1. App Structure

```tsx
import { ThemeProvider, Settings, Toaster } from '@wedevs/plugin-ui';
import { __ } from '@wordpress/i18n';
import { useSettings, useSettingsPage } from '../../hooks';

const MyApp = () => {
    const { schema, values, isLoading, onChange, onSave } = useSettings(
        'my-plugin/v1/settings/schema',
        'my-plugin/v1/settings'
    );
    const { initialPage, onNavigate } = useSettingsPage();

    if (isLoading) return <div className="p-6"><p>{__('Loading...', 'my-plugin')}</p></div>;

    return (
        <ThemeProvider pluginId="my-plugin" tokens={{ primary: '#6366f1', primaryForeground: '#ffffff' }}>
            <div className="pui-root your-plugin-root">
                <Settings
                    title={__('My Plugin Settings', 'my-plugin')}
                    schema={schema}
                    values={values}
                    onChange={onChange}
                    onSave={onSave}
                    initialPage={initialPage}
                    onNavigate={onNavigate}
                />
                <Toaster richColors />
            </div>
        </ThemeProvider>
    );
};
```

### 2. useSettings Hook

Implement in `src/hooks/useSettings.ts`:

```ts
import { useState, useCallback } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { toast } from '@wedevs/plugin-ui';
import { __ } from '@wordpress/i18n';

export function useSettings(schemaEndpoint: string, saveEndpoint: string) {
    const [schema, setSchema] = useState([]);
    const [values, setValues] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const fetchSchema = useCallback(async () => {
        const data = await apiFetch({ path: schemaEndpoint });
        setSchema(data.schema);
        setValues(data.values);
        setIsLoading(false);
    }, [schemaEndpoint]);

    const onChange = useCallback((key: string, value: any) => {
        setValues((prev) => ({ ...prev, [key]: value }));
    }, []);

    const onSave = useCallback(
        async (_scopeId: string, treeValues: Record<string, any>) => {
            try {
                await apiFetch({ path: saveEndpoint, method: 'POST', data: treeValues });
                await fetchSchema(); // always refresh — server is source of truth
                toast.success(__('Settings saved.', 'my-plugin'));
            } catch (err: any) {
                toast.error(err?.message ?? __('Failed to save settings.', 'my-plugin'));
            }
        },
        [saveEndpoint, fetchSchema]
    );

    return { schema, values, isLoading, onChange, onSave };
}
```

**Always `fetchSchema()` after save** — the server sanitizes values (e.g. strips invalid hex) and the UI must reflect the canonical saved state.

### 3. useSettingsPage Hook (Query Param Persistence)

Implement in `src/hooks/useSettingsPage.ts`:

```ts
import { useCallback } from 'react';

const PARAM = 'settings_page';

export function useSettingsPage() {
    const initialPage = new URLSearchParams(window.location.search).get(PARAM) ?? undefined;

    const onNavigate = useCallback((pageId: string) => {
        const url = new URL(window.location.href);
        url.searchParams.set(PARAM, pageId);
        window.history.replaceState(null, '', url.toString());
    }, []);

    return { initialPage, onNavigate };
}
```

URL becomes: `admin.php?page=my-plugin-settings&settings_page=appearance`

The `initialPage` prop on `<Settings>` seeds the active page from the URL on mount. `onNavigate` updates the URL without a page reload when the user switches pages.

---

## CSS — WordPress Admin Conflicts

### 1. Root Scoping

All app output must be wrapped in `<div className="pui-root your-plugin-root">`. All CSS resets must be scoped to these selectors to avoid leaking into WP admin.

### 2. Scoped Tailwind Preflight + Utilities (Critical)

WordPress admin loads its own global styles. Tailwind's default preflight resets affect everything on the page if applied globally. **Scope both preflight and utilities inside your root selector** so they only apply within your plugin's UI:

```css
/* src/index.css */
@import "tailwindcss";
@source "./";  /* or path to your src dir */
@import "@wedevs/plugin-ui/dist/index.css";

/* Replace with your plugin's actual mount-point selectors */
.pui-root,
.your-plugin-root {
    @import 'tailwindcss/preflight.css' layer(base) important;
    @import 'tailwindcss/utilities.css' layer(utilities) important;

    @layer base {
        *,
        ::after,
        ::before,
        ::backdrop,
        ::file-selector-button {
            border-color: var(--color-gray-200, currentColor);
        }

        &.dark *,
        &.dark ::after,
        &.dark ::before,
        &.dark ::backdrop,
        &.dark ::file-selector-button {
            border-color: var(--color-gray-600, currentColor);
        }

        button:not(:disabled),
        [role='button']:not(:disabled) {
            @apply cursor-pointer;
        }
    }
}
```

**Why scoping matters:** Without it, Tailwind preflight zeroes out all WP admin styles globally — breaking the admin menu, notices, and other plugins. With scoping, resets only apply inside your mount point.

**The root selectors** are the `class` attributes on your React mount divs. Always include `.pui-root` (plugin-ui's own wrapper class) plus any top-level class your plugin adds.

### 3. WordPress Admin Heading/Paragraph Overrides

WP admin's stylesheet sets `h2, h3 { color: #1d2327; font-size: 1.3em }` and paragraph margins. These leak into your UI even with scoped preflight because they come from WP admin's own CSS, not Tailwind. Reset them explicitly:

```css
.pui-root h1, .pui-root h2, .pui-root h3,
.pui-root h4, .pui-root h5, .pui-root h6 {
    color: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    margin: 0;
}

.pui-root p {
    color: inherit !important;
    font-size: inherit !important;
    margin: 0;
}
```

### 4. Tailwind v3/v4 Transform Conflict

Other WP plugins may use Tailwind v3 which generates:
```css
.-translate-y-1\/2 { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(...); }
```

plugin-ui uses Tailwind v4's individual `translate` CSS property. Both apply simultaneously causing double-translation. Fix:

```css
/* Reset Tailwind v3 transform shorthand from other plugins */
.pui-root [class*="translate-"],
.pui-root [class*="-translate-"] {
    transform: none !important;
}
```

This is safe — Tailwind v4 uses `translate` (not `transform`) for positioning.

---

## Extending Fields via Filter Hooks

Every field variant is wrapped with `applyFilters(hookName, <DefaultComponent />, element)`.

**Hook name pattern:** `${hookPrefix}_settings_${variant}_field`

Default `hookPrefix` is `'plugin_ui'`. Override via `<Settings hookPrefix="my_plugin" />`.

### Override an existing variant

```tsx
import { addFilter } from '@wordpress/hooks';

addFilter(
    'my_plugin_settings_text_field',
    'my-plugin/custom-text',
    (DefaultComponent, element) => {
        if (element.id === 'special_field') {
            return <MySpecialField element={element} />;
        }
        return DefaultComponent;
    }
);
```

### Register a completely new variant

In PHP schema: `'variant' => 'date_picker'`. Unknown variants hit the `default` switch case and fire `${hookPrefix}_settings_date_picker_field` with `<FallbackField />` as the default:

```tsx
addFilter(
    'my_plugin_settings_date_picker_field',
    'my-plugin/date-picker',
    (_Fallback, element) => <MyDatePicker element={element} />
);
```

### Wire applyFilters to `<Settings>`

The `applyFilters` prop must receive the actual `@wordpress/hooks` function — otherwise filters are no-ops:

```tsx
import { applyFilters } from '@wordpress/hooks';

<Settings
    applyFilters={applyFilters}
    hookPrefix="my_plugin"
    // ...
/>
```

---

## PHP Unit Testing

Use `WP_Test_REST_TestCase` to test the REST endpoints:

```php
class SettingsApiTest extends WP_Test_REST_TestCase {
    protected $server;
    protected $admin_id;

    public function set_up(): void {
        parent::set_up();
        global $wp_rest_server;
        $this->server = $wp_rest_server = new WP_REST_Server();
        do_action('rest_api_init');
        $this->admin_id = $this->factory->user->create(['role' => 'administrator']);
        wp_set_current_user($this->admin_id);
        delete_option('my_plugin_settings');
    }

    private function post_request(string $path, array $body): array {
        $request = new WP_REST_Request('POST', $path);
        $request->set_header('Content-Type', 'application/json');
        $request->set_body(wp_json_encode($body));
        $response = $this->server->dispatch($request);
        $this->assertNotWPError($response);
        return $response->get_data();
    }
}
```

**Test the section-grouped payload** — not flat keys:
```php
// CORRECT
$this->post_request('/my-plugin/v1/settings', [
    'app_identity' => ['tag_line' => 'My App', 'app_logo' => ''],
]);

// WRONG — old flat format, will not be read by sanitize()
$this->post_request('/my-plugin/v1/settings', ['tag_line' => 'My App']);
```

**Test partial save preserves other sections:**
```php
// Call schema->save() directly to bypass WP REST arg defaults injection
$schema->save(['app_identity' => ['tag_line' => 'Original', 'app_logo' => '']]);
$schema->save(['appearance'   => ['primary_color' => '#111111']]);

$saved = get_option('my_option_key');
$this->assertSame('Original', $saved['tag_line']); // preserved
$this->assertSame('#111111', $saved['primary_color']); // updated
```

---

## Common Pitfalls Checklist

| Pitfall | Fix |
|---|---|
| Using `'password'` variant | Use `'show_hide'` |
| Field IDs don't match WP REST args properties | Align IDs — WP REST strips unknown properties |
| WP REST arg properties have `required: true` | Set `required: false` to allow partial saves |
| `save()` overwrites the entire option | Use `array_merge($existing, $sanitized)` |
| `sanitize_hex_color()` returns null | Only pass valid hex strings; never use placeholder values |
| Tailwind preflight applied globally | Scope `preflight.css` + `utilities.css` inside root selector |
| Double-translation from Tailwind v3 conflict | Add `transform: none !important` reset inside `.pui-root` |
| WP admin h2/h3/p styles leaking in | Reset `color`, `font-size`, `margin` inside `.pui-root` |
| Active page lost on reload | Use `useSettingsPage` hook with `initialPage` + `onNavigate` |
| Toast not appearing | Add `<Toaster richColors />` inside `<div className="pui-root">` |
| `fetchSchema()` not called after save | Always call it — server sanitizes values |
| Filters not running | Pass `applyFilters` from `@wordpress/hooks` to `<Settings>` |

---

## Steps for a New Integration

1. **PHP**: Create `{Integration}SettingsSchema extends AbstractSettingsSchema` — implement `slug()`, `sections()`, `fields()`, `sanitize()`
2. **PHP**: Create `{Integration}SettingsController extends WP_REST_Controller` — register `GET /settings/schema`, `GET /settings`, `POST /settings`
3. **PHP**: Register the controller in your `ServiceProvider` / `Integration` class
4. **Frontend**: Create an app component with `ThemeProvider + pui-root + Settings + Toaster`
5. **Frontend**: Implement `useSettings(schemaEndpoint, saveEndpoint)` and `useSettingsPage()` hooks
6. **Frontend**: Pass `initialPage` + `onNavigate` to `<Settings>`; pass `applyFilters` if using filter hooks
7. **CSS**: Scope Tailwind preflight/utilities inside your root selectors; add heading/paragraph resets and transform conflict fix
8. **Tests**: Write `WP_Test_REST_TestCase` tests covering schema, fetch, save each section, partial save, sanitization, auth guard
