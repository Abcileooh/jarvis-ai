// src/components/SystemStats.js
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { COLORS } from '../constants/theme';

const STATS = [
  { label: 'CPU', gen: () => (Math.random() * 20 + 75).toFixed(1) + '%' },
  { label: 'GÜÇ', gen: () => (Math.random() * 5 + 94).toFixed(1) + '%' },
  { label: 'GECİKME', gen: () => (Math.random() * 3 + 1).toFixed(0) + 'ms' },
  { label: 'BELLEK', gen: () => (Math.random() * 10 + 82).toFixed(1) + '%' },
];

export default function SystemStats() {
  const [stats, setStats] = useState(STATS.map((s) => ({ label: s.label, value: s.gen() })));

  useEffect(() => {
    const iv = setInterval(() => {
      setStats(STATS.map((s) => ({ label: s.label, value: s.gen() })));
    }, 1800);
    return () => clearInterval(iv);
  }, []);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
      {stats.map((s) => (
        <View
          key={s.label}
          style={{
            width: '47%',
            backgroundColor: COLORS.cyanFaint,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 6,
            padding: 8,
          }}
        >
          <Text style={{ color: COLORS.textDim, fontSize: 9, letterSpacing: 2 }}>{s.label}</Text>
          <Text style={{ color: COLORS.cyan, fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace' }}>
            {s.value}
          </Text>
        </View>
      ))}
    </View>
  );
}
