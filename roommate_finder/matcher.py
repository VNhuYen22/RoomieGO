from sentence_transformers import SentenceTransformer, util
import numpy as np
import pandas as pd

# Load mô hình embedding cho mô tả
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def match_roommate(user_input, candidates):
    # Gộp dữ liệu user + candidates
    df = pd.DataFrame([user_input] + candidates)

    # Tính tuổi
    df['age'] = 2025 - df['yob']

    # Chuẩn hóa text sở thích: lower + loại bỏ khoảng trắng
    df['hobbies_clean'] = df['hobbies'].fillna("").astype(str).str.lower().str.replace(" ", "").str.replace(",", "")

    # Mã hóa sở thích thành các đặc trưng
    df['hobbies_pets'] = df['hobbies_clean'].apply(lambda x: int("nuôithúcưng" in x))
    df['hobbies_smoke'] = df['hobbies_clean'].apply(lambda x: int("húthuốc" in x or "hútthuốc" in x))
    df['hobbies_night'] = df['hobbies_clean'].apply(lambda x: int("thứckhuya" in x))

    # One-hot encode các cột categorical
    cat_encoded = pd.get_dummies(df[['gender', 'hometown', 'job']])

    # Ghép đặc trưng số
    features = pd.concat([cat_encoded, df[['age', 'hobbies_pets', 'hobbies_smoke', 'hobbies_night']]], axis=1).values
    features = features.astype(np.float32)

    # Vector hóa phần mô tả 'more'
    more_vectors = model.encode(df['more'].tolist())
    more_vectors = np.array(more_vectors, dtype=np.float32)

    # Kết hợp đặc trưng + vector mô tả
    final_vectors = np.hstack([features, more_vectors])

    # Tính độ tương đồng
    user_vec = final_vectors[0]
    candidate_vecs = final_vectors[1:]
    similarities = util.cos_sim(user_vec, candidate_vecs)[0].tolist()

    # Chọn người phù hợp nhất
    best_idx = int(np.argmax(similarities))
    best_match = candidates[best_idx]
    # best_score = similarities[best_idx]

    # return best_match, best_score
    return best_match
