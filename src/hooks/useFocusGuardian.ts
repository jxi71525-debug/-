import { useEffect, useState, useRef } from 'react';
import { useFocusStore } from '../store/useFocusStore';

export function useFocusGuardian() {
  const { status, failFocus, tick, setShowWarning, setWarningCountdown } = useFocusStore();
  const [isFlat, setIsFlat] = useState(false);
  const [angles, setAngles] = useState({ beta: 0, gamma: 0 });
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningCountdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. 物理结界：DeviceOrientation
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      
      if (beta !== null && gamma !== null) {
        setAngles({ beta: Math.round(beta), gamma: Math.round(gamma) });
        
        // Check if device is flat (face up on table)
        // 放宽了角度限制，从 15度 增加到 35度，允许轻微的晃动或拿起来看一眼
        const isCurrentlyFlat = Math.abs(beta) < 35 && Math.abs(gamma) < 35;
        setIsFlat(isCurrentlyFlat);

        // 只有在 focusing 状态下，拿起手机才会触发警告和失败
        if (status === 'focusing') {
          if (!isCurrentlyFlat) {
            if (!warningTimerRef.current) {
              setShowWarning(true);
              setWarningCountdown(5); // 初始化倒计时

              let remaining = 5;
              warningCountdownIntervalRef.current = setInterval(() => {
                remaining -= 1;
                setWarningCountdown(remaining);
                if (remaining <= 0) {
                  if (warningCountdownIntervalRef.current) {
                    clearInterval(warningCountdownIntervalRef.current);
                    warningCountdownIntervalRef.current = null;
                  }
                  warningTimerRef.current = null;
                  setShowWarning(false);
                  failFocus();
                }
              }, 1000);

              warningTimerRef.current = setTimeout(() => {
                warningTimerRef.current = null;
              }, 6000);
            }
          } else {
            // 手机放平，取消警告和定时器
            if (warningTimerRef.current) {
              clearTimeout(warningTimerRef.current);
              warningTimerRef.current = null;
            }
            if (warningCountdownIntervalRef.current) {
              clearInterval(warningCountdownIntervalRef.current);
              warningCountdownIntervalRef.current = null;
            }
            setShowWarning(false);
            setWarningCountdown(0);
          }
        }
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (warningCountdownIntervalRef.current) clearInterval(warningCountdownIntervalRef.current);
    };
  }, [status, failFocus, setShowWarning]);

  // 当状态改变（例如中途退出、暂停）时，清理警告定时器
  useEffect(() => {
    if (status !== 'focusing') {
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
        warningTimerRef.current = null;
      }
      if (warningCountdownIntervalRef.current) {
        clearInterval(warningCountdownIntervalRef.current);
        warningCountdownIntervalRef.current = null;
      }
      setShowWarning(false);
      setWarningCountdown(0);
    }
  }, [status, setShowWarning, setWarningCountdown]);

  // 2. 软件结界：Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      // 切换到后台且处于专注中，立刻失败
      if (document.hidden && status === 'focusing') {
        failFocus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, failFocus]);

  // 3. 专注倒计时 Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (status === 'focusing' || status === 'preparing') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, tick]);

  // 为了 iOS 等设备请求传感器权限
  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
        } else {
          alert('需要传感器权限才能开启物理结界！请在设置中允许Safari/Chrome访问动作与方向。');
        }
      } catch (error) {
        console.error('Error requesting orientation permission:', error);
      }
    } else {
      // Android 或 PC 通常不需要手动 requestPermission
      setPermissionGranted(true);
    }
  };

  return {
    isFlat,
    angles,
    permissionGranted,
    requestOrientationPermission
  };
}
