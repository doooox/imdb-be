import { createApp } from '../../app/app'
import * as request from "supertest"
import mongoose from 'mongoose';
import { Cookie } from 'express-session';
import Movie from "../../models/Movies/moviesModel"
import { createTestUser } from '../Auth/auth.spec';

const app = createApp();
let cookie: Cookie | undefined
afterEach(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase()
  }
})

beforeAll(async () => {
  await createTestUser()
  const data = { email: 'test@mail.com', password: "123456" }
  const response = await request(app).post("/api/auth/singin").send(data);
  cookie = response.headers["set-cookie"]
})

const data = { title: "Movie test", description: "Description movie test", coverImage: 'coverImage movie test', genre: [{ name: "Action" }, { name: "Comedy" }] }

describe("Create movie test", () => {
  it("Should return movie created", async () => {
    const response = await request(app).post("/api/movies/create").set("Cookie", cookie[0]).send(data)

    expect(response.body.title).toBe(data.title)
    expect(response.body.description).toBe(data.description)
    expect(response.body.coverImage).toBe(data.coverImage)
    expect(response.body.genre[0].name).toBe(data.genre[0].name)
    expect(response.body.genre[1].name).toBe(data.genre[1].name)
    expect(response.status).toBe(201)

    const dbRecord = await Movie.exists({ title: data.title });
    expect(dbRecord).toHaveProperty("_id")
  })

  it("Should return user not authenticated", async () => {
    const response = await request(app).post("/api/movies/create").send(data)

    expect(response.body.errors[0].msg).toBe("User not authenticated!")
    expect(response.status).toBe(401)
  })

  it("Should return title field is required", async () => {
    const data = { title: "", description: "Description movie test", coverImage: 'coverImage movie test', genre: [{ name: "Action" }, { name: "Comedy" }] }
    const response = await request(app).post("/api/movies/create").set("Cookie", cookie[0]).send(data)

    expect(response.body.errors[0].msg).toBe("Title field is required")
    expect(response.status).toBe(400)
  })

  it("Should return movie already exists", async () => {
    const response = await request(app).post("/api/movies/create").set("Cookie", cookie[0]).send(data)

    expect(response.body.title).toBe(data.title)
    expect(response.body.description).toBe(data.description)
    expect(response.body.coverImage).toBe(data.coverImage)
    expect(response.body.genre[0].name).toBe(data.genre[0].name)
    expect(response.body.genre[1].name).toBe(data.genre[1].name)
    expect(response.status).toBe(201)

    const response1 = await request(app).post("/api/movies/create").set("Cookie", cookie[0]).send(data)

    expect(response1.body.errors[0].msg).toBe("Movie already exists")
    expect(response1.status).toBe(403)
  })
})

