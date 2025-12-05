import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    walletAddress: {
      type: String,
      required: true,
      index: true,
    },
    providerId: Number,
    providerName: String,
    serviceId: Number,
    serviceName: String,
    accountNumber: String,
    amountINR: {
      type: Number,
      required: true,
    },
    tokenSymbol: String,
    tokenAmount: Number,   // kitna token kharch hua
    onChainTxHash: String, // blockchain tx hash (ETH / token transfer)
    thirdPartyStatus: {
      type: String,
      enum: ['success', 'pending', 'failed'],
      default: 'pending',
    },
    transactionType: {
      type: String,
      required: true,
    },
    thirdPartyTxnId: String,
    rawThirdPartyResponse: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('Transaction', transactionSchema);