import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Work from "./pages/Work.jsx";
import Services from "./pages/Services.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

const Preview = lazy(() => import("./pages/Preview.jsx"));

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/preview" element={<Suspense fallback={<p className="shell" style={{ padding: "4rem 0" }}>Opening the room…</p>}><Preview /></Suspense>} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
}
