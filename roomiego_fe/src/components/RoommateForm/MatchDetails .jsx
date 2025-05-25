// MatchDetails.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './RoommateForm.css'; // Import CSS

const MatchDetails = () => {
    const location = useLocation();
    const match = location.state?.match;
    
    console.log("Match data received:", match); // Debug log

    if (!match) {
        return (
            <div className="roommate-form-container">
                <div className="match-details-container">
                    <h2>Không tìm thấy thông tin phù hợp</h2>
                </div>
            </div>
        );
    }

    // Get up to 5 recommendations
    const recommendations = Array.isArray(match) ? match.slice(0, 5) : [match];

    // Function to format gender
    const formatGender = (gender) => {
        if (!gender) return 'Không xác định';
        const genderStr = String(gender).toUpperCase();
        return genderStr === 'MALE' || genderStr === 'NAM' ? 'Nam' : 
               genderStr === 'FEMALE' || genderStr === 'NỮ' ? 'Nữ' : 
               genderStr;
    };

    return (
        <div className="roommate-form-container">
            <div className="match-details-container glass-background">
                <h2>Danh sách người phù hợp</h2>
                <div className="match-details-content">
                    {recommendations.map((recommendation, index) => (
                        <div key={index} className="match-section">
                            <h3>Người phù hợp #{index + 1}</h3>
                            <div className="match-grid">
                                <div className="match-item">
                                    <label>Giới tính:</label>
                                    <span>{formatGender(recommendation.gender)}</span>
                                </div>
                                <div className="match-item">
                                    <label>Quê quán:</label>
                                    <span>{recommendation.hometown}</span>
                                </div>
                                <div className="match-item">
                                    <label>Thành phố:</label>
                                    <span>{recommendation.city}</span>
                                </div>
                                <div className="match-item">
                                    <label>Quận:</label>
                                    <span>{recommendation.district}</span>
                                </div>
                                <div className="match-item">
                                    <label>Năm sinh:</label>
                                    <span>{recommendation.yob}</span>
                                </div>
                                <div className="match-item">
                                    <label>Nghề nghiệp:</label>
                                    <span>{recommendation.job}</span>
                                </div>
                                <div className="match-item full-width">
                                    <label>Sở thích:</label>
                                    <span>
                                        {typeof recommendation.hobbies === 'string' 
                                            ? recommendation.hobbies 
                                            : Array.isArray(recommendation.hobbies) 
                                                ? recommendation.hobbies.join(', ') 
                                                : 'Không có'}
                                    </span>
                                </div>
                                <div className="match-item full-width">
                                    <label>Mô tả thêm:</label>
                                    <span>{recommendation.more || 'Không có'}</span>
                                </div>
                                {/* <div className="match-item full-width">
                                    <label>Phong cách phòng mong muốn:</label>
                                    <span>
                                        {recommendation.rateImage === 1 ? 'Tối giản' : 
                                         recommendation.rateImage === 2 ? 'Sạch sẽ & ấm áp' : 
                                         recommendation.rateImage === 3 ? 'Thoáng đãng' : 'Không xác định'}
                                    </span>
                                </div> */}
                            </div>
                        </div>
                    ))}

                    {Array.isArray(match) && match.length > 5 && (
                        <div className="match-section">
                            <h3>Thông tin thêm</h3>
                            <div className="match-grid">
                                <div className="match-item full-width">
                                    <label>Tổng số người phù hợp:</label>
                                    <span>{match.length} người</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;
