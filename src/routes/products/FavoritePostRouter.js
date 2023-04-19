const FavoriteRouter = require("express").Router();
const auth = require("../../middlewares/auth");

const Favorite = require("../../controllers/products/FavoritePostController");

const favorite = new Favorite();

FavoriteRouter.post("/", auth, favorite.setFavoritePost);
FavoriteRouter.get("/", auth, favorite.getFavoriteProductOfAUser);
// FavoriteRouter.get("/", auth, );
// FavoriteRouter.put("/:id", auth, );
FavoriteRouter.delete("/:post_id", auth, favorite.removeFavoritePostByPostId);
FavoriteRouter.delete("/byId/:post_id", auth, favorite.removeFavoritePost);

module.exports = FavoriteRouter;
