import { useState, useEffect } from 'react';
import { Plus, Trash2, Power, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Policy } from '@/types/governance';

export function PoliciesPage() {
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPolicy, setNewPolicy] = useState<Partial<Policy>>({
        name: '',
        description: '',
        isActive: true,
        rules: []
    });

    const fetchPolicies = async () => {
        try {
            const res = await fetch('http://localhost:8000/policies');
            if (res.ok) {
                setPolicies(await res.json());
            }
        } catch (err) {
            console.error("Failed to fetch policies", err);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    const togglePolicy = async (policy: Policy) => {
        try {
            const updated = { ...policy, isActive: !policy.isActive };
            await fetch(`http://localhost:8000/policies/${policy.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            fetchPolicies();
        } catch (err) {
            console.error("Failed to toggle policy", err);
        }
    };

    const deletePolicy = async (id: string) => {
        if (!confirm("Are you sure you want to delete this policy?")) return;
        try {
            await fetch(`http://localhost:8000/policies/${id}`, { method: 'DELETE' });
            fetchPolicies();
        } catch (err) {
            console.error("Failed to delete", err);
        }
    };

    const createPolicy = async () => {
        if (!newPolicy.name || !newPolicy.description) return;
        try {
            const policy = {
                id: `pol_${Date.now()}`,
                ...newPolicy,
                rules: ["generic_rule"], // Placeholder
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await fetch('http://localhost:8000/policies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(policy)
            });
            setIsCreating(false);
            setNewPolicy({ name: '', description: '', isActive: true, rules: [] });
            fetchPolicies();
        } catch (err) {
            console.error("Failed to create", err);
        }
    };

    return (
        <div className="h-full flex flex-col p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Policy Manager</h1>
                    <p className="text-muted-foreground">Configure governance rules and ethical constraints</p>
                </div>
                <Button onClick={() => setIsCreating(true)} variant="glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Policy
                </Button>
            </div>

            {isCreating && (
                <div className="glass-card p-4 mb-6 animate-slide-up">
                    <h3 className="font-medium mb-4">New Policy</h3>
                    <div className="flex flex-col gap-3">
                        <input
                            placeholder="Policy Name"
                            className="p-2 rounded bg-black/20 border border-white/10"
                            value={newPolicy.name}
                            onChange={e => setNewPolicy({ ...newPolicy, name: e.target.value })}
                        />
                        <input
                            placeholder="Description"
                            className="p-2 rounded bg-black/20 border border-white/10"
                            value={newPolicy.description}
                            onChange={e => setNewPolicy({ ...newPolicy, description: e.target.value })}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                            <Button variant="default" onClick={createPolicy}>Save Policy</Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {policies.map(policy => (
                    <div key={policy.id} className="glass-card p-4 flex flex-col justify-between group hover:border-primary/50 transition-all">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Shield className={`w-5 h-5 ${policy.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <h3 className="font-semibold">{policy.name}</h3>
                                </div>
                                <Badge variant={policy.isActive ? "success" : "secondary"}>
                                    {policy.isActive ? "Active" : "Disabled"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{policy.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <button
                                onClick={() => togglePolicy(policy)}
                                className={`p-2 rounded transition-colors ${policy.isActive ? 'text-primary hover:bg-primary/10' : 'text-muted-foreground hover:bg-white/10'}`}
                                title={policy.isActive ? "Disable Policy" : "Enable Policy"}
                            >
                                <Power className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => deletePolicy(policy.id)}
                                className="p-2 rounded text-destructive hover:bg-destructive/10 transition-colors"
                                title="Delete Policy"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
