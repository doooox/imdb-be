import { createApp } from '../../app/app'
import * as request from "supertest"
import Auth from '../../models/Auth/authModel'
import mongoose from 'mongoose';

const app = createApp();
afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase()
  }
})

describe("Singin test", () => {
  it("Should sing in user to app", async () => {
    const data = { email: 'test@mail.com', password: "123456" }
    const response = await request(app).post("/api/auth/singin").send(data);

    expect(response.body.email).toBe(data.email)
    expect(response.status).toBe(201)

    const dbRecord = await Auth.exists({ email: data.email });
    expect(dbRecord).toHaveProperty("_id")
  });

  it("Should return error about invalid email", async () => {
    const data = { email: '', password: "123456" }
    const response = await request(app).post("/api/auth/singin").send(data);

    expect(response.body.errors[0].msg).toBe("Input must have a value of email")
    expect(response.status).toBe(400)
  });

  it("Should return error about invalid password", async () => {
    const data = { email: 'test@mail.com', password: "" }
    const response = await request(app).post("/api/auth/singin").send(data);

    expect(response.body.errors[0].msg).toBe("Invalid password")
    expect(response.status).toBe(400)

    const dbRecord = await Auth.exists({ email: data.email });
    expect(dbRecord).toBe(null)
  });

  // it("Should return user authenticated", async () => {
  //   const data = { email: 'test@mail.com', password: "123456" }
  //   const response = await request(app).post("/api/auth/singin").send(data);

  //   expect(response.body.email).toBe(data.email)
  //   expect(response.status).toBe(201)

  //   const response1 = await request(app).post("/api/auth/singin").send(data);
  //   console.log(response1.body);

  //   expect(response1.body.errors[0].msg).toBe("User already authenticated")
  //   expect(response1.status).toBe(400)
  // });
});

