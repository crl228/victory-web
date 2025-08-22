export type ApiEnvelope<T> = {
  code?: number; // 0 / 200 视你的后端
  msg?: string; // "OK" / 错误信息
  data?: T; // 推荐：所有有效载荷都放 data
};

export type Overview = {
  pv: number; // 历史累计成交额使用 GMV 字段；此字段保留历史定义
  uv: number; // 平均活跃率（可选展示）
  live_purchase_amount: number; // 直播成交总额（历史+单场累计）
  live_purchase_count: number; // 观看人数（去重）
  watch_bin_0: number; // 全局观看分布（用于饼图）
  watch_bin_1: number; // 全局观看分布（用于饼图）
  watch_bin_2: number; // 全局观看分布（用于饼图）
  watch_bin_3: number; // 全局观看分布（用于饼图）
  watch_bin_4: number; // 全局观看分布（用于饼图）
  watch_bin_5: number; // 全局观看分布（用于饼图）
  funnel: Array<{ name: string; value: number }>; // 成交转化漏斗
  sessions: Array<{
    live_no: number;
    total_users: number; // 当场观看人数
    active_users: number;
    total_deals: number;
    deal_users: number;
    watch_bin_0: number; // 全局观看分布（用于饼图）
    watch_bin_1: number; // 全局观看分布（用于饼图）
    watch_bin_2: number; // 全局观看分布（用于饼图）
    watch_bin_3: number; // 全局观看分布（用于饼图）
    watch_bin_4: number; // 全局观看分布（用于饼图）
    watch_bin_5: number; // 全局观看分布（用于饼图）
  }>;
};

export type LeaderOverview = {
  leader_id: string;
  leader_name: string;
  sessions: Array<{
    live_no: number;
    users: number;
    gmv_current: number;
    gmv_history: number;
  }>;
};

export type CoachOverview = {
  coach_id: string;
  coach_name: string;
  latest?: {
    live_no: number;
    users: number;
    gmv_current: number;
    gmv_history: number;
    deal_users?: number;
  };
  sessions: Array<{
    live_no: number;
    users: number;
    gmv_current: number;
    gmv_history: number;
  }>;
};
