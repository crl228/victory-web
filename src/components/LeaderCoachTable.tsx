import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { CoachOverview } from '@/lib/types';

export default function LeaderCoachTable({ leaderId }: { leaderId: string }) {
  const [rows, setRows] = useState<
    Array<{
      id: string;
      name: string;
      latest_no: number;
      latest_users: number;
      latest_gmv: number;
      total_users: number;
      total_gmv: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      const list = await api.listCoaches(leaderId);
      const data: typeof rows = [];
      const overs: CoachOverview[] = await Promise.all(
        list.map((c) => api.coachOverview(c.id))
      );
      overs.forEach((ov) => {
        const latest = ov.sessions.reduce(
          (m, s) => (s.live_no > m.live_no ? s : m),
          ov.sessions[0]
        );
        const total_users = ov.sessions.reduce((a, s) => a + s.users, 0);
        const total_gmv = ov.sessions.reduce((a, s) => a + s.gmv_history, 0);
        data.push({
          id: ov.coach_id,
          name: ov.coach_name,
          latest_no: latest.live_no,
          latest_users: latest.users,
          latest_gmv: latest.gmv_current,
          total_users,
          total_gmv,
        });
      });
      if (alive) {
        setRows(data);
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [leaderId]);

  const total = useMemo(
    () => ({
      totalUsers: rows.reduce((a, b) => a + b.total_users, 0),
      totalGmv: rows.reduce((a, b) => a + b.total_gmv, 0),
    }),
    [rows]
  );
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
        <div className="text-sm text-slate-600">管理教练：{rows.length} 人</div>
        <div className="text-xs text-slate-500">
          合计观看人数：{total.totalUsers.toLocaleString()}｜合计成交额：
          {total.totalGmv.toLocaleString()}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium">教练</th>
              <th className="px-3 py-2 text-right font-medium">最新场次</th>
              <th className="px-3 py-2 text-right font-medium">最新观看</th>
              <th className="px-3 py-2 text-right font-medium">最新成交</th>
              <th className="px-3 py-2 text-right font-medium">累计观看</th>
              <th className="px-3 py-2 text-right font-medium">累计成交</th>
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
                  <td className="px-3 py-2">{r.name}</td>
                  <td className="px-3 py-2 text-right">第{r.latest_no}场</td>
                  <td className="px-3 py-2 text-right">
                    {r.latest_users.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.latest_gmv.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.total_users.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {r.total_gmv.toLocaleString()}
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
