import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HamburgerButton from '../../../components/header/HamburgerButton';
import { Colors, StatusStyles } from "../../../constants/colors";

const STATUS_KEYS = ["safe", "enroute", "onscene", "needshelp"];

const STATUS_SUBLABELS = {
  safe: 'Safe',
  enroute: 'Code 2',
  onscene: 'Code 3',
  needshelp: 'Alert',
};

function StatusIcon({ statusKey, size = 22, color }) {
  const s = StatusStyles[statusKey];
  if (!s) return null;
  const iconColor = color || s.color;
  if (s.iconLib === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={s.icon} size={size} color={iconColor} />;
  }
  return <Ionicons name={s.icon} size={size} color={iconColor} />;
}

export default function CheckInScreen() {
  const [currentStatus, setCurrentStatus] = useState("safe");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [info, setInfo] = useState(null);
  const [infoType, setInfoType] = useState(null);

  const current = StatusStyles[currentStatus];

  const pending = useMemo(() => {
    if (!pendingStatus) return null;
    return StatusStyles[pendingStatus];
  }, [pendingStatus]);

  const onPickStatus = async (key) => {
    if (key === currentStatus) {
      await Haptics.selectionAsync();
      setPendingStatus(null);
      setInfo("Already your current status");
      setInfoType("warning");
      return;
    }
    await Haptics.selectionAsync();
    setInfo(null);
    setPendingStatus(key);
  };

  const onCancel = async () => {
    await Haptics.selectionAsync();
    setPendingStatus(null);
  };

  const onConfirm = async () => {
    if (!pendingStatus) return;
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Heavy);
    setCurrentStatus(pendingStatus);
    setPendingStatus(null);
    setInfo("Status updated · Team notified");
    setInfoType("success");
  };

  const alertColor = infoType === "success" ? Colors.available : Colors.enRoute;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Page header */}
      <View style={styles.header}>
        <HamburgerButton />
        <Text style={styles.headerTitle}>PSC Companion</Text>
      </View>

      <View style={styles.content}>
        {/* Status hero block */}
        <View style={[styles.heroBlock, { borderTopColor: current.color }]}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroMicro}>Current status</Text>
            <Text style={[styles.heroWord, { color: current.color }]}>{current.label}</Text>
            <Text style={styles.heroMeta}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <StatusIcon statusKey={currentStatus} size={26} />
        </View>

        {/* 2×2 status button grid */}
        <View style={styles.grid}>
          {STATUS_KEYS.map((key) => {
            const s = StatusStyles[key];
            const isCurrent = key === currentStatus;
            const isPending = key === pendingStatus;

            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.statusButton,
                  isCurrent && styles.statusButtonSelected,
                  isCurrent && { borderTopColor: s.color },
                  isPending && { borderColor: s.color },
                ]}
                onPress={() => onPickStatus(key)}
                activeOpacity={0.75}
              >
                <View style={styles.btnTop}>
                  <StatusIcon statusKey={key} size={22} />
                  {isCurrent && (
                    <View style={[styles.activeDot, { backgroundColor: s.color }]} />
                  )}
                </View>
                <View style={styles.btnBottom}>
                  <Text style={[styles.btnLabel, isCurrent && { color: s.color }]}>
                    {s.label}
                  </Text>
                  <Text style={[styles.btnSublabel, isCurrent && { color: s.color }]}>
                    {isCurrent ? 'Active' : STATUS_SUBLABELS[key]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {pendingStatus && pending && (
          <View style={styles.confirmBox}>
            <Text style={styles.confirmText}>
              Update status to{" "}
              <Text style={{ color: pending.color, fontWeight: "500" }}>
                {pending.label}
              </Text>?
            </Text>
            <View style={styles.confirmRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmBtn, { borderColor: pending.color }]}
                onPress={onConfirm}
              >
                <Text style={[styles.confirmBtnText, { color: pending.color }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!!info && (
          <View style={[styles.alertBox, { borderColor: alertColor }]}>
            <Ionicons
              name={infoType === "success" ? "checkmark-circle-outline" : "alert-circle-outline"}
              size={18}
              color={alertColor}
            />
            <Text style={[styles.alertText, { color: alertColor }]}>{info}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 16,
  },

  heroBlock: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface1,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderTopWidth: 1.5,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  heroLeft: { gap: 2 },
  heroMicro: { fontSize: 10, color: Colors.text3, letterSpacing: 0.4 },
  heroWord: { fontSize: 30, fontWeight: '500', letterSpacing: -0.3 },
  heroMeta: { fontSize: 11, color: Colors.text3, fontVariant: ['tabular-nums'] },

  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  statusButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderTopWidth: 0.5,
    backgroundColor: Colors.surface2,
    padding: 13,
    justifyContent: 'space-between',
  },
  statusButtonSelected: {
    backgroundColor: Colors.surface1,
    borderTopWidth: 1.5,
  },
  btnTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  btnBottom: { gap: 2 },
  btnLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
  },
  btnSublabel: {
    fontSize: 10,
    color: Colors.text3,
    letterSpacing: 0.4,
  },

  confirmBox: {
    width: "100%",
    backgroundColor: Colors.surface1,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: 13,
    padding: 14,
  },
  confirmText: {
    color: Colors.text1,
    fontSize: 13,
    marginBottom: 12,
    textAlign: "center",
  },
  confirmRow: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 13,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.surface2,
  },
  cancelText: {
    color: Colors.text3,
    fontSize: 13,
    fontWeight: "500",
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 13,
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.surface2,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },

  alertBox: {
    width: "100%",
    borderRadius: 13,
    borderWidth: 0.5,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.surface1,
  },
  alertText: {
    fontSize: 13,
    fontWeight: "500",
  },
});
