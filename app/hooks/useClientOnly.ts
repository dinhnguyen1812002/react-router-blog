import { useEffect, useState } from "react";

/**
 * Hook to check if code is running on client side
 * Useful for preventing SSR issues with browser-only APIs
 */
export const useClientOnly = () => {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return isClient;
};

/**
 * Hook to safely access window object
 * Returns null during SSR, window object on client
 */
export const useWindow = () => {
	const isClient = useClientOnly();
	return isClient ? window : null;
};

/**
 * Component wrapper that only renders children on client side
 * Useful for components that use browser-only APIs
 */
interface ClientOnlyProps {
	children: React.ReactNode;
	fallback?: React.ReactNode;
}

export function ClientOnly({
	children,
	fallback = null,
}: ClientOnlyProps): React.ReactElement | null {
	const isClient = useClientOnly();

	if (!isClient) {
		return fallback ? (fallback as React.ReactElement) : null;
	}

	return children as React.ReactElement;
}
