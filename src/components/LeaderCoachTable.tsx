import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { CoachOverview, CoachListItem } from '@/lib/types';

export default function LeaderCoachTable({
  leaderReviewer,
}: {
  leaderReviewer: string;
}) {
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
      try {
        const resp: any = await api.listCoachesByLeader(leaderReviewer);

        // 归一化最外层数组
        const arr: any[] = Array.isArray(resp)
          ? resp
          : Array.isArray(resp?.items)
          ? resp.items
          : Array.isArray(resp?.data)
          ? resp.data
          : Array.isArray(resp?.coaches)
          ? resp.coaches
          : resp && typeof resp === 'object'
          ? Object.values(resp)
          : [];

        const toNum = (v: any) => (typeof v === 'number' ? v : Number(v ?? 0));

        // 用 Map 按教练聚合
        const map = new Map<string, Row>();

        // 将一条“场次”更新进对应教练的聚合
        const upsert = (
          id: string,
          name: string,
          session: {
            live_no?: any;
            total_users: any;
            active_users: any;
            total_deals: any;
            deal_users: any;
          }
        ) => {
          if (!map.has(id)) {
            map.set(id, {
              id,
              name,
              latest_no: -Infinity,
              latest_users: 0,
              latest_gmv: 0,
              total_users: 0,
              total_gmv: 0,
            });
          }
          const r = map.get(id)!;
          const liveNo = session.live_no;
          const users = toNum(session.active_users ?? 0);
          const gmvCurrent = toNum(session.total_deals ?? 0);
          const gmvHistory = toNum(gmvCurrent);

          r.total_users += users;
          r.total_gmv += gmvHistory;

          if (liveNo > r.latest_no) {
            r.latest_no = liveNo;
            r.latest_users = users;
            r.latest_gmv = gmvCurrent;
          }
        };

        for (const it of arr) {
          const id = String(it.coach ?? it.coach_id ?? it.id ?? '');
          if (!id) continue;
          const name = String(it.coach_name ?? it.name ?? id);

          // 1) 标准：有 sessions/records（每项为一场）
          if (Array.isArray(it.sessions)) {
            it.sessions.forEach((s: any) => upsert(id, name, s));
            continue;
          }
          if (Array.isArray(it.records)) {
            it.records.forEach((s: any) => upsert(id, name, s));
            continue;
          }

          // 2) 行即一场（后端返回按教练×场次扁平表）
          if (
            typeof it.live_no !== 'undefined' ||
            typeof it.no !== 'undefined' ||
            typeof it.session_no !== 'undefined'
          ) {
            upsert(id, name, it);
            continue;
          }

          // 3) 已经是聚合结果（latest_* 和 total_*），直接合并
          const latest_no = toNum(it.latest_no ?? 0);
          const latest_users = toNum(it.latest_users ?? 0);
          const latest_gmv = toNum(it.latest_gmv ?? 0);
          const total_users = toNum(it.total_users ?? 0);
          const total_gmv = toNum(it.total_gmv ?? 0);

          if (!map.has(id)) {
            map.set(id, {
              id,
              name,
              latest_no: latest_no || -Infinity,
              latest_users,
              latest_gmv,
              total_users,
              total_gmv,
            });
          } else {
            const r = map.get(id)!;
            r.total_users += total_users || latest_users;
            r.total_gmv += total_gmv || latest_gmv;
            if (latest_no > r.latest_no) {
              r.latest_no = latest_no;
              r.latest_users = latest_users;
              r.latest_gmv = latest_gmv;
            }
          }
        }

        // 输出 & 排序（按最新场次倒序）
        const data = Array.from(map.values())
          .map((r) => ({ ...r, latest_no: Math.max(0, r.latest_no) }))
          .sort((a, b) => b.latest_no - a.latest_no);

        if (alive) setRows(data);
      } catch (_e) {
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [leaderReviewer]);

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
          合计观看人次：{total.totalUsers.toLocaleString()}｜合计成交额：
          {total.totalGmv.toLocaleString()}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium">教练</th>
              <th className="px-3 py-2 text-right font-medium">最新场次</th>
              <th className="px-3 py-2 text-right font-medium">最新观看人数</th>
              <th className="px-3 py-2 text-right font-medium">最新成交</th>
              <th className="px-3 py-2 text-right font-medium">累计观看人次</th>
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
