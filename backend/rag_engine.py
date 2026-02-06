from typing import List, Dict
import re
from collections import Counter
import math

class RAGEngine:
    def __init__(self):
        self.documents = [] # List of {id, content, title}
        self.index = {}

    def add_document(self, content: str, title: str = "Untitled"):
        doc_id = f"doc_{len(self.documents) + 1}"
        doc = {"id": doc_id, "content": content, "title": title}
        self.documents.append(doc)
        return doc

    def search(self, query: str, top_k: int = 3) -> List[Dict]:
        """
        Simple retrieval based on keyword overlap (TF-IDF style simplified).
        """
        if not self.documents:
            return []

        query_tokens = self._tokenize(query)
        results = []

        for doc in self.documents:
            doc_tokens = self._tokenize(doc["content"])
            score = self._calculate_similarity(query_tokens, doc_tokens)
            if score > 0:
                results.append({**doc, "score": score})

        # Sort by score desc
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def _tokenize(self, text: str):
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)
        return text.split()

    def _calculate_similarity(self, tokens1, tokens2):
        # Jaccardish / Overlap for MVP
        s1 = set(tokens1)
        s2 = set(tokens2)
        intersection = len(s1.intersection(s2))
        union = len(s1.union(s2))
        return intersection / union if union > 0 else 0.0

rag_engine = RAGEngine()
