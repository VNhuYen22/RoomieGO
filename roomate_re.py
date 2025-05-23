import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db_connection import get_db_connection

# Kết nối tới cơ sở dữ liệu
db = get_db_connection()
if db is None:
    print("Không thể kết nối DB!")
    exit()

# Tải dữ liệu roommates
roommates = pd.read_sql("SELECT * FROM roommates", con=db)

# Tạo chuỗi đặc điểm cá nhân cho TF-IDF (chỉ dùng các cột liên quan)
def combine_features(row):
    features = [
        str(row.get('city', '')),
        str(row.get('district', '')),
        str(row.get('gender', '')),
        str(row.get('hobbies', '')),
        str(row.get('hometown', '')),
        str(row.get('job', '')),
        str(row.get('more', '')),
        str(row.get('rate_image', '')),
        str(row.get('yob', ''))
    ]
    return ' '.join([f for f in features if pd.notna(f)])

# Áp dụng hàm gộp đặc điểm
roommates['combined'] = roommates.apply(combine_features, axis=1)

# Tính TF-IDF và ma trận tương đồng cosine
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(roommates['combined'])
cosine_sim = cosine_similarity(tfidf_matrix)

# Hàm gợi ý bạn cùng phòng theo user_id
def content_based_recommend_by_user_id(user_id, top_n=5):
    """Gợi ý bạn cùng phòng dựa trên TF-IDF và user_id."""
    if user_id not in roommates['user_id'].values:
        return f"Không tìm thấy user_id = {user_id}."

    idx = roommates.index[roommates['user_id'] == user_id][0]

    gender = roommates.loc[idx, 'gender']
    hometown = roommates.loc[idx, 'hometown']
    rate_image = roommates.loc[idx, 'rate_image']

    # Lọc những người có cùng giới tính, quê quán và rate_image
    filter_mask = (
        (roommates['gender'] == gender) &
        (roommates['hometown'] == hometown) &
        (roommates['rate_image'] == rate_image)
    )
    filtered_indices = roommates[filter_mask].index.tolist()

    # Nếu không có ai phù hợp, fallback dùng toàn bộ dữ liệu
    if not filtered_indices:
        filtered_indices = roommates.index.tolist()

    # Lấy điểm TF-IDF tương đồng
    cb_scores = list(enumerate(cosine_sim[idx]))

    results = []
    for i, score in cb_scores:
        if i == idx or i not in filtered_indices:
            continue
        results.append((i, score))

    # Sắp xếp theo điểm tương đồng giảm dần
    results = sorted(results, key=lambda x: x[1], reverse=True)
    top_indices = [i[0] for i in results[:top_n]]

    return roommates[['user_id', 'gender', 'hometown', 'city', 'district', 'yob', 'hobbies', 'job', 'more', 'rate_image']].iloc[top_indices]
