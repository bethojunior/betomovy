class RetryUtils {
    static async withRetry(asyncFunction, retries = 2, delay = 1500) {
        let lastError;
        for (let i = 0; i <= retries; i++) {
            try {
                return await asyncFunction();
            } catch (error) {
                lastError = error;
                if (i < retries) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        throw lastError;
    }
}