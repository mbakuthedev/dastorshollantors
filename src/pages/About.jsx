import { Band } from "../components/Layout.jsx";

export default function About() {
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <p className="eyebrow">The studio</p>
          <h1>A workroom that also hangs the work.</h1>
        </div>
      </header>
      <div className="shell">
        <section className="about-grid" style={{ paddingBottom: "3rem" }}>
          <div className="about-copy">
            <p className="lead">dastorshollantors makes blinds and curtains, and decorates the rooms they hang in. Measuring, cutting, and fitting stay with us, so a heading decided on paper is the heading you live with.</p>
            <p>People usually arrive with one difficult window: a bay that pools, a bedroom that is never quite dark, an office that glares by lunch. Often that window is the start of a larger job — colour, a chair, the way the furniture sits once the cloth has somewhere to stack.</p>
            <p>We work by appointment, for private rooms and for places that have to keep operating while we fit. If you already own a cloth you love, bring it. If it is right for the opening, we will sew it. If it is not, we will say so before anyone cuts.</p>
          </div>
          <figure style={{ margin: 0 }}>
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80" alt="A pale, carefully arranged interior with a chair and soft daylight" width="1200" height="1500" />
          </figure>
        </section>
        <section className="section" aria-labelledby="principles-title" style={{ paddingTop: 0 }}>
          <p className="eyebrow">How we decide</p>
          <h2 id="principles-title">Three rules in the workroom</h2>
          <div className="principles">
            <article className="principle">
              <h3>Measure the opening</h3>
              <p>Not the drawing, and not last time’s notes. Tape on the day, written down, checked before cloth is cut.</p>
            </article>
            <article className="principle">
              <h3>Choose cloth in that light</h3>
              <p>A sample at the window beats a sample under a shop lamp. Sheer, wool, velvet, and lining are picked for the room’s actual day.</p>
            </article>
            <article className="principle">
              <h3>Install is part of making</h3>
              <p>A curtain is unfinished on the table. We fit it, dress it, and adjust it until the line is the one we promised.</p>
            </article>
          </div>
        </section>
        <section className="section standards" aria-labelledby="clients-title">
          <div>
            <p className="eyebrow">Who it is for</p>
            <h2 id="clients-title">Homes first. Rooms that work, as well.</h2>
          </div>
          <ul className="standard-list">
            <li><span>Homes</span><p>Living rooms, bedrooms, kitchens, and the one window that has annoyed you for years.</p></li>
            <li><span>Work</span><p>Offices that need glare gone and a finish that still looks deliberate in a photograph.</p></li>
            <li><span>Guest rooms</span><p>Small hotels and rentals where blackout and a repeated detail matter more than a one-off flourish.</p></li>
          </ul>
        </section>
      </div>
      <Band
        eyebrow="Visit"
        title="Come with the awkward window."
        text="If you can, bring a photo and the rough size. If you cannot, we will measure it ourselves."
        to="/contact#visit"
        label="Write to the studio"
      />
    </>
  );
}
