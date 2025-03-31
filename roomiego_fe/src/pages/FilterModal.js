import { useState } from "react";
import "../App.css"

const FilterModal = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("Phòng trọ");
  const [selectedPrice, setSelectedPrice] = useState("Tất cả");
  const [selectedArea, setSelectedArea] = useState("Tất cả");
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const categories = ["Phòng trọ", "Nhà riêng", "Ở ghép", "Mặt bằng", "Căn hộ chung cư", "Căn hộ mini", "Căn hộ dịch vụ"];
  const prices = ["Tất cả", "Dưới 1 triệu", "1 - 2 triệu", "2 - 3 triệu", "3 - 5 triệu", "5 - 7 triệu", "7 - 10 triệu", "10 - 15 triệu", "Trên 15 triệu"];
  const areas = ["Tất cả", "Dưới 20 m²", "20 - 30 m²", "30 - 50 m²", "50 - 70 m²", "70 - 100 m²", "Trên 100 m²"];
  const features = ["Gần trường học", "Gần chợ", "Gần công viên", "Gần bệnh viện", "Gần trung tâm thương mại"];

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const applyFilters = () => {
    console.log({ selectedCategory, selectedPrice, selectedArea, selectedFeatures });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bộ lọc</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
        </div>
        
        <h3 className="text-lg font-medium mb-2">Danh mục cho thuê</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 border rounded-full ${
                selectedCategory === category ? "text-red-600 border-red-600 bg-red-100" : "text-gray-600 border-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-medium mb-2">Khoảng giá</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {prices.map((price) => (
            <button
              key={price}
              onClick={() => setSelectedPrice(price)}
              className={`px-4 py-2 border rounded-full ${
                selectedPrice === price ? "text-red-600 border-red-600 bg-red-100" : "text-gray-600 border-gray-300"
              }`}
            >
              {price}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-medium mb-2">Khoảng diện tích</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 border rounded-full ${
                selectedArea === area ? "text-red-600 border-red-600 bg-red-100" : "text-gray-600 border-gray-300"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-medium mb-2">Đặc điểm nổi bật</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {features.map((feature) => (
            <button
              key={feature}
              onClick={() => toggleFeature(feature)}
              className={`px-4 py-2 border rounded-full ${
                selectedFeatures.includes(feature) ? "text-red-600 border-red-600 bg-red-100" : "text-gray-600 border-gray-300"
              }`}
            >
              {feature}
            </button>
          ))}
        </div>

        <button onClick={applyFilters} className="w-full py-3 bg-red-600 text-white rounded-lg">Áp dụng</button>
      </div>
    </div>
  );
};

export default FilterModal;
