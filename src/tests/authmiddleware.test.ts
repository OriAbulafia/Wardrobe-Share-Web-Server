import request from "supertest";
import initApp from "../server"; 
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";

let app: Express; 

type UserInfo = {
  username: string;
  password: string;
  email: string;
  f_name: string;
  l_name: string;
  picture: string;
  likedPosts?: string[];
  accessToken?: string;
  refreshTokens?: string;
  _id?: string;
};
const userInfo: UserInfo = {
  username: "testuser",
  password: "testpassword",
  email: "testemail",
  f_name: "testf_name",
  l_name: "testl_name",
  picture: "testpicture",
};

beforeAll(async () => {
  app = await initApp();
   await request(app).post("/user/register").send(userInfo);
  const response = await request(app).post("/user/login").send({ 
    username: userInfo.username,
    password: userInfo.password,
  });
  userInfo.accessToken = response.body.accessToken;
});

afterAll(async () => {
  await userModel.deleteMany();
  await mongoose.connection.close();
});

describe("Auth Tests", () => {
    test("should return 401 if no token is provided", async () => {
        const response = await request(app).put("/user/update").send(userInfo);
        expect(response.status).toBe(401);
    });
    test("should return 403 if invalid token is provided", async () => {
        const response = await request(app).put("/user/update").set("Authorization", "JWT invalidtoken").send(userInfo);
        expect(response.status).toBe(403);
    });
    test("should return 200 if valid token is provided", async () => {
        const response = await request(app).put("/user/update").set("Authorization", "JWT "+userInfo.accessToken).send(userInfo);
        expect(response.status).toBe(200);
    });
});
