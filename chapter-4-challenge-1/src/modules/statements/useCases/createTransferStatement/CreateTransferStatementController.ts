import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferStatementUseCase } from "./CreateTransferStatementUseCase";

export class CreateTransferStatementController {
  async execute(request: Request, response: Response):Promise<Response> {
    const { user_id } = request.params

    const {id: sender_id} = request.user

    const {amount, description} = request.body

    const createTransferStatement = container.resolve(CreateTransferStatementUseCase)

    const statement =await createTransferStatement.execute({sender_id, user_id, amount, description})

    return response.json(statement)
  }
}
