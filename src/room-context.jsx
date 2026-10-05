import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { presets } from "./data.js";

const storageKey = "dastorshollantors-room";

function startingRoom() {
  const preset = presets.living;
  return {
    kind: "living",
    presetActive: true,
    unit: "m",
    width: preset.width.toFixed(2),
    depth: preset.depth.toFixed(2),
    height: preset.height.toFixed(2),
    windowWidth: preset.windowWidth.toFixed(2),
    windowDrop: preset.windowDrop.toFixed(2),
    treatment: preset.treatment,
    cloth: preset.cloth,
    hem: preset.hem,
    closed: preset.closed,
    summary: "",
  };
}

const RoomContext = createContext(null);

export function RoomProvider({ children }) {
  const [room, setRoom] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (saved && saved.width && saved.treatment) return { ...startingRoom(), ...saved };
    } catch {
      /* keep the living-room default */
    }
    return startingRoom();
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(room));
  }, [room]);

  const patch = useCallback((partial, custom = false) => {
    setRoom((current) => ({
      ...current,
      ...partial,
      presetActive: custom ? false : current.presetActive,
    }));
  }, []);

  const setSummary = useCallback((summary) => {
    setRoom((current) => (current.summary === summary ? current : { ...current, summary }));
  }, []);

  return (
    <RoomContext.Provider value={{ room, setRoom, patch, setSummary }}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const value = useContext(RoomContext);
  if (!value) throw new Error("useRoom must be used inside RoomProvider");
  return value;
}
