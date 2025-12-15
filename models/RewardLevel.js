import mongoose from "mongoose";

const rewardLevelSchema = new mongoose.Schema(
  {
    startAmount: { type: Number, required: true },
    endAmount: { type: Number, required: true },
    rewardToken: { type: Number, required: true }, // kitne token milenge
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("RewardLevel", rewardLevelSchema);
