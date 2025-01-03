import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postModel from "../models/post_model";

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

type PostInfo = {
  user?: string;
  title: string;
  description: string;
  image: string;
  likes?: string[];
  catagoery: string;
  phone: string;
  region: string;
  city: string;
  _id?: string;
};

const postInfo: PostInfo = {
  title: "testtitle",
  description: "testdescription",
  image: "testimage",
  catagoery: "testcatagoery",
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
  picture: "testpicture",
};

const userInfo2: UserInfo = {
  username: "testuser2",
  password: "testpassword2",
  email: "testemail2",
  f_name: "testf_name2",
  l_name: "testl_name2",
  picture: "testpicture2",
};

beforeAll(async () => {
  app = await initApp();
});

afterAll(async () => {
  await userModel.deleteMany();
  await postModel.deleteMany();
  await mongoose.connection.close();
});

describe("Users Tests", () => {
  test("register fail - should return 400 if missing fields", async () => {
    const response = await request(app).post("/user/register").send({
      username: userInfo.username,
      password: userInfo.password,
      email: userInfo.email,
      f_name: userInfo.f_name,
    });
    expect(response.status).toBe(400);
  });
  test("register fail - should return 401 if email already exist", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/register").send(userInfo);
    expect(response.status).toBe(401);
    await userModel.deleteMany();
  });
  test("register fail - should return 402 if username already exist", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app)
      .post("/user/register")
      .send({
        username: userInfo.username,
        password: userInfo.password,
        email: userInfo.email + "wrong",
        f_name: userInfo.f_name,
        l_name: userInfo.l_name,
        picture: userInfo.picture,
      });
    expect(response.status).toBe(402);
    await userModel.deleteMany();
  });
  test("register success - should return 200 if user is created", async () => {
    const response = await request(app).post("/user/register").send(userInfo);
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
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
    await userModel.deleteMany();
  });
  test("login fail - should return 403 if missing fields", async () => {
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
    });
    expect(response.status).toBe(403);
  });
  test("login success - should return 200 if user is logged in", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    expect(response.status).toBe(200);
    await userModel.deleteMany();
  });
  test("logout fail - should return 402 missing refresh token", async () => {
    const response = await request(app).post("/user/logout").send({});
    expect(response.status).toBe(402);
  });
  test("logout fail - should return 401 if user is not logged in", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    await request(app)
      .post("/user/logout")
      .send({ refreshToken: refreshToken });
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: refreshToken });
    expect(response2.status).toBe(401);
    await userModel.deleteMany();
  });
  test("logout fail - should return 403 if invalid refresh token", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: refreshToken + "wrong" });
    expect(response2.status).toBe(403);
    await userModel.deleteMany();
  });
  test("logout fail - should return 400 if the token is of deleted user", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    await userModel.deleteMany();
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: refreshToken });
    expect(response2.status).toBe(400);
  });
  test("logout success - should return 200 if user is logged out", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    const response2 = await request(app)
      .post("/user/logout")
      .send({ refreshToken: refreshToken });
    expect(response2.status).toBe(200);
    await userModel.deleteMany();
  });
  test("refresh fail - should return 402 if missing refresh token", async () => {
    const response = await request(app).post("/user/refresh").send({});
    expect(response.status).toBe(402);
  });
  test("refresh fail - should return 400 if user is deleted", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    await userModel.deleteMany();
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: refreshToken });
    expect(response2.status).toBe(400);
  });
  test("refresh fail - should return 403 if invalid refresh token", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: refreshToken + "wrong" });
    expect(response2.status).toBe(403);
    await userModel.deleteMany();
  });
  test("refresh fail - should return 401 if refresh token is not in the database", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    await userModel.updateOne(
      { username: userInfo.username },
      { $pull: { refreshTokens: refreshToken } }
    );
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: refreshToken });
    expect(response2.status).toBe(401);
    await userModel.deleteMany();
  });
  test("refresh success - should return 200 if token is refreshed", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    const refreshToken = response.body.refreshToken;
    const response2 = await request(app)
      .post("/user/refresh")
      .send({ refreshToken: refreshToken });
    expect(response2.status).toBe(200);
    await userModel.deleteMany();
  });
  test("Get user fail - should return 500 id not in format", async () => {
    const response = await request(app).get("/user/" + userInfo.username);
    expect(response.status).toBe(500);
  });
  test("Get user success - should return 200 if user exists", async () => {
    const response = await request(app).post("/user/register").send(userInfo);
    userInfo._id = response.body._id;
    const response2 = await request(app).get("/user/" + userInfo._id);
    expect(response2.status).toBe(200);
    await userModel.deleteMany();
  });
  test("Get user fail - should return 401 if user does not exist", async () => {
    const response = await request(app).get("/user/" + userInfo._id);
    expect(response.status).toBe(401);
  });
  test("Get user settings success - should return 200 if users are found", async () => {
    const response3 = await request(app).post("/user/register").send(userInfo);
    expect(response3.status).toBe(200);
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
    await userModel.deleteMany();
  });
  test("Get user settings fail - should return 400 if user does not exist", async () => {
    const response3 = await request(app)
      .get("/user/auth/settings")
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response3.status).toBe(400);
  });
  test("Update user fail - should return 400 if user does not exist", async () => {
    const response = await request(app).post("/user/register").send(userInfo);
    userInfo._id = response.body._id;
    const response2 = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.accessToken = response2.body.accessToken;
    await userModel.deleteMany();
    const response3 = await request(app)
      .put("/user/update")
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send(userInfo);
    expect(response3.status).toBe(400);
  });
  test("Update user fail - should return 401 if username you are trying to update are already in the system", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.accessToken = response.body.accessToken;
    await request(app).post("/user/register").send(userInfo2);
    const response2 = await request(app)
      .put("/user/update")
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ ...userInfo, username: userInfo2.username });
    expect(response2.status).toBe(401);
    await userModel.deleteMany();
  });
  test("Update user success - should return 200 if user is updated", async () => {
    await request(app).post("/user/register").send(userInfo);
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
    await userModel.deleteMany();
  });
  test("Delete user fail - should return 400 if user does not exist", async () => {
    const response = await request(app).post("/user/register").send(userInfo);
    userInfo._id = response.body._id;
    const response2 = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.accessToken = response2.body.accessToken;
    await userModel.deleteMany();
    const response3 = await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response3.status).toBe(400);
  });
  test("Delete user success - should return 200 if user is deleted and removed likes on post", async () => {
    await request(app).post("/user/register").send(userInfo);
    const response = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.accessToken = response.body.accessToken;
    const response2 = await request(app)
      .post("/post")
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .send(postInfo);
    postInfo._id = response2.body._id;
    await request(app)
      .post(`/post/${postInfo._id}/like`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    const response3 = await request(app)
      .delete("/user/delete")
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response3.status).toBe(200);
    const response4 = await request(app).get("/post/" + postInfo._id);
    expect(response4.status).toBe(404);
  });
});
