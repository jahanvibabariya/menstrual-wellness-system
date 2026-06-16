import mongoose from 'mongoose';

const SYMPTOM_ENUM = [
  'cramps',
  'headache',
  'backPain',
  'bloating',
  'fatigue',
  'nausea',
  'breastTenderness',
  'moodSwings',
  'insomnia',
  'dizziness',
];

const MOOD_ENUM = [
  'happy',
  'sad',
  'anxious',
  'irritable',
  'calm',
  'tired',
  'energetic',
  'neutral',
];

const painLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    painScore: {
      type: Number,
      required: [true, 'Pain score is required'],
      min: [1, 'Pain score must be at least 1'],
      max: [10, 'Pain score must be at most 10'],
    },
    symptoms: [
      {
        type: String,
        enum: {
          values: SYMPTOM_ENUM,
          message: '{VALUE} is not a valid symptom',
        },
      },
    ],
    mood: {
      type: String,
      enum: {
        values: MOOD_ENUM,
        message: '{VALUE} is not a valid mood',
      },
    },
    notes: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PainLog = mongoose.model('PainLog', painLogSchema);

export default PainLog;
