import { useEffect, useRef, useState } from "react";
import { Band } from "../components/Layout.jsx";
import { projects } from "../data.js";

const filters = [
  ["all", "All"],
  ["curtains", "Curtains"],
  ["blinds", "Blinds"],
  ["interiors", "Interiors"],
  ["commercial", "Commercial"],
];

export default function Work() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);
  const dialog = useRef(null);
  const visible = projects.filter((project) => filter === "all" || project.tags.includes(filter));

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (active && !node.open) node.showModal();
    if (!active && node.open) node.close();
  }, [active]);

  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <p className="eyebrow">Proof of work</p>
          <h1>The finish, frame by frame.</h1>
          <p className="lead">Each card is a reference for a treatment the workroom is set up to make. Swap the photograph and the note when a real install is ready — the frame stays the same. Open any image to look closer.</p>
          <div className="filters" role="group" aria-label="Filter work">
            {filters.map(([id, label]) => (
              <button key={id} className="filter" type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
            ))}
          </div>
        </div>
      </header>
      <div className="shell" style={{ paddingBottom: "4rem" }}>
        <div className="work-grid">
          {visible.map((project) => (
            <article className="project" key={project.id} id={project.id}>
              <button className="project-media" type="button" onClick={() => setActive(project)}>
                <img src={project.image} alt={project.alt} width="1000" height="1250" loading="lazy" />
              </button>
              <div className="project-meta">
                <p className="index-no">{project.index} · {project.kind}</p>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <ul className="tags">{project.labels.map((label) => <li key={label}>{label}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
        {visible.length === 0 && <p className="empty-note">Nothing in this group yet. Choose another filter, or send a room that should start it.</p>}
      </div>
      <Band
        eyebrow="Your rooms"
        title="The next frame should be yours."
        text="Send a photo of the window as it is. We will say whether it wants a blind, a curtain, or a fuller scheme."
        to="/contact#visit"
        label="Send a room"
      />
      <dialog id="lightbox" ref={dialog} aria-label="Enlarged room" onClose={() => setActive(null)} onClick={(event) => { if (event.target === dialog.current) setActive(null); }}>
        {active && (
          <div className="lightbox-frame">
            <img src={active.image} alt={active.alt} />
            <div className="lightbox-bar">
              <p>{active.caption}</p>
              <button className="lightbox-close" type="button" onClick={() => setActive(null)}>Close</button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
