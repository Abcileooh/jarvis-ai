// src/screens/BootScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BOOT_LINES } from '../constants/theme';
import HUDRing from '../components/HUDRing';
import RadarSweep from '../components/RadarSweep';
import PulseDot from '../components/PulseDot';

export default function BootScreen({ onDone }) {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  const fadeAnim = new RNAnimated.Value(1);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        setProgress(((i + 1) / BOOT_LINES.length) * 100);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => {
          RNAnimated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(onDone);
        }, 600);
      }
    }, 450);
    return () => clearInterval(iv);
  }, []);

  return (
    <RNAnimated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* HUD center */}
      <View style={styles.hudContainer}>
        <HUDRing size={160} duration={12000} color={COLORS.cyan} opacity={0.2} />
        <HUDRing size={130} duration={8000} reverse color={COLORS.aqua} opacity={0.25} />
        <HUDRing size={100} duration={5000} color={COLORS.gold} opacity={0.15} />
        <HUDRing size={70} duration={3000} reverse color={COLORS.cyan} opacity={0.35} />
        <RadarSweep size={160} />
        <View style={styles.hudCenter}>
          <Text style={styles.hudText}>J.A.R.V.I.S.</Text>
          <PulseDot size={8} color={COLORS.cyan} />
        </View>
      </View>

      {/* Boot lines */}
      <View style={styles.linesContainer}>
        {lines.map((line, i) => (
          <Text
            key={i}
            style={[
              styles.bootLine,
              i === lines.length - 1 && { color: COLORS.aqua },
            ]}
          >
            {'> '}{line}
          </Text>
        ))}
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <Text style={styles.version}>STARK INDUSTRIES © 2024 — v7.4.1</Text>
    </RNAnimated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  hudContainer: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  hudCenter: {
    alignItems: 'center',
    gap: 6,
  },
  hudText: {
    color: COLORS.cyan,
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
  linesContainer: {
    width: '100%',
    marginBottom: 24,
    minHeight: 140,
  },
  bootLine: {
    color: COLORS.textDim,
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: '100%',
    height: 2,
    backgroundColor: COLORS.border,
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  version: {
    color: COLORS.textFaint,
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
});
