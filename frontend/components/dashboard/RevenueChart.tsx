'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp } from 'lucide-react';

// Mock data for the chart
const monthlyData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 3800 },
  { month: 'Mar', revenue: 5200 },
  { month: 'Apr', revenue: 4800 },
  { month: 'May', revenue: 6200 },
  { month: 'Jun', revenue: 5800 },
];

export function RevenueChart() {
  const totalRevenue = monthlyData.reduce((sum, data) => sum + data.revenue, 0);
  const growthRate = '+18%';
  const averageRevenue = totalRevenue / monthlyData.length;
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            Invoice Analytics
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Monthly invoice performance
          </p>
        </div>
        <Badge variant="secondary" className="text-xs">
          Last 6 months
        </Badge>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Simple Bar Chart Visualization */}
        <div className="space-y-4">
          <div className="flex justify-between items-end h-32 sm:h-40 gap-2 sm:gap-4">
            {monthlyData.map((data, index) => {
              const height = (data.revenue / maxRevenue) * 100;
              const colors = [
                'bg-blue-500',
                'bg-red-500', 
                'bg-green-500',
                'bg-yellow-500',
                'bg-purple-500',
                'bg-cyan-500'
              ];
              
              return (
                <div key={data.month} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full rounded-t-md ${colors[index]} transition-all duration-300 hover:opacity-80`}
                    style={{ height: `${height}%` }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {data.month}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Summary Stats */}
          <div className="flex flex-wrap gap-4 sm:gap-8 pt-4 border-t">
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-green-500">
                ${(totalRevenue / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-blue-500 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                {growthRate}
              </p>
              <p className="text-xs text-muted-foreground">Growth Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-xl font-bold text-purple-500">
                ${(averageRevenue / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-muted-foreground">Average</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}