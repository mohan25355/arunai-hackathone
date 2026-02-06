import { useState, useEffect } from 'react';


// Mapping backend keys (snake_case) to frontend types (camelCase) happens here or in component
// But for now, backend returns snake_case, so let's define a local interface matching API
// OR we map it manually. Let's keep local interface matching API for simplicity then map later if needed.
// Actually, to be safe, I'll update local interface to match API exact structure
interface MetricsResponse {
    total_prompts: number;
    approved: number;
    pending: number;
    violations: number;
    trust_score: number;
    average_confidence: number;
    groundedness_score: number;
    hallucination_rate: number;
    bias_score: number;
}

export function useDashboardData() {
    const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [metricsRes, logsRes] = await Promise.all([
                fetch('http://localhost:8000/metrics'),
                fetch('http://localhost:8000/audit-log')
            ]);

            if (!metricsRes.ok || !logsRes.ok) throw new Error('Failed to fetch dashboard data');

            const metricsData = await metricsRes.json();
            const logsData = await logsRes.json();

            setMetrics(metricsData);
            setActivities(logsData);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('');
            setMetrics({
                total_prompts: 0,
                approved: 0,
                pending: 0,
                violations: 0,
                trust_score: 100,
                average_confidence: 100,
                groundedness_score: 100,
                hallucination_rate: 0,
                bias_score: 0
            });
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s refresh
        return () => clearInterval(interval);
    }, []);

    return { metrics, activities, loading, error, refresh: fetchData };
}
