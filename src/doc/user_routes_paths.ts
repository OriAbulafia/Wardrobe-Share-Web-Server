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
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                username: { type: "string", example: "example" },
                password: { type: "string", example: "example" },
                email: { type: "string", example: "example" },
                f_name: { type: "string", example: "example" },
                l_name: { type: "string", example: "example" },
                picture: { type: "file", example: "null" },
              },
              required: ["username", "password", "email", "f_name", "l_name"],
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
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    user: {
                      properties: {
                        username: { type: "string", example: "example" },
                        password: { type: "string", example: "HashedPassword" },
                        email: { type: "string", example: "example" },
                        f_name: { type: "string", example: "example" },
                        l_name: { type: "string", example: "example" },
                        picture: { type: "string", example: null },
                        likedPosts: { type: "array", example: [] },
                        refreshTokens: {
                          type: "array",
                          example: ["refreshToken"],
                        },
                        _id: {
                          type: "string",
                          example: "676aa39695b4233508df4147",
                        },
                      },
                    },
                    refreshToken: { type: "array", example: "refreshToken" },
                    accessToken: { type: "string", example: "accessToken" },
                  },
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
  "/user/googleLogin": {
    post: {
      summary: "Login a user with Google",
      description:
        "Endpoint to login a user with Google. Returns a user and an access token and a refresh token.",
      tags: ["Users"],
      requestBody: {
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  description: "Google token ID",
                },
              },
              required: ["code"],
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
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    user: {
                      properties: {
                        username: {
                          type: "string",
                          example: "unique-username",
                        },
                        password: {
                          type: "string",
                          example: "unique-password",
                        },
                        email: { type: "string", example: "google-email" },
                        f_name: { type: "string", example: "google-f_name" },
                        l_name: { type: "string", example: "google-l_name" },
                        picture: { type: "string", example: "google-picture" },
                        likedPosts: { type: "array", example: [] },
                        refreshTokens: {
                          type: "array",
                          example: ["refreshToken"],
                        },
                        _id: {
                          type: "string",
                          example: "676aa39695b4233508df4147",
                        },
                      },
                    },
                    refreshToken: { type: "array", example: "refreshToken" },
                    accessToken: { type: "string", example: "accessToken" },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "No google token.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "Invalid code",
              },
            },
          },
        },
        401: {
          description: "Invalid google token.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "Invalid code",
              },
            },
          },
        },
        402: {
          description: "Invalid email.",
          content: {
            "application/json": {
              schema: {
                type: "string",
                example: "Invalid email",
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
                username: { type: "string", example: "example" },
                password: { type: "string", example: "example" },
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
                  username: { type: "string", example: "example" },
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
                  example: "refreshToken",
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
                  example: "refreshToken",
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
                    example: "accessToken",
                  },
                  refreshToken: {
                    type: "string",
                    description: "The new refresh token.",
                    example: "refreshToken",
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
                  username: { type: "string", example: "example" },
                  email: { type: "string", example: "example" },
                  f_name: { type: "string", example: "example" },
                  l_name: { type: "string", example: "example" },
                  picture: { type: "string", example: "example" },
                  likedposts: { type: "array", example: [] },
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
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  description: "Username of the user",
                },
                f_name: {
                  type: "string",
                  description: "First name of the user",
                },
                l_name: {
                  type: "string",
                  description: "Last name of the user",
                },
                picture: {
                  type: "file",
                  description: "Profile picture of the user",
                },
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
