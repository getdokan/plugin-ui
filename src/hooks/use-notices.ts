import { Notice, NoticeAction } from '@/components/wordpress/AdminNotice';
import apiFetch from '@wordpress/api-fetch';
import { useCallback, useEffect, useState } from 'react';

interface NoticesOptions {
    interval?: number;
    autoSlide?: boolean;
    notices?: Notice[];
    noticesUrl?: string;
    noticesUrlArgs?: Record<string, string>;
    actionUrl?: string;
}

export const useNotices = ({
    interval = 5000,
    autoSlide = true,
    notices: staticNotices = [],
    noticesUrl,
    noticesUrlArgs,
    actionUrl
}: NoticesOptions = {}) => {
    const [notices, setNotices] = useState<Notice[]>([...staticNotices]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(!!noticesUrl);
    const [currentNotice, setCurrentNotice] = useState(1);
    const [isAutoSliding, setIsAutoSliding] = useState(autoSlide);
    const [actionLoading, setActionLoading] = useState<{
        [key: number]: boolean;
    }>({});

    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const url = new URL(noticesUrl as string, window.location.href);

            if (noticesUrlArgs) {
                Object.entries(noticesUrlArgs).forEach(([key, value]) => {
                    url.searchParams.set(key, value);
                });
            }

            const data = await apiFetch<Notice[] | { success: boolean; data: Notice[] }>({
                url: url.toString()
            });

            const fetched = Array.isArray(data) ? data : data.data;
            setNotices(fetched);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch notices');
        } finally {
            setIsLoading(false);
        }
    }, [noticesUrl, noticesUrlArgs]);

    useEffect(() => {
        if (!noticesUrl) {
            return;
        }

        fetchNotices();
    }, [noticesUrl, noticesUrlArgs, fetchNotices]);

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

                await apiFetch({
                    url: actionUrl,
                    method: 'POST',
                    body,
                    parse: false
                });

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
        isLoading,
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
