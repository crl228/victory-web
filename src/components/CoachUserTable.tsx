import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { CoachOverview } from '@/lib/types';

export default function CoachUserTable({ details }: { details: any }) {
  const [rows, setRows] = useState<
    Array<{
      id: string;
      username: string;
      live_watch_bin6: string;
      replay_watch_bin6: string;
      live_deal_amount: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    console.log(details);
    (async () => {
      try {
        // const toNum = (v: any) => (typeof v === 'number' ? v : Number(v ?? 0));

        if (alive) setRows(details);
      } catch (_e) {
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [details]);

  const total = useMemo(
    () => ({
      // totalUsers: rows.reduce((a, b) => a + b.total_users, 0),
      totalGmv: details.reduce((a, b) => a + b.live_deal_amount, 0),
    }),
    [rows]
  );
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
        <div className="text-sm text-slate-600">
          本场到访用户：{rows.length} 人
        </div>
        {/* <div className="text-xs text-slate-500">
          合计成交额：
          {total.totalGmv.toLocaleString()}
        </div> */}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium">用户</th>
              <th className="px-3 py-2 text-right font-medium">直播观看</th>
              <th className="px-3 py-2 text-right font-medium">回放观看</th>
              {/* <th className="px-3 py-2 text-right font-medium">在线成交金额</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-3 py-6 text-slate-500" colSpan={6}>
                  加载中…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-slate-500" colSpan={6}>
                  暂无数据
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="px-3 py-2 text-left">
                    {r.username.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.live_watch_bin_6.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.replay_watch_bin_6.toLocaleString()}
                  </td>
                  {/* <td className="px-3 py-2 text-right">
                    {r.live_deal_amount.toLocaleString()}
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
