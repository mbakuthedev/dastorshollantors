import { Band } from "../components/Layout.jsx";
import { services } from "../data.js";

export default function Services() {
  return (
    <>
      <header className="page-hero">
        <div className="shell">
          <p className="eyebrow">Services</p>
          <h1>Cloth, light, and the room around them.</h1>
          <p className="lead">We price after measuring. Windows are rarely the size on the drawing, and a fair price follows the cloth, the heading, the lining, and the number of openings.</p>
        </div>
      </header>
      <div className="shell">
        {services.map((service) => (
          <article className="service-block" id={service.id} key={service.id}>
            <div className="service-copy">
              <p className="eyebrow">{service.number}</p>
              <h2>{service.title}</h2>
              <p>{service.body}</p>
              <ul className="ticks">{service.points.map((point) => <li key={point}>{point}</li>)}</ul>
            </div>
            <figure>
              <img src={service.image} alt={service.alt} width="1400" height="1120" loading="lazy" />
            </figure>
          </article>
        ))}
        <section className="section" aria-labelledby="measure-title">
          <div className="measure-panel">
            <div>
              <p className="eyebrow">On a visit</p>
              <h2 id="measure-title">What we write down</h2>
              <p>A quote that skips these is a guess. We would rather measure twice and sew once.</p>
            </div>
            <ul className="ticks">
              <li>Width, drop, and whether you want the hem at the floor or the sill</li>
              <li>Which side the cloth should stack, and what the door swing does</li>
              <li>Radiators, handles, tiles, and anything the blind must clear</li>
              <li>Which way the light comes, and when you need the room dark</li>
              <li>Poles and tracks already there, and whether they can carry new cloth</li>
            </ul>
          </div>
        </section>
      </div>
      <Band
        eyebrow="A straight answer"
        title="Not sure if it is a blind or a curtain?"
        text="Say how you use the room. Or build it in the preview first, and send that with your note."
        to="/preview"
        label="Open the 3D room"
      />
    </>
  );
}
