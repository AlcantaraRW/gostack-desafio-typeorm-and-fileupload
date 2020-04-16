import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Values {
  income: number;
  outcome: number;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const values: Values = transactions.reduce(
      (accumulator, currentTransaction) => {
        accumulator[currentTransaction.type] += currentTransaction.value;
        return accumulator;
      },
      { income: 0, outcome: 0 },
    );

    const { income, outcome } = values;

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
