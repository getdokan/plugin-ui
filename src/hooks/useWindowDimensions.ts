import { useCallback, useEffect, useState } from 'react';

interface ViewportDimensions {
    width: number | null;
    height: number | null;
}

export default function useWindowDimensions() {
    const getViewportDimensions = useCallback(
        (): ViewportDimensions => ({
            width: typeof window !== 'undefined' ? window.innerWidth : null,
            height: typeof window !== 'undefined' ? window.innerHeight : null
        }),
        []
    );

    const [viewport, setViewport] = useState<ViewportDimensions>(getViewportDimensions());

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const handleResize = () => {
            // Use requestAnimationFrame to throttle updates
            window.requestAnimationFrame(() => {
                setViewport(getViewportDimensions());
            });
        };

        window.addEventListener('resize', handleResize);

        // Initial measurement after mount
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [getViewportDimensions]);

    return viewport;
}
