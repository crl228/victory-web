import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

export default function Chart({
  option,
  className,
}: {
  option: any;
  className?: string;
}) {
  const memo = useMemo(() => option, [option]);
  return (
    <div className={className}>
      <ReactECharts
        option={memo}
        style={{ height: 360, width: '100%' }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
}
