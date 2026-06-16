import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import config from './config/env.js';
import User from './models/User.js';
import Cycle from './models/Cycle.js';
import PainLog from './models/PainLog.js';
import TherapySession from './models/TherapySession.js';
import Notification from './models/Notification.js';
import Content from './models/Content.js';

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // ── Admin User ──────────────────────────────────────────
    let adminUser = await User.findOne({ email: 'admin@wellness.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@wellness.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@wellness.com / Admin@123');
    } else {
      console.log('ℹ️  Admin user already exists, skipping.');
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
      console.log('✅ Test user created: jane@example.com / User@123');
    } else {
      console.log('ℹ️  Test user already exists, skipping.');
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
      console.log(`✅ ${cycles.length} sample cycles created`);
    } else {
      console.log('ℹ️  Cycles already exist for test user, skipping.');
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
          mood: 'irritable',
          notes: 'Moderate pain, took a warm bath',
          timestamp: new Date(now.getFullYear(), now.getMonth(), 2),
        },
        {
          userId,
          painScore: 3,
          symptoms: ['bloating', 'moodSwings'],
          mood: 'anxious',
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
        {
          userId,
          painScore: 6,
          symptoms: ['cramps', 'backPain', 'nausea'],
          mood: 'sad',
          notes: 'Unexpected spike in pain',
          timestamp: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        },
        {
          userId,
          painScore: 8,
          symptoms: ['cramps', 'headache', 'bloating', 'fatigue'],
          mood: 'tired',
          notes: 'Very painful day, used therapy device',
          timestamp: new Date(now.getFullYear(), now.getMonth() - 1, 2),
        },
        {
          userId,
          painScore: 4,
          symptoms: ['backPain', 'insomnia'],
          mood: 'neutral',
          notes: 'Some back pain, trouble sleeping',
          timestamp: new Date(now.getFullYear(), now.getMonth() - 2, 3),
        },
        {
          userId,
          painScore: 1,
          symptoms: [],
          mood: 'happy',
          notes: 'Feeling great today!',
          timestamp: new Date(now.getFullYear(), now.getMonth() - 2, 10),
        },
      ];

      await PainLog.insertMany(painLogs);
      console.log(`✅ ${painLogs.length} sample pain logs created`);
    } else {
      console.log('ℹ️  Pain logs already exist for test user, skipping.');
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
        {
          userId,
          heatLevel: 'low',
          vibrationMode: 'gentle',
          duration: 15,
          completedAt: new Date(now.getFullYear(), now.getMonth(), 3, 9, 15),
        },
        {
          userId,
          heatLevel: 'medium',
          vibrationMode: 'strong',
          duration: 25,
          completedAt: new Date(now.getFullYear(), now.getMonth() - 1, 1, 20, 25),
        },
        {
          userId,
          heatLevel: 'high',
          vibrationMode: 'strong',
          duration: 45,
          completedAt: new Date(now.getFullYear(), now.getMonth() - 1, 2, 22, 45),
        },
        {
          userId,
          heatLevel: 'low',
          vibrationMode: 'moderate',
          duration: 10,
          completedAt: new Date(now.getFullYear(), now.getMonth() - 2, 5, 8, 10),
        },
      ];

      await TherapySession.insertMany(sessions);
      console.log(`✅ ${sessions.length} sample therapy sessions created`);
    } else {
      console.log('ℹ️  Therapy sessions already exist for test user, skipping.');
    }

    // ── Sample Notifications ────────────────────────────────
    const existingNotifications = await Notification.countDocuments({ userId });
    if (existingNotifications === 0) {
      const notifications = [
        {
          userId,
          title: 'Period Reminder',
          message:
            'Your next period is predicted to start in 3 days. Stay prepared!',
          type: 'period',
          read: false,
        },
        {
          userId,
          title: 'Wellness Tip',
          message:
            'Try gentle stretching and warm compresses to ease menstrual cramps.',
          type: 'wellness',
          read: false,
        },
        {
          userId,
          title: 'Therapy Complete',
          message:
            'Your 30-minute therapy session has been completed. How are you feeling?',
          type: 'therapy',
          read: true,
        },
        {
          userId,
          title: 'Welcome!',
          message:
            'Welcome to the Menstrual Wellness System. Start by logging your current cycle.',
          type: 'system',
          read: true,
        },
        {
          userId,
          title: 'Ovulation Window',
          message:
            'You are entering your estimated fertile window. Your estimated ovulation is in 2 days.',
          type: 'period',
          read: false,
        },
      ];

      await Notification.insertMany(notifications);
      console.log(`✅ ${notifications.length} sample notifications created`);
    } else {
      console.log('ℹ️  Notifications already exist for test user, skipping.');
    }

    // ── Sample Content ──────────────────────────────────────
    const existingContent = await Content.countDocuments();
    if (existingContent === 0) {
      const contentItems = [
        {
          title: 'Understanding Your Menstrual Cycle',
          category: 'education',
          description:
            'A comprehensive guide to the four phases of the menstrual cycle.',
          content:
            'The menstrual cycle consists of four main phases: **Menstrual Phase** (Days 1–5): The uterus sheds its lining, causing bleeding. Common symptoms include cramps, fatigue, and mood changes.\n\n**Follicular Phase** (Days 1–13): Overlaps with menstruation. FSH stimulates follicle growth in the ovaries. Estrogen rises, thickening the uterine lining.\n\n**Ovulation** (Day 14): A mature egg is released from the ovary. This is the most fertile window. Some women feel mild pain called mittelschmerz.\n\n**Luteal Phase** (Days 15–28): The empty follicle transforms into the corpus luteum, producing progesterone. If the egg isn\'t fertilized, hormone levels drop, leading to PMS symptoms and eventually menstruation.',
          isPublished: true,
          createdBy: adminUser._id,
        },
        {
          title: '5 Natural Remedies for Menstrual Cramps',
          category: 'wellness_tip',
          description:
            'Evidence-based natural approaches to managing period pain.',
          content:
            '1. **Heat Therapy**: Apply a heating pad or warm water bottle to your lower abdomen for 15-20 minutes. Heat relaxes the uterine muscles and improves blood flow.\n\n2. **Gentle Exercise**: Light activities like walking, yoga, or swimming can release endorphins, your body\'s natural painkillers.\n\n3. **Herbal Teas**: Ginger, chamomile, and peppermint teas have anti-inflammatory properties that can help reduce cramping.\n\n4. **Magnesium-Rich Foods**: Dark chocolate, spinach, nuts, and avocados are high in magnesium, which helps relax muscles.\n\n5. **Deep Breathing & Meditation**: Stress can worsen cramps. Practice deep breathing exercises or guided meditation to promote relaxation.',
          isPublished: true,
          createdBy: adminUser._id,
        },
        {
          title: 'Guided Relaxation for Period Pain',
          category: 'relaxation',
          description:
            'A step-by-step guided relaxation technique for pain relief.',
          content:
            '**Progressive Muscle Relaxation (PMR)**\n\nFind a comfortable position, either sitting or lying down. Close your eyes and take 3 deep breaths.\n\n1. **Feet**: Tense the muscles in your feet for 5 seconds, then release. Feel the tension melt away.\n2. **Calves**: Tighten your calf muscles, hold for 5 seconds, and release.\n3. **Thighs**: Squeeze your thigh muscles, hold, and release.\n4. **Abdomen**: Gently tighten your abdominal muscles. Hold for 5 seconds and release slowly. Imagine warmth spreading through your lower belly.\n5. **Hands & Arms**: Make fists, tense your arms, hold, and release.\n6. **Shoulders & Neck**: Shrug your shoulders toward your ears, hold, and let them drop.\n7. **Face**: Scrunch your facial muscles, hold, and relax.\n\nTake 3 more deep breaths. Notice how your body feels lighter and more relaxed. Practice this technique whenever you feel tension or pain.',
          isPublished: true,
          createdBy: adminUser._id,
        },
        {
          title: 'Nutrition During Your Period',
          category: 'wellness_tip',
          description:
            'Foods to eat and avoid during menstruation for optimal wellness.',
          content:
            '**Foods to Include:**\n- Iron-rich foods (spinach, lentils, red meat) to replenish iron lost through bleeding\n- Omega-3 fatty acids (salmon, walnuts, flaxseeds) to reduce inflammation\n- Complex carbohydrates (whole grains, sweet potatoes) for sustained energy\n- Water and hydrating foods (cucumbers, watermelon) to reduce bloating\n- Calcium-rich foods (yogurt, almonds) to ease muscle cramps\n\n**Foods to Limit:**\n- Excessive salt (increases water retention and bloating)\n- Caffeine (can worsen anxiety and breast tenderness)\n- Refined sugar (causes energy crashes and inflammation)\n- Alcohol (can increase cramps and dehydration)\n- Processed foods (often high in sodium and unhealthy fats)',
          isPublished: true,
          createdBy: adminUser._id,
        },
        {
          title: 'When to See a Doctor About Period Pain',
          category: 'education',
          description:
            'Know when menstrual pain requires medical attention.',
          content:
            'While some discomfort during periods is normal, certain signs warrant medical consultation:\n\n- **Severe pain** that doesn\'t respond to over-the-counter medication\n- **Excessively heavy bleeding** (soaking through a pad/tampon every hour for several hours)\n- **Periods lasting more than 7 days**\n- **Irregular cycles** (significantly shorter than 21 days or longer than 35 days)\n- **Pain during intercourse**\n- **Bleeding between periods**\n- **Sudden changes** in your cycle pattern\n- **Pain that interferes** with daily activities, work, or school\n\nThese symptoms could indicate conditions like endometriosis, fibroids, PCOS, or adenomyosis. Early diagnosis leads to better treatment outcomes.',
          isPublished: false,
          createdBy: adminUser._id,
        },
      ];

      await Content.insertMany(contentItems);
      console.log(`✅ ${contentItems.length} sample content articles created`);
    } else {
      console.log('ℹ️  Content already exists, skipping.');
    }

    // ── Summary ─────────────────────────────────────────────
    console.log('\n─────────────────────────────────────────');
    console.log('📊 Seed Summary:');
    console.log(`   Users:             ${await User.countDocuments()}`);
    console.log(`   Cycles:            ${await Cycle.countDocuments()}`);
    console.log(`   Pain Logs:         ${await PainLog.countDocuments()}`);
    console.log(`   Therapy Sessions:  ${await TherapySession.countDocuments()}`);
    console.log(`   Notifications:     ${await Notification.countDocuments()}`);
    console.log(`   Content Articles:  ${await Content.countDocuments()}`);
    console.log('─────────────────────────────────────────');
    console.log('\n✅ Database seeding complete!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.error(error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seed();
