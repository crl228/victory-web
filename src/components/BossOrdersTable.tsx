import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Order } from '@/lib/types';

export default function BossOrdersTable() {
  const [rows, setRows] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const list = await api.dealUsers();
        if (alive) setRows(Array.isArray(list) ? list : []);
      } catch (e: any) {
        if (alive) setError(e?.message || '加载失败');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const totals = useMemo(
    () => ({
      count: rows.length,
      amount: rows.reduce((a, b) => a + (Number(b.live_deal_amount) || 0), 0),
    }),
    [rows]
  );

  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-slate-50">
        <div className="text-sm text-slate-600">
          成交明细（{totals.count} 笔）
        </div>
        <div className="text-xs text-slate-500">
          合计金额：{totals.amount.toLocaleString()} 元
        </div>
      </div>

      {/* 状态 */}
      {loading ? (
        <div className="px-4 py-6 text-slate-500">加载中…</div>
      ) : error ? (
        <div className="px-4 py-6 text-rose-600">加载失败：{error}</div>
      ) : rows.length === 0 ? (
        <div className="px-4 py-6 text-slate-500">暂无数据</div>
      ) : (
        <>
          {/* 移动端：卡片列表 */}
          <div className="md:hidden divide-y">
            {rows.map((r, idx) => (
              <div key={idx} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-[11px]">
                      第{r.live_no}场
                    </span>
                    <span className="text-slate-900 font-medium truncate max-w-[9rem]">
                      {r.username}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-slate-900 font-semibold">
                      {r.live_deal_amount.toLocaleString()}
                      <span className="text-xs ml-1">元</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-3 text-xs text-slate-600">
                  <div className="truncate">
                    教练：
                    <span className="text-slate-800">
                      {r.coach ? r.coach : '未分配'}
                    </span>
                  </div>
                  <div className="truncate">
                    团长：
                    <span className="text-slate-800">
                      {r.reviewer ? r.reviewer : '未分配'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 桌面端：表格 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">场次</th>
                  <th className="px-3 py-2 text-left font-medium">用户</th>
                  <th className="px-3 py-2 text-right font-medium">成交额</th>
                  <th className="px-3 py-2 text-left font-medium">教练</th>
                  <th className="px-3 py-2 text-left font-medium">团长</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2">第{r.live_no}场</td>
                    <td className="px-3 py-2">{r.username}</td>
                    <td className="px-3 py-2 text-right">
                      {r.live_deal_amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{r.coach}</td>
                    <td className="px-3 py-2">{r.reviewer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
