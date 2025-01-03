import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel from "../models/user_model";
import postModel from "../models/post_model";
import commentModel from "../models/comment_model";

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
  const response3 = await request(app)
    .post("/post")
    .set("Authorization", "JWT " + userInfo.accessToken)
    .send(postInfo);
  postInfo._id = response3.body._id;
  commentInfo.post = postInfo._id;
});

afterAll(async () => {
  await userModel.deleteMany();
  await postModel.deleteMany();
  await commentModel.deleteMany();
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
