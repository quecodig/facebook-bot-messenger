function index(req, res) {
  res.render("index", { title: "Hey", message: "Hola Mundo!" });
}
exports.index = index;
