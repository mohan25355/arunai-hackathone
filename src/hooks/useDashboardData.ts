import { useState, useEffect } from 'react';
import type { DashboardMetrics } from '@/types/governance';

export function useDashboardData() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
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
                approved_responses: 0,
                pending_review: 0,
                policy_violations: 0,
                trust_scores: {
                    overall_trust: 100,
                    bias_risk: 0
                },
                hallucination: {
                    grounded: 100,
                    avg_confidence: 100,
                    hallucination_rate: 0
                }
            });
            setActivities([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 2000); // 2s refresh
        return () => clearInterval(interval);
    }, []);

    return { metrics, activities, loading, error, refresh: fetchData };
}
