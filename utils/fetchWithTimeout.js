// Lightweight fetch with timeout to avoid long SSR stalls
export async function fetchWithTimeout(url, options = {}, timeoutMs = 800) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

export default fetchWithTimeout;