import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';

export default function CoachSessionTable({
  coach,
  live_no,
}: {
  coach: any;
  live_no: any;
}) {
  const toneOf = (bin?: string) => {
    const s = (bin || '').toString();
    if (/核心/.test(s))
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (/深度/.test(s)) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (/半参与/.test(s))
      return 'bg-violet-50 text-violet-700 border-violet-200';
    if (/短暂|浅度/.test(s))
      return 'bg-amber-50 text-amber-700 border-amber-200';
    if (/路过/.test(s)) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (/未观看|0s/.test(s))
      return 'bg-slate-50 text-slate-600 border-slate-200';
    return 'bg-slate-50 text-slate-600 border-slate-200';
  };
  const Badge = ({ label }: { label: string }) => (
    <span
      className={`inline-flex items-center border px-2 py-0.5 rounded-full text-[11px] ${toneOf(
        label
      )}`}
    >
      {label || '—'}
    </span>
  );

  const [rows, setRows] = useState<
    Array<{
      uid: string;
      coach: string;
      live_no: number;
      username: string;
      live_deal_amount: number;
      store_purchase_amount: number;
      live_watch_bin_6: string;
      replay_watch_bin_6: string;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    (async () => {
      try {
        const users = await api.coachUsers(coach, live_no);
        if (alive) setRows(users);
      } catch (_e) {
        if (alive) setRows([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [coach, live_no]);

  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
        <div className="text-[12px] text-slate-600">
          管理用户：{rows.length} 人
        </div>
      </div>

      {/* 移动端：卡片列表（< md 显示） */}
      <div className="md:hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-b last:border-0 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                  <div className="h-6 w-24 bg-slate-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="px-4 py-10 text-center text-slate-500">暂无数据</div>
        ) : (
          <ul className="divide-y">
            {rows.map((r) => (
              <li key={r.uid} className="p-3">
                {/* 头部：用户名 + 成交额 */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-[15px] text-slate-900 truncate">
                      {r.username || '未命名用户'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[11px] text-slate-500">本场成交</div>
                    <div className="text-[15px] font-semibold tabular-nums">
                      {(r.live_deal_amount ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* 明细：直播 / 回放 各一行 */}
                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-600">直播观看</span>
                    <span className="shrink-0">
                      <Badge label={r.live_watch_bin_6} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-slate-600">回放观看</span>
                    <span className="shrink-0">
                      <Badge label={r.replay_watch_bin_6} />
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 桌面端：表格（>= md 显示） */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-3 py-2 text-left font-medium">用户</th>
              <th className="px-3 py-2 text-right font-medium">本场成交</th>
              <th className="px-3 py-2 text-right font-medium">直播观看</th>
              <th className="px-3 py-2 text-right font-medium">回放观看</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-8 text-slate-500 text-center"
                  colSpan={4}
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.uid}
                  className="border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="px-3 py-2 text-left max-w-[260px]">
                    <span className="truncate block">{r.username}</span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {r.live_deal_amount}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Badge label={r.live_watch_bin_6} />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Badge label={r.replay_watch_bin_6} />
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
