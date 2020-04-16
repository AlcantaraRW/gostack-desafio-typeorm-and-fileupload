import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(data: Request[]): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const transactions = await Promise.all(
      data.map(transactionData => {
        const { title, type, value, category } = transactionData;

        return createTransaction.execute({
          title,
          type,
          value,
          category,
        });
      }),
    );

    return transactions;
  }
}

export default ImportTransactionsService;
