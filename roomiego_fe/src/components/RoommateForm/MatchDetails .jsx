// MatchDetails.jsx
// import React from 'react';
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

    return (
        <div className="roommate-form-container">
            <div className="match-details-container card-listing-container">
                <h2>Danh sách người phù hợp</h2>
                <div className="card-listing-grid">
                    {recommendations.map((recommendation, index) => (
                        <div key={index} className="match-card">
                            <div className="match-card-avatar-wrapper">
                                <img
                                    className="match-card-avatar"
                                    src={recommendation.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                                    alt={recommendation.fullName || 'Avatar'}
                                />
                            </div>
                            <div className="match-card-header">
                                <span className="match-card-name">{recommendation.fullName || recommendation.username || `Người phù hợp #${index + 1}`}</span>
                            </div>
                            <div className="match-card-job">{recommendation.job || 'Chưa cập nhật nghề nghiệp'}</div>
                            <div className="match-card-field"><b>Số điện thoại:</b> {recommendation.phone || '--'}</div>
                            <div className="match-card-field"><b>Sở thích:</b> {Array.isArray(recommendation.hobbies) ? recommendation.hobbies.join(', ') : (recommendation.hobbies || 'Không có')}</div>
                            <div className="match-card-field"><b>Thành phố:</b> {recommendation.city || '--'}</div>
                            <div className="match-card-field"><b>Quận:</b> {recommendation.district || '--'}</div>
                            <div className="match-card-field"><b>Quê quán:</b> {recommendation.hometown || '--'}</div>
                            <div className="match-card-field"><b>Giới tính:</b> {recommendation.gender || '--'}</div>
                            <div className="match-card-desc">{recommendation.more || recommendation.description || 'Không có mô tả'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchDetails;
