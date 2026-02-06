import json
import os

LOG_FILE = "logs.json"

class Database:
    def __init__(self):
        self.logs = []
        self.load_logs()

    def load_logs(self):
        if os.path.exists(LOG_FILE):
            try:
                with open(LOG_FILE, "r") as f:
                    self.logs = json.load(f)
                print(f"Loaded {len(self.logs)} logs from {LOG_FILE}")
            except Exception as e:
                print(f"Failed to load logs: {e}")
                self.logs = []

    def save_logs(self):
        try:
            with open(LOG_FILE, "w") as f:
                json.dump(self.logs, f, indent=2, default=str)
        except Exception as e:
            print(f"Failed to save logs: {e}")

    async def log_event(self, event: dict):
        self.logs.append(event)
        self.save_logs()
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

    def safe_percent(self, value, total):
        if total == 0:
            return 0
        return round((value / total) * 100, 2)

    async def get_metrics(self):
        total = len(self.logs)
        
        approved = sum(1 for log in self.logs if log.get("validation_status") == "PASSED")
        # Pending if status is PENDING or it was flagged for review
        pending = sum(1 for log in self.logs if log.get("status") == "PENDING" or log.get("validation_status") == "FLAGGED")
        violations = sum(1 for log in self.logs if log.get("validation_status") == "FLAGGED" or log.get("risk_assessment", {}).get("risk_level") == "HIGH")
        
        # Calculations for Trust Scores
        # Trust score average
        trust_sum = sum(log.get("trust_score", 0) for log in self.logs)
        # Bias score average (using risk score as proxy for now)
        bias_sum = sum(log.get("risk_assessment", {}).get("score", 0) for log in self.logs) * 100 # Normalize if needed

        # Calculations for Hallucinations
        grounded = sum(log.get("groundedness_score", 0) for log in self.logs) / 100 * total if total > 0 else 0 # Approximate back from avg if needed, or just sum raw if available. 
        # Wait, previous logic was: avg_groundedness = sum(...) / total. 
        # User wants "grounded" percent. Let's assume 'grounded' means groundedness > 50? 
        # Or does user mean the *score*? 
        # User payload example: "grounded": safe_percent(grounded, total). 
        # This implies 'grounded' is a COUNT of grounded responses.
        
        grounded_count = sum(1 for log in self.logs if log.get("groundedness_score", 0) >= 50)
        confidence_sum = sum(log.get("confidence_score", 0) for log in self.logs) # This is sum, safe_percent divides by total. Correct.
        hallucinated_count = sum(1 for log in self.logs if log.get("groundedness_score", 0) < 50)

        metrics = {
            "total_prompts": total,
            "approved_responses": approved,
            "pending_review": pending,
            "policy_violations": violations,

            "trust_scores": {
                "overall_trust": self.safe_percent(trust_sum, total),
                "bias_risk": self.safe_percent(bias_sum, total)
            },

            "hallucination": {
                "grounded": self.safe_percent(grounded_count, total), # % of responses that are grounded
                "avg_confidence": self.safe_percent(confidence_sum, total), # Avg confidence
                "hallucination_rate": self.safe_percent(hallucinated_count, total) # % of responses that are hallucinations
            }
        }

        return metrics

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
