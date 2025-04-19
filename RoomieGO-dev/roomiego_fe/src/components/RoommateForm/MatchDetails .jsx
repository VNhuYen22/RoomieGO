// MatchDetails.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import './RoommateForm.css'; // Import CSS

const MatchDetails = () => {
    const location = useLocation();
    const match = location.state?.match;

    return (
    <div className="roommate-form-container"> {/* Thêm class */}
        <div className="match-details-container"> {/* Thêm class */}
            <h2>Thông tin người phù hợp</h2>
            {match && (
                <div>
                    <p><strong>Giới tính:</strong> {match.gender}</p>
                    <p><strong>Năm sinh:</strong> {match.yob}</p>
                    <p><strong>Quê quán:</strong> {match.hometown}</p>
                    <p><strong>Nghề nghiệp:</strong> {match.job}</p>
                    <p><strong>Sở thích:</strong> {match.hobbies ? match.hobbies.join(', ') : ''}</p>
                    <p><strong>Mô tả thêm:</strong> {match.more}</p>
                </div>
            )}
        </div>
    </div>
    );
};

export default MatchDetails;
