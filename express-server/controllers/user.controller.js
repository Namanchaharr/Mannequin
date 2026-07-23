//getUserByIdController
//updateUserController,
//deleteUserController,
import {
  getusersById,
} from "../models/users.model.js";


export async function getUserByIdController(req, res) {
  try {
    const Id = req.params.id;

    const user = await getusersById(Id);

    if (!user) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(200).json(user);

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to fetch user",
    });
  }
}