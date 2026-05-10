import { useNavigate } from "react-router-dom";
import LectureForm from "../../components/lectureComponents/LectureForm";

export default function AddLecture() {


    <main className="flex-1 space-y-10 animate-in fade-in duration-700 pb-20">
        {/* Simplified Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
                   Conduct Session
                </h1>
            </div>

            <div className="flex bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                  <button 
                    className="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic bg-slate-900 text-white shadow-lg"
                  >
                    Creation
                  </button>
                  <button 
                    onClick={() => navigate("/online")}
                    className="px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic text-slate-400 hover:text-slate-900 transition-all hover:bg-white"
                  >
                    Go Back
                  </button>
            </div>
        </div>

        <LectureForm />
    </main>
}



