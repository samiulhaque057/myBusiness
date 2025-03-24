export default function productTableData(productData) {
  // calculation
  const total_defect = productData?.thaan_count?.reduce((sum, thaan) => {
    return sum + thaan?.defect;
  }, 0);
  const thaan_amount = productData?.thaan_count?.reduce((sum, thaan) => {
    return sum + thaan?.amount;
  }, 0);
  const difference_from_gray =
    productData?.dyeing_amount - productData?.gray_amount;
  const diffrence_from_gray_lot = thaan_amount - productData?.gray_amount;
  const difference_from_dyeing_lot = thaan_amount - productData?.dyeing_amount;

  // calculation

  const maxRow = productData?.thaan_count?.length;

  // table row data
  const gray_memo_date_td = tableData(productData?.gray_date || "", maxRow);
  const dyeing_memo_date_td = tableData(productData?.dyeing_date || "", maxRow);
  const gray_company_td = tableData(productData?.gray?.name, maxRow);
  const dyeing_company_td = tableData(productData?.dyeing?.name, maxRow);
  const chalan_td = tableData(productData?.chalanNumber, maxRow);
  const product_td = tableData(productData?.name, maxRow);
  const gray_lot_td = tableData(productData?.gray_amount, maxRow);
  const received_from_dyeing_td = tableData(productData?.dyeing_amount, maxRow);
  const difference_from_gray_td = tableData(difference_from_gray, maxRow);
  //   const thaan_count_td;
  //   const defect_count_td;
  const thaam_amount_td = tableData(thaan_amount, maxRow);
  const diffrence_from_gray_lot_td = tableData(diffrence_from_gray_lot, maxRow);
  const difference_from_dyeing_lot_td = tableData(
    difference_from_dyeing_lot,
    maxRow
  );
  const total_defect_td = tableData(total_defect, maxRow);
  // table row data

  const totalRow = productData?.thaan_count?.map((thaan, index) => {
    if (index == 0) {
      const all_tds =
        gray_memo_date_td +
        dyeing_memo_date_td +
        gray_company_td +
        dyeing_company_td +
        chalan_td +
        product_td +
        gray_lot_td +
        received_from_dyeing_td +
        difference_from_gray_td +
        tableData(thaan?.amount) +
        tableData(thaan?.defect) +
        thaam_amount_td +
        diffrence_from_gray_lot_td +
        difference_from_dyeing_lot_td +
        total_defect_td;

      return `
        <tr class="border-b border-collapse transition-colors  data-[state=selected]:bg-slate-100  dark:data-[state=selected]:bg-slate-800">
         ${all_tds}
        </tr>`;
    } else {
      const all_tds = tableData(thaan?.amount) + tableData(thaan?.defect);
      return `
        <tr class="border-b border-collapse transition-colors  data-[state=selected]:bg-slate-100  dark:data-[state=selected]:bg-slate-800">
         ${all_tds}
        </tr>`;
    }
  });

  function tableData(value = "", rowspan) {
    return `<td ${
      rowspan ? `rowspan=${rowspan}` : ""
    } class="px-5 text-nowrap py-3 align-middle [&:has([role=checkbox])]:pr-0 border border-collapse" > 
  <div class="capitalize ">${value}</div></td>`;
  }

  return totalRow.join("");
}
