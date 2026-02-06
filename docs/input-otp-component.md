# InputOTP Component

A specialized input component for One-Time Password (OTP) entry following ShadCN design patterns.

## Installation

```bash
npm install @wedevs/plugin-ui
```

## Import

```tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  Label
} from "@wedevs/plugin-ui";
```

## Basic Usage

```tsx
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

## Controlled Component

```tsx
const [otp, setOtp] = useState("");

<InputOTP maxLength={6} value={otp} onChange={setOtp}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

## With Separator

Use a separator to visually group OTP digits:

```tsx
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

## With Label and Help Text

```tsx
<div className="space-y-2">
  <Label>Verification Code</Label>
  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
  <p className="text-xs text-muted-foreground">
    Enter the 6-digit code sent to your email.
  </p>
</div>
```

## Error State

```tsx
<div className="space-y-2">
  <Label>Invalid Code</Label>
  <InputOTP maxLength={4}>
    <InputOTPGroup aria-invalid>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
    </InputOTPGroup>
  </InputOTP>
  <p className="text-xs text-destructive">
    The verification code you entered is invalid. Please try again.
  </p>
</div>
```

## Different Lengths

### 4-Digit Code
```tsx
<InputOTP maxLength={4}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
  </InputOTPGroup>
</InputOTP>
```

### 6-Digit Code (Most Common)
```tsx
<InputOTP maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

## Complete Examples

### Email Verification
```tsx
const [otp, setOtp] = useState("");

<div className="space-y-2">
  <Label>Verification Code</Label>
  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
  <p className="text-xs text-muted-foreground">
    Enter the 6-digit code sent to your email.
  </p>
</div>
```

### Two-Factor Authentication
```tsx
<div className="space-y-2">
  <div className="flex items-center gap-2">
    <Label>Two-Factor Code</Label>
    <Info className="size-4 text-muted-foreground" />
  </div>
  <InputOTP maxLength={6}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
  <p className="text-xs text-muted-foreground">
    Code expires in 5 minutes.
  </p>
</div>
```

### With Auto-Submit
```tsx
const [otp, setOtp] = useState("");

const handleComplete = (value: string) => {
  if (value.length === 6) {
    // Auto-submit when all digits are entered
    verifyOTP(value);
  }
};

<InputOTP
  maxLength={6}
  value={otp}
  onChange={(value) => {
    setOtp(value);
    handleComplete(value);
  }}
>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

## Props Reference

### InputOTP Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maxLength` | `number` | Required | Maximum number of characters |
| `value` | `string` | `undefined` | Controlled value |
| `onChange` | `function` | `undefined` | Change handler, receives the OTP value |
| `disabled` | `boolean` | `false` | Disable all inputs |
| `containerClassName` | `string` | `undefined` | Additional classes for container |
| `className` | `string` | `undefined` | Additional CSS classes |

### InputOTPGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `aria-invalid` | `boolean` | `false` | Error state for the group |
| `className` | `string` | `undefined` | Additional CSS classes |

### InputOTPSlot Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `index` | `number` | Required | Position index (0-based) |
| `className` | `string` | `undefined` | Additional CSS classes |

## Best Practices

1. **Length**: Most OTP codes are 4 or 6 digits
2. **Auto-focus**: Consider auto-focusing the first input on mount
3. **Auto-submit**: Submit automatically when all digits are entered
4. **Error handling**: Show clear error messages for invalid codes
5. **Expiration**: Display code expiration time when applicable
6. **Paste support**: The component supports pasting full codes
7. **Keyboard navigation**: Users can navigate between slots with arrow keys

## Common Patterns

### Resend Code
```tsx
const [canResend, setCanResend] = useState(false);
const [timer, setTimer] = useState(60);

<div className="space-y-4">
  <InputOTP maxLength={6}>
    <InputOTPGroup>
      <InputOTPSlot index={0} />
      <InputOTPSlot index={1} />
      <InputOTPSlot index={2} />
      <InputOTPSlot index={3} />
      <InputOTPSlot index={4} />
      <InputOTPSlot index={5} />
    </InputOTPGroup>
  </InputOTP>
  <div className="text-sm">
    {canResend ? (
      <Button variant="link" onClick={handleResend}>
        Resend Code
      </Button>
    ) : (
      <span className="text-muted-foreground">
        Resend code in {timer}s
      </span>
    )}
  </div>
</div>
```

### Verification Flow
```tsx
const [otp, setOtp] = useState("");
const [error, setError] = useState("");
const [isVerifying, setIsVerifying] = useState(false);

<div className="space-y-4">
  <div className="space-y-2">
    <Label>Enter Verification Code</Label>
    <InputOTP
      maxLength={6}
      value={otp}
      onChange={setOtp}
      disabled={isVerifying}
    >
      <InputOTPGroup aria-invalid={!!error}>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
    {error && (
      <p className="text-xs text-destructive">{error}</p>
    )}
  </div>
  <Button
    onClick={handleVerify}
    disabled={otp.length !== 6 || isVerifying}
    className="w-full"
  >
    {isVerifying ? "Verifying..." : "Verify Code"}
  </Button>
</div>
```

## Accessibility

- Each slot is properly labeled and keyboard accessible
- Supports keyboard navigation between slots
- Paste functionality for quick code entry
- Focus states clearly visible
- Error states communicated via aria-invalid
- Screen reader friendly with proper ARIA labels
