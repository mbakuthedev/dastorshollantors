import { useState } from "react";
import { email, phone, phoneHref, whatsapp } from "../data.js";
import { useRoom } from "../room-context.jsx";

const services = [
  "Curtains",
  "Blinds",
  "Curtains and blinds",
  "Interior decoration",
  "Soft furnishings",
  "A commercial or guest-room scheme",
  "Not sure yet",
];

export default function Contact() {
  const { room } = useRoom();
  const [sent, setSent] = useState(null);

  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const body = [
      `Name: ${name}`,
      `Email: ${data.get("email") || ""}`,
      `Phone: ${data.get("phone") || "Not given"}`,
      `Service: ${data.get("service") || ""}`,
      `Timing: ${data.get("timing") || "Not given"}`,
      "",
      String(data.get("message") || "").trim(),
      "",
      room.summary ? `Preview: ${room.summary}` : "Preview: not used",
    ].join("\n");
    const href = `mailto:${email}?subject=${encodeURIComponent(`Measure request — ${name}`)}&body=${encodeURIComponent(body)}`;
    setSent(href);
  }

  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <p className="eyebrow">Contact</p>
          <h1>Write, or ask us to come and measure.</h1>
          <p className="lead">Tell us the room and what the window is doing wrong. If you have used the preview, that room is attached to the note.</p>
        </div>
      </header>
      <div className="shell" style={{ paddingBottom: "4rem" }}>
        <div className="contact-grid" id="visit">
          <div className="contact-copy">
            <div className="contact-card">
              <p className="eyebrow">Studio</p>
              <h2 style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>The workroom, by appointment</h2>
              <p>Monday to Friday, 9:00–17:30<br />Saturday measures by arrangement</p>
              <p style={{ marginTop: "1rem" }}>
                <a href={phoneHref}>{phone}</a><br />
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a><br />
                <a href={`mailto:${email}`}>{email}</a>
              </p>
              <p style={{ marginTop: "1rem" }}>Share the address in your note. We confirm we can attend before we book the diary.</p>
            </div>
            {room.summary && (
              <div className="contact-card" style={{ marginTop: "0.8rem" }}>
                <p className="eyebrow">From your preview</p>
                <p>{room.summary}</p>
              </div>
            )}
            <div className="faq" aria-label="Common questions">
              <article>
                <h3>Do you come to the house?</h3>
                <p>Yes. Measuring is on site. Samples can be seen at the window or at the workroom.</p>
              </article>
              <article>
                <h3>How long does making take?</h3>
                <p>Most domestic curtains are two to three weeks after the cloth is approved. Blinds are often sooner. A full decorative scheme depends on the rooms.</p>
              </article>
              <article>
                <h3>Can you use fabric I already have?</h3>
                <p>Often, if there is enough cloth and it suits the heading. We check before it is cut.</p>
              </article>
            </div>
          </div>

          {sent ? (
            <div className="thanks" tabIndex={-1} role="status">
              <h2>Ready to send.</h2>
              <p>Your note includes the room from the preview, when you have built one. Open it in your email app and press send. If you would rather talk, call or WhatsApp <a href={phoneHref}>{phone}</a>.</p>
              <p style={{ marginTop: "1.2rem" }}><a className="btn" href={sent}>Open email to send</a></p>
            </div>
          ) : (
            <form className="form-card" onSubmit={submit}>
              <div>
                <p className="eyebrow">Enquiry</p>
                <h2 style={{ fontSize: "2rem" }}>Request a visit</h2>
              </div>
              <div className="form-row">
                <label>
                  <span>Name</span>
                  <input name="name" autoComplete="name" required />
                </label>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>
              </div>
              <div className="form-row">
                <label>
                  <span>Phone</span>
                  <input name="phone" type="tel" autoComplete="tel" />
                </label>
                <label>
                  <span>What do you need?</span>
                  <select name="service" required defaultValue="">
                    <option value="" disabled>Choose one</option>
                    {services.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <label>
                <span>When would you like it finished?</span>
                <input name="timing" autoComplete="off" placeholder="Optional — a month, a season, a date" />
              </label>
              <label>
                <span>The room</span>
                <textarea name="message" required placeholder="The room, the window, and what you want from the light." />
              </label>
              <button className="btn" type="submit">Prepare this note</button>
              <p className="note">We prepare an email for you to send. The preview description is added automatically. Nothing else is stored on a server.</p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
