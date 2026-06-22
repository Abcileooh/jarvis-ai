// src/screens/ChatScreen.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated as RNAnimated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, STATUS_MESSAGES, MODULES } from '../constants/theme';
import { sendMessage } from '../services/anthropic';
import HUDRing from '../components/HUDRing';
import RadarSweep from '../components/RadarSweep';
import PulseDot from '../components/PulseDot';
import WaveBar from '../components/WaveBar';
import SystemStats from '../components/SystemStats';

function MessageBubble({ message, index }) {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(12)).current;
  const isUser = message.role === 'user';

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      RNAnimated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <RNAnimated.View
      style={[
        styles.messageRow,
        isUser && styles.messageRowUser,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          isUser ? styles.avatarUser : styles.avatarJarvis,
        ]}
      >
        <Text style={[styles.avatarText, isUser && { color: COLORS.gold }]}>
          {isUser ? 'S' : 'J'}
        </Text>
      </View>

      <View style={[styles.bubbleContainer, isUser && { alignItems: 'flex-end' }]}>
        <Text style={[styles.senderLabel, isUser && { color: COLORS.goldDim, textAlign: 'right' }]}>
          {isUser ? 'KULLANICI' : 'J.A.R.V.I.S.'}
        </Text>
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleJarvis,
          ]}
        >
          {!isUser && (
            <View style={styles.bubbleAccent} />
          )}
          <Text style={[styles.bubbleText, isUser && { color: COLORS.userText }]}>
            {message.content}
          </Text>
        </View>
      </View>
    </RNAnimated.View>
  );
}

function SidePanel({ visible }) {
  if (!visible) return null;
  return (
    <View style={styles.sidePanel}>
      {/* Mini HUD */}
      <View style={styles.miniHudContainer}>
        <HUDRing size={80} duration={10000} color={COLORS.cyan} opacity={0.25} />
        <HUDRing size={62} duration={7000} reverse color={COLORS.aqua} opacity={0.3} />
        <HUDRing size={44} duration={4000} color={COLORS.gold} opacity={0.15} />
        <RadarSweep size={80} />
        <View style={styles.miniHudCore}>
          <Text style={styles.miniHudText}>AI</Text>
          <PulseDot size={5} />
        </View>
      </View>

      {/* Stats */}
      <Text style={styles.panelLabel}>SİSTEM</Text>
      <SystemStats />

      {/* Modules */}
      <Text style={[styles.panelLabel, { marginTop: 12 }]}>MODÜLLER</Text>
      {MODULES.map((m) => (
        <View key={m.name} style={styles.moduleRow}>
          <Text style={styles.moduleName}>{m.name}</Text>
          <Text style={styles.moduleStatus}>●</Text>
        </View>
      ))}
    </View>
  );
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setStatusIdx((p) => (p + 1) % STATUS_MESSAGES.length);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage(newMessages);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert('Sistem Hatası', e.message || 'Bağlantı kurulamadı.');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sistem hatası tespit edildi. Protokol yeniden deneniyor, Efendim.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>◈</Text>
      <Text style={styles.emptyTitle}>SİSTEM HAZIR</Text>
      <Text style={styles.emptySubtitle}>Bir komut veya soru girin</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.bg, '#0A0F1A', COLORS.bg]}
        style={StyleSheet.absoluteFill}
      />

      {/* Grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => setShowPanel(!showPanel)}
          activeOpacity={0.7}
        >
          <View style={styles.headerHud}>
            <HUDRing size={36} duration={6000} color={COLORS.cyan} opacity={0.5} />
            <HUDRing size={26} duration={4000} reverse color={COLORS.aqua} opacity={0.4} />
            <RadarSweep size={36} />
            <PulseDot size={6} />
          </View>
          <View>
            <Text style={styles.headerTitle}>J.A.R.V.I.S.</Text>
            <Text style={styles.headerSub}>STARK INDUSTRIES v7.4.1</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <PulseDot size={6} color={COLORS.aqua} />
          <Text style={styles.statusText}>{STATUS_MESSAGES[statusIdx]}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        {/* Side panel */}
        <SidePanel visible={showPanel} />

        {/* Chat area */}
        <KeyboardAvoidingView
          style={styles.chatArea}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item, index }) => <MessageBubble message={item} index={index} />}
            ListEmptyComponent={EmptyState}
            contentContainerStyle={[styles.messageList, messages.length === 0 && { flex: 1 }]}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              loading ? (
                <View style={styles.loadingBubble}>
                  <View style={[styles.avatar, styles.avatarJarvis]}>
                    <Text style={styles.avatarText}>J</Text>
                  </View>
                  <View style={styles.loadingContent}>
                    <WaveBar barCount={10} color={COLORS.cyan} />
                    <Text style={styles.loadingLabel}>ANALİZ EDİLİYOR...</Text>
                  </View>
                </View>
              ) : null
            }
          />

          {/* Input */}
          <View style={styles.inputArea}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={input}
                onChangeText={setInput}
                placeholder="► KOMUT GİRİN..."
                placeholderTextColor={COLORS.textFaint}
                multiline
                maxLength={1000}
                returnKeyType="send"
                onSubmitEditing={handleSend}
                blurOnSubmit={false}
              />
            </View>
            <TouchableOpacity
              onPress={handleSend}
              disabled={loading || !input.trim()}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={
                  loading || !input.trim()
                    ? [COLORS.cyanFaint, COLORS.cyanFaint]
                    : [COLORS.cyanGlow, '#00FFF715']
                }
                style={[
                  styles.sendButton,
                  (loading || !input.trim()) && { opacity: 0.4 },
                ]}
              >
                <Text style={styles.sendButtonText}>
                  {loading ? '...' : '►'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputHint}>
            Mesajınızı yazın ve gönderin
          </Text>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bg + 'E8',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerHud: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.cyan,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
    fontFamily: 'monospace',
  },
  headerSub: {
    color: COLORS.textFaint,
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    color: COLORS.aqua,
    fontSize: 9,
    letterSpacing: 1.5,
    fontFamily: 'monospace',
  },

  mainContent: { flex: 1, flexDirection: 'row' },

  sidePanel: {
    width: 160,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    padding: 12,
    backgroundColor: COLORS.bg,
  },
  miniHudContainer: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  miniHudCore: { alignItems: 'center', gap: 3 },
  miniHudText: {
    color: COLORS.cyan,
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  panelLabel: {
    color: COLORS.textDim,
    fontSize: 8,
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: 'monospace',
  },
  moduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  moduleName: {
    color: COLORS.textDim,
    fontSize: 9,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  moduleStatus: { color: COLORS.aqua, fontSize: 10 },

  chatArea: { flex: 1 },
  messageList: { padding: 16, gap: 16 },

  messageRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  messageRowUser: { flexDirection: 'row-reverse' },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarJarvis: {
    backgroundColor: COLORS.cyanFaint,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
  },
  avatarUser: {
    backgroundColor: COLORS.goldDim,
    borderWidth: 1,
    borderColor: COLORS.goldDim,
  },
  avatarText: {
    color: COLORS.cyan,
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },

  bubbleContainer: { flex: 1 },
  senderLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  bubble: {
    padding: 12,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '100%',
  },
  bubbleJarvis: {
    backgroundColor: COLORS.cyanFaint,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderTopLeftRadius: 2,
  },
  bubbleUser: {
    backgroundColor: COLORS.userBubble,
    borderWidth: 1,
    borderColor: COLORS.userBorder,
    borderTopRightRadius: 2,
  },
  bubbleAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.cyan,
    opacity: 0.6,
  },
  bubbleText: {
    color: COLORS.whiteSecondary,
    fontSize: 13,
    lineHeight: 20,
  },

  loadingBubble: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  loadingContent: {
    padding: 12,
    backgroundColor: COLORS.cyanFaint,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    borderTopLeftRadius: 2,
    gap: 6,
  },
  loadingLabel: {
    color: COLORS.textDim,
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: 'monospace',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 0.4,
  },
  emptyIcon: { fontSize: 40, color: COLORS.cyanDim },
  emptyTitle: {
    color: COLORS.textDim,
    fontSize: 13,
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
  emptySubtitle: {
    color: COLORS.textFaint,
    fontSize: 10,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },

  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.bg,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: COLORS.cyanFaint,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  textInput: {
    color: COLORS.whiteSecondary,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: 'System',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: COLORS.cyan,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  inputHint: {
    color: COLORS.textFaint,
    fontSize: 9,
    textAlign: 'center',
    paddingVertical: 6,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
});
