export function SpecTable({ rows }: { rows: [string, string | null | undefined][] }) {
  const visible = rows.filter(([, v]) => v !== null && v !== undefined && v !== "");
  return (
    <table className="w-full border-collapse">
      <tbody>
        {visible.map(([k, v]) => (
          <tr key={k} className="border-b border-line-2 last:border-0">
            <th className="py-3 pr-4 text-left align-top text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-muted">
              {k}
            </th>
            <td className="py-3 text-right text-[0.95rem] font-medium text-ink">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
