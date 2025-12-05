import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

export const createTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            });
        }

        if (req.body.walletAddress) {
            req.body.walletAddress = req.body.walletAddress.toLowerCase();
        }

        req.body.userId = id;
        const tx = await Transaction.create(req.body);

        res.status(201).json({
            success: true,
            transaction: tx,
        });
    } catch (err) {
        next(err);
    }
};

export const getTransactionsByWallet = async (req, res, next) => {
    try {
        const { userId  } = req.params;

        const txs = await Transaction.find({
            userId: userId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            transactions: txs,
        });
    } catch (err) {
        next(err);
    }
};
