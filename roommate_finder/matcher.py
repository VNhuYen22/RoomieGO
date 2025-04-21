from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

def match_roommate(user_input, candidates):
    def calculate_score(user, candidate):
        score = 0
        # Quê quán giống
        if user.get("hometown") == candidate.get("hometown"):
            score += 7
        # Nơi bạn muốn thuê giống (thành phố)
        if user.get("city") == candidate.get("city"):
            score += 6
        # Nơi bạn muốn thuê giống (quận)
        if user.get("district") == candidate.get("district"):
            score += 5
        # Năm sinh giống
        if user.get("yob") == candidate.get("yob"):
            score += 4
        # Nghề nghiệp giống
        if user.get("job") == candidate.get("job"):
            score += 3
        # Sở thích có điểm chung
        user_hobbies = set(map(str.strip, str(user.get("hobbies", "")).lower().split(',')))
        cand_hobbies = set(map(str.strip, str(candidate.get("hobbies", "")).lower().split(',')))
        if user_hobbies & cand_hobbies:
            score += 2
        # Mức độ sạch sẽ
        if user.get("rateImage") == candidate.get("rateImage"):
            score += 2
        # Mô tả thêm tương đồng nội dung
        u_more = user.get("more", "").strip()
        c_more = candidate.get("more", "").strip()
        if u_more and c_more:
            u_vec = model.encode(u_more, convert_to_tensor=True)
            c_vec = model.encode(c_more, convert_to_tensor=True)
            similarity = util.cos_sim(u_vec, c_vec).item()
            if similarity > 0.5:
                score += 1
        return score

    # Kiểm tra nếu không có ứng viên nào
    if not candidates:
        return {"message": "Không tìm thấy người phù hợp."}

    # Tính điểm cho tất cả ứng viên (bỏ lọc giới tính)
    scored_candidates = [(cand, calculate_score(user_input, cand)) for cand in candidates]

    # Chọn người có điểm cao nhất
    best_match = max(scored_candidates, key=lambda x: x[1])[0]

    return best_match