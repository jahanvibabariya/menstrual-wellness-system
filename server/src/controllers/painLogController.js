import mongoose from 'mongoose';
import PainLog from '../models/PainLog.js';

/**
 * GET /api/pain-logs
 * Get pain logs for user with optional date range filter.
 */
export const getPainLogs = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { userId: req.user.id };

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    const painLogs = await PainLog.find(filter).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: painLogs.length,
      data: { painLogs },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/pain-logs
 * Create a new pain log entry.
 */
export const createPainLog = async (req, res, next) => {
  try {
    const { painScore, symptoms, mood, notes, timestamp } = req.body;

    const painLog = await PainLog.create({
      userId: req.user.id,
      painScore,
      symptoms,
      mood,
      notes,
      timestamp: timestamp || Date.now(),
    });

    res.status(201).json({
      success: true,
      message: 'Pain log created successfully.',
      data: { painLog },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/pain-logs/stats
 * Aggregate stats: average pain, most common symptoms, pain by month (last 6 months).
 */
export const getPainStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Average pain score
    const avgResult = await PainLog.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          averagePainScore: { $avg: '$painScore' },
          totalLogs: { $sum: 1 },
        },
      },
    ]);

    const averagePainScore =
      avgResult.length > 0
        ? Math.round(avgResult[0].averagePainScore * 10) / 10
        : 0;
    const totalLogs = avgResult.length > 0 ? avgResult[0].totalLogs : 0;

    // Most common symptoms
    const symptomResult = await PainLog.aggregate([
      { $match: { userId } },
      { $unwind: '$symptoms' },
      {
        $group: {
          _id: '$symptoms',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const mostCommonSymptoms = symptomResult.map((s) => ({
      symptom: s._id,
      count: s.count,
    }));

    // Pain by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const painByMonth = await PainLog.aggregate([
      {
        $match: {
          userId,
          timestamp: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
          },
          averagePain: { $avg: '$painScore' },
          logCount: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const painByMonthFormatted = painByMonth.map((m) => ({
      year: m._id.year,
      month: m._id.month,
      averagePain: Math.round(m.averagePain * 10) / 10,
      logCount: m.logCount,
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          averagePainScore,
          totalLogs,
          mostCommonSymptoms,
          painByMonth: painByMonthFormatted,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/pain-logs/:id
 * Delete a pain log (verify ownership).
 */
export const deletePainLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const painLog = await PainLog.findById(id);

    if (!painLog) {
      return res.status(404).json({
        success: false,
        message: 'Pain log not found.',
      });
    }

    if (painLog.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this pain log.',
      });
    }

    await PainLog.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Pain log deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
