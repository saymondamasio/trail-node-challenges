import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository
    );
  });

  it("should be able get operation of a statement", async () => {
    const user = await usersRepository.create({
      email: "johndoe@mail.com",
      name: "John Doe",
      password: "123",
    });

    const statement = await statementsRepository.create({
      amount: 100,
      description: "Test",
      type: OperationType.DEPOSIT,
      user_id: user.id!,
    });

    const statementResult = await getStatementOperationUseCase.execute({
      statement_id: statement.id!,
      user_id: user.id!,
    });

    expect(statementResult).toEqual(statement);
  });

  it("should not be able get operation of a statement with user non-existing", async () => {
    const statement = await statementsRepository.create({
      amount: 100,
      description: "Test",
      type: OperationType.DEPOSIT,
      user_id: "non-existing",
    });

    await expect(
      getStatementOperationUseCase.execute({
        statement_id: statement.id!,
        user_id: "non-existing",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able get operation of a statement non-existing", async () => {
    const user = await usersRepository.create({
      email: "johndoe@mail.com",
      name: "John Doe",
      password: "123",
    });

    await expect(
      getStatementOperationUseCase.execute({
        statement_id: "non-existing",
        user_id: user.id!,
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
