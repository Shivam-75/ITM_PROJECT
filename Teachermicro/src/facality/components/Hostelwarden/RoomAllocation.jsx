import React, { useState } from "react";
import { FiPlus, FiTrash2, FiUsers, FiHome, FiCheckCircle, FiMoreVertical } from "react-icons/fi";

const ROOM_CAPACITY = 3;

const RoomAllocation = () => {
  const [rooms, setRooms] = useState([
    { id: 1, roomNumber: "A-101", students: ["Rahul"] },
    { id: 2, roomNumber: "A-102", students: ["Amit", "Vikas"] },
    { id: 3, roomNumber: "B-201", students: [] },
    { id: 4, roomNumber: "B-202", students: ["Sohan"] },
  ]);

  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [newStudents, setNewStudents] = useState("");

  const handleAddRoom = () => {
    if (!newRoomNumber.trim()) return;
    const studentsArray = newStudents.split(",").map(s => s.trim()).filter(s => s !== "");
    if (studentsArray.length > ROOM_CAPACITY) return;
    const newRoom = { id: Date.now(), roomNumber: newRoomNumber, students: studentsArray };
    setRooms([...rooms, newRoom]);
    setNewRoomNumber("");
    setNewStudents("");
  };

  const handleAllocate = (roomId) => {
    const studentName = prompt("Enter Student Name:");
    if (!studentName) return;
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        if (room.students.length >= ROOM_CAPACITY) return room;
        return { ...room, students: [...room.students, studentName] };
      }
      return room;
    }));
  };

  const handleRemove = (roomId, studentName) => {
    setRooms(prev => prev.map(room => room.id === roomId ? { ...room, students: room.students.filter(s => s !== studentName) } : room));
  };

  const handleDeleteRoom = (roomId) => {
    if (!window.confirm("Delete this room?")) return;
    setRooms(prev => prev.filter(room => room.id !== roomId));
  };

  return (
    <div className="min-h-[100dvh] bg-white pt-4 px-4 md:px-8 pb-20">
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-8 flex items-center gap-4">
        <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
        Room Allocation
      </h1>

      {/* 🔹 Add Room Section */}
      <div className="bg-white p-6 md:p-10 rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 mb-10">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic mb-6">Provision New Inventory</h2>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <input
            type="text"
            placeholder="Room No"
            value={newRoomNumber}
            onChange={(e) => setNewRoomNumber(e.target.value)}
            className="flex-1 px-5 py-3.5 bg-white border-none rounded-lg text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 transition-all shadow-inner"
          />

          <input
            type="text"
            placeholder="Students (comma separated)"
            value={newStudents}
            onChange={(e) => setNewStudents(e.target.value)}
            className="flex-[2] px-5 py-3.5 bg-white border-none rounded-lg text-[11px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-900 transition-all shadow-inner"
          />

          <button
            onClick={handleAddRoom}
            className="px-8 py-3.5 bg-slate-900 border border-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.3em] italic shadow-xl hover:bg-indigo-600 hover:shadow-indigo-100 transition-all flex items-center justify-center gap-2"
          >
            <FiPlus size={14} /> Add Room
          </button>
        </div>
      </div>

      {/* 🔹 Responsive Room Grid / Table */}
      <div className="space-y-4 md:space-y-0">
        <div className="hidden md:block bg-white rounded-lg border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-white border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
                <tr>
                  <th className="px-8 py-5">Room No</th>
                  <th className="px-8 py-5">Capacity</th>
                  <th className="px-8 py-5">Occupied</th>
                  <th className="px-8 py-5">Students</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const occupied = room.students.length;
                  const vacant = ROOM_CAPACITY - occupied;
                  const isFull = occupied === ROOM_CAPACITY;
                  return (
                    <tr key={room.id} className="border-b border-slate-50 hover:bg-white/50 transition-colors">
                      <td className="px-8 py-6 font-black text-slate-900 uppercase italic">{room.roomNumber}</td>
                      <td className="px-8 py-6 text-[10px] font-black">{ROOM_CAPACITY}</td>
                      <td className="px-8 py-6 text-[10px] font-black text-emerald-600 italic uppercase">{occupied} / {ROOM_CAPACITY}</td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                            {room.students.map((s, i) => (
                                <span key={i} className="bg-white px-3 py-1 rounded-lg text-[9px] font-black uppercase italic text-slate-500 border border-slate-100 flex items-center gap-2">
                                    {s} <FiTrash2 size={10} className="text-rose-400 cursor-pointer" onClick={() => handleRemove(room.id, s)} />
                                </span>
                            ))}
                            {room.students.length === 0 && <span className="text-[9px] text-slate-200 uppercase font-black tracking-widest italic">No Assets</span>}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest italic ${isFull ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>{isFull ? "Inventory Full" : "Active"}</span>
                      </td>
                      <td className="px-8 py-6 space-x-3">
                        {!isFull && <button onClick={() => handleAllocate(room.id)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest italic shadow-lg">Allocate</button>}
                        <button onClick={() => handleDeleteRoom(room.id)} className="px-4 py-2 bg-rose-50 text-rose-500 rounded-lg text-[8px] font-black uppercase tracking-widest italic border border-rose-100">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden grid grid-cols-1 gap-4">
            {rooms.map((room) => {
                const occupied = room.students.length;
                const isFull = occupied === ROOM_CAPACITY;
                return (
                    <div key={room.id} className="bg-white p-6 rounded-lg border border-slate-100 shadow-xl shadow-slate-100/30 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">{room.roomNumber}</h3>
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic ${isFull ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>{isFull ? "Full" : "Available"}</span>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Current Residents ({occupied}/{ROOM_CAPACITY})</p>
                            <div className="flex flex-wrap gap-2">
                                {room.students.map((s, i) => (
                                    <span key={i} className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase italic text-slate-600 border border-slate-100 flex items-center gap-2">
                                        {s} <FiTrash2 size={12} className="text-rose-400" onClick={() => handleRemove(room.id, s)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                            {!isFull && <button onClick={() => handleAllocate(room.id)} className="flex-1 py-3 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest italic shadow-lg">Allocate</button>}
                            <button onClick={() => handleDeleteRoom(room.id)} className="px-4 py-3 bg-rose-50 text-rose-500 rounded-lg border border-rose-100 flex items-center justify-center"><FiTrash2 size={14} /></button>
                        </div>
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;



