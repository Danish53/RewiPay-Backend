import RewardLevel from "../models/RewardLevel.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

// rewards progress
export const getUserRewardProgress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("rewards.completedLevels.levelId"); 
    if (!user) return res.status(404).json({ message: "User not found" });

    const transactions = await Transaction.find({
      userId: req.user.id,
      thirdPartyStatus: "success",
    });

    const totalAmount = transactions.reduce((sum, t) => sum + t.amountINR, 0);

    const levels = await RewardLevel.find().sort({ startAmount: 1 });

    const levelsProgress = levels.map((level) => {
      let progress = 0;
      let completed = false;
      let rewardGiven = false;

      if (totalAmount >= level.startAmount) {
        progress = Math.min(
          100,
          ((Math.min(totalAmount, level.endAmount) - level.startAmount) /
            (level.endAmount - level.startAmount)) *
            100
        );
      }

      if (totalAmount >= level.endAmount) {
        completed = true;

        // Check if already credited
        rewardGiven = user.rewards.completedLevels.some(
          (lvl) => lvl.levelId.toString() === level._id.toString()
        );

        // Auto credit if not given
        if (!rewardGiven) {
          user.rewards.totalEarnedTokens += level.rewardToken;
          user.rewards.completedLevels.push({
            levelId: level._id,
            completedAt: new Date(),
          });
          rewardGiven = true;
        }
      }

      return {
        levelId: level._id,
        startAmount: level.startAmount,
        endAmount: level.endAmount,
        rewardToken: level.rewardToken,
        progress: Math.floor(progress),
        completed,
        rewardGiven,
      };
    });

    await user.save();

    res.json({
      totalAmount,
      totalEarnedTokens: user.rewards.totalEarnedTokens,
      levelsProgress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

