import { Link } from "react-router-dom";
import { Band } from "../components/Layout.jsx";
import { projects, services } from "../data.js";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Blinds · Curtains · Interiors</p>
          <h1>Windows dressed. Rooms that <em>hold together.</em></h1>
          <p className="lead">We cut and sew blinds and curtains in the workroom, then install them so the cloth, the light, and the rest of the room agree. When you want more than the window, we decorate the room around it.</p>
          <div className="hero-actions">
            <Link className="btn" to="/contact#visit">Book a measure</Link>
            <Link className="text-link" to="/preview">Preview a room in 3D</Link>
          </div>
        </div>
        <figure className="hero-figure">
          <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80" alt="A calm living room with layered neutral furnishings and tall windows" width="1600" height="2000" />
          <figcaption>Reference · Layered living room</figcaption>
        </figure>
      </section>

      <div className="swatch-bar">
        <div className="shell">
          <ul className="swatches">
            <li><span style={{ "--swatch": "#e4d3bc" }} /> Oat linen</li>
            <li><span style={{ "--swatch": "#6e2e24" }} /> Clay velvet</li>
            <li><span style={{ "--swatch": "#24312b" }} /> Olive wool</li>
            <li><span style={{ "--swatch": "#f7f4ee" }} /> Chalk sheer</li>
            <li><span style={{ "--swatch": "#1c1915" }} /> Blackout lining</li>
          </ul>
        </div>
      </div>

      <div className="shell">
        <section className="facts" aria-label="How the studio works">
          <article>
            <strong>Made here</strong>
            <p>Curtains and soft furnishings are cut and finished in the workroom, not bought off a rail.</p>
          </article>
          <article>
            <strong>Two to four weeks</strong>
            <p>Most domestic orders, once the cloth is chosen. Whole-room schemes take as long as the scope needs.</p>
          </article>
          <article>
            <strong>Homes and rooms for work</strong>
            <p>Houses, apartments, offices, and small hospitality spaces. We visit by appointment.</p>
          </article>
        </section>

        <section className="section" aria-labelledby="services-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Services</p>
              <h2 id="services-title">What we make and dress</h2>
            </div>
            <p>Start with a window, or hand us the room. The same people measure, make, and fit.</p>
          </div>
          <ol className="service-list">
            {services.slice(0, 4).map((service) => (
              <li key={service.id}>
                <span className="index-no">{service.number}</span>
                <Link to={`/services#${service.id}`}><h3>{service.title}</h3></Link>
                <p>{service.summary}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section" aria-labelledby="work-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">Proof of finish</p>
              <h2 id="work-title">Rooms in the standard we work to</h2>
            </div>
            <p>These are reference rooms, ready to be replaced with photographs from your own installs.</p>
          </div>
          <div className="feature-grid">
            {projects.slice(0, 3).map((project) => (
              <article className="project" key={project.id}>
                <Link className="project-media" to="/work">
                  <img src={project.image} alt={project.alt} width="1200" height="1500" />
                </Link>
                <div className="project-meta">
                  <p className="index-no">{project.index}</p>
                  <h3>{project.title}</h3>
                  <p>{project.text}</p>
                  <ul className="tags">{project.labels.map((label) => <li key={label}>{label}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem" }}><Link className="text-link" to="/work">Open the full work index</Link></p>
        </section>

        <section className="section" aria-labelledby="process-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">The visit</p>
              <h2 id="process-title">Four steps, then a finished opening</h2>
            </div>
          </div>
          <ol className="steps">
            <li><span className="index-no">01</span><strong>Measure</strong><p>We come to the room, record every opening, and look at how the light actually falls.</p></li>
            <li><span className="index-no">02</span><strong>Sample</strong><p>You choose cloth, colour, and heading from samples, at home or at the workroom.</p></li>
            <li><span className="index-no">03</span><strong>Make</strong><p>Blinds and curtains are cut, lined, and finished to those measurements.</p></li>
            <li><span className="index-no">04</span><strong>Fit</strong><p>We install, dress the headings, and stay until the hems and the line are right.</p></li>
          </ol>
        </section>

        <section className="section standards" aria-labelledby="standards-title">
          <div>
            <p className="eyebrow">What you can expect</p>
            <h2 id="standards-title">The work is in the details nobody photographs first.</h2>
          </div>
          <ul className="standard-list">
            <li><span>Headings</span><p>Even fullness, hooks that match the tape, and a pole or track that can carry the weight.</p></li>
            <li><span>Linings</span><p>Named in the quote. Interlining, blackout, or a simple cotton — never assumed.</p></li>
            <li><span>Hems</span><p>Level with the floor or the sill you asked for, including bays and odd returns.</p></li>
            <li><span>The room</span><p>We leave the site tidy. If we are decorating, the paint, furniture, and cloth are decided together.</p></li>
          </ul>
        </section>

        <section className="section" aria-labelledby="preview-title">
          <div className="section-head">
            <div>
              <p className="eyebrow">3D preview</p>
              <h2 id="preview-title">Try the room at your measurements.</h2>
            </div>
            <p>Enter the room and the window. The model stays with you, and the same note is waiting on the contact page.</p>
          </div>
          <Link className="btn" to="/preview">Open the 3D room</Link>
        </section>
      </div>

      <Band
        eyebrow="Next"
        title="Tell us about the room."
        text="A window count and a sentence on the light is enough to start. If you have already used the preview, that room comes with the note."
        to="/contact#visit"
        label="Contact the studio"
      />
    </>
  );
}
