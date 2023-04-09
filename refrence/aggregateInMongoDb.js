const ratingAvg = await SellerRatingModel.aggregate([
  {
    $match: {
      sellerId: new mongoose.Types.ObjectId(id), //aik seller ka data aye ga
    },
  },
  {
    $group: {
      _id: "$sellerId", //pipelines id
      avgRating: { $sum: "$rating" },
    },
  },
]);
