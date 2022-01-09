import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able to create a new statement", async () => {
    const user = await usersRepository.create({
      email: "test@mail.com",
      name: "Test",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      amount: 100,
      description: "Test Description",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("id");
    expect(statement).toHaveProperty("description", "Test Description");
  });

  it("should not be able to create a new statement with non-existent user", async () => {
    await expect(
      createStatementUseCase.execute({
        user_id: "non-exists",
        amount: 100,
        description: "Test Description",
        type: OperationType.DEPOSIT,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a new statement without sufficient funds", async () => {
    const user = await usersRepository.create({
      email: "test@mail.com",
      name: "Test",
      password: "123456",
    });

    await expect(
      createStatementUseCase.execute({
        user_id: user.id!,
        amount: 100,
        description: "Test Description",
        type: OperationType.WITHDRAW,
      })
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
