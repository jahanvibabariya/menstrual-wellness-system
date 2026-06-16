import mongoose from 'mongoose';

const therapySessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    heatLevel: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid heat level',
      },
      required: [true, 'Heat level is required'],
    },
    vibrationMode: {
      type: String,
      enum: {
        values: ['gentle', 'moderate', 'strong'],
        message: '{VALUE} is not a valid vibration mode',
      },
      required: [true, 'Vibration mode is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [120, 'Duration must be at most 120 minutes'],
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const TherapySession = mongoose.model('TherapySession', therapySessionSchema);

export default TherapySession;
