import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able create user", async () => {
    const response = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    });

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("email", "johndoe@mail.com");
    expect(response).toHaveProperty("name", "John Doe");
  });

  it("should not be able create user with email is already exists", async () => {
    await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    });

    await expect(
      createUserUseCase.execute({
        name: "John Doe",
        email: "johndoe@mail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
