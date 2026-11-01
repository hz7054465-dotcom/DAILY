import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_SETTINGS, Settings } from '@/types/settings';
import { loadSettings, saveSettings } from '@/services/settingsStorage';

interface SettingsContextValue {
  settings: Settings;
  ready: boolean;
  update: (patch: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const latest = useRef<Settings>(DEFAULT_SETTINGS);
  const loaded = useRef(false);
  const pending = useRef<Partial<Settings>>({});
  const queue = useRef<Promise<void>>(Promise.resolve());

  const persist = useCallback((value: Settings) => {
    queue.current = queue.current
      .then(() => saveSettings(value))
      .catch(() => {});
    return queue.current;
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadSettings().then((s) => {
      if (cancelled) return;
      const hasPending = Object.keys(pending.current).length > 0;
      const merged = { ...s, ...pending.current };
      pending.current = {};
      loaded.current = true;
      latest.current = merged;
      setSettings(merged);
      setReady(true);
      if (hasPending) persist(merged);
    });
    return () => {
      cancelled = true;
    };
  }, [persist]);

  // Every change is saved instantly (no "Save" button), in order.
  const update = useCallback(
    async (patch: Partial<Settings>) => {
      if (!loaded.current) {
        pending.current = { ...pending.current, ...patch };
        setSettings((prev) => ({ ...prev, ...patch }));
        return;
      }
      const next = { ...latest.current, ...patch };
      latest.current = next;
      setSettings(next);
      await persist(next);
    },
    [persist]
  );

  const value = useMemo(() => ({ settings, ready, update }), [settings, ready, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
