import { useEffect, useRef } from 'react';

// runs only when a dependencies changes, not on loading
export function useUpdateEffect(callback, dependencies=[]) {
    const firstRenderRef = useRef(true);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return
        }
        return callback()
    }, dependencies)
}