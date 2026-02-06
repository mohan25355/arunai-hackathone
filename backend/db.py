# Stub for database connection
# In a real app, this would connect to PostgreSQL/MongoDB

class Database:
    def __init__(self):
        self.logs = []

    async def log_event(self, event: dict):
        self.logs.append(event)
        print(f"Logged event: {event}")

    async def get_policies(self):
        if not hasattr(self, "policies"):
             self.policies = [
                {
                    "id": "pol_1",
                    "name": "No PII",
                    "description": "Ensure no Personally Identifiable Information is leaked.",
                    "isActive": True,
                    "rules": ["pattern_match_ssn", "pattern_match_email"]
                },
                {
                    "id": "pol_2",
                    "name": "Toxic Content",
                    "description": "Block harmful or toxic content.",
                    "isActive": True,
                    "rules": ["sentiment_analysis", "keyword_blocklist"]
                }
            ]
        return self.policies

    async def add_policy(self, policy: dict):
        if not hasattr(self, "policies"):
            await self.get_policies() # Initialize
        self.policies.append(policy)
        print(f"Added policy: {policy}")
        return policy

    async def update_policy(self, policy_id: str, updates: dict):
        if not hasattr(self, "policies"):
            await self.get_policies()
        
        for policy in self.policies:
            if policy["id"] == policy_id:
                policy.update(updates)
                print(f"Updated policy {policy_id}: {updates}")
                return policy
        return None

    async def delete_policy(self, policy_id: str):
        if not hasattr(self, "policies"):
            await self.get_policies()
            
        initial_len = len(self.policies)
        self.policies = [p for p in self.policies if p["id"] != policy_id]
        success = len(self.policies) < initial_len
        if success:
            print(f"Deleted policy {policy_id}")
        return success

    async def get_metrics(self):
        total = len(self.logs)
        if total == 0:
            return {
                "total_prompts": 0,
                "approved": 0,
                "pending": 0,
                "violations": 0,
                "trust_score": 100
            }
        
        approved = sum(1 for log in self.logs if log.get("validation_status") == "PASSED")
        violations = sum(1 for log in self.logs if log.get("validation_status") == "FLAGGED" or log.get("risk_assessment", {}).get("risk_level") == "HIGH")
        # Pending if status is PENDING or it was flagged for review
        pending = sum(1 for log in self.logs if log.get("status") == "PENDING" or log.get("validation_status") == "FLAGGED")
        
        avg_trust = sum(log.get("trust_score", 0) for log in self.logs) / total
        avg_confidence = sum(log.get("confidence_score", 0) for log in self.logs) / total
        avg_groundedness = sum(log.get("groundedness_score", 0) for log in self.logs) / total
        
        # Hallucination Rate (Groundeness < 50)
        hallucinations = sum(1 for log in self.logs if log.get("groundedness_score", 0) < 50)
        hallucination_rate = (hallucinations / total) * 100 if total > 0 else 0

        # Avg Bias (Mocked for now as risk score proxy, or extract if available)
        # We'll use risk score as a proxy for bias risk
        avg_bias = sum(log.get("risk_assessment", {}).get("score", 0) for log in self.logs) / total

        return {
            "total_prompts": total,
            "approved": approved,
            "pending": pending,
            "violations": violations,
            "trust_score": round(avg_trust, 1),
            "average_confidence": round(avg_confidence, 1),
            "groundedness_score": round(avg_groundedness, 1),
            "hallucination_rate": round(hallucination_rate, 1),
            "bias_score": round(avg_bias * 100, 1) # Normalize to 0-100
        }

    async def get_logs(self, limit: int = 10):
        # Return last N logs reversed
        return self.logs[-limit:][::-1]

    async def get_policy_stats(self):
        if not hasattr(self, "policies"):
            await self.get_policies()
            
        total_prompts = len(self.logs)
        stats = []
        
        for policy in self.policies:
            # Name of policy is what validator returns in violations list usually
            # But assume validator returns policy IDs or Names. 
            # For this MVP, let's match by Name.
            name = policy["name"]
            
            if total_prompts == 0:
                compliance = 100
            else:
                # Count logs that contain this policy in violated_policies
                violation_count = sum(1 for log in self.logs if name in log.get("violated_policies", []))
                compliance = ((total_prompts - violation_count) / total_prompts) * 100
                
            status = "compliant"
            if compliance < 90:
                status = "warning"
            if compliance < 80:
                status = "violation"
                
            stats.append({
                "name": name,
                "compliance": round(compliance, 1),
                "status": status
            })
            
        return stats

    async def get_pending_reviews(self):
        return [log for log in self.logs if log.get("status") == "PENDING" or log.get("validation_status") == "FLAGGED"]

    async def update_log_status(self, response_id: str, action: str, comment: str):
        for log in self.logs:
            if log.get("id") == response_id:
                if action == "APPROVE":
                    log["status"] = "COMPLETED"
                    log["validation_status"] = "PASSED"
                elif action == "REJECT":
                    log["status"] = "FAILED"
                    log["validation_status"] = "BLOCKED"
                
                # Append comment if needed, for now just print
                print(f"Human review for {response_id}: {action} - {comment}")
                return True
        return False

db = Database()
