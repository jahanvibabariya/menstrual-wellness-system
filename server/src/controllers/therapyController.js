import mongoose from 'mongoose';
import TherapySession from '../models/TherapySession.js';

/**
 * GET /api/therapy
 * Get therapy sessions for the authenticated user, sorted desc.
 */
export const getSessions = async (req, res, next) => {
  try {
    const sessions = await TherapySession.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: sessions.length,
      data: { sessions },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/therapy
 * Create a new therapy session.
 */
export const createSession = async (req, res, next) => {
  try {
    const { heatLevel, vibrationMode, duration, completedAt } = req.body;

    const session = await TherapySession.create({
      userId: req.user.id,
      heatLevel,
      vibrationMode,
      duration,
      completedAt,
    });

    res.status(201).json({
      success: true,
      message: 'Therapy session created successfully.',
      data: { session },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/therapy/stats
 * Aggregate stats: total sessions, total minutes, average duration, usage by heat/vibration level.
 */
export const getStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Overall stats
    const overallStats = await TherapySession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalMinutes: { $sum: '$duration' },
          averageDuration: { $avg: '$duration' },
        },
      },
    ]);

    const overall =
      overallStats.length > 0
        ? {
            totalSessions: overallStats[0].totalSessions,
            totalMinutes: overallStats[0].totalMinutes,
            averageDuration:
              Math.round(overallStats[0].averageDuration * 10) / 10,
          }
        : {
            totalSessions: 0,
            totalMinutes: 0,
            averageDuration: 0,
          };

    // Usage by heat level
    const heatUsage = await TherapySession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$heatLevel',
          count: { $sum: 1 },
          totalMinutes: { $sum: '$duration' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const usageByHeatLevel = heatUsage.map((h) => ({
      level: h._id,
      count: h.count,
      totalMinutes: h.totalMinutes,
    }));

    // Usage by vibration mode
    const vibrationUsage = await TherapySession.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$vibrationMode',
          count: { $sum: 1 },
          totalMinutes: { $sum: '$duration' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const usageByVibrationMode = vibrationUsage.map((v) => ({
      mode: v._id,
      count: v.count,
      totalMinutes: v.totalMinutes,
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          ...overall,
          usageByHeatLevel,
          usageByVibrationMode,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
