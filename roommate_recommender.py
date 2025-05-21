import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db_connection import get_db_connection

# Kết nối DB
db = get_db_connection()
if db is None:
    print("Không thể kết nối DB!")
    exit()

# Load roommates
roommates = pd.read_sql("SELECT * FROM roommates", con=db)

# Load ratings
ratings = pd.read_sql("SELECT * FROM ratings", con=db)

# Gộp đặc điểm cá nhân
def combine_features(row):
    h = str(row.get('hobbies', '')) if pd.notna(row.get('hobbies')) else ''
    s = str(row.get('sleep_schedule', '')) if pd.notna(row.get('sleep_schedule')) else ''
    c = str(row.get('cleanliness', '')) if pd.notna(row.get('cleanliness')) else ''
    return f"{h} {s} {c}"

roommates['combined'] = roommates.apply(combine_features, axis=1)

# TF-IDF vectorization
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(roommates['combined'])
cosine_sim = cosine_similarity(tfidf_matrix)

# Hàm lấy collaborative filtering score trung bình
def get_cf_scores(user_id):
    """Trả về dict: {roommate_id: average_rating} mà user_id đã đánh giá người khác."""
    user_ratings = ratings[ratings['rater_id'] == user_id]
    return dict(zip(user_ratings['ratee_id'], user_ratings['score']))

# Hybrid Recommender
def hybrid_recommend(name, top_n=5, alpha=0.7):
    """alpha: trọng số TF-IDF, (1 - alpha): trọng số Collaborative"""
    if name not in roommates['name'].values:
        return f"Không tìm thấy người tên '{name}'."

    idx = roommates.index[roommates['name'] == name][0]
    user_id = roommates.loc[idx, 'id']  # Cần cột 'id' trong bảng roommates
    cb_scores = list(enumerate(cosine_sim[idx]))

    # Lấy điểm CF
    cf_dict = get_cf_scores(user_id)

    # Kết hợp điểm: tổng hợp theo công thức hybrid_score = alpha * CB + (1 - alpha) * CF
    hybrid_scores = []
    for i, cb in cb_scores:
        if i == idx:
            continue
        roommate_id = roommates.loc[i, 'id']
        cf = cf_dict.get(roommate_id, None)

        # Nếu không có đánh giá CF, chỉ dùng CB
        if cf is None:
            score = cb
        else:
            score = alpha * cb + (1 - alpha) * (cf / 5.0)  # Chuẩn hóa score CF về [0,1]
        hybrid_scores.append((i, score))

    hybrid_scores = sorted(hybrid_scores, key=lambda x: x[1], reverse=True)
    top_indices = [i[0] for i in hybrid_scores[:top_n]]

    return roommates[['name', 'gender', 'hometown', 'city', 'district', 'yob', 'hobbies', 'job', 'more', 'rate_image']].iloc[top_indices]
