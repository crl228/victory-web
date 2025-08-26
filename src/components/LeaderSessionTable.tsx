import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { CoachOverview, CoachListItem } from '@/lib/types';

export default function LeaderSessionTable({ sessions }: { sessions: any }) {
  const [rows, setRows] = useState<
    Array<{
      id: number;
      coach: string;
      live_no: number;
      total_users: number;
      active_users: number;
      total_deals: number;
      total_store_amount: number;
      deal_users: number;
      watch_bin_0: number;
      watch_bin_1: number;
      watch_bin_2: number;
      watch_bin_3: number;
      watch_bin_4: number;
      watch_bin_5: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    (async () => {
      try {
        if (alive) setRows(sessions);
      } catch (_e) {
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [sessions]);

  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
        <div className="text-sm text-slate-600">
          管理教练：{sessions.length} 人
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-[12px]">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium">教练</th>
              <th className="px-3 py-2 text-center font-medium">到访人数</th>
              <th className="px-3 py-2 text-center font-medium">观看人数</th>
              <th className="px-3 py-2 text-center font-medium">成交人数</th>
              <th className="px-3 py-2 text-center font-medium">累计成交</th>
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
                  <td className="px-1 py-2">{r.coach}</td>
                  <td className="px-1 py-2 text-center">
                    {r.total_users.toLocaleString()}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {r.active_users.toLocaleString()}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {r.deal_users.toLocaleString()}
                  </td>
                  <td className="px-1 py-2 text-center">
                    {r.total_deals.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
