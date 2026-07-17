import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useTheme } from '@/hooks/use-theme';

interface StockChartProps {
  history: number[];
  width?: number;
  height?: number;
}

export function StockChart({ history, width = 120, height = 50 }: StockChartProps) {
  const theme = useTheme();

  if (!history || history.length < 2) return null;

  const pointsCount = history.length;
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min === 0 ? 1 : max - min;

  // Map data to SVG coordinates
  const coords = history.map((val, idx) => {
    const x = (idx / (pointsCount - 1)) * width;
    // Map values so higher values are physically higher up (lower Y coordinate)
    // Add 4px padding top/bottom so line isn't clipped
    const y = height - 4 - ((val - min) / range) * (height - 8);
    return { x, y };
  });

  // Construct SVG path string for the line
  let linePath = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 1; i < coords.length; i++) {
    linePath += ` L ${coords[i].x} ${coords[i].y}`;
  }

  // Construct closed path for the gradient area fill
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  // Determine trend color
  const isUp = history[history.length - 1] >= history[0];
  const strokeColor = isUp ? theme.green : theme.red;
  const gradientId = `grad-${isUp ? 'up' : 'down'}-${Math.floor(Math.random() * 10000)}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Fill under the line */}
        <Path d={areaPath} fill={`url(#${gradientId})`} />

        {/* The line itself */}
        <Path
          d={linePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
