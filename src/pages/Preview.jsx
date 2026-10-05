import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { cloths, presets } from "../data.js";
import { useRoom } from "../room-context.jsx";
import { createRoomView } from "../studio.js";

const kinds = [
  ["living", "Living"],
  ["bedroom", "Bedroom"],
  ["dining", "Dining"],
  ["study", "Study"],
];

const treatments = [
  ["curtains", "Curtains"],
  ["layered", "Sheer and curtain"],
  ["roman", "Roman"],
  ["roller", "Roller"],
  ["venetian", "Venetian"],
];

function shown(metres, unit) {
  const value = unit === "ft" ? metres / 0.3048 : metres;
  return value.toFixed(2);
}

export default function Preview() {
  const canvasRef = useRef(null);
  const viewRef = useRef(null);
  const { room, patch, setRoom, setSummary } = useRoom();
  const curtains = room.treatment === "curtains" || room.treatment === "layered";
  const openLabel = room.treatment === "venetian"
    ? "Slats closed"
    : curtains
      ? "Drawn across the window"
      : "Blind lowered";

  useEffect(() => {
    const view = createRoomView(canvasRef.current, setSummary);
    viewRef.current = view;
    return () => view.dispose();
  }, [setSummary]);

  useEffect(() => {
    viewRef.current?.update(room);
  }, [room.kind, room.unit, room.width, room.depth, room.height, room.windowWidth, room.windowDrop, room.treatment, room.cloth, room.hem, room.closed]);

  function chooseKind(kind) {
    const preset = presets[kind];
    setRoom((current) => ({
      ...current,
      kind,
      presetActive: true,
      treatment: preset.treatment,
      cloth: preset.cloth,
      hem: preset.hem,
      closed: preset.closed,
      width: shown(preset.width, current.unit),
      depth: shown(preset.depth, current.unit),
      height: shown(preset.height, current.unit),
      windowWidth: shown(preset.windowWidth, current.unit),
      windowDrop: shown(preset.windowDrop, current.unit),
    }));
  }

  function chooseUnit(unit) {
    if (unit === room.unit) return;
    const factor = room.unit === "m" && unit === "ft" ? 3.28084 : 0.3048;
    const convert = (value) => {
      const number = parseFloat(value);
      return Number.isFinite(number) ? (number * factor).toFixed(2) : value;
    };
    patch({
      unit,
      width: convert(room.width),
      depth: convert(room.depth),
      height: convert(room.height),
      windowWidth: convert(room.windowWidth),
      windowDrop: convert(room.windowDrop),
    });
  }

  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <p className="eyebrow">3D preview</p>
          <h1>A room at the size you type.</h1>
          <p className="lead">Choose the room, enter the measurements, then pick the cloth and the treatment. The model rebuilds as you change them, and the same description is kept for your enquiry. Drag to look around. This is a guide — we still measure on site before anything is cut.</p>
        </div>
      </header>
      <div className="shell">
        <div className="planner">
          <form className="planner-panel" onSubmit={(event) => event.preventDefault()}>
            <div>
              <p className="eyebrow">Room</p>
              <h2>Measurements</h2>
            </div>
            <div className="choice-row" role="group" aria-label="Room type">
              {kinds.map(([id, label]) => (
                <button key={id} type="button" aria-pressed={room.presetActive && room.kind === id} onClick={() => chooseKind(id)}>{label}</button>
              ))}
            </div>
            <div className="choice-row" role="group" aria-label="Units">
              <button type="button" aria-pressed={room.unit === "m"} onClick={() => chooseUnit("m")}>Metres</button>
              <button type="button" aria-pressed={room.unit === "ft"} onClick={() => chooseUnit("ft")}>Feet</button>
            </div>
            <div className="field-grid">
              {[
                ["width", "Room width"],
                ["depth", "Room depth"],
                ["height", "Ceiling height"],
                ["windowWidth", "Window width"],
                ["windowDrop", "Window drop"],
              ].map(([key, label]) => (
                <label key={key}>
                  <span>{label}</span>
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    inputMode="decimal"
                    value={room[key]}
                    onChange={(event) => patch({ [key]: event.target.value }, true)}
                  />
                </label>
              ))}
            </div>
            <div>
              <p className="eyebrow">Treatment</p>
              <div className="choice-row" role="group" aria-label="Window treatment">
                {treatments.map(([id, label]) => (
                  <button key={id} type="button" aria-pressed={room.treatment === id} onClick={() => patch({ treatment: id }, true)}>{label}</button>
                ))}
              </div>
            </div>
            {curtains && (
              <fieldset>
                <legend className="eyebrow">Curtain hem</legend>
                <div className="choice-row" role="group" aria-label="Curtain hem">
                  <button type="button" aria-pressed={room.hem === "floor"} onClick={() => patch({ hem: "floor" })}>To the floor</button>
                  <button type="button" aria-pressed={room.hem === "sill"} onClick={() => patch({ hem: "sill" })}>To the sill</button>
                </div>
              </fieldset>
            )}
            <div>
              <p className="eyebrow">Cloth</p>
              <div className="swatch-picks">
                {Object.entries(cloths).map(([id, cloth]) => (
                  <label key={id}>
                    {cloth.name}
                    <input type="radio" name="cloth" value={id} checked={room.cloth === id} onChange={() => patch({ cloth: id }, true)} />
                    <i style={{ "--swatch": cloth.swatch }} />
                  </label>
                ))}
              </div>
            </div>
            <label>
              <span>{openLabel}</span>
              <input type="range" min="0" max="100" value={room.closed} onChange={(event) => patch({ closed: Number(event.target.value) })} />
            </label>
            <p className="note">Width is the wall with the window. Depth is how far the room comes toward you. Drop is the glass, not the curtain hem. This room is saved in the browser, so the contact page can send it with your note.</p>
            <Link className="btn" to="/contact#visit">Book a measure of this room</Link>
          </form>
          <div className="planner-stage">
            <canvas ref={canvasRef} aria-label="3D preview of the room and window treatment" />
            <div className="stage-bar">
              <p>{room.summary || "Drag to turn the room. Scroll to come closer."}</p>
              <button className="btn" type="button" onClick={() => viewRef.current?.update(room, true)}>Reset view</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
