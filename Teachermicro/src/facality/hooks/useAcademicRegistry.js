import { useState, useEffect } from "react";
import { AcademicAPI, AcademicService } from "../api/apis";

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
                    AcademicService.getCourses(),
                    AcademicService.getYears(),
                    AcademicService.getSemesters(),
                    AcademicService.getSections(),
                    AcademicService.getBatches(),
                    AcademicService.getPeriods()
                ]);

                setCourses(cRes.data?.data || cRes.data || []);
                setYears(yRes.data?.data || yRes.data || []);
                setSemesters(semRes.data?.data || semRes.data || []);
                setSections(secRes.data?.data || secRes.data || []);
                setBatches(bRes.data?.batches || bRes.batches || bRes.data || []); 
                setPeriods(pRes.data?.data || pRes.data || []);
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
