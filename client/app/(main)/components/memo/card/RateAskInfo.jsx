export default function RateAskInfo({ product }) {
  return (
    <>
      <div className="pt-4">
        <h3 className="text-xl font-semibold text-center pt-2 pb-2">Rate</h3>

        <table className="w-full text-[14px]">
          <thead>
            <tr className="bg-slate-50 rounded-md">
              <th className="border border-collapse px-4 py-2">Due Ask Rate</th>
              <th className="border border-collapse px-4 py-2">
                Due Sell Rate
              </th>
              <th className="border border-collapse px-4 py-2">
                Cash Ask Rate
              </th>
              <th className="border border-collapse px-4 py-2">
                Cash Sell Rate
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr className="hover:bg-slate-50">
              <td className="border border-collapse px-4 py-2">
                {product?.due_ask_rate || 0}
              </td>
              <td className="border border-collapse px-4 py-2">
                {product?.due_sell_rate || 0}
              </td>
              <td className="border border-collapse px-4 py-2">
                {product?.cash_ask_rate || 0}
              </td>
              <td className="border border-collapse px-4 py-2">
                {product?.cash_sell_rate || 0}
              </td>
            </tr>
          </tbody>
        </table>

        {/* <div className="space-y-2 pt-3 border p-4 rounded-md text-sm">
          <p className="flex gap-6 justify-between bg-slate-50 py-2 px-3 rounded-md text-slate-600">
            <span className="font-medium">Due Ask Rate </span>
            <span>{product?.due_ask_rate || 0}</span>
          </p>
          <p className="flex gap-6 justify-between bg-slate-50 py-2 px-3 rounded-md text-slate-600">
            <span>Due Sell Rate </span>
            <span>{product?.due_sell_rate || 0}</span>
          </p>
          <p className="flex gap-6 justify-between bg-slate-50 py-2 px-3 rounded-md text-slate-600">
            <span>Cash Ask Rate </span>
            <span>{product?.cash_ask_rate || 0}</span>
          </p>
          <p className="flex gap-6 justify-between bg-slate-50 py-2 px-3 rounded-md text-slate-600">
            <span>Cash Sell Rate </span>
            <span>{product?.cash_sell_rate || 0}</span>
          </p>
        </div> */}
      </div>
    </>
  );
}
