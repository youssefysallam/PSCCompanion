import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Colors, StatusStyles } from '../../constants/colors';

const STATUS_OPTIONS = ['safe', 'enroute', 'onscene', 'needshelp'];
const SCREEN_HEIGHT = Dimensions.get('window').height;

function StatusIcon({ status, size = 20, color }) {
  const s = StatusStyles[status];
  if (!s) return null;
  const iconColor = color || s.color;
  if (s.iconLib === 'MaterialCommunityIcons') {
    return <MaterialCommunityIcons name={s.icon} size={size} color={iconColor} />;
  }
  return <Ionicons name={s.icon} size={size} color={iconColor} />;
}

export default function CheckInPanel({
  visible,
  onClose,
  currentStatus,
  onStatusChange,
}) {
  const [confirming, setConfirming] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const translateY = useSharedValue(0);
  const shouldDismiss = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      const shouldClose = translateY.value > 120 || event.velocityY > 1000;
      if (shouldClose) {
        shouldDismiss.value = true;
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
      } else {
        translateY.value = withSpring(0);
      }
    });

  useEffect(() => {
    if (visible) {
      translateY.value = 0;
    }
  }, [visible]);

  useEffect(() => {
    const id = setInterval(() => {
      if (shouldDismiss.value && translateY.value >= 500) {
        shouldDismiss.value = false;
        setConfirmed(false);
        setConfirming(null);
        onClose();
      }
    }, 16);
    return () => clearInterval(id);
  }, []);

  const handleSelect = (status) => {
    setConfirming(status);
  };

  const handleConfirm = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Heavy);
    onStatusChange(confirming);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setConfirming(null);
      onClose();
    }, 1100);
  };

  const renderConfirmed = () => {
    const s = StatusStyles[confirming];
    return (
      <View style={styles.confirmedContainer}>
        <View style={[styles.confirmedIcon, { borderColor: s.color }]}>
          <Ionicons name="checkmark" size={32} color={s.color} />
        </View>
        <Text style={styles.confirmedTitle}>Status updated</Text>
        <Text style={[styles.confirmedStatus, { color: s.color }]}>{s.label}</Text>
        <Text style={styles.confirmedDetail}>Broadcast to all team members</Text>
      </View>
    );
  };

  const renderConfirmStep = () => {
    const s = StatusStyles[confirming];
    return (
      <View style={styles.confirmStep}>
        <View style={[styles.confirmIcon, { borderColor: s.color }]}>
          <StatusIcon status={confirming} size={28} />
        </View>
        <Text style={styles.confirmText}>
          Update status to{' '}
          <Text style={{ color: s.color, fontWeight: '500' }}>{s.label}</Text>?
        </Text>
        <View style={styles.confirmButtons}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setConfirming(null)}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { borderColor: s.color }]}
            onPress={handleConfirm}
          >
            <Text style={[styles.confirmButtonText, { color: s.color }]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderOptions = () => (
    <View style={styles.options}>
      {STATUS_OPTIONS.map((key) => {
        const s = StatusStyles[key];
        const isCurrent = key === currentStatus;
        return (
          <TouchableOpacity
            key={key}
            style={[
              styles.option,
              isCurrent && { borderColor: s.color, backgroundColor: Colors.surface2 },
            ]}
            onPress={() => handleSelect(key)}
            activeOpacity={0.7}
          >
            <StatusIcon status={key} size={20} />
            <Text style={[styles.optionLabel, { color: isCurrent ? s.color : Colors.text1 }]}>
              {s.label}
            </Text>
            <View style={{ flex: 1 }} />
            {isCurrent && (
              <Text style={[styles.currentTag, { color: s.color }]}>Active</Text>
            )}
            <Ionicons name="chevron-forward" size={14} color={Colors.text3} />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, animatedStyle]}>
            <View style={styles.handle} />

            {confirmed ? (
              renderConfirmed()
            ) : (
              <>
                <Text style={styles.title}>Quick check-in</Text>
                <Text style={styles.subtitle}>Select your current status</Text>
                {confirming ? renderConfirmStep() : renderOptions()}
              </>
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text1,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.text3,
    textAlign: 'center',
    marginBottom: 20,
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    borderRadius: 13,
    backgroundColor: Colors.surface2,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  currentTag: {
    fontSize: 11,
    fontWeight: '500',
    marginRight: 4,
  },
  confirmStep: {
    alignItems: 'center',
    paddingTop: 8,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: Colors.surface2,
  },
  confirmText: {
    fontSize: 14,
    color: Colors.text1,
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  backButton: {
    flex: 1,
    padding: 14,
    borderRadius: 13,
    backgroundColor: Colors.surface2,
    borderWidth: 0.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text3,
  },
  confirmButton: {
    flex: 1,
    padding: 14,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface2,
  },
  confirmButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  confirmedContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  confirmedIcon: {
    width: 72,
    height: 72,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: Colors.surface2,
  },
  confirmedTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text1,
  },
  confirmedStatus: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  confirmedDetail: {
    fontSize: 11,
    color: Colors.text3,
    marginTop: 10,
  },
});
