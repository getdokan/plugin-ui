---
name: "Settings Integration"
description: Guide for integrating plugin-ui <Settings> into a WordPress plugin — covers PHP schema, REST API, frontend wiring, CSS, testing, and common pitfalls.
category: Integration
tags: [settings, plugin-ui, wordpress, php, rest-api, react]
---

You are helping a developer integrate the `@wedevs/plugin-ui` `<Settings>` component into a WordPress plugin.

When invoked with `/settings-integration`, read the current codebase to understand the integration state, then guide, scaffold, or fix whatever the user asks.

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
    abstract protected function slug(): string; // e.g. 'woocommerce', 'dokan'

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

**Option key** is automatically `pocket_store_{slug}_settings`.

### 2. Field Definition Structure

```php
[
    'id'             => 'tag_line',           // CRITICAL: must match WP REST args key for nested objects
    'type'           => 'field',
    'variant'        => 'text',               // text | show_hide | color_picker | switch | wp_media_upload
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

    if (isset($data['vendor_app'])) {
        $s = $data['vendor_app'];
        $result['enable_vendor_app'] = (bool)($s['enable_vendor_app'] ?? true);
        $result['vendor_tagline']    = sanitize_text_field($s['vendor_tagline'] ?? '');
    }
    return $result;
}
```

### 4. Nested Object Fields and WP REST Args

For nested objects (e.g. `onesignal`), field **IDs must match the WP REST args property names**:

```php
// CORRECT — field id matches REST args property key
[ 'id' => 'app_id',      'section_id' => 'onesignal', ... ]
[ 'id' => 'rest_api_key','section_id' => 'onesignal', ... ]

// WRONG — WP REST strips 'onesignal_app_id' (not in registered properties)
[ 'id' => 'onesignal_app_id', 'section_id' => 'onesignal', ... ]
```

WP REST **strips unknown properties** from registered `object` args. If stripped, the object becomes `{}` and `required: true` properties fail validation.

**Set `'required' => false` on nested properties** to allow partial saves:
```php
'onesignal' => [
    'required'   => false,
    'type'       => 'object',
    'properties' => [
        'app_id'       => [ 'required' => false, 'type' => 'string', 'default' => '' ],
        'rest_api_key' => [ 'required' => false, 'type' => 'string', 'default' => '' ],
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

`sanitize_hex_color()` returns `null` for invalid hex strings. Never use placeholder values like `'#NEWCOLOR'` — use real hex values like `'#FF9472'`.

---

## Frontend

### 1. App Structure

```tsx
import { ThemeProvider, Settings, Toaster } from '@wedevs/plugin-ui';
import { useSettings, useSettingsPage } from '../../hooks';

const MyApp = () => {
    const { schema, values, isLoading, onChange, onSave } = useSettings(
        'my-plugin/v1/settings/schema',
        'my-plugin/v1/settings'
    );
    const { initialPage, onNavigate } = useSettingsPage();

    if (isLoading) return <div className="p-6"><p>Loading...</p></div>;

    return (
        <ThemeProvider pluginId="my-plugin" tokens={{ primary: '#6366f1', primaryForeground: '#ffffff' }}>
            <div className="pui-root">
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

```ts
const onSave = useCallback(
    async (_scopeId: string, treeValues: Record<string, any>) => {
        try {
            await apiFetch({ path: saveEndpoint, method: 'POST', data: treeValues });
            await fetchSchema(); // refresh values from server
            toast.success(__('Settings saved.', 'my-plugin'));
        } catch (err: any) {
            toast.error(err?.message ?? __('Failed to save settings.', 'my-plugin'));
        }
    },
    [saveEndpoint, fetchSchema]
);
```

**Always `fetchSchema()` after save** — the server is the source of truth for sanitized values.

### 3. useSettingsPage Hook (Query Param Persistence)

```ts
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

URL becomes: `admin.php?page=mobile-app-vendor-app&settings_page=appearance`

The `initialPage` prop on `<Settings>` seeds the active page from the URL on mount. `onNavigate` updates the URL without a page reload when the user switches pages.

---

## CSS — WordPress Admin Conflicts

### 1. Root Scoping

All app output must be wrapped in `<div className="pui-root">`. All CSS resets and conflict fixes are scoped to `.pui-root`.

### 2. WordPress Admin Heading/Paragraph Overrides

WP admin sets `h2, h3 { color: #1d2327; font-size: 1.3em }` and paragraph margins. Reset inside `index.css`:

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

### 3. Tailwind v3/v4 Transform Conflict

Other WP plugins (e.g. Dokan Pro) may use Tailwind v3 which generates:
```css
.-translate-y-1\/2 { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(...); }
```

plugin-ui uses Tailwind v4's individual `translate` CSS property. Both apply simultaneously causing double-translation. Fix in `index.css`:

```css
/* Reset Tailwind v3 transform shorthand from other plugins */
.pui-root [class*="translate-"],
.pui-root [class*="-translate-"] {
    transform: none !important;
}
```

This is safe — Tailwind v4 uses `translate` (not `transform`) for positioning.

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

// WRONG — this is what the old flat format looked like
$this->post_request('/my-plugin/v1/settings', ['tag_line' => 'My App']);
```

**Test partial save preserves other sections:**
```php
// Call schema->save() directly to bypass WP REST arg defaults injection
$schema->save(['app_identity' => ['tag_line' => 'Original', ...]]);
$schema->save(['button_colors' => ['primary_button_color_1' => '#111111', ...]]);

$saved = get_option('my_option_key');
$this->assertSame('Original', $saved['tag_line']); // preserved
$this->assertSame('#111111', $saved['primary_button_color_1']); // updated
```

---

## Common Pitfalls Checklist

| Pitfall | Fix |
|---|---|
| Using `'password'` variant | Use `'show_hide'` |
| Field IDs don't match WP REST args properties | Align IDs — WP REST strips unknown properties |
| WP REST arg properties have `required: true` | Set `required: false` to allow partial saves |
| `save()` overwrites the entire option | Use `array_merge($existing, $sanitized)` |
| `sanitize_hex_color()` returns null | Only pass valid hex strings; test colors like `#FF9472` not `#NEWCOLOR` |
| Double-translation from Tailwind v3 conflict | Add `transform: none !important` reset inside `.pui-root` |
| WP admin h2/h3/p styles leaking in | Reset `color`, `font-size`, `margin` inside `.pui-root` |
| Active page lost on reload | Use `useSettingsPage` hook with `initialPage` + `onNavigate` |
| Toast not appearing | Add `<Toaster richColors />` inside `<div className="pui-root">` |
| `fetchSchema()` not called after save | Always call it — server sanitizes values |

---

## Steps for a New Integration

1. **PHP**: Create `{Integration}SettingsSchema extends AbstractSettingsSchema` — implement `slug()`, `sections()`, `fields()`, `sanitize()`
2. **PHP**: Create `{Integration}SettingsController extends WP_REST_Controller` — register `GET /settings/schema`, `GET /settings`, `POST /settings`
3. **PHP**: Register the controller in your `ServiceProvider` / `Integration` class
4. **Frontend**: Create an app component with `ThemeProvider + pui-root + Settings + Toaster`
5. **Frontend**: Use `useSettings(schemaEndpoint, saveEndpoint)` hook
6. **Frontend**: Use `useSettingsPage()` and pass `initialPage` + `onNavigate` to `<Settings>`
7. **CSS**: Add `pui-root` heading/paragraph resets and transform conflict fix to `index.css`
8. **Tests**: Write `WP_Test_REST_TestCase` tests covering schema, fetch, save each section, partial save, sanitization, auth guard
