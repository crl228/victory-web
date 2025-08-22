import React from 'react';

export default function RoleNav() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <a href="/boss" className="rounded-2xl border p-6 hover:shadow">
        <div className="text-lg font-semibold">老板管理层</div>
        <p className="text-sm text-slate-600 mt-1">
          全局指标、分场走势、用户分层
        </p>
      </a>
      <a href="/leader" className="rounded-2xl border p-6 hover:shadow">
        <div className="text-lg font-semibold">团长</div>
        <p className="text-sm text-slate-600 mt-1">
          按【团长+场次】统计，分层占比
        </p>
      </a>
      <a href="/coach" className="rounded-2xl border p-6 hover:shadow">
        <div className="text-lg font-semibold">教练</div>
        <p className="text-sm text-slate-600 mt-1">
          选教练或固定链接进入，最新场成交等
        </p>
      </a>
    </div>
  );
}
