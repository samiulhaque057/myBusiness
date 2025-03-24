export const totalSingeGrayAmount = (gray) => {
  const totalAmount = gray?.products?.reduce((sum, product) => {
    return sum + (product?.gray_amount || 0);
  }, 0);

  return totalAmount;
};

export const totalSingleGrayCost = (gray) => {
  return gray?.products?.reduce((sum, product) => {
    return sum + (+product?.gray_amount || 0) * (+product?.gray_rate || 0);
  }, 0);
};

export const totalSingleGrayPaid = (gray) => {
  return gray?.grayPayments?.reduce((sum, payment) => {
    return sum + (+payment?.amount || 0);
  }, 0);
};

export const totalSingleGrayDiscount = (gray) => {
  return gray?.chalans?.reduce((sum, chalan) => {
    return sum + (chalan?.discount || 0);
  }, 0);
};
