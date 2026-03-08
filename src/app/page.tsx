import Header from "../components/Header";
import Hero from "../components/Hero";
import FoodMenu from "../components/FoodMenu";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="text-zinc-800">
      <Header />
      <Hero />
      <FoodMenu />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
