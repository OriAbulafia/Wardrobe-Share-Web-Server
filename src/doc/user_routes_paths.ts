const userPaths = {
  "/user/register": {
    post: {
      summary: "Register a new user",
      description:
        "Endpoint to register a new user with an email and password.",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: [
                "username",
                "password",
                "email",
                "f_name",
                "l_name",
                "picture",
              ],
              properties: {
                username: { type: "string", example: "Sahar" },
                password: { type: "string", example: "password" },
                email: { type: "string", example: "email" },
                f_name: { type: "string", example: "Sahar" },
                l_name: { type: "string", example: "Sahar" },
                picture: { type: "string", example: "Sahar" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User registration succeeded.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "Sahar" },
                  password: { type: "string", example: "HashedPassword#@$#$" },
                  email: { type: "string", example: "email" },
                  f_name: { type: "string", example: "Sahar" },
                  l_name: { type: "string", example: "Sahar" },
                  picture: { type: "string", example: "Sahar" },
                  likedPosts: { type: "array", example: [] },
                  refreshTokens: { type: "array", example: [] },
                  _id: { type: "string", example: "676aa39695b4233508df4147" },
                },
              },
            },
          },
        },
        400: {
          description: "Missing fields.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "missing fields",
              },
            },
          },
        },
        401: {
          description: "Email already exists.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "email already exists",
              },
            },
          },
        },
        402: {
          description: "Username already exists.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "username already exists",
              },
            },
          },
        },
      },
    },
  },
  "/user/login": {
    post: {
      summary: "Login a user",
      description:
        "Endpoint to login a user with an email and password. Returns an access token and a refresh token.",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "password"],
              properties: {
                username: { type: "string", example: "Sahar" },
                password: { type: "string", example: "password" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User login succeeded.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "Sahar" },
                  _id: { type: "string", example: "676aa39695b4233508df4147" },
                  accessToken: { type: "string", example: "accessToken" },
                  refreshToken: { type: "string", example: "refreshToken" },
                },
              },
            },
          },
        },
        403: {
          description: "Missing fields.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "missing fields",
              },
            },
          },
        },
        401: {
          description: "Password is incorrect.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "password is incorrect",
              },
            },
          },
        },
        400: {
          description: "User does not exist.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "user does not exist",
              },
            },
          },
        },
      },
    },
  },
  "/user/logout": {
    post: {
      summary: "Logout a user",
      description: "Log out a user by invalidating their refresh token.",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  description: "The refresh token to revoke.",
                  example: "eyJhbGci...",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Logout successful.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "logged out",
              },
            },
          },
        },
        400: {
          description: "token is of deleted user.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "token is of deleted user",
              },
            },
          },
        },
        401: {
          description: "if user is not logged in.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "if user is not logged in",
              },
            },
          },
        },
        402: {
          description: "Missing refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "missing refresh token",
              },
            },
          },
        },
        403: {
          description: "Invalid refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "invalid refresh token",
              },
            },
          },
        },
      },
    },
  },
  "/user/refresh": {
    post: {
      summary: "Refresh access token",
      description: "Refresh the access token using the refresh token.",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["refreshToken"],
              properties: {
                refreshToken: {
                  type: "string",
                  description: "The refresh token to use.",
                  example: "eyJhbGci...",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Access token refreshed.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                    description: "The new access token.",
                    example: "eyJhbGci...",
                  },
                  refreshToken: {
                    type: "string",
                    description: "The new refresh token.",
                    example: "eyJhbGci...",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "token is of deleted user.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "token is of deleted user",
              },
            },
          },
        },
        401: {
          description: "if user is not logged in.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "if user is not logged in",
              },
            },
          },
        },
        402: {
          description: "Missing refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "missing refresh token",
              },
            },
          },
        },
        403: {
          description: "Invalid refresh token.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "invalid refresh token",
              },
            },
          },
        },
      },
    },
  },
  "/user/{userId}": {
    get: {
      summary: "Get user by ID",
      description: "Get a user's fullname and picture by their ID.",
      tags: ["Users"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          description: "The ID of the user to get.",
          schema: {
            type: "string",
            example: "676aa39695b4233508df4147",
          },
        },
      ],
      responses: {
        200: {
          description: "User found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fullname: { type: "string", example: "Sahar Sahar" },
                  picture: { type: "string", example: "Sahar" },
                },
              },
            },
          },
        },
        401: {
          description: "User not found.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "user not found",
              },
            },
          },
        },
        500: {
          description: "Invalid user id.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "invalid user id",
              },
            },
          },
        },
      },
    },
  },
  "/user/auth/settings": {
    get: {
      summary: "Get user settings",
      description: "Get a user's full info by their ID.",
      tags: ["Users"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "User settings found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "Sahar" },
                  f_name: { type: "string", example: "Sahar" },
                  l_name: { type: "string", example: "Sahar" },
                  picture: { type: "string", example: "Sahar" },
                },
              },
            },
          },
        },
        400: {
          description: "User not found.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "user not found",
              },
            },
          },
        },
      },
    },
  },
  "/user/update": {
    put: {
      summary: "Update user",
      description: "Update a user's info.",
      tags: ["Users"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string", example: "updated username" },
                f_name: { type: "string", example: "updated first name" },
                l_name: { type: "string", example: "updated last name" },
                picture: { type: "string", example: "updated picture" },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User updated.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "user updated",
              },
            },
          },
        },
        400: {
          description: "User not found.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "user not found",
              },
            },
          },
        },
        401: {
          description: "Username already exists.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "username already exists",
              },
            },
          },
        },
      },
    },
  },
  "/user/delete": {
    delete: {
      summary: "Delete user",
      description: "Delete a user.",
      tags: ["Users"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      responses: {
        200: {
          description: "User deleted.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "user deleted",
              },
            },
          },
        },
        400: {
          description: "User not found.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "user not found",
              },
            },
          },
        },
      },
    },
  },
};

export default userPaths;
