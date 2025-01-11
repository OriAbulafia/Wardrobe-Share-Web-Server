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

type CommentInfo = {
  user?: string;
  post?: string;
  content: string;
  _id?: string;
};

const commentInfo: CommentInfo = {
  content: "testcomment",
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
  const response = await request(app)
    .post("/user/register")
    .field("f_name", userInfo.f_name)
    .field("l_name", userInfo.l_name)
    .field("email", userInfo.email)
    .field("username", userInfo.username)
    .field("password", userInfo.password)
    .attach("picture", imagePath);
  userInfo._id = response.body._id;
  const response2 = await request(app).post("/user/login").send({
    username: userInfo.username,
    password: userInfo.password,
  });
  userInfo.accessToken = response2.body.accessToken;
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
  commentInfo.post = postInfo._id;
});

afterAll(async () => {
  await request(app).delete('/user/delete').set('Authorization', `JWT ${userInfo.accessToken}`);
  await mongoose.connection.close();
});

describe("Comment Tests", () => {
  test("Create Comment", async () => {
    const response = await request(app)
      .post("/comment")
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send(commentInfo);
    commentInfo._id = response.body._id;
    expect(response.status).toBe(201);
  });
  test("Create Comment with invalid post", async () => {
    const response = await request(app)
      .post("/comment")
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ ...commentInfo, post: fakeId });
    expect(response.status).toBe(400);
  });
  test("Get All Comments By Post", async () => {
    const response = await request(app).get(`/comment/post/${postInfo._id}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
  test("Get all comments by post fail - no data found", async () => {
    const response = await request(app).get(`/comment/post/${fakeId}`);
    expect(response.status).toBe(404);
  });
  test("Get all comments by post fail - invalid id", async () => {
    const response = await request(app).get(`/comment/post/invalidid`);
    expect(response.status).toBe(400);
  });
  test("Get Comment By Id", async () => {
    const response = await request(app).get(`/comment/${commentInfo._id}`);
    expect(response.status).toBe(200);
    expect(response.body.content).toBe(commentInfo.content);
  });
  test("Get Comment By Id fail - no data found", async () => {
    const response = await request(app).get(`/comment/${fakeId}`);
    expect(response.status).toBe(404);
  });
  test("Get Comment By Id fail - invalid id", async () => {
    const response = await request(app).get(`/comment/invalidid`);
    expect(response.status).toBe(400);
  });
  test("Update Comment", async () => {
    const response = await request(app)
      .put(`/comment/${commentInfo._id}`)
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ content: "updatedcontent" });
    expect(response.status).toBe(200);
    expect(response.body.content).toBe("updatedcontent");
  });
  test("Update Comment fail - invalid id", async () => {
    const response = await request(app)
      .put(`/comment/invalidid`)
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ content: "updatedcontent" });
    expect(response.status).toBe(400);
  });
  test("Update Comment fail - no data found", async () => {
    const response = await request(app)
      .put(`/comment/${fakeId}`)
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ content: "updatedcontent" });
    expect(response.status).toBe(404);
  });
  test("Update Comment fail - cannot update post or user", async () => {
    const response = await request(app)
      .put(`/comment/${commentInfo._id}`)
      .set("Authorization", "JWT " + userInfo.accessToken)
      .send({ content: "updatedcontent", post: fakeId });
    expect(response.status).toBe(403);
  });
  test("Delete Comment fail", async () => {
    const response = await request(app)
      .delete(`/comment/${fakeId}`)
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response.status).toBe(404);
  });
  test("Delete Comment fail - invalid id", async () => {
    const response = await request(app)
      .delete(`/comment/invalidid`)
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response.status).toBe(400);
  });
  test("Delete Comment", async () => {
    const response = await request(app)
      .delete(`/comment/${commentInfo._id}`)
      .set("Authorization", "JWT " + userInfo.accessToken);
    expect(response.status).toBe(200);
  });
});
