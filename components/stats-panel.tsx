"use client";

import { Card } from "@/components/ui/card";
import { Flame, Snowflake, TrendingUp } from "lucide-react";

export function StatsPanel() {
  const hotNumbers = [
    { number: 23, heatIndex: 98.1, appearances: 166 },
    { number: 36, heatIndex: 89.4, appearances: 160 },
    { number: 39, heatIndex: 89.4, appearances: 160 },
    { number: 21, heatIndex: 83.6, appearances: 156 },
    { number: 32, heatIndex: 78.1, appearances: 154 },
  ];

  const coldNumbers = [
    { number: 65, heatIndex: 0.0, appearances: 78 },
    { number: 60, heatIndex: 0.0, appearances: 81 },
    { number: 66, heatIndex: 5.2, appearances: 88 },
    { number: 67, heatIndex: 8.1, appearances: 92 },
    { number: 68, heatIndex: 10.3, appearances: 95 },
  ];

  const insights = [
    { label: "Consecutive Numbers", value: "28.4%", description: "of draws contain consecutive numbers" },
    { label: "Average Sum", value: "167.9", description: "average sum of white balls" },
    { label: "Most Common Pattern", value: "2E / 3O", description: "2 even, 3 odd numbers (33.1%)" },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-bold">Hottest Numbers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {hotNumbers.map((item) => (
            <div key={item.number} className="text-center p-3 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
              <div className="text-3xl font-bold text-red-500 mb-1">{item.number}</div>
              <div className="text-xs text-muted-foreground">Heat: {item.heatIndex}</div>
              <div className="text-xs text-muted-foreground">{item.appearances} times</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center gap-2 mb-4">
          <Snowflake className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold">Coldest Numbers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {coldNumbers.map((item) => (
            <div key={item.number} className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-500 mb-1">{item.number}</div>
              <div className="text-xs text-muted-foreground">Heat: {item.heatIndex}</div>
              <div className="text-xs text-muted-foreground">{item.appearances} times</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-bold">Key Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight, idx) => (
            <div key={idx} className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-sm text-muted-foreground mb-1">{insight.label}</div>
              <div className="text-3xl font-bold text-accent mb-1">{insight.value}</div>
              <div className="text-xs text-muted-foreground">{insight.description}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
