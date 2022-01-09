import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      usersRepository
    );
  });

  it("should be able to get balance from user", async () => {
    const user = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    });

    await statementsRepository.create({
      amount: 1000,
      type: OperationType.DEPOSIT,
      description: "Deposit",
      user_id: user.id!,
    });

    await statementsRepository.create({
      amount: 250,
      type: OperationType.WITHDRAW,
      description: "Deposit",
      user_id: user.id!,
    });

    const responseBalance = await getBalanceUseCase.execute({
      user_id: user.id!,
    });

    expect(responseBalance.balance).toBe(750);
  });

  it("should be able to get balance from non-existing user", async () => {
    await expect(
      getBalanceUseCase.execute({
        user_id: "non-existent-user",
      })
    ).rejects.toBeInstanceOf(GetBalanceError);
  });
});
