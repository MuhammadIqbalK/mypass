"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo, useState, useEffect } from "react";

type Password = {
  id: number;
  category: string | null;
  // other fields are not needed for this chart
};

type CategoryChartProps = {
  passwords: Password[];
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#ff4d4d"];

export function CategoryChart({ passwords }: CategoryChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    const categoryCounts = new Map<string, number>();
    passwords.forEach((p) => {
      const category = p.category || "Uncategorized";
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1);
    });

    return Array.from(categoryCounts.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [passwords]);

  if (!mounted) {
    return <div>Loading chart...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No category data to display.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={(entry) => `${entry.name} (${entry.value})`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
