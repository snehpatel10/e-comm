import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trime: true,
        required: true,
        maxLength: 32,
        unique: true,
    },
})

export default mongoose.model('Category', categorySchema)