export const productStatus = (product) => {
  let status = null;
  if (product?.gray_date && !product?.dyeing?.name) {
    status = "IN RUNNING";
  } else if (product?.dyeing_date && product?.gray_date) {
    status = "IN HOME";
  } else {
    status = "IN MILL";
  }

  return status;
};

export const numberToFixed = (number) => {
  return Number.isInteger(number) ? number : number?.toFixed(2);
};

export const productShortage = (product) => {
  // finished product
  const finishedProduct = numberToFixed(
    product?.finished_products?.reduce((acc, product) => {
      acc += product?.amount;
      return acc;
    }, 0)
  );

  const gAmount = product?.gray_amount;
  const gRate = product?.gray_rate;
  const difference =
    (finishedProduct && gAmount && finishedProduct - gAmount) || 0;

  // sortage furmula
  const shortage =
    difference < 0 &&
    gRate &&
    finishedProduct &&
    ((difference * gRate) / finishedProduct).toFixed(2);

  return shortage ? shortage : 0;
};

export const getContrastColor = (hexColor) => {
  // Remove hash if present
  hexColor = hexColor.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate luminance
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return black or white based on luminance
  return luminance > 128 ? "#000000" : "#FFFFFF";
};
