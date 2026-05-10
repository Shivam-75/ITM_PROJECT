import { useState, useEffect } from "react";
import { AcademicAPI } from "../api/apis";

export const useAcademicRegistry = () => {
    const [courses, setCourses] = useState([]);
    const [years, setYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                setLoading(true);
                const [cRes, yRes, semRes, secRes] = await Promise.all([
                    AcademicAPI.get("/courses"),
                    AcademicAPI.get("/years"),
                    AcademicAPI.get("/semesters"),
                    AcademicAPI.get("/sections")
                ]);

                setCourses(cRes.data.courses || []);
                setYears(yRes.data.years || []);
                setSemesters(semRes.data.semesters || []);
                setSections(secRes.data.sections || []);
            } catch (err) {
                console.error("Failed to fetch academic registry:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistry();
    }, []);

    return { courses, years, semesters, sections, loading, error };
};

