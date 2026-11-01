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

  useEffect(() => {
    let cancelled = false;
    loadSettings().then((s) => {
      if (cancelled) return;
      latest.current = s;
      setSettings(s);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Every change is saved instantly (no "Save" button).
  const update = useCallback(async (patch: Partial<Settings>) => {
    const next = { ...latest.current, ...patch };
    latest.current = next;
    setSettings(next);
    await saveSettings(next);
  }, []);

  const value = useMemo(() => ({ settings, ready, update }), [settings, ready, update]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside <SettingsProvider>');
  return ctx;
}
