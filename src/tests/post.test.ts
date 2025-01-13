import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import path from "path";

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
  category: "testcategory",
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

const fakeId = "60f7b4f3bbedb00000000000";

const imagePath = path.join(__dirname, "assets", "trash.png");

beforeAll(async () => {
  app = await initApp();
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
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Post Tests", () => {
  test("Create Post", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .field("title", postInfo.title)
      .field("description", postInfo.description)
      .field("category", postInfo.category)
      .field("phone", postInfo.phone)
      .field("region", postInfo.region)
      .field("city", postInfo.city)
      .attach("picture", imagePath);
    expect(response.status).toBe(200);
    postInfo._id = response.body._id;
  });
  test("Create Post without all fields", async () => {
    const response = await request(app)
      .post("/post")
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .field("title", postInfo.title);
    expect(response.status).toBe(400);
  });
  test("Get Post", async () => {
    const response = await request(app).get("/post");
    expect(response.body.length).toBe(1);
    expect(response.status).toBe(200);
    const response2 = await request(app).get("/post?category=testcategory");
    expect(response2.body.length).toBe(1);
    expect(response2.status).toBe(200);
  });
  test("Get Post by catagory fail - no data", async () => {
    const response = await request(app).get("/post?category=category");
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
    await request(app)
      .delete("/user/delete")
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    const response = await request(app)
      .post(`/post/${postInfo._id}/like`)
      .set("Authorization", `JWT ${userInfo.accessToken}`);
    expect(response.status).toBe(403);
  });
  test("Update Post", async () => {
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
      .post("/post")
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .field("title", postInfo.title)
      .field("description", postInfo.description)
      .field("category", postInfo.category)
      .field("phone", postInfo.phone)
      .field("region", postInfo.region)
      .field("city", postInfo.city)
      .attach("picture", imagePath);
    postInfo._id = response2.body._id;
    const response3 = await request(app)
      .put(`/post/${postInfo._id}`)
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .field("title", "updatedtitle")
      .field("description", postInfo.description)
      .field("category", postInfo.category)
      .field("phone", postInfo.phone)
      .field("region", postInfo.region)
      .field("city", postInfo.city)
      .attach("picture", imagePath);
    expect(response3.status).toBe(200);
    expect(response3.body.title).toBe("updatedtitle");
  });
  test("Update Post fail - Fake post id", async () => {
    const response = await request(app)
      .put(`/post/${fakeId}`)
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .field("title", "updatedtitle")
      .field("description", postInfo.description)
      .field("category", postInfo.category)
      .field("phone", postInfo.phone)
      .field("region", postInfo.region)
      .field("city", postInfo.city)
      .attach("picture", imagePath);
    expect(response.status).toBe(400);
  });
  test("Update Post fail - tried to update likes", async () => {
    const response = await request(app)
      .put(`/post/${postInfo._id}`)
      .set("Authorization", `JWT ${userInfo.accessToken}`)
      .field("title", "updatedtitle")
      .field("description", postInfo.description)
      .field("likes", [ "test" ])
      .field("category", postInfo.category)
      .field("phone", postInfo.phone)
      .field("region", postInfo.region)
      .field("city", postInfo.city)
      .attach("picture", imagePath);
    expect(response.status).toBe(403);
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
    await request(app).delete("/user/delete").set("Authorization", `JWT ${userInfo.accessToken}`);
  });
});
