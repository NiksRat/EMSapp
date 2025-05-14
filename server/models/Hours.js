import mongoose from "mongoose";

const HoursSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  hours: { type: Number, required: true },
});

module.exports = mongoose.model('Hours', HoursSchema);
