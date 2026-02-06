
import asyncio
from backend.db import Database, LOG_FILE
import os
import json

async def verify():
    print("--- Verifying Persistence ---")
    
    # 1. Clear existing logs for test
    if os.path.exists(LOG_FILE):
        os.remove(LOG_FILE)
    
    # 2. Add log with first instance
    db1 = Database()
    print(f"DB1 Logs (Init): {len(db1.logs)}")
    await db1.log_event({"test": "persistence", "id": "123"})
    print(f"DB1 Logs (After Add): {len(db1.logs)}")
    
    # 3. Instantiate new DB instance (simulate restart)
    db2 = Database()
    print(f"DB2 Logs (Load): {len(db2.logs)}")
    
    if len(db2.logs) == 1 and db2.logs[0]["id"] == "123":
        print("✅ SUCCESS: Data persisted across instances")
    else:
        print("❌ FAILED: Data did not persist")

if __name__ == "__main__":
    asyncio.run(verify())
