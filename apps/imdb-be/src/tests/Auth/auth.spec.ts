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
const data = { email: "test@mail.com", name: "test", password: '123456', confirmPassword: "123456" }
export const createTestUser = async () => {

  const response = await request(app).post("/api/auth/singup").send(data)
  return response
}

describe("Singin test", () => {
  it("Should sing in user to app", async () => {
    await createTestUser()
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
  });

});

describe("Singup test", () => {
  it("Should return user has been registerd", async () => {
    const response = await createTestUser()

    expect(response.body.name).toBe(data.name)
    expect(response.body.email).toBe(data.email)
    expect(response.status).toBe(201)
  })

  it("Should return user is alredy registerd", async () => {
    await createTestUser()
    const response = await request(app).post("/api/auth/singup").send(data)

    expect(response.body.errors[0].msg).toBe("User already registerd!");
    expect(response.status).toBe(403)
  })

  it("Should return passwords must match", async () => {
    const data = { email: "test1@mail.com", name: "test", password: '123456', confirmPassword: "156" }
    const response = await request(app).post("/api/auth/singup").send(data)

    expect(response.body.errors[0].msg).toBe("Passwords don't match!");
    expect(response.status).toBe(400)
  })

})

describe("Singout test", () => {
  it("Should send logout error ", async () => {
    const response = await request(app).post("/api/auth/singout")

    expect(response.body.errors[0].msg).toBe("User not authenticated!")
    expect(response.status).toBe(401)
  })
  it("Should logout user", async () => {
    const response = await createTestUser()
    const cookie = response.headers["set-cookie"]

    expect(response.body.email).toBe(data.email)
    expect(response.status).toBe(201)


    const response1 = await request(app).post("/api/auth/singout").set("Cookie", cookie[0])
    expect(response1.body.message).toBe("User is logged out")
    expect(response1.status).toBe(200)
  })

})


