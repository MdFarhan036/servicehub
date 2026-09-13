let cart = [];

const getCart = (req, res) => {
  res.json(cart);
};

const addToCart = (req, res) => {

  const item = req.body;
  cart.push(item);

  res.json({
    message: "Item added to cart",
    cart
  });

};

module.exports = {
  getCart,
  addToCart
};