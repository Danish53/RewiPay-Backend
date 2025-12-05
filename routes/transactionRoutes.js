import express from 'express';
import { createTransaction, getTransactionsByWallet } from '../controllers/transactionController.js';

const router = express.Router();


router.post('/create-transaction/:id', createTransaction);
router.get('/get-transactions/:userId', getTransactionsByWallet);

export default router;