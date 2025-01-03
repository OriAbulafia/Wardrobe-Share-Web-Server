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

const fakeId = "60f7b4f3bbedb00000000000";

beforeAll(async () => {
  app = await initApp();
  const response = await request(app).post("/user/register").send(userInfo);
  userInfo._id = response.body._id;
  const response2 = await request(app).post("/user/login").send({
    username: userInfo.username,
    password: userInfo.password,
  });
  userInfo.accessToken = response2.body.accessToken;
});

afterAll(async () => {
  await postModel.deleteMany({});
  await userModel.deleteMany({});
  await mongoose.connection.close();
});

describe("Post Tests", () => {
  test("Create Post", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .send(postInfo);
    expect(response.status).toBe(201);
    postInfo._id = response.body._id;
  });
  test("Crate Post without all fields", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .send({ title: "testtitle" });
    expect(response.status).toBe(400);
  });
  test("Get Post", async () => {
    const response = await request(app).get("/post");
    expect(response.body.length).toBe(1);
    expect(response.status).toBe(200);
    const response2 = await request(app).get("/post?catagoery=testcatagoery");
    expect(response2.body.length).toBe(1);
    expect(response2.status).toBe(200);
  });
  test("Get Post by catagory fail - no data", async () => {
    const response = await request(app).get("/post?catagoery=catagoery");
    expect(response.status).toBe(404);
  });
  test("Get Post by id", async () => {
    const response = await request(app).get(`/post/${postInfo._id}`);
    expect(response.body.title).toBe(postInfo.title);
    expect(response.status).toBe(200);
  });
  test("Get Post by id fail - no data", async () => {
    const response = await request(app).get(`/post/${fakeId}`);
    expect(response.status).toBe(404);
  });
  test("Get Post by id fail - invalid id", async () => {
    const response = await request(app).get(`/post/invalidId`);
    expect(response.status).toBe(400);
  });
  test("Post like", async () => {
    const response = await request(app)
      .post(`/post/${postInfo._id}/like`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    expect(response.status).toBe(200);
  });
  test("Post unlike", async () => {
    const response = await request(app)
      .post(`/post/${postInfo._id}/like`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    expect(response.status).toBe(200);
  });
  test("Post like fail - Fake post id", async () => {
    const response = await request(app)
      .post(`/post/${fakeId}/like`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    expect(response.status).toBe(404);
  });
  test("Post like fail - User doesn't exist", async () => {
    await userModel.deleteMany({});
    const response = await request(app)
      .post(`/post/${postInfo._id}/like`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    expect(response.status).toBe(403);
  });
  test("Update Post", async () => {
    const response = await request(app).post("/user/register").send(userInfo);
    userInfo._id = response.body._id;
    const response2 = await request(app).post("/user/login").send({
      username: userInfo.username,
      password: userInfo.password,
    });
    userInfo.accessToken = response2.body.accessToken;
    const response3 = await request(app)
      .put(`/post/${postInfo._id}`)
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .send({ title: "updatedtitle" });
    expect(response3.body.title).toBe("updatedtitle");
    expect(response3.status).toBe(200);
  });
  test("Update Post fail - Fake post id", async () => {
    const response = await request(app)
      .put(`/post/${fakeId}`)
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .send({ title: "updatedtitle" });
    expect(response.status).toBe(404);
  });
  test("Update Post fail - tried to update likes", async () => {
    const response = await request(app)
      .put(`/post/${postInfo._id}`)
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .send({ likes: ["test"] });
    expect(response.status).toBe(403);
  });
  test("Update Post fail - invalid post id", async () => {
    const response = await request(app)
      .put(`/post/invalidId`)
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .send({ title: "updatedtitle" });
    expect(response.status).toBe(400);
  });
  test("Delete Post fail - invalid post id", async () => {
    const response = await request(app)
      .delete(`/post/invalidId`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    expect(response.status).toBe(400);
  });
  test("Delete Post", async () => {
    const response = await request(app)
      .delete(`/post/${postInfo._id}`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    expect(response.status).toBe(200);
  });
});
