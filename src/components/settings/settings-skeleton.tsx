import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

// ============================================
// Settings Skeleton — matches the real layout
// ============================================

export function SettingsSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'relative flex min-h-[500px] rounded-lg border border-border bg-background overflow-hidden',
                className
            )}
            aria-busy="true"
            aria-label="Loading settings"
        >
            {/* ── Sidebar ── */}
            <aside className="hidden lg:flex lg:w-64 shrink-0 flex-col border-r border-border bg-muted/30 p-3 gap-2">
                {/* Title */}
                <div className="px-1 py-2 border-b border-border mb-1">
                    <Skeleton className="h-4 w-32" />
                </div>
                {/* Search bar */}
                <Skeleton className="h-8 w-full rounded-md" />
                {/* Nav items */}
                <SidebarNavSkeleton />
            </aside>

            {/* ── Content ── */}
            <div className="flex flex-1 min-w-0 flex-col">
                <ContentSkeleton />
            </div>
        </div>
    );
}

// ── Sidebar nav items ─────────────────────────────────────────────────────────

function SidebarNavSkeleton() {
    return (
        <nav className="flex flex-col gap-1 mt-1">
            {[80, 64, 72, 56, 68].map((w, i) => (
                <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                    <Skeleton className="size-4 shrink-0 rounded" />
                    <Skeleton className="h-3.5 rounded" style={{ width: w }} />
                </div>
            ))}
        </nav>
    );
}

// ── Content area ──────────────────────────────────────────────────────────────

function ContentSkeleton() {
    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            {/* Page heading */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
                <Skeleton className="h-7 w-48 mb-2" />
                <Skeleton className="h-4 w-72" />
            </div>

            {/* Tabs */}
            <div className="px-6 border-b border-border flex gap-6 py-2.5">
                {[48, 64, 56].map((w, i) => (
                    <Skeleton key={i} className="h-4 rounded" style={{ width: w }} />
                ))}
            </div>

            {/* Sections */}
            <div className="p-6 space-y-6">
                <SectionSkeleton fieldCount={3} />
                <SectionSkeleton fieldCount={2} />
            </div>
        </div>
    );
}

// ── Single section ────────────────────────────────────────────────────────────

function SectionSkeleton({ fieldCount }: { fieldCount: number }) {
    return (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Section header */}
            <div className="px-5 pt-5 pb-3 border-b border-border">
                <Skeleton className="h-5 w-40 mb-1.5" />
                <Skeleton className="h-3.5 w-64" />
            </div>
            {/* Fields */}
            <div className="divide-y divide-border">
                {Array.from({ length: fieldCount }).map((_, i) => (
                    <FieldSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}

// ── Single field row ──────────────────────────────────────────────────────────

function FieldSkeleton() {
    return (
        <div className="flex items-center justify-between px-5 py-4 gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3.5 w-56" />
            </div>
            <Skeleton className="h-6 w-10 shrink-0 rounded-full" />
        </div>
    );
}
