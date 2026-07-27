import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../constants/theme';

/**
 * Shared dark gradient background for every screen. Using one gradient
 * behind BlurView cards is what makes the "glass" card effect actually
 * read as glass — a blur over a flat solid color looks identical to a
 * flat solid color, a blur over a gradient shows depth.
 */
export function Screen({ children, edges = ['top'] }: PropsWithChildren<{ edges?: Edge[] }>) {
  return (
    <LinearGradient
      colors={[colors.bg, colors.bgGradientEnd]}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.fill}
    >
      <StatusBar style="light" />
      <SafeAreaView style={styles.fill} edges={edges}>
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
