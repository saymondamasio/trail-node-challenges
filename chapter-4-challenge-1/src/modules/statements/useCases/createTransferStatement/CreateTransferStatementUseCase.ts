import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";

interface IRequest {
  sender_id: string;
  user_id: string;
  amount: number;
  description: string;
}

@injectable()
export class CreateTransferStatementUseCase {
  constructor(
    @inject('UsersRepository') private usersRepository:IUsersRepository,
    @inject('StatementsRepository') private statementsRepository:IStatementsRepository
  ){}

  async execute({amount,description,user_id,sender_id}: IRequest): Promise<Statement> {
    const sender = await this.usersRepository.findById(sender_id);

    if(!sender) {
      throw new AppError('Sender not found');
    }

    const recipient = await this.usersRepository.findById(user_id);

    if(!recipient) {
      throw new AppError('Recipient not found');
    }

    const balance = await this.statementsRepository.getUserBalance({user_id: sender_id});

    if(balance.balance < amount) {
      throw new AppError('Insufficient balance');
    }

    const statement = await this.statementsRepository.create({
      user_id,
      sender_id,
      amount,
      description,
      type: OperationType.TRANSFER
    })

    console.log(statement);


    return statement
  }
}
