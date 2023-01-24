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
});

describe("Singup test", () => {
  it("Should return user has been registerd", async () => {
    const data = { email: "test1@mail.com", name: "test", password: '123456', confirmPassword: "123456" }
    const response = await request(app).post("/api/auth/singup").send(data)

    expect(response.body.name).toBe(data.name)
    expect(response.body.email).toBe(data.email)
    expect(response.status).toBe(201)
  })

  it("Should return user is alredy registerd", async () => {
    const data = { email: "test1@mail.com", name: "test", password: '123456', confirmPassword: "123456" }
    const response = await request(app).post("/api/auth/singup").send(data)

    expect(response.body.name).toBe(data.name)
    expect(response.body.email).toBe(data.email)
    expect(response.status).toBe(201)

    const response1 = await request(app).post("/api/auth/singup").send(data);

    expect(response1.body.errors[0].msg).toBe("User registerd!");
    expect(response1.status).toBe(403)

  })

  it("Should return passwords must match", async () => {
    const data = { email: "test1@mail.com", name: "test", password: '123456', confirmPassword: "156" }
    const response = await request(app).post("/api/auth/singup").send(data)

    expect(response.body.errors[0].msg).toBe("Passwords don't match!");
    expect(response.status).toBe(400)
  })

})

describe("Singout test", () => {
  it("Should logout user", async () => {
    const response = await request(app).post("/api/auth/singout")

    expect(response.body.errors[0].msg).toBe("User not authenticated!")
    expect(response.status).toBe(401)
  })

})

