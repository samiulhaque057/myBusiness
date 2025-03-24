import React from "react";
import { CiSquareMinus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import EditBuyProduct from "./EditBuyProduct";
import { getContrastColor } from "../../helper";

export default function SelectedProduct({
  allSelectedProducts,
  setAllSelectedProducts,
  type,
}) {
  const handleRemove = (index) => {
    setAllSelectedProducts((prev) => {
      const newSelectedProducts = [...prev];
      newSelectedProducts.splice(index, 1);
      return newSelectedProducts;
    });
  };

  return (
    <div className="flex   gap-x-5 gap-y-6 flex-wrap">
      {/* product -1  */}
      {allSelectedProducts?.map((product, index) => (
        <ul
          className="flex flex-col w-fit text-[12px]  shadow-sm  relative group"
          key={index}
        >
          <li className="font-semibold rounded-tl-md rounded-tr-md px-6 py-2  bg-slate-100/70  inline-flex justify-center items-center border ">
            <span className="text-nowrap">{product?.name}</span>
          </li>
          {/* item remove button */}
          <span
            className="absolute -top-[2.5px] -right-[19px] cursor-pointer z-50  hidden group-hover:block "
            onClick={() => handleRemove(index)}
          >
            <CiSquareMinus className="text-[22px] text-red-300 hover:text-red-500  rounded-sm" />
          </span>
          <div className="absolute top-[18px] -right-[17px] cursor-pointer z-50  hidden group-hover:block ">
            <EditBuyProduct
              product={product}
              index={index}
              type={type}
              setAllSelectedProducts={setAllSelectedProducts}
              allSelectedProducts={allSelectedProducts}
            />
          </div>
          {product?.items?.map((item, index) => (
            <li
              className=" py-1.5  inline-flex justify-center items-center border "
              style={{
                backgroundColor: item?.colorCode,
                color: getContrastColor(item?.colorCode),
              }}
              key={index}
            >
              <span>{item?.amount}</span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}
