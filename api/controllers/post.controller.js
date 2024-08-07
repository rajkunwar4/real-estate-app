import prisma from "../lib/prisma.js";

export const getPosts = async (req, res) => {
  const query = req.query;
  console.log(query);
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        bathroom: parseInt(query.bathroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 10000000000,
        },
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get all posts",
    });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to get post",
    });
  }
};
export const addPost = async (req, res) => {
  const body = req.body;
  const tokenId = req.userId;
  console.log(body);
  console.log(tokenId);

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to add post",
    });
  }
};
export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;

  try {
    res.json(200).json({});
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed update post",
    });
  }
};
export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenId = req.userId;

  try {
    const deletePost = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (deletePost.userId != tokenId) {
      console.log("tokenid", tokenId);
      console.log("post id", deletePost.userId);

      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await prisma.post.delete({
      where: { id },
    });
    res.status(200).json({
      message: "deleted post ",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to delete post",
    });
  }
};
