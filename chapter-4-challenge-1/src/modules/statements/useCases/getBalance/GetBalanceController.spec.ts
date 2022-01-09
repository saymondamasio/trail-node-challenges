import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { createConnectionApplication } from "../../../../database";

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnectionApplication();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get balance from user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "John Doe",
      email: "johndoe@mail.com",
      password: "123",
    });

    const responseAuth = await request(app).post("/api/v1/sessions").send({
      email: "johndoe@mail.com",
      password: "123",
    });

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Deposit",
      })
      .set("Authorization", `Bearer ${responseAuth.body.token}`);

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set("Authorization", `Bearer ${responseAuth.body.token}`);

    console.log(response.body);

    expect(response.status).toBe(200);
  });
});
