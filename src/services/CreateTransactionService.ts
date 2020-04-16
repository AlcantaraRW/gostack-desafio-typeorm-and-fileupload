import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError(
        "You don't have enough balance to create this outcome.",
      );
    }

    const categoriesRepository = getRepository(Category);

    const existingCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    let category_id = '';

    if (existingCategory) {
      category_id = existingCategory.id;
    } else {
      const newCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(newCategory);

      category_id = newCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
