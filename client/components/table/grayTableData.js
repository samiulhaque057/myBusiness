export default function grayTableData(grayData) {
  // total Products
  //   const products = grayData.products;
  // total payments
  //   const payments = products?.reduce((allPayement, product) => {
  //     return [...allPayement, ...product?.gray_payments];
  //   }, []);

  //   const totalPaymentLength = payments?.length;
  //   //   const totalProductLength = products?.length;

  //   const productsWithOutPayment = products?.filter(
  //     (data) => !data?.gray_payments?.length
  //   );

  // max row number
  //   const max = totalPaymentLength + productsWithOutPayment?.length;

  const productTableData = grayData?.products?.reduce((sum, product) => {
    // total gray product cost
    const totalCost = product?.gray_amount * product?.gray_rate;
    // total payment for gray product
    const totalPay = product?.gray_payments?.reduce((sum, payment) => {
      return sum + +payment.amount;
    }, 0);
    // total due
    const totalDue = totalCost - totalPay;

    // payment data
    const paymentData = product?.gray_payments?.map((payment) => {
      return `
    ${tableData(payment.date)}
    ${tableData(payment.amount)}
    `;
    });

    // show td
    const leftSideData = `

      ${tableData(product?.gray_date || "", product?.gray_payments?.length)}
      ${tableData(product?.chalanNumber, product?.gray_payments?.length)}
      ${tableData(product?.name, product?.gray_payments?.length)}
      ${tableData(product?.gray_amount, product?.gray_payments?.length)}
      ${tableData(product?.gray_rate, product?.gray_payments?.length)}
      ${tableData(totalCost, product?.gray_payments?.length)}
        `;

    // right side data
    const rightSideData = `
      ${tableData(totalPay, product?.gray_payments?.length)}
      ${tableData(totalDue, product?.gray_payments?.length)}
      ${tableData(product?.gray_payment_status, product?.gray_payments?.length)}
      ${tableData(product.deliver_status, product?.gray_payments?.length)}
      ${tableData(product?.dyeing?.name, product?.gray_payments?.length)}
      `;

    let productsTd = "";
    if (paymentData.length) {
      productsTd = paymentData.map((dt, index) => {
        if (index === 0) {
          return leftSideData + dt + rightSideData;
        } else {
          return dt;
        }
      });
    } else {
      const empty = `
       ${tableData()}  
       ${tableData()}  
       ${tableData()}  
       ${tableData()}  
       ${tableData()}  
       ${tableData()}  
       ${tableData()}  
        `;

      productsTd = [leftSideData + empty];
    }
    return [...sum, ...productsTd];
  }, []);

  const output = productTableData?.map((item, index) => {
    if (index === 0) {
      return `
    <tr class="border-b border-collapse transition-colors  data-[state=selected]:bg-slate-100  dark:data-[state=selected]:bg-slate-800">
    ${item}
    </tr>   `;
      // <tr class="border-b border-collapse transition-colors  data-[state=selected]:bg-slate-100  dark:data-[state=selected]:bg-slate-800">
      //   ${tableData(grayData.id, max)}
      //   ${tableData(grayData.name, max)}
      //   ${tableData(grayData.address, max)}
      //   ${tableData(grayData.phone, max)}
      // ${item}
      // </tr>   `;
    }

    return ` <tr>${item} </tr>   `;
  });

  // table data
  function tableData(value = "", rowspan) {
    return `
    <td ${
      rowspan ? `rowspan=${rowspan}` : ""
    } class="px-5 text-nowrap py-3 align-middle [&:has([role=checkbox])]:pr-0 border border-collapse" >
             <div class="capitalize ">${value}</div>
    </td>`;
  }

  return output?.join("");
}
