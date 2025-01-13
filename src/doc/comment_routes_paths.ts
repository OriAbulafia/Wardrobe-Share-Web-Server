import { get } from "mongoose";

const commentPaths = {
  "/comment": {
    post: {
      summary: "Create a new comment",
      description: "Creating a new comment.",
      tags: ["Comments"],
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
              required: ["post", "content"],
              properties: {
                post: {
                  type: "string",
                  example: "60f3b4a2c4f5c50015e4f8a8",
                },
                content: {
                  type: "string",
                  example: "This is my first comment.",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Post created successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  post: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  content: {
                    type: "string",
                    example: "This is my first comment.",
                  },
                  _id: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Missing required fields.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Missing required fields.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/comment/post/{postId}": {
    get: {
      summary: "Get all comments by post",
      description: "Get all comments by post.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Comments retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    user: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
                    },
                    post: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
                    },
                    content: {
                      type: "string",
                      example: "This is my first comment.",
                    },
                    _id: {
                      type: "string",
                      example: "60f3b4a2c4f5c50015e4f8a8",
                    },
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid post id.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid post id.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Post not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Post not found.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/comment/{commentId}": {
    get: {
      summary: "Get comment by id",
      description: "Get comment by id.",
      tags: ["Comments"],
      parameters: [
        {
          in: "path",
          name: "commentId",
          required: true,
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Comment retrieved successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  post: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  content: {
                    type: "string",
                    example: "This is my first comment.",
                  },
                  _id: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid comment id.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid comment id.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Comment not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Comment not found.",
                  },
                },
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Update comment",
      description: "Update comment.",
      tags: ["Comments"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "commentId",
          required: true,
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  example: "this is my updated comment.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Comment updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  post: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                  content: {
                    type: "string",
                    example: "this is my updated comment.",
                  },
                  _id: {
                    type: "string",
                    example: "60f3b4a2c4f5c50015e4f8a8",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid comment id.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid comment id.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Comment not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Comment not found.",
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Delete comment",
      description: "Delete comment.",
      tags: ["Comments"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "commentId",
          required: true,
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Comment deleted successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "item deleted",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid comment id.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Invalid comment id.",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Comment not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Comment not found.",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default commentPaths;
