import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './RoommateForm.css';
import  minimal  from "../../assets/minimal.jpg";
import minimal2 from "../../assets/minimal2.jpg";
import openly from "../../assets/openly.jpg";
import warm from "../../assets/clean&warm.jpg";
import friend_vid from "../../assets/4k_friend.mp4"; // Import icon nếu cần
import Select from "react-select"; // Import Select component from react-select
import {getProvinces} from "sub-vn"; // Import getProvinces function
const provincesOptions = getProvinces().map((province) => ({
  value: province.name,
  label: province.name,
}));

const StepIndicator = ({ step }) => {
  return (
    <div className="step-indicator">
      <div className={`step ${step >= 1 ? "completed" : ""}`}>
        <span className="step-number">01</span>
        <span className="step-label">Thông tin</span>
      </div>
      <div className={`step ${step >= 2 ? "completed" : ""}`}>
        <span className="step-number">02</span>
        <span className="step-label">Thành phố </span>
      </div>
      <div className={`step ${step >= 3 ? "completed" : ""}`}>
        <span className="step-number">03</span>
        <span className="step-label">Sở thích </span>
      </div>
    </div>
  );
};

const StepOne = ({ formData, errors, handleChange }) => (
  <>
    <label>Giới tính:</label>
    <select name="sex" value={formData.sex} onChange={handleChange}>
      <option value="Nam">Nam</option>
      <option value="Nữ">Nữ</option>
    </select>

    <label>Quê quán:</label>
    <Select
  options={provincesOptions}
  value={provincesOptions.find((opt) => opt.value === formData.hometown)}
  onChange={(selected) =>
    handleChange({
      target: {
        name: "hometown",
        value: selected ? selected.value : "",
      },
    })
  }
/>

    {errors.hometown && <div className="error">{errors.hometown}</div>}

    <label>Năm sinh:</label>
    <input type="number" name="dob" value={formData.dob} onChange={handleChange} />
    {errors.dob && <div className="error">{errors.dob}</div>}

    <label>Nghề nghiệp:</label>
    <input type="text" name="job" value={formData.job} onChange={handleChange} />
    {errors.job && <div className="error">{errors.job}</div>}
  </>
);

const StepTwo = ({ formData, errors, handleChange }) => (
  <>
    <label>Thành phố:</label>
    <input type="text" name="city" value={formData.city} onChange={handleChange} />
    {errors.city && <div className="error">{errors.city}</div>}

    <label>Quận:</label>
    <input type="text" name="district" value={formData.district} onChange={handleChange} />
    {errors.district && <div className="error">{errors.district}</div>}
  </>
);

const StepThree = ({ formData, errors, handleChange }) => {
  const hobbiesList = ["Nuôi thú cưng", 
    "Hút thuốc", "Ăn Chay"];

  // Mảng chứa thông tin các phòng với tiêu chí cụ thể
  const roomTypes = [
    { value: "1", label: "" , image: minimal },
    { value: "2", label: "" , image: warm },
    { value: "3", label: "",  image: openly },
  ];

  return (
    <>
      <label>Thói quen sinh hoạt:</label>
      <div className="checkbox-group">
        {hobbiesList.map((hobby) => (
          <label key={hobby}>
            <input
              type="checkbox"
              name="hobbies"
              value={hobby}
              checked={formData.hobbies.includes(hobby)}
              onChange={handleChange}
            />
            {hobby}
          </label>
        ))}
      </div>
      {errors.hobbies && <div className="error">{errors.hobbies}</div>}

      <label>Vui lòng chọn một trong ba bức ảnh dưới đây :</label>
      <div className="radio-group">
        {roomTypes.map((room) => (
          <label
            key={room.value}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              margin: "10px",
            }}
          >
            <input
              type="radio"
              name="rateImage"
              value={room.value}
              checked={formData.rateImage === room.value}
              onChange={handleChange}
            />
            <img src={room.image} alt=""  style={{ width: "100px", height: "auto"} }/>
            <span>{room.label}</span>
          </label>
        ))}
      </div>
      {errors.rateImage && <div className="error">{errors.rateImage}</div>}

      <label>Mô tả thêm:</label>
      <textarea
        name="more"
        rows="4"
        maxLength="500"
        value={formData.more}
        onChange={handleChange}
      />
    </>
  );
};


const RoommateForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const initialFormData = {
    sex: "Nam",
    hometown: "",
    city: "",
    district: "",
    dob: "",
    job: "",
    hobbies: [],
    rateImage: "",
    more: "",
    userId: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        hobbies: checked
          ? [...prev.hobbies, value]
          : prev.hobbies.filter((h) => h !== value),
      }));
    } else if (type === "radio") {
      setFormData((prev) => ({ ...prev, rateImage: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.hometown.trim())
        newErrors.hometown = "Vui lòng nhập quê quán";
      if (!formData.dob) newErrors.dob = "Vui lòng nhập năm sinh";
      if (!formData.job.trim())
        newErrors.job = "Vui lòng nhập nghề nghiệp";
    } else if (step === 2) {
      if (!formData.city.trim()) newErrors.city = "Vui lòng nhập thành phố";
      if (!formData.district.trim())
        newErrors.district = "Vui lòng nhập quận";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (formData.hobbies.length === 0)
      newErrors.hobbies = "Chọn ít nhất một thói quen";
    if (!formData.rateImage)
      newErrors.rateImage = "Chọn một hình ảnh phòng mong muốn";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const dataToSend = {
        hometown: formData.hometown,
        city: formData.city,
        district: formData.district,
        yob: formData.dob,
        job: formData.job,
        hobbies: formData.hobbies.join(", "),
        rateImage: formData.rateImage,
        more: formData.more,
        userId: formData.userId ? parseInt(formData.userId) : null,
      };

      const token = localStorage.getItem("authToken");
      await fetch("http://localhost:8080/api/roommates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      await fetch("http://localhost:8080/api/roommates/export-to-file", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const formDataToSend = new FormData();
      formDataToSend.append("hometown", formData.hometown);
      formDataToSend.append("yob", formData.dob);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("district", formData.district);
      formDataToSend.append("job", formData.job);
      formData.hobbies.forEach((hobby) =>
        formDataToSend.append("hobbies", hobby)
      );
      formDataToSend.append("rateImage", formData.rateImage);
      formDataToSend.append("more", formData.more);

      const submitResponse = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        body: formDataToSend,
      });
      const responseJson = await submitResponse.json();
      navigate("/match", { state: { match: responseJson } });
    } catch (err) {
      console.error("Error during submission:", err);
    }
  };

  return (
    <div className="roommate-container">
      {/* Video nền động */}
      <div className="video-background">
        <video autoPlay loop muted>
          <source src={friend_vid} type="video/mp4" />
        </video> 
        </div>
      {/* Step Indictor nằm ngoài hộp form để hiển thị phía trên */}
      <StepIndicator step={step} />
      <div className="roommate-form glass-background">
        <h2>Thông tin Roommate - Bước {step}/3</h2>
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <StepOne
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {step === 2 && (
            <StepTwo
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          {step === 3 && (
            <StepThree
              formData={formData}
              errors={errors}
              handleChange={handleChange}
            />
          )}
          <div className="form-navigation">
            {step > 1 && (
              <button type="button" onClick={handleBack}>
                Quay lại
              </button>
            )}
            {step < 3 && (
              <button type="button" onClick={handleNext}>
                Tiếp theo
              </button>
            )}
            {step === 3 && (
              <button type="submit">Tìm người phù hợp</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoommateForm;