import Comments from "../models/comment_model";

const postPaths = {
  "/post": {
    post: {
      summary: "Create a new post",
      description: "Create a new post with the user's ID as the owner.",
      tags: ["Posts"],
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
              required: [
                "title",
                "description",
                "picture",
                "category",
                "phone",
                "region",
                "city",
              ],
              properties: {
                title: {
                  type: "string",
                  example: "testtitle",
                },
                description: {
                  type: "string",
                  example: "testdescription",
                },
                picture: {
                  type: "file",
                  example: "testpicture",
                },
                category: {
                  type: "string",
                  example: "testcategory",
                },
                phone: {
                  type: "string",
                  example: "testphone",
                },
                region: {
                  type: "string",
                  example: "testregion",
                },
                city: {
                  type: "string",
                  example: "testcity",
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
                    example: "60f7b4f3bbedb00000000000",
                  },
                  title: {
                    type: "string",
                    example: "testtitle",
                  },
                  description: {
                    type: "string",
                    example: "testdescription",
                  },
                  picture: {
                    type: "string",
                    example: "testimage",
                  },
                  likes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: [],
                  },
                  comments: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: [],
                  },
                  category: {
                    type: "string",
                    example: "testcatagoery",
                  },
                  phone: {
                    type: "string",
                    example: "testphone",
                  },
                  region: {
                    type: "string",
                    example: "testregion",
                  },
                  city: {
                    type: "string",
                    example: "testcity",
                  },
                  _id: {
                    type: "string",
                    example: "60f7b4f3bbedb00000000000",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Missing fields",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "missing fields",
                  },
                },
              },
            },
          },
        },
      },
    },
    get: {
      summary: "Get all posts and filter",
      description: "Get all posts and filter by query parameters.",
      tags: ["Posts"],
      responses: {
        200: {
          description: "Successful request.",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: {
                      type: "string",
                      example: "60f7b4f3bbedb00000000000",
                    },
                    user: {
                      type: "string",
                      example: "60f7b4f3bbedb00000000000",
                    },
                    title: {
                      type: "string",
                      example: "testtitle",
                    },
                    description: {
                      type: "string",
                      example: "testdescription",
                    },
                    picture: {
                      type: "string",
                      example: "testimage",
                    },
                    likes: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      example: [],
                    },
                    comments: {
                      type: "array",
                      items: {
                        type: "string",
                      },
                      example: [],
                    },
                    category: {
                      type: "string",
                      example: "testcategory",
                    },
                    phone: {
                      type: "string",
                      example: "testphone",
                    },
                    region: {
                      type: "string",
                      example: "testregion",
                    },
                    city: {
                      type: "string",
                      example: "testcity",
                    },
                  },
                },
              },
            },
          },
        },
        404: {
          description: "No data found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "no data found",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/post/{postId}": {
    get: {
      summary: "Get a post by ID",
      description: "Get a post by ID.",
      tags: ["Posts"],
      parameters: [
        {
          name: "postId",
          in: "path",
          required: true,
          description: "ID of the post to get.",
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful request.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    example: "60f7b4f3bbedb00000000000",
                  },
                  user: {
                    type: "string",
                    example: "60f7b4f3bbedb00000000000",
                  },
                  title: {
                    type: "string",
                    example: "testtitle",
                  },
                  description: {
                    type: "string",
                    example: "testdescription",
                  },
                  picture: {
                    type: "string",
                    example: "testimage",
                  },
                  likes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: [],
                  },
                  comments: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: [],
                  },
                  category: {
                    type: "string",
                    example: "testcategory",
                  },
                  phone: {
                    type: "string",
                    example: "testphone",
                  },
                  region: {
                    type: "string",
                    example: "testregion",
                  },
                  city: {
                    type: "string",
                    example: "testcity",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "invalid ID",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Item not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "item not found",
                  },
                },
              },
            },
          },
        },
      },
    },
    put: {
      summary: "Update a post",
      description: "Update a post by its ID.",
      tags: ["Posts"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          description: "The post's ID.",
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                title: {
                  type: "string",
                  description: "The updated title.",
                },
                description: {
                  type: "string",
                  description: "The updated description.",
                },
                picture: {
                  type: "file",
                  description: "The updated image.",
                },
                category: {
                  type: "string",
                  description: "The updated category.",
                },
                phone: {
                  type: "string",
                  description: "The updated phone.",
                },
                region: {
                  type: "string",
                  description: "The updated region.",
                },
                city: {
                  type: "string",
                  description: "The updated city.",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Post updated successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: {
                    type: "string",
                    example: "60f7b4f3bbedb00000000000",
                  },
                  user: {
                    type: "string",
                    example: "60f7b4f3bbedb00000000000",
                  },
                  title: {
                    type: "string",
                    example: "The updated title.",
                  },
                  description: {
                    type: "string",
                    example: "The updated description.",
                  },
                  picture: {
                    type: "string",
                    example: "The updated image.",
                  },
                  likes: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: [],
                  },
                  comments: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    example: [],
                  },
                  category: {
                    type: "string",
                    example: "The updated category.",
                  },
                  phone: {
                    type: "string",
                    example: "The updated phone.",
                  },
                  region: {
                    type: "string",
                    example: "The updated region.",
                  },
                  city: {
                    type: "string",
                    example: "The updated city.",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Invalid ID",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "invalid ID",
                  },
                },
              },
            },
          },
        },
        403: {
          description: "Cannot update likes",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Cannot update likes",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Item not found.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "item not found",
                  },
                },
              },
            },
          },
        },
      },
    },
    delete: {
      summary: "Delete a post",
      description: "Delete a post by its ID.",
      tags: ["Posts"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          description: "The post's ID.",
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Post deleted successfully.",
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
          description: "Invalid ID",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "invalid ID",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/post/{postId}/like": {
    post: {
      summary: "Like/Unlike a post",
      description: "Like/Unlike a post by its ID.",
      tags: ["Posts"],
      security: [
        {
          bearerAuth: [],
        },
      ],
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          description: "The post's ID.",
          schema: {
            type: "string",
            example: "60f3b4a2c4f5c50015e4f8a8",
          },
        },
      ],
      responses: {
        200: {
          description: "Post liked/unliked successfully.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "post liked/unliked",
                  },
                },
              },
            },
          },
        },
        403: {
          description: "User not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User not found",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Post not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Post not found",
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

export default postPaths;
