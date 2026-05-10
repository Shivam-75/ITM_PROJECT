import React, { memo, useState, useEffect, useCallback } from "react";
import { ReportAPI, authAPI } from "../api/apis";
import Loader from "../components/common/Loader";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const lectureTimes = [
    { id: 1, range: "09:00 - 10:00" },
    { id: 2, range: "10:00 - 11:00" },
    { id: 3, range: "11:00 - 12:00" },
    { id: 4, range: "12:00 - 01:00" },
    { id: 5, range: "02:00 - 03:00" },
    { id: 6, range: "03:00 - 04:00" },
    { id: 7, range: "04:00 - 05:00" },
];

const Timetable = () => {
    const [grid, setGrid] = useState({});
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchTimetable = useCallback(async () => {
        try {
            setLoading(true);
            const profileRes = await authAPI.get("/userProfile");
            const student = profileRes.data?.StudentData;
            setStudentInfo(student);

            if (student?.section) {
                const { data } = await ReportAPI.get(`/TimeTable/View/${student.section}`);
                if (data?.data?.timeSheet) {
                    const newGrid = {};
                    data.data.timeSheet.forEach(item => {
                        if (!newGrid[item.lecture]) newGrid[item.lecture] = {};
                        newGrid[item.lecture][item.day] = item;
                    });
                    setGrid(newGrid);
                }
            }
        } catch (error) {
            console.error("Failed to fetch timetable", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTimetable();
    }, [fetchTimetable]);

    return (
        <div className="min-h-screen space-y-8 pb-10">
            {loading && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-50">
                    <Loader />
                </div>
            )}

            {/* Header */}
            <div className="px-4">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">📅 Academic Calendar</h2>
                <p className="text-sm text-slate-500 font-medium">Class schedule for {studentInfo?.course?.toUpperCase() || "ITM"} • {studentInfo?.section?.toUpperCase() || "A"}</p>
            </div>

            {/* Unified Table Container */}
            <div className="mx-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100/50">
                <div className="overflow-x-auto scroller-style">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="p-5 text-left bg-slate-100/50 min-w-[120px]">
                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lecture Slot</span>
                                </th>
                                {days.map((day) => (
                                    <th key={day} className="p-5 text-center border-l border-slate-200">
                                        <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{day}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {lectureTimes.map((slot) => (
                                <tr key={slot.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    {/* Slot Header */}
                                    <td className="p-5 border-r border-slate-200 bg-slate-50/30">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-800">Period {slot.id}</span>
                                            <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase whitespace-nowrap">{slot.range}</span>
                                        </div>
                                    </td>

                                    {/* Day Cells */}
                                    {days.map((day) => {
                                        const entry = grid[slot.id]?.[day];
                                        return (
                                            <td key={day} className="p-3 border-l border-slate-100 align-top h-24">
                                                {entry ? (
                                                    <div className="h-full p-4 rounded-xl bg-blue-50/40 border border-blue-100/50 flex flex-col justify-center">
                                                        <h4 className="text-[11px] font-black text-blue-900 leading-tight uppercase tracking-tight mb-2 italic">
                                                            {entry.subject}
                                                        </h4>
                                                        <div className="flex items-center gap-1.5 opacity-60">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                                            <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter truncate italic">
                                                                {entry.teacher}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex items-center justify-center">
                                                        <span className="text-[9px] font-black text-slate-100 uppercase tracking-[0.3em]">—</span>
                                                    </div>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Instruction for Mobile */}
            <div className="md:hidden px-4 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">← Scroll horizontally for more days →</p>
            </div>
        </div>
    );
};

export default Timetable;
