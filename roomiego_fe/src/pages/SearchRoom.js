import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Search } from "lucide-react";
import "../App.css"

const rooms = [
  { id: 1, name: "Phòng Deluxe", price: "500,000 VND", location: "Hà Nội" },
  { id: 2, name: "Phòng Tiêu Chuẩn", price: "300,000 VND", location: "TP.HCM" },
  { id: 3, name: "Phòng VIP", price: "1,000,000 VND", location: "Đà Nẵng" },
];

export default function SearchRoom() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "all" || room.location === filter)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Thanh tìm kiếm */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Tìm kiếm phòng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value="Hà Nội">Hà Nội</SelectItem>
          <SelectItem value="TP.HCM">TP.HCM</SelectItem>
          <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
        </Select>
        <Button><Search className="w-4 h-4" /></Button>
      </div>
      
      {/* Danh sách phòng */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="p-4 shadow-lg rounded-lg">
            <CardContent>
              <h2 className="text-lg font-bold">{room.name}</h2>
              <p className="text-gray-500">{room.location}</p>
              <p className="text-blue-600 font-semibold">{room.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
