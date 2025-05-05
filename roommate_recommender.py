import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from db_connection import get_db_connection  # Import hàm kết nối MySQL

# Kết nối đến cơ sở dữ liệu MySQL
db_connection = get_db_connection()

# Tải dữ liệu từ bảng 'roommates'
query = "SELECT * FROM roommates"
roommates = pd.read_sql(query, con=db_connection)

# Gộp các đặc điểm thành chuỗi mô tả
def combine_features(row):
    return f"{row['hobbies']} {row['sleep_schedule']} {row['cleanliness']}"

roommates['combined'] = roommates.apply(combine_features, axis=1)

# Vector hóa văn bản bằng TF-IDF
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(roommates['combined'])

# Tính độ tương đồng cosine
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Hàm gợi ý bạn cùng phòng
def recommend_roommates(name, top_n=5):
    if name not in roommates['name'].values:
        return f"Không tìm thấy người tên '{name}'."

    # Lấy thông tin người dùng
    idx = roommates.index[roommates['name'] == name][0]
    user = roommates.iloc[idx]

    # Lọc những người cùng giới tính
    same_gender = roommates[roommates['gender'] == user['gender']]

    # Nếu có nhiều người cùng giới tính -> tiếp tục lọc theo quê quán
    filtered = same_gender.copy()
    filtered['priority_score'] = 0

    # Ưu tiên người cùng quê quán
    filtered.loc[filtered['hometown'] == user['hometown'], 'priority_score'] += 3

    # Ưu tiên người cùng thành phố
    filtered.loc[filtered['city'] == user['city'], 'priority_score'] += 2

    # Ưu tiên người cùng quận
    filtered.loc[filtered['district'] == user['district'], 'priority_score'] += 1

    # Tính điểm tương đồng cosine
    similarity_scores = list(enumerate(cosine_sim[idx]))

    # Giữ lại chỉ những người trong danh sách đã lọc
    filtered_indices = filtered.index.tolist()
    filtered_scores = [s for s in similarity_scores if s[0] in filtered_indices and s[0] != idx]

    # Cộng điểm ưu tiên vào điểm tương đồng
    scored = []
    for i, score in filtered_scores:
        extra = filtered.loc[i, 'priority_score']
        scored.append((i, score + extra))

    # Sắp xếp theo điểm tổng
    scored = sorted(scored, key=lambda x: x[1], reverse=True)

    # Trả về top N gợi ý
    top_matches = [i[0] for i in scored[:top_n]]
    return roommates[['name', 'gender', 'hometown', 'city', 'district', 'yob', 'hobbies', 'job', 'more', 'rate_image']].iloc[top_matches]

# Ví dụ sử dụng
print("Gợi ý bạn cùng phòng cho Alice:")
print(recommend_roommates('Alice'))
