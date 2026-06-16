import mongoose from 'mongoose';

const cycleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    cycleLength: {
      type: Number,
      default: 28,
      min: [21, 'Cycle length must be at least 21 days'],
      max: [45, 'Cycle length must be at most 45 days'],
    },
    periodLength: {
      type: Number,
      default: 5,
      min: [1, 'Period length must be at least 1 day'],
      max: [10, 'Period length must be at most 10 days'],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: predicted next cycle start date
cycleSchema.virtual('predictedNextStart').get(function () {
  if (!this.startDate || !this.cycleLength) return null;
  const nextStart = new Date(this.startDate);
  nextStart.setDate(nextStart.getDate() + this.cycleLength);
  return nextStart;
});

// Virtual: estimated ovulation date
cycleSchema.virtual('estimatedOvulation').get(function () {
  if (!this.startDate || !this.cycleLength) return null;
  const ovulation = new Date(this.startDate);
  ovulation.setDate(ovulation.getDate() + (this.cycleLength - 14));
  return ovulation;
});

const Cycle = mongoose.model('Cycle', cycleSchema);

export default Cycle;
