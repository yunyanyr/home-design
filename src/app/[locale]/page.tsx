import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Share from "@/components/home/Share";
import BeforeAfter from "@/components/home/BeforeAfter";
import Comments from "@/components/home/Comments";
import Tips from "@/components/home/Tips";
import FAQ from "@/components/home/FAQ";
import Message from "@/components/home/Message";
import Footer from "@/components/home/Footer";
import { get } from "@/lib/ajax";
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Share />
        <BeforeAfter />

        <Tips />
        <Comments />
        <Message />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
