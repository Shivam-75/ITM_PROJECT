import { useState, useEffect } from "react";
import { AcademicAPI } from "../api/apis";

export const useAcademicRegistry = () => {
    const [courses, setCourses] = useState([]);
    const [years, setYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [sections, setSections] = useState([]);
    const [batches, setBatches] = useState([]);
    const [periods, setPeriods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegistry = async () => {
            try {
                setLoading(true);
                const [cRes, yRes, semRes, secRes, bRes, pRes] = await Promise.all([
                    AcademicAPI.get("/courses"),
                    AcademicAPI.get("/years"),
                    AcademicAPI.get("/semesters"),
                    AcademicAPI.get("/sections"),
                    AcademicAPI.get("/batches"),
                    AcademicAPI.get("/periods")
                ]);

                setCourses(cRes.data.data || []);
                setYears(yRes.data.data || []);
                setSemesters(semRes.data.data || []);
                setSections(secRes.data.data || []);
                setBatches(bRes.data.batches || []); // Batch returns .batches
                setPeriods(pRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch academic registry:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistry();
    }, []);

    return { courses, years, semesters, sections, batches, periods, loading, error };
};
