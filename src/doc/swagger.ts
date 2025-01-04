import userPaths from "./user_routes_paths";
import postPaths from "./post_routes_paths";
import commentPaths from "./comment_routes_paths";
import Components from "./components";

const options = {
  openapi: "3.1.0",
  info: {
    title: "Express API with Swagger, Jest, TypeScript and JWT",
    version: "0.1.0",
    description:
      "This is a simple CRUD API application made with Express in TypeScript documented with Swagger, tested with Jest and protected with JWT.",
    license: {
      name: "MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
  },
  servers: [
    {
      url: `http://localhost:3000`,
    },
  ],
  tags: [
    {
      name: "Users",
      description: "Operations about user",
    },
    {
      name: "Posts",
      description: "Operations about posts",
    },
    {
      name: "Comments",
      description: "Operations about comments",
    },
  ],
  paths: { ...userPaths, ...postPaths, ...commentPaths },
  components: Components,
};

export default options;
