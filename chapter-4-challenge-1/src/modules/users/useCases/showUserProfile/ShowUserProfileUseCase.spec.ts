import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it("should be able show profile", async () => {
    const user = await createUserUseCase.execute({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123456",
    });

    const response = await showUserProfileUseCase.execute(user.id!);

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("email", "johndoe@mail.com");
    expect(response).toHaveProperty("name", "John Doe");
  });

  it("should not be able show profile from user non-existing", async () => {
    await expect(
      showUserProfileUseCase.execute("user non-existing")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
