import mongoose from 'mongoose';
import config from './env.js';
import User from '../models/User.js';
import Cycle from '../models/Cycle.js';
import PainLog from '../models/PainLog.js';
import TherapySession from '../models/TherapySession.js';
import Notification from '../models/Notification.js';
import Content from '../models/Content.js';

let mongoServer = null;

const seedInMemoryDB = async () => {
  try {
    console.log('🌱 Seed: Checking database contents for auto-seeding...');

    // ── Admin User ──────────────────────────────────────────
    let adminUser = await User.findOne({ email: 'admin@wellness.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@wellness.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Auto-Seed: Admin user created: admin@wellness.com / Admin@123');
    }

    // ── Test User ───────────────────────────────────────────
    let testUser = await User.findOne({ email: 'jane@example.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'User@123',
        role: 'user',
      });
      console.log('✅ Auto-Seed: Test user created: jane@example.com / User@123');
    }

    const userId = testUser._id;

    // ── Sample Cycles ───────────────────────────────────────
    const existingCycles = await Cycle.countDocuments({ userId });
    if (existingCycles === 0) {
      const now = new Date();
      const cycles = [
        {
          userId,
          startDate: new Date(now.getFullYear(), now.getMonth() - 3, 5),
          cycleLength: 28,
          periodLength: 5,
          notes: 'Regular cycle, mild cramps on day 1.',
        },
        {
          userId,
          startDate: new Date(now.getFullYear(), now.getMonth() - 2, 2),
          cycleLength: 29,
          periodLength: 4,
          notes: 'Slightly longer cycle this month.',
        },
        {
          userId,
          startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
          cycleLength: 27,
          periodLength: 5,
          notes: 'On track, used therapy device for cramps.',
        },
        {
          userId,
          startDate: new Date(now.getFullYear(), now.getMonth(), 1),
          cycleLength: 28,
          periodLength: 5,
          notes: 'Current cycle.',
        },
      ];
      await Cycle.insertMany(cycles);
      console.log(`✅ Auto-Seed: ${cycles.length} cycles created`);
    }

    // ── Sample Pain Logs ────────────────────────────────────
    const existingPainLogs = await PainLog.countDocuments({ userId });
    if (existingPainLogs === 0) {
      const now = new Date();
      const painLogs = [
        {
          userId,
          painScore: 7,
          symptoms: ['cramps', 'bloating', 'fatigue'],
          mood: 'tired',
          notes: 'Heavy cramps on day 1',
          timestamp: new Date(now.getFullYear(), now.getMonth(), 1),
        },
        {
          userId,
          painScore: 5,
          symptoms: ['cramps', 'headache'],
          mood: 'neutral',
          notes: 'Moderate pain, took a warm bath',
          timestamp: new Date(now.getFullYear(), now.getMonth(), 2),
        },
        {
          userId,
          painScore: 3,
          symptoms: ['bloating', 'moodSwings'],
          mood: 'calm',
          notes: 'Pain reducing, some mood swings',
          timestamp: new Date(now.getFullYear(), now.getMonth(), 3),
        },
        {
          userId,
          painScore: 2,
          symptoms: ['fatigue'],
          mood: 'calm',
          notes: 'Much better today',
          timestamp: new Date(now.getFullYear(), now.getMonth(), 4),
        },
      ];
      await PainLog.insertMany(painLogs);
      console.log(`✅ Auto-Seed: ${painLogs.length} pain logs created`);
    }

    // ── Sample Therapy Sessions ─────────────────────────────
    const existingSessions = await TherapySession.countDocuments({ userId });
    if (existingSessions === 0) {
      const now = new Date();
      const sessions = [
        {
          userId,
          heatLevel: 'medium',
          vibrationMode: 'gentle',
          duration: 20,
          completedAt: new Date(now.getFullYear(), now.getMonth(), 1, 10, 20),
        },
        {
          userId,
          heatLevel: 'high',
          vibrationMode: 'moderate',
          duration: 30,
          completedAt: new Date(now.getFullYear(), now.getMonth(), 2, 14, 30),
        },
      ];
      await TherapySession.insertMany(sessions);
      console.log(`✅ Auto-Seed: ${sessions.length} therapy sessions created`);
    }

    // ── Sample Notifications ────────────────────────────────
    const existingNotifications = await Notification.countDocuments({ userId });
    if (existingNotifications === 0) {
      const notifications = [
        {
          userId,
          title: 'Period Reminder',
          message: 'Your next period is predicted to start in 3 days. Stay prepared!',
          type: 'period',
          read: false,
        },
        {
          userId,
          title: 'Wellness Tip',
          message: 'Try gentle stretching and warm compresses to ease menstrual cramps.',
          type: 'wellness',
          read: false,
        },
      ];
      await Notification.insertMany(notifications);
      console.log(`✅ Auto-Seed: ${notifications.length} notifications created`);
    }

    // ── Sample Content ──────────────────────────────────────
    const existingContent = await Content.countDocuments();
    if (existingContent === 0) {
      const contentItems = [
        {
          title: 'Understanding Your Menstrual Cycle',
          category: 'education',
          description: 'A comprehensive guide to the four phases of the menstrual cycle.',
          content: 'The menstrual cycle consists of four main phases: **Menstrual Phase** (Days 1–5): Uterus sheds its lining. **Follicular Phase** (Days 1–13): Estrogen rises. **Ovulation** (Day 14): Fertile window. **Luteal Phase** (Days 15–28): Progesterone increases.',
          isPublished: true,
          createdBy: adminUser._id,
        },
        {
          title: '5 Natural Remedies for Menstrual Cramps',
          category: 'wellness_tip',
          description: 'Evidence-based natural approaches to managing period pain.',
          content: '1. Heat Therapy: Use WellBelt Pro settings. 2. Gentle Exercise. 3. Herbal Teas. 4. Magnesium. 5. Breathwork.',
          isPublished: true,
          createdBy: adminUser._id,
        },
        {
          title: 'Guided Relaxation for Period Pain',
          category: 'relaxation',
          description: 'A step-by-step guided relaxation technique for pain relief.',
          content: 'PMR: Progressive muscle relaxation. Focus on relaxing lower belly, thighs, back. Breathe in for 4 seconds, hold, breathe out.',
          isPublished: true,
          createdBy: adminUser._id,
        },
      ];
      await Content.insertMany(contentItems);
      console.log(`✅ Auto-Seed: ${contentItems.length} articles created`);
    }
  } catch (err) {
    console.error('❌ Auto-seeding error:', err.message);
  }
};

const connectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });

  let connectionString = config.mongoUri;

  if (connectionString === 'mongodb://localhost:27017/menstrual-wellness') {
    try {
      console.log('🔍 Testing connection to local MongoDB...');
      // Short timeout to detect if mongodb is running locally
      await mongoose.connect(connectionString, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log('✅ Connected to local MongoDB instance.');
      await seedInMemoryDB();
      return;
    } catch (err) {
      console.log('⚠️  Local MongoDB not running. Launching in-memory database fallback...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        connectionString = mongoServer.getUri();
        console.log('🚀 In-memory MongoDB launched at:', connectionString);
      } catch (memError) {
        console.error('❌ Failed to start in-memory MongoDB:', memError.message);
        process.exit(1);
      }
    }
  }

  try {
    await mongoose.connect(connectionString);
    await seedInMemoryDB();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
