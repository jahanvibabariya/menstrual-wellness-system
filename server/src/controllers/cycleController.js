import Cycle from '../models/Cycle.js';

/**
 * GET /api/cycles
 * Get all cycles for the authenticated user, sorted by startDate desc.
 */
export const getCycles = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ userId: req.user.id }).sort({
      startDate: -1,
    });

    res.status(200).json({
      success: true,
      count: cycles.length,
      data: { cycles },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/cycles
 * Create a new cycle for the authenticated user.
 */
export const createCycle = async (req, res, next) => {
  try {
    const { startDate, cycleLength, periodLength, notes } = req.body;

    const cycle = await Cycle.create({
      userId: req.user.id,
      startDate,
      cycleLength,
      periodLength,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Cycle created successfully.',
      data: { cycle },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/cycles/:id
 * Update a cycle (verify ownership).
 */
export const updateCycle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { startDate, cycleLength, periodLength, notes } = req.body;

    const cycle = await Cycle.findById(id);

    if (!cycle) {
      return res.status(404).json({
        success: false,
        message: 'Cycle not found.',
      });
    }

    if (cycle.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this cycle.',
      });
    }

    if (startDate !== undefined) cycle.startDate = startDate;
    if (cycleLength !== undefined) cycle.cycleLength = cycleLength;
    if (periodLength !== undefined) cycle.periodLength = periodLength;
    if (notes !== undefined) cycle.notes = notes;

    await cycle.save();

    res.status(200).json({
      success: true,
      message: 'Cycle updated successfully.',
      data: { cycle },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/cycles/:id
 * Delete a cycle (verify ownership).
 */
export const deleteCycle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cycle = await Cycle.findById(id);

    if (!cycle) {
      return res.status(404).json({
        success: false,
        message: 'Cycle not found.',
      });
    }

    if (cycle.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this cycle.',
      });
    }

    await Cycle.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Cycle deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/cycles/predict
 * Get prediction based on the latest cycle: next start, ovulation, fertile window.
 */
export const getPrediction = async (req, res, next) => {
  try {
    const latestCycle = await Cycle.findOne({ userId: req.user.id }).sort({
      startDate: -1,
    });

    if (!latestCycle) {
      return res.status(404).json({
        success: false,
        message: 'No cycle data found. Please log a cycle first.',
      });
    }

    const predictedNextStart = latestCycle.predictedNextStart;
    const estimatedOvulation = latestCycle.estimatedOvulation;

    // Fertile window: 5 days before ovulation to 1 day after
    const fertileWindowStart = new Date(estimatedOvulation);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);

    const fertileWindowEnd = new Date(estimatedOvulation);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

    // Days until next period
    const today = new Date();
    const diffTime = predictedNextStart.getTime() - today.getTime();
    const daysUntilNextPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Current cycle day
    const cycleDiffTime = today.getTime() - latestCycle.startDate.getTime();
    const currentCycleDay =
      Math.floor(cycleDiffTime / (1000 * 60 * 60 * 24)) + 1;

    res.status(200).json({
      success: true,
      data: {
        currentCycle: latestCycle,
        prediction: {
          predictedNextStart,
          estimatedOvulation,
          fertileWindow: {
            start: fertileWindowStart,
            end: fertileWindowEnd,
          },
          daysUntilNextPeriod,
          currentCycleDay,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
