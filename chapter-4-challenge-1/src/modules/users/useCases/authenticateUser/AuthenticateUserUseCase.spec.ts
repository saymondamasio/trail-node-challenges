import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it("should be able authenticate user", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    });

    const response = await authenticateUserUseCase.execute({
      email: "johndoe@mail.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
  });

  it("should not be able authenticate user with incorrect password", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "incorrect-mail",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able authenticate user with incorrect email", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    });

    await expect(
      authenticateUserUseCase.execute({
        email: "johndoe@mail.com",
        password: "incorrect-password",
      })
    ).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
