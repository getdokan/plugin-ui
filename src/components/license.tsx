import { useMemo, useState, type HTMLAttributes, type ReactNode } from "react";
import { RawHTML } from "@wordpress/element";
import { doAction } from "@wordpress/hooks";
import { Calendar, Eye, EyeOff, Info, KeyRound, LoaderCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Badge } from "./ui";

export interface LicenseStatus {
  is_valid: boolean;
  expiry_days?: number;
  data?: {
    key?: string;
    remaining?: number;
    activation_limit?: number;
  };
}

export interface LicenseLabels {
  title?: string;
  activationTitle?: string;
  activationDescription?: string;
  activateLicenseHeading?: string;
  activateLicenseSubheading?: string;
  licenseKeyLabel?: string;
  licenseKeyPlaceholder?: string;
  activateButton?: string;
  deactivateButton?: string;
  refreshButton?: string;
  activeStatus?: string;
  maskedKeyInfo?: string;
  activationsRemainingTitle?: string;
  usageLabel?: string;
  outOfLabel?: string;
  activationInfoUnavailable?: string;
  licenseExpiryTitle?: string;
  perpetualLicenseMessage?: string;
  expiryMessage?: (date: string, days: number) => string;
  expiryInfoUnavailable?: string;
  deactivateConfirmTitle?: string;
  deactivateConfirmMessage?: string;
  cancelButton?: string;
  confirmDeactivateButton?: string;
  showKeyLabel?: string;
  hideKeyLabel?: string;
}

export interface LicenseClassNames {
  /** Root wrapper div */
  root?: string;
  /** Page title (h1) */
  title?: string;
  /** Loading overlay backdrop */
  loadingOverlay?: string;
  /** Loading spinner icon */
  loadingSpinner?: string;
  /** Main license card */
  card?: string;
  /** Card header section (contains title, badge, description, image) */
  header?: string;
  /** Header title (h2) */
  headerTitle?: string;
  /** Header description paragraph */
  headerDescription?: string;
  /** Header image container */
  headerImageContainer?: string;
  /** Card body section */
  body?: string;
  /** Activate license heading section (icon + text) */
  activateHeading?: string;
  /** Activate heading icon container */
  activateHeadingIcon?: string;
  /** Activate heading title (h3) */
  activateHeadingTitle?: string;
  /** Activate heading subtitle */
  activateHeadingSubtitle?: string;
  /** License key label */
  licenseKeyLabel?: string;
  /** License key input */
  input?: string;
  /** Error message text */
  errorMessage?: string;
  /** Masked key info row */
  maskedKeyInfo?: string;
  /** Action buttons container */
  actions?: string;
  /** Status cards grid (activations + expiry) */
  statusGrid?: string;
  /** Activations remaining card */
  activationsCard?: string;
  /** License expiry card */
  expiryCard?: string;
}

export interface LicenseProps extends HTMLAttributes<HTMLDivElement> {
  /** Current license key value */
  licenseKey: string;
  /** Callback when the license key input changes */
  onLicenseKeyChange: (key: string) => void;
  /** Current license status data */
  status: LicenseStatus | null;
  /** Whether a license operation is in progress */
  loading: boolean;
  /** Current error message, empty string if no error */
  error: string;
  /** Called when user clicks the Activate button */
  onActivate: () => void;
  /** Called when user confirms deactivation. Receives `closeDialog` to dismiss the confirmation when ready. */
  onDeactivate: (closeDialog: () => void) => void;
  /** Called when user clicks the Refresh button */
  onRefresh: () => void;
  /** Custom header image/illustration rendered in the top-right of the card */
  headerImage?: ReactNode;
  /** Namespace for WordPress hooks (doAction). Defaults to 'plugin_ui' */
  hookNamespace?: string;
  /** Plugin name used in default label strings. Defaults to 'Plugin' */
  pluginName?: string;
  /** Override default label strings for i18n or customization */
  labels?: LicenseLabels;
  /** Format a date string for display (e.g., using dateI18n from @wordpress/date) */
  formatDate?: (date: Date) => string;
  /** Override Tailwind class names for individual sections of the component */
  classNames?: LicenseClassNames;
}

const maskKey = (key: string): string => {
  if (!key) return "";
  if (key.length <= 8) return "*".repeat(key.length);
  return key.substring(0, 18) + "*".repeat(Math.max(10, key.length - 18));
};

const getUsagePercentage = (
  limit: number,
  remaining: number,
): number => {
  return Math.min(100, Math.round(((limit - remaining) / (limit || 1)) * 100));
};

const defaultFormatDate = (date: Date): string => {
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function License({
  licenseKey,
  onLicenseKeyChange,
  status,
  loading,
  error,
  onActivate,
  onDeactivate,
  onRefresh,
  headerImage,
  hookNamespace = "plugin_ui",
  pluginName = "Plugin",
  labels: labelOverrides = {},
  formatDate = defaultFormatDate,
  classNames: cx = {},
  className,
  ...props
}: LicenseProps) {
  const [showKey, setShowKey] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  const hasActive = useMemo(() => Boolean(status?.is_valid), [status]);

  const labels = useMemo(() => {
    const defaults: Required<LicenseLabels> = {
      title: "License",
      activationTitle: "License Activation",
      activationDescription: `Activate ${pluginName} with your license key for automatic updates and expert support from your dashboard.`,
      activateLicenseHeading: "Activate License",
      activateLicenseSubheading:
        "Enter your license key to activate your software",
      licenseKeyLabel: `${pluginName} License Key`,
      licenseKeyPlaceholder: "Enter your key here",
      activateButton: "Activate License",
      deactivateButton: "Deactivate License",
      refreshButton: "Refresh",
      activeStatus: "Active",
      maskedKeyInfo: "Your license key is masked for security purposes",
      activationsRemainingTitle: "Activations Remaining",
      usageLabel: "Usage",
      outOfLabel: "out of",
      activationInfoUnavailable: "Activation information not available.",
      licenseExpiryTitle: "License Expiry",
      perpetualLicenseMessage: `Your ${pluginName} license is perpetual and will never expire.`,
      expiryMessage: (date: string, days: number) =>
        `Your ${pluginName} license expires on <strong>${date}</strong> (${days} days left)`,
      expiryInfoUnavailable: "Expiry information not available.",
      deactivateConfirmTitle:
        "Are you sure you want to deactivate the license key?",
      deactivateConfirmMessage:
        "Deactivating will disable updates and support until you activate again.",
      cancelButton: "Cancel",
      confirmDeactivateButton: "Yes, Deactivate",
      showKeyLabel: "Show key",
      hideKeyLabel: "Hide key",
    };
    return { ...defaults, ...labelOverrides };
  }, [labelOverrides, pluginName]);

  const maskedOrReal = showKey ? licenseKey : maskKey(licenseKey);

  const handleActivate = () => {
    doAction(`${hookNamespace}_license_action`, {
      action: "activate",
      licenseKey,
    });
    onActivate();
  };

  const handleDeactivate = () => {
    doAction(`${hookNamespace}_license_action`, {
      action: "deactivate",
    });
    onDeactivate(() => setDeactivateDialogOpen(false));
  };

  const handleRefresh = () => {
    doAction(`${hookNamespace}_license_action`, {
      action: "refresh",
    });
    onRefresh();
  };

  const expiryDate =
    typeof status?.expiry_days === "number" && status.expiry_days > 0
      ? new Date(Date.now() + status.expiry_days * 24 * 60 * 60 * 1000)
      : null;

  return (
    <div
      className={cn("w-full max-w-2xl lg:max-w-3xl mx-auto", cx.root, className)}
      {...props}
    >
      <h1 className={cn("text-2xl font-bold mb-6", cx.title)}>{labels.title}</h1>

      <div className="relative">
        {loading && (
          <div className={cn("absolute inset-0 rounded-lg w-full h-full z-10 backdrop-blur-sm", cx.loadingOverlay)}>
            <div className="flex items-center justify-center h-full">
              <LoaderCircle role="status" aria-label="Loading" className={cn("animate-spin size-10 text-primary", cx.loadingSpinner)} strokeWidth={1} />
            </div>
          </div>
        )}

        <Card className={cn("bg-card rounded-lg mb-6 p-0 gap-0", cx.card)}>
          {/* Header section */}
          <div className={cn("flex items-start justify-between p-6 border-b border-border", cx.header)}>
            <div className="flex justify-between w-full">
              <div className="w-full md:w-1/2">
                <div className="flex gap-2.5 items-center">
                  <h2 className={cn("text-lg font-bold m-0", cx.headerTitle)}>{labels.activationTitle}</h2>
                  {hasActive && (
                    <Badge variant="success">
                      {labels.activeStatus}
                    </Badge>
                  )}
                </div>
                <p className={cn("m-0 mt-4 text-muted-foreground text-sm leading-snug", cx.headerDescription)}>
                  {labels.activationDescription}
                </p>
              </div>
              {headerImage && (
                <div className={cn("sm:hidden md:flex w-1/2 justify-end", cx.headerImageContainer)}>
                  {headerImage}
                </div>
              )}
            </div>
          </div>

          {/* Body section */}
          <div className={cn("p-6", cx.body)}>
            {/* Activate heading (shown when not active) */}
            {!hasActive && (
              <div className={cn("flex gap-3.5 mb-7", cx.activateHeading)}>
                <div className={cn("bg-primary/10 size-11 rounded-xl flex items-center justify-center", cx.activateHeadingIcon)}>
                  <KeyRound size={20} className="text-primary" />
                </div>
                <div className="flex flex-col justify-between">
                  <h3 className={cn("text-foreground font-bold text-lg p-0 m-0", cx.activateHeadingTitle)}>
                    {labels.activateLicenseHeading}
                  </h3>
                  <span className={cn("text-xs text-muted-foreground", cx.activateHeadingSubtitle)}>
                    {labels.activateLicenseSubheading}
                  </span>
                </div>
              </div>
            )}

            {/* License key label */}
            <div className={cn("cursor-pointer text-sm font-semibold text-foreground mb-2.5 inline-block", cx.licenseKeyLabel)}>
              {labels.licenseKeyLabel}
            </div>

            {/* License key input */}
            <div className="relative">
              <Input
                type={showKey || hasActive ? "text" : "password"}
                placeholder={labels.licenseKeyPlaceholder}
                name="license_key"
                value={hasActive ? maskedOrReal : licenseKey}
                onChange={(e) => onLicenseKeyChange(e.target.value)}
                disabled={loading || hasActive}
                className={cn(
                  "pr-10",
                  error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
                  cx.input
                )}
              />
              <button
                type="button"
                className="absolute text-muted-foreground hover:text-foreground top-1/2 -translate-y-1/2 right-3"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? labels.hideKeyLabel : labels.showKeyLabel}
                disabled={loading || hasActive}
              >
                {showKey || hasActive ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p className={cn("text-destructive text-sm m-0 mt-2", cx.errorMessage)}>{error}</p>
            )}

            {/* Masked key info */}
            {!error && hasActive && (
              <div className={cn("text-sm text-muted-foreground mt-2 flex gap-1.5 items-center", cx.maskedKeyInfo)}>
                <Info size={16} strokeWidth={3} />
                <span>{labels.maskedKeyInfo}</span>
              </div>
            )}

            {/* Action buttons */}
            <div className={cn("flex items-center gap-3 mt-6", cx.actions)}>
              {hasActive ? (
                <>
                  <AlertDialog open={deactivateDialogOpen} onOpenChange={(open) => { if (!loading) setDeactivateDialogOpen(open); }}>
                    <AlertDialogTrigger>
                      <Button variant="destructive" size="sm" disabled={loading}>{labels.deactivateButton}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="p-0! m-0!">
                          {labels.deactivateConfirmTitle}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="p-0! m-0!">
                          {labels.deactivateConfirmMessage}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>
                          {labels.cancelButton}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={handleDeactivate}
                          disabled={loading}
                        >
                          {labels.confirmDeactivateButton}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <RefreshCw size={16} strokeWidth={3} />
                    {labels.refreshButton}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={handleActivate}
                  disabled={loading || !licenseKey.length}
                >
                  {labels.activateButton}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Status cards (shown when active) */}
        {hasActive && (
          <div className={cn("grid gap-6 grid-cols-1 md:grid-cols-2 max-w-4xl", cx.statusGrid)}>
            {/* Activations Remaining card */}
            <Card className={cn("bg-card rounded-lg p-6 gap-0", cx.activationsCard)}>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-primary/10 size-11 rounded-full flex items-center justify-center">
                  <KeyRound size={20} className="text-primary" />
                </div>
                <div className="font-semibold text-sm text-foreground">
                  {labels.activationsRemainingTitle}
                </div>
              </div>
              {typeof status?.data?.remaining !== "undefined" &&
              typeof status?.data?.activation_limit !== "undefined" ? (
                <>
                  <div className="text-xs text-muted-foreground mb-2">
                    {labels.usageLabel}
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div className="h-2 bg-destructive/15 rounded-full overflow-hidden w-full">
                      <div
                        className="h-2 bg-destructive rounded-full"
                        style={{
                          width: `${getUsagePercentage(
                            status.data.activation_limit,
                            status.data.remaining,
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="text-foreground text-xs flex flex-row w-8 justify-end">
                      {getUsagePercentage(
                        status.data.activation_limit,
                        status.data.remaining,
                      )}
                      %
                    </div>
                  </div>
                  <div className="text-destructive mt-2 text-xs">
                    {`${status.data.activation_limit - status.data.remaining} ${labels.outOfLabel} ${status.data.activation_limit}`}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground text-sm">
                  {labels.activationInfoUnavailable}
                </div>
              )}
            </Card>

            {/* License Expiry card */}
            <Card className={cn("bg-card rounded-lg p-6 gap-0", cx.expiryCard)}>
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-primary/10 size-11 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div className="font-semibold text-sm text-foreground">
                  {labels.licenseExpiryTitle}
                </div>
              </div>
              {typeof status?.expiry_days === "number" ? (
                status.expiry_days <= 0 ? (
                  <div className="text-sm text-foreground">
                    {labels.perpetualLicenseMessage}
                  </div>
                ) : (
                  <div className="flex gap-2.5">
                    <Info
                      size={16}
                      strokeWidth={3}
                      className="min-w-4 mt-0.5"
                    />
                    <RawHTML className="text-sm text-foreground">
                      {labels.expiryMessage!(
                        expiryDate ? formatDate(expiryDate) : "",
                        status.expiry_days,
                      )}
                    </RawHTML>
                  </div>
                )
              ) : (
                <div className="text-sm text-muted-foreground">
                  {labels.expiryInfoUnavailable}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

    </div>
  );
}
