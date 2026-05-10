import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    marks: {
        type: String,
        required: true
    }
});

const marksSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    entries: [entrySchema]
}, { timestamps: true });

export const Marks = mongoose.models.Marks || mongoose.model("Marks", marksSchema, "marks");
