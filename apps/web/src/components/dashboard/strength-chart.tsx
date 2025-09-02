"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useMemo, useState, useEffect } from "react";

type Password = {
  id: number;
  strength: 1 | 2 | 3 | 4 | 5 | null;
  // other fields are not needed for this chart
};

type StrengthChartProps = {
  passwords: Password[];
};

const STRENGTH_LABELS: { [key: number]: string } = {
  1: "Very Weak",
  2: "Weak",
  3: "Moderate",
  4: "Strong",
  5: "Very Strong",
};

export function StrengthChart({ passwords }: StrengthChartProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const data = useMemo(() => {
    const strengthCounts = new Map<string, number>();

    // Initialize map with all possible strength labels
    Object.values(STRENGTH_LABELS).forEach(label => {
      strengthCounts.set(label, 0);
    });

    passwords.forEach((p) => {
      if (p.strength && STRENGTH_LABELS[p.strength]) {
        const label = STRENGTH_LABELS[p.strength];
        strengthCounts.set(label, (strengthCounts.get(label) || 0) + 1);
      }
    });

    return Array.from(strengthCounts.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [passwords]);

  if (!mounted) {
    return <div>Loading chart...</div>;
  }

  if (!data || data.every(d => d.count === 0)) {
    return <div>No strength data to display.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" name="Password Count" />
      </BarChart>
    </ResponsiveContainer>
  );
}
