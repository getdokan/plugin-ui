import { Notice, NoticeAction } from '@/components/wordpress/AdminNotice';
import { useEffect, useState } from 'react';

interface NoticesOptions {
    interval?: number;
    autoSlide?: boolean;
    notices?: Notice[];
    actionUrl?: string;
}

export const useNotices = ({
    interval = 5000,
    autoSlide = true,
    notices: staticNotices = [],
    actionUrl
}: NoticesOptions = {}) => {
    const [notices, setNotices] = useState<Notice[]>([...staticNotices]);
    const [error, setError] = useState<string | null>(null);
    const [currentNotice, setCurrentNotice] = useState(1);
    const [isAutoSliding, setIsAutoSliding] = useState(autoSlide);
    const [actionLoading, setActionLoading] = useState<{
        [key: number]: boolean;
    }>({});

    useEffect(() => {
        if (!isAutoSliding || notices.length <= 1) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentNotice((prev) => (prev >= notices.length ? 1 : prev + 1));
        }, interval);

        return () => clearInterval(timer);
    }, [isAutoSliding, notices.length, interval]);

    const nextNotice = () => {
        setCurrentNotice((prev) => (prev >= notices.length ? 1 : prev + 1));
    };

    const prevNotice = () => {
        setCurrentNotice((prev) => (prev <= 1 ? notices.length : prev - 1));
    };

    const pauseAutoSlide = () => setIsAutoSliding(false);
    const resumeAutoSlide = () => setIsAutoSliding(autoSlide);

    const closeNotice = async (notice: Notice, index: number) => {
        if (!notice) {
            return;
        }

        setNotices((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNoticeAt = (noticeIndex: number) => {
        setNotices((prev) => {
            const newNotices = prev.filter((_, i) => i !== noticeIndex);

            if (currentNotice > newNotices.length && newNotices.length > 0) {
                setCurrentNotice(1);
            } else if (currentNotice > 1 && noticeIndex < currentNotice - 1) {
                setCurrentNotice((prevCurrent) => prevCurrent - 1);
            }

            return newNotices;
        });
    };

    const executeAction = async (action: NoticeAction, noticeIndex: number) => {
        setActionLoading((prev) => ({ ...prev, [noticeIndex]: true }));

        try {
            if (action.ajax_data) {
                if (!actionUrl) {
                    throw new Error('actionUrl is required for AJAX actions');
                }

                const body = new URLSearchParams();
                Object.entries(action.ajax_data).forEach(([key, value]) => {
                    body.append(key, String(value));
                });

                const response = await fetch(actionUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body
                });

                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }

                removeNoticeAt(noticeIndex);
            } else {
                removeNoticeAt(noticeIndex);

                if (action.action) {
                    if (action.target === '_blank') {
                        window.open(action.action, '_blank', 'noopener,noreferrer');
                    } else {
                        window.location.href = action.action;
                    }
                    return;
                }
            }

            if (action.reload) {
                window.location.reload();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Action failed');
        } finally {
            setActionLoading((prev) => ({ ...prev, [noticeIndex]: false }));
        }
    };

    return {
        notices,
        error,
        currentNotice,
        nextNotice,
        prevNotice,
        pauseAutoSlide,
        resumeAutoSlide,
        closeNotice,
        executeAction,
        actionLoading
    };
};
