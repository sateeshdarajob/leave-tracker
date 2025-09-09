export default function StickyTest() {
  return (
    <div className="overflow-x-auto max-w-3xl mx-auto">
      <table className="min-w-[800px] border-collapse">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-20 border px-4 py-2">Team Member</th>
            <th className="border px-4 py-2">Jan</th>
            <th className="border px-4 py-2">Feb</th>
            <th className="border px-4 py-2">Mar</th>
            <th className="border px-4 py-2">Apr</th>
            <th className="border px-4 py-2">May</th>
            <th className="border px-4 py-2">Jun</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="sticky left-0 bg-white z-20 border px-4 py-2">Alice</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
          </tr>
          <tr>
            <td className="sticky left-0 bg-white z-20 border px-4 py-2">Bob</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
            <td className="border px-4 py-2">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}