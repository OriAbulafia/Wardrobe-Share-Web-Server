import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import { beforeAll, describe, expect } from "@jest/globals";
import * as path from "path";

let app: Express;

type UserInfo = {
  username: string;
  password: string;
  email: string;
  f_name: string;
  l_name: string;
  likedPosts?: string[];
  accessToken?: string;
  refreshTokens?: string;
  _id?: string;
};

type PostInfo = {
  user?: string;
  title: string;
  description: string;
  likes?: string[];
  category: string;
  phone: string;
  region: string;
  city: string;
  _id?: string;
};

const postInfo: PostInfo = {
  title: "testtitle",
  description: "testdescription",
  category: "testcatagoery",
  phone: "testphone",
  region: "testregion",
  city: "testcity",
};

const userInfo: UserInfo = {
  username: "testuser",
  password: "testpassword",
  email: "testemail",
  f_name: "testf_name",
  l_name: "testl_name",
};

const userInfo2: UserInfo = {
  username: "testuser2",
  password: "testpassword2",
  email: "testemail2",
  f_name: "testf_name2",
  l_name: "testl_name2",
};

const fakeId = "60f1b0e4c9e3f1b3b4c9e3f1";

const imagePath = path.join(__dirname, "assets", "trash.png");

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Users Tests", () => {
  test("should return 200 if user created - register", async () => {
    const res = await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo.email)
      .field("username", userInfo.username)
      .field("password", userInfo.password)
      .attach("picture", imagePath);
    expect(res.statusCode).toEqual(200);
  });
  test("register fail - should return 400 if missing fields", async () => {
    const response = await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo.email)
      .field("username", userInfo.username);
    expect(response.status).toBe(400);
  });
  test("register fail - should return 401 if email already exist", async () => {
    const res = await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo.email)
      .field("username", userInfo.username)
      .field("password", userInfo.password)
      .attach("picture", imagePath);
    expect(res.status).toBe(401);
  });
  test("register fail - should return 402 if username already exist", async () => {
    const res = await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo2.email)
      .field("username", userInfo.username)
      .field("password", userInfo.password)
      .attach("picture", imagePath);
    expect(res.status).toBe(402);
  });
  test("Google login fail - should return 400 if missing fields", async () => {
    const response = await request(app).post("/user/googleLogin").send({});
    expect(response.status).toBe(400);
  });
  test("login success - should return 200 if user is logged in", async () => {
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.refreshTokens = response.body.refreshToken;
    userInfo.accessToken = response.body.accessToken;
    expect(response.status).toBe(200);
  });
  test("login fail - should return 400 if user does not exist", async () => {
    const response = await request(app)
      .post("/user/login")
      .send({
        username: userInfo.username + "wrong",
        password: userInfo.password,
      });
    expect(response.status).toBe(400);
  });
  test("login fail - should return 401 if password is incorrect", async () => {
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
  });
  test("login fail - should return 403 if missing fields", async () => {
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
    });
    expect(response.status).toBe(403);
  });
  test("logout success - should return 200 if user is logged out", async () => {
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: userInfo.refreshTokens });
    expect(response2.status).toBe(200);
  });
  test("logout fail - should return 402 missing refresh token", async () => {
    const response = await request(app).post("/user/logout").send({});
    expect(response.status).toBe(402);
  });
  test("logout fail - should return 403 if invalid refresh token", async () => {
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: userInfo.refreshTokens + "wrong" });
    expect(response2.status).toBe(403);
  });
  test("logout fail - should return 401 if user is not logged in", async () => {
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: userInfo.refreshTokens });
    expect(response2.status).toBe(401);
  });
  test("logout fail - should return 400 if the token is of deleted user", async () => {
    await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: userInfo.refreshTokens });
    expect(response2.status).toBe(400);
  });
  test("refresh success - should return 200 if token is refreshed", async () => {
    await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo.email)
      .field("username", userInfo.username)
      .field("password", userInfo.password)
      .attach("picture", imagePath);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.refreshTokens = response.body.refreshToken;
    userInfo.accessToken = response.body.accessToken;
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: userInfo.refreshTokens });
    expect(response2.status).toBe(200);
  });
  test("refresh fail - should return 402 if missing refresh token", async () => {
    const response = await request(app).post("/user/refresh").send({});
    expect(response.status).toBe(402);
  });
  test("refresh fail - should return 403 if invalid refresh token", async () => {
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: userInfo.refreshTokens + "wrong" });
    expect(response2.status).toBe(403);
  });
  test("refresh fail - should return 401 if refresh token is not in the database", async () => {
    await userModel.updateOne(
      { username: userInfo.username },
      { $pull: { refreshTokens: userInfo.refreshTokens } }
    );
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: userInfo.refreshTokens });
    expect(response2.status).toBe(401);
    await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
  });
  test("refresh fail - should return 400 if user is deleted", async () => {
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: userInfo.refreshTokens });
    expect(response2.status).toBe(400);
  });
  test("Get user fail - should return 500 id not in format", async () => {
    const response = await request(app).get("/user/" + userInfo.username);
    expect(response.status).toBe(500);
  });
  test("Get user fail - should return 401 if user does not exist", async () => {
    const response = await request(app).get("/user/" + fakeId);
    expect(response.status).toBe(401);
  });
  test("Get user success - should return 200 if user exists", async () => {
    const res = await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo.email)
      .field("username", userInfo.username)
      .field("password", userInfo.password)
      .attach("picture", imagePath);
    userInfo._id = res.body.user._id;
    const response2 = await request(app).get("/user/" + userInfo._id);
    expect(response2.status).toBe(200);
  });
  test("Get user settings success - should return 200 if users are found", async () => {
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    expect(response.status).toBe(200);
    userInfo.accessToken = response.body.accessToken;
    const response2 = await request(app)
      .get("/user/auth/settings")
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response2.status).toBe(200);
    await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
  });
  test("Get user settings fail - should return 400 if user does not exist", async () => {
    const response3 = await request(app)
      .get("/user/auth/settings")
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response3.status).toBe(400);
  });
  test("Update user success - should return 200 if user is updated", async () => {
    await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo.email)
      .field("username", userInfo.username)
      .field("password", userInfo.password)
      .attach("picture", imagePath);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.accessToken = response.body.accessToken;
    const response2 = await request(app)
      .put("/user/update")
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ ...userInfo, username: "newusername" });
    expect(response2.status).toBe(200);
  });
  test("Update user fail - should return 401 if username you are trying to update are already in the system", async () => {
    await request(app)
      .post("/user/register")
      .field("f_name", userInfo2.f_name)
      .field("l_name", userInfo2.l_name)
      .field("email", userInfo2.email)
      .field("username", userInfo2.username)
      .field("password", userInfo2.password)
      .attach("picture", imagePath);
    const response = await request(app).post("/user/login").send({
      username: userInfo2.username,
      password: userInfo2.password,
    });
    userInfo2.accessToken = response.body.accessToken;
    const response2 = await request(app)
      .put("/user/update")
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ ...userInfo, username: userInfo2.username });
    expect(response2.status).toBe(401);
  });
  test("Update user fail - should return 400 if user does not exist", async () => {
    await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
    const response3 = await request(app)
      .put("/user/update")
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send(userInfo);
    expect(response3.status).toBe(400);
  });
  test("Delete user fail - should return 400 if user does not exist", async () => {
    const response3 = await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response3.status).toBe(400);
  });
  test("Delete user success - should return 200 if user is deleted and removed likes on post", async () => {
    await request(app)
      .post("/user/register")
      .field("f_name", userInfo.f_name)
      .field("l_name", userInfo.l_name)
      .field("email", userInfo.email)
      .field("username", userInfo.username)
      .field("password", userInfo.password)
      .attach("picture", imagePath);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.accessToken = response.body.accessToken;
    const response3 = await request(app)
      .post("/post")
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .field("title", postInfo.title)
      .field("description", postInfo.description)
      .field("category", postInfo.category)
      .field("phone", postInfo.phone)
      .field("region", postInfo.region)
      .field("city", postInfo.city)
      .attach("picture", imagePath);
    postInfo._id = response3.body._id;
    expect(response3.status).toBe(200);
    const response4 = await request(app)
      .post(`/post/${postInfo._id}/like`)
      .set("Authorization", `JWT ${userInfo2.accessToken}`);
    expect(response4.status).toBe(200);
    const response5 = await request(app).get(`/post/${postInfo._id}`);
    expect(response5.body.likes.length).toBe(1);
    userInfo.accessToken = response.body.accessToken;
    const response2 = await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo2.accessToken);
    expect(response2.status).toBe(200);
    const response6 = await request(app).get(`/post/${postInfo._id}`);
    expect(response6.body.likes.length).toBe(0);
    await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
  });
});
