exports.getSearchPage = (req, res, next) => {
  res.render("search", {
    title: "Search for users",
  });
};
