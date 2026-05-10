import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    subName: {
        type: String,
        required: true,
        trim: true
    },
    marks: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
});
const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        rollNo: {
            type: String,
            required: true,
            unique: true
        },
        course: {
            type: String,
            required: true
        },
        section: {
            type: String,
            required: true,
            lowercase: true
        },
        semester: {
            type: String,
            required: true
        },
        subjects: [subjectSchema]
    }
);

export const Marks = mongoose.models.Marks || mongoose.model("Marks", studentSchema);
