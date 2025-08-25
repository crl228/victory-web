import React, { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Order } from '@/lib/types';

export default function BossOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const list = await api.dealUsers();
        if (alive) setOrders(Array.isArray(list) ? list : []);
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
      count: orders.length,
      amount: orders.reduce((a, b) => a + (Number(b.live_deal_amount) || 0), 0),
    }),
    [orders]
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
      <div className="overflow-x-auto">
        <table className="min-w-full text-[10px]">
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
            {loading ? (
              <tr>
                <td className="px-3 py-6 text-slate-500" colSpan={5}>
                  加载中…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td className="px-3 py-6 text-rose-600" colSpan={5}>
                  加载失败：{error}
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-slate-500" colSpan={5}>
                  暂无数据
                </td>
              </tr>
            ) : (
              orders
                .sort(
                  (a, b) => (Number(a.live_no) || 0) - (Number(b.live_no) || 0)
                )
                .map((o, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2">第{Number(o.live_no)}场</td>
                    <td className="px-3 py-2">{o.username}</td>
                    <td className="px-3 py-2 text-right">
                      {Number(o.live_deal_amount).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      {o.coach ?? o.coach_id ?? '-'}
                    </td>
                    <td className="px-3 py-2">{o.reviewer ?? '-'}</td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
