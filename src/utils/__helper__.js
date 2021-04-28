exports.subTotal = (items) => {
  let produdcts = null;
  if (!items || !items?.length > 0) {
    return produdcts;
  }

  produdcts = items;
  let total = 0;

  produdcts.map((product) => {
    let quantity = product?.CartProduct?.quantity;
    let priceProduct = product?.price;
    total += priceProduct * quantity;
  });

  return total;
};
