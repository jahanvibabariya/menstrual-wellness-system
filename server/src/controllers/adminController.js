import mongoose from 'mongoose';
import User from '../models/User.js';
import PainLog from '../models/PainLog.js';
import TherapySession from '../models/TherapySession.js';
import Content from '../models/Content.js';

/**
 * GET /api/admin/users
 * Paginated user list with search by name or email.
 */
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id/toggle
 * Toggle isActive status for a user.
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/analytics
 * Return platform-wide analytics.
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [
      totalUsers,
      activeUsers,
      newUsersToday,
      newUsersThisWeek,
      avgPainResult,
      totalTherapySessions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ createdAt: { $gte: weekStart } }),
      PainLog.aggregate([
        { $group: { _id: null, avg: { $avg: '$painScore' } } },
      ]),
      TherapySession.countDocuments(),
    ]);

    const averagePainScore =
      avgPainResult.length > 0
        ? Math.round(avgPainResult[0].avg * 10) / 10
        : 0;

    res.status(200).json({
      success: true,
      data: {
        analytics: {
          totalUsers,
          activeUsers,
          newUsersToday,
          newUsersThisWeek,
          averagePainScore,
          totalTherapySessions,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/content
 * Get all content with optional category filter.
 */
export const getContent = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }

    const content = await Content.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: content.length,
      data: { content },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/admin/content
 * Create new content.
 */
export const createContent = async (req, res, next) => {
  try {
    const { title, category, description, content: bodyContent, isPublished } = req.body;

    const newContent = await Content.create({
      title,
      category,
      description,
      content: bodyContent,
      isPublished: isPublished || false,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Content created successfully.',
      data: { content: newContent },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/content/:id
 * Update content by ID.
 */
export const updateContent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, description, content: bodyContent, isPublished } = req.body;

    const existingContent = await Content.findById(id);

    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: 'Content not found.',
      });
    }

    if (title !== undefined) existingContent.title = title;
    if (category !== undefined) existingContent.category = category;
    if (description !== undefined) existingContent.description = description;
    if (bodyContent !== undefined) existingContent.content = bodyContent;
    if (isPublished !== undefined) existingContent.isPublished = isPublished;

    await existingContent.save();

    res.status(200).json({
      success: true,
      message: 'Content updated successfully.',
      data: { content: existingContent },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/content/:id
 * Delete content by ID.
 */
export const deleteContent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found.',
      });
    }

    await Content.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Content deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/reports
 * Generate reports with date range: user signups over time, pain trends, therapy usage.
 */
export const getReports = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const hasDateFilter = Object.keys(dateFilter).length > 0;

    // User signups over time (grouped by day)
    const signupMatch = hasDateFilter ? { createdAt: dateFilter } : {};
    const userSignups = await User.aggregate([
      { $match: signupMatch },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const userSignupsFormatted = userSignups.map((s) => ({
      date: `${s._id.year}-${String(s._id.month).padStart(2, '0')}-${String(s._id.day).padStart(2, '0')}`,
      count: s.count,
    }));

    // Pain trends (average pain by day)
    const painMatch = hasDateFilter ? { timestamp: dateFilter } : {};
    const painTrends = await PainLog.aggregate([
      { $match: painMatch },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' },
          },
          averagePain: { $avg: '$painScore' },
          logCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const painTrendsFormatted = painTrends.map((p) => ({
      date: `${p._id.year}-${String(p._id.month).padStart(2, '0')}-${String(p._id.day).padStart(2, '0')}`,
      averagePain: Math.round(p.averagePain * 10) / 10,
      logCount: p.logCount,
    }));

    // Therapy usage (sessions and minutes by day)
    const therapyMatch = hasDateFilter ? { createdAt: dateFilter } : {};
    const therapyUsage = await TherapySession.aggregate([
      { $match: therapyMatch },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          sessions: { $sum: 1 },
          totalMinutes: { $sum: '$duration' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    const therapyUsageFormatted = therapyUsage.map((t) => ({
      date: `${t._id.year}-${String(t._id.month).padStart(2, '0')}-${String(t._id.day).padStart(2, '0')}`,
      sessions: t.sessions,
      totalMinutes: t.totalMinutes,
    }));

    res.status(200).json({
      success: true,
      data: {
        reports: {
          userSignups: userSignupsFormatted,
          painTrends: painTrendsFormatted,
          therapyUsage: therapyUsageFormatted,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
