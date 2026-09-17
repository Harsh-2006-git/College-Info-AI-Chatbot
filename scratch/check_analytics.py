import sqlite3
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect('backend/chats.db')
cur = conn.cursor()
cur.execute('SELECT id, session_id, role, content, analytics, sources FROM chat_messages WHERE role = "assistant" ORDER BY id DESC')

for row in cur.fetchall():
    aid, sess, role, content, analytics_raw, sources_raw = row
    if not analytics_raw:
        continue
    try:
        analytics = json.loads(analytics_raw)
    except:
        continue
    if analytics.get('avg_similarity', 1.0) == 0.0 or analytics.get('precision', 1.0) == 0.0:
        print(f"Message ID: {aid}")
        print(f"Content: {content}")
        print(f"Analytics: {analytics}")
        print(f"Sources: {sources_raw}")
        cur2 = conn.cursor()
        cur2.execute('SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY id ASC', (sess,))
        for r in cur2.fetchall():
            print(f"[{r[0]}]: {r[1]}")
        print("="*60)

