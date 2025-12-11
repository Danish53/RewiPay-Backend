import Transaction from "../models/Transaction.js";
import User from "../models/User.js";


export const getAnalytics = async (req, res) => {
  try {
    // 1. TOTAL USERS
    const totalUsers = await User.countDocuments();

    // 2. TOTAL TRANSACTIONS
    const totalTransactions = await Transaction.countDocuments();

    // 3. TOTAL VOLUME (SUM OF AMOUNTS)
    const volumeResult = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: "$amountINR" } } }
    ]);
    const totalVolume = volumeResult.length ? volumeResult[0].total : 0;

    // DAILY USERS (fix: ignore null createdAt)
    const dailyUsers = await User.aggregate([
      { $match: { createdAt: { $ne: null } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } }
    ]);

    // DAILY VOLUME
    const dailyVolume = await Transaction.aggregate([
      { $match: { createdAt: { $ne: null } } },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" }
          },
          totalVolume: { $sum: "$amountINR" }
        }
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } }
    ]);

    res.json({
      totalUsers,
      totalTransactions,
      totalVolume,

      daily: {
        users: dailyUsers,
        volume: dailyVolume
      }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
