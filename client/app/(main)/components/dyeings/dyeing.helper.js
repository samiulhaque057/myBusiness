export const totalSingleDyeingAmount = (dyeing) => {
  return dyeing?.products?.reduce((sum, product) => {
    return sum + (product?.dyeing_amount || 0);
  }, 0);
};

export const totalSingleDyeingCost = (dyeing) => {
  return dyeing?.products?.reduce((sum, product) => {
    return sum + product?.dyeing_amount * product?.dyeing_rate;
  }, 0);
};

export const totalSingleDyeingPaid = (dyeing) => {
  return dyeing?.dyeingPayments?.reduce((sum, payment) => {
    return sum + (payment?.amount || 0);
  }, 0);
};

export const totalSingleDyeingDiscount = (dyeing) => {
  return dyeing?.chalans?.reduce((sum, chalan) => {
    return sum + (chalan?.discount || 0);
  }, 0);
};
