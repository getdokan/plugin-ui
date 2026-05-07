import { RawHTML, useState } from '@wordpress/element';
import { ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotices } from '@/hooks/use-notices';
import { cn } from '@/lib/utils';
import { Modal, ModalDescription, ModalFooter } from '../ui/modal';
import { Button } from '../ui/button';

export interface NoticeAction {
    type: 'primary' | 'secondary';
    text: string;
    action?: string;
    ajax_data?: {
        action: string;
        nonce: string;
        [key: string]: unknown;
    };
    target?: '_self' | '_blank';
    class?: string;
    confirm_message?: string;
    loading_text?: string;
    completed_text?: string;
    reload?: boolean;
}

export interface Notice {
    type: 'primary' | 'success' | 'warning' | 'info' | 'danger';
    title?: string;
    description?: string;
    logo?: string;
    logo_alt?: string;
    actions?: NoticeAction[];
    close_url?: string;
    ajax_data?: {
        action: string;
        nonce: string;
        [key: string]: unknown;
    };
    priority?: number;
}

interface AdminNoticeProps {
    interval?: number;
    notices?: Notice[];
    noticesUrl?: string;
    noticesUrlArgs?: Record<string, string>;
    actionUrl?: string;
}

const actionClasses = (type: NoticeAction['type']) =>
    cn(
        'text-xs leading-4 px-3 py-1.5 mr-1.5 mt-2.5 rounded-sm border transition-all duration-200 no-underline inline-block cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed',
        type === 'primary'
            ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/85'
            : 'border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground'
    );

const noticeAccentClass: Record<Notice['type'], string> = {
    primary: 'border-l-blue-600',
    success: 'border-l-emerald-600',
    warning: 'border-l-amber-500',
    danger: 'border-l-rose-600',
    info: 'border-l-sky-600'
};

interface NoticeActionsProps {
    actions: NoticeAction[];
    noticeIndex: number;
    loading: boolean;
    onActionClick: (action: NoticeAction, index: number) => void;
}

const NoticeActions = ({ actions, noticeIndex, loading, onActionClick }: NoticeActionsProps) => (
    <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {actions.map((action, i) =>
            action.action && !action.ajax_data ? (
                <a
                    key={i}
                    className={cn(actionClasses(action.type), action.class)}
                    href={action.action}
                    target={action.target ?? '_self'}>
                    {action.text}
                </a>
            ) : (
                <button
                    key={i}
                    className={cn(actionClasses(action.type), action.class)}
                    disabled={loading}
                    onClick={() => onActionClick(action, noticeIndex)}>
                    {loading ? action.loading_text ?? 'Loading...' : action.text}
                </button>
            )
        )}
    </div>
);

interface NoticeNavigationProps {
    current: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
}

const NoticeNavigation = ({ current, total, onPrev, onNext }: NoticeNavigationProps) => (
    <div className="flex items-center justify-end">
        <div className="flex gap-2 items-center overflow-hidden rounded-md border border-border bg-[#f6f6f6]">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:text-slate-900 size-7 rounded-none"
                onClick={onPrev}
                disabled={current <= 1}
                aria-label="Previous notice">
                <ChevronLeft size={16} />
            </Button>
            <span className="text-xs h-7 text-slate-700 border-l border-r border-border flex items-center justify-center shrink-0 px-1.5">
                {current} of {total}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hover:text-slate-900 size-7 rounded-none"
                onClick={onNext}
                disabled={current >= total}
                aria-label="Next notice">
                <ChevronRight size={16} />
            </Button>
        </div>
    </div>
);

interface ConfirmModalProps {
    open: boolean;
    action: NoticeAction | null;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmModal = ({ open, action, loading, onConfirm, onClose }: ConfirmModalProps) => (
    <Modal open={open} onClose={onClose} size="sm">
        <ModalDescription className="pt-6">
            <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-400 bg-amber-400">
                    <ShieldAlert color="#fff" size={28} />
                </div>
                <div>
                    <p className="text-base font-semibold text-foreground">Are you sure?</p>
                    <p className="mt-1 text-sm text-muted-foreground">{action?.confirm_message ?? ''}</p>
                </div>
            </div>
        </ModalDescription>
        <ModalFooter>
            <Button variant="outline" onClick={onClose}>
                Cancel
            </Button>
            <Button onClick={onConfirm} disabled={loading}>
                {loading ? action?.loading_text ?? 'Loading...' : action?.text ?? 'Confirm'}
            </Button>
        </ModalFooter>
    </Modal>
);

const AdminNotice = ({ interval = 5000, notices: initialNotices = [], noticesUrl, noticesUrlArgs, actionUrl }: AdminNoticeProps) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [pendingAction, setPendingAction] = useState<{
        action: NoticeAction;
        noticeIndex: number;
    } | null>(null);

    const {
        notices,
        error,
        currentNotice,
        nextNotice,
        prevNotice,
        pauseAutoSlide,
        resumeAutoSlide,
        executeAction,
        actionLoading
    } = useNotices({ interval, notices: initialNotices, noticesUrl, noticesUrlArgs, actionUrl });

    if (error || !notices.length) {
        return null;
    }

    const activeIndex = Math.max(0, Math.min(notices.length - 1, currentNotice - 1));
    const activeNotice = notices[activeIndex];

    const handleActionClick = async (action: NoticeAction, noticeIndex: number) => {
        if (action.confirm_message) {
            setPendingAction({ action, noticeIndex });
            setModalOpen(true);
            return;
        }
        await executeAction(action, noticeIndex);
    };

    const handleModalConfirm = async () => {
        if (pendingAction) {
            await executeAction(pendingAction.action, pendingAction.noticeIndex);
        }
        setModalOpen(false);
        setPendingAction(null);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setPendingAction(null);
    };

    return (
        <div className="w-full overflow-hidden rounded-lg border border-border bg-[#f3f3f3] shadow-sm">
            <div onMouseEnter={pauseAutoSlide} onMouseLeave={resumeAutoSlide}>
                <div
                    className={cn(
                        'overflow-hidden rounded-md flex border-l-4 bg-white p-2 transition-all items-start duration-300 ease-in-out md:p-4',
                        noticeAccentClass[activeNotice.type]
                    )}>
                    <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-start md:gap-6">
                        {activeNotice.logo && (
                            <div className="shrink-0">
                                <img
                                    src={activeNotice.logo}
                                    alt={activeNotice.logo_alt ?? ''}
                                    className="h-24 w-24 rounded-lg object-cover md:h-32 md:w-32"
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            {activeNotice.title && (
                                <h3 className="text-base font-bold leading-tight text-slate-900">
                                    {activeNotice.title}
                                </h3>
                            )}
                            {activeNotice.description && (
                                <div className="mt-1 text-sm leading-6 text-slate-700">
                                    <RawHTML>{activeNotice.description}</RawHTML>
                                </div>
                            )}
                            {activeNotice.actions?.length ? (
                                <NoticeActions
                                    actions={activeNotice.actions}
                                    noticeIndex={activeIndex}
                                    loading={!!actionLoading[activeIndex]}
                                    onActionClick={handleActionClick}
                                />
                            ) : null}
                        </div>
                    </div>

                    {notices.length > 1 && (
                        <NoticeNavigation
                            current={currentNotice}
                            total={notices.length}
                            onPrev={prevNotice}
                            onNext={nextNotice}
                        />
                    )}
                </div>
            </div>

            <ConfirmModal
                open={modalOpen}
                action={pendingAction?.action ?? null}
                loading={pendingAction ? !!actionLoading[pendingAction.noticeIndex] : false}
                onConfirm={handleModalConfirm}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default AdminNotice;
