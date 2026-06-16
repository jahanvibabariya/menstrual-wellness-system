import Notification from '../models/Notification.js';

/**
 * GET /api/notifications
 * Get all notifications for the authenticated user, sorted by createdAt desc.
 */
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.read).length;

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: { notifications },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/:id/read
 * Mark a single notification as read.
 */
export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.',
      });
    }

    if (notification.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this notification.',
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read.',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/notifications/read-all
 * Mark all notifications for the authenticated user as read.
 */
export const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notification(s) marked as read.`,
    });
  } catch (error) {
    next(error);
  }
};
