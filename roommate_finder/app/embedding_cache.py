from sentence_transformers import SentenceTransformer
import numpy as np

model = SentenceTransformer('paraphrase-MiniLM-L12-v2')
embedding_cache = {}

#Hàm tạo embedding cho text
def get_embedding(user_id: int, text: str) -> np.ndarray:
    if user_id in embedding_cache:
        return embedding_cache[user_id]
    vec = model.encode(text)
    embedding_cache[user_id] = vec
    return vec