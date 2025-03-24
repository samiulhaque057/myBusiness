export default function CountCost({ allSelectedProducts }) {
  const totalAmount = allSelectedProducts?.reduce((acc, product) => {
    acc += product?.items?.reduce((acc, item) => {
      acc += item.amount;
      return acc;
    }, 0);
    return acc;
  }, 0);

  const totalCost = allSelectedProducts?.reduce((acc, product) => {
    acc += product?.items?.reduce((acc, item) => {
      acc += item.amount * product?.sellRate;
      return acc;
    }, 0);
    return acc;
  }, 0);

  return (
    <table className="w-full border border-collapse overflow-scroll">
      <thead className="bg-slate-100 ">
        <tr className="text-left">
          <th className="border border-collapse px-4 py-1.5 text-nowrap">
            Fabric Name
          </th>
          <th className="text-nowrap border border-collapse px-4 py-1.5">
            Amount
          </th>
          <th className="text-nowrap border border-collapse px-4 py-1.5">
            Rate
          </th>
          <th className="text-nowrap border border-collapse px-4 py-1.5">
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        {allSelectedProducts?.map((product, index) => {
          const totalAmount = product?.items?.reduce((acc, item) => {
            acc += item.amount;
            return acc;
          }, 0);
          const price = +(totalAmount * product?.sellRate).toFixed(2);

          return (
            <tr key={index}>
              <td className="px-4 py-1.5 border border-collapse">
                {product?.name}
              </td>
              <td className="px-4 py-1.5 border border-collapse">
                {totalAmount}
              </td>
              <td className="px-4 py-1.5 border border-collapse">
                {product?.sellRate || 0}
              </td>
              <td className="px-4 py-1.5 border border-collapse">{price}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="bg-green-100/70">
          <td className="px-4 py-1.5 border border-collapse"></td>
          <td className="px-4 py-1.5 border border-collapse font-semibold">
            {totalAmount}
          </td>
          <td className="px-4 py-1.5 border border-collapse"></td>
          <td className="px-4 py-1.5 border border-collapse font-semibold">
            {(+totalCost).toFixed(2)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
