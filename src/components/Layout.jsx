import React from "react";
import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import TrustedBy from "./TrustedBy.jsx";
import About from "./About.jsx";
import Footer from "./Footer.jsx";
import WhyTrustUs from "./WhyTrustUs.jsx";
import MobileApp from "./MobileApp.jsx";
// import ChatSupport from "./ChatSupport.jsx";
// import TawkToWidget from "./TawkToWidget.jsx";
import CryptoTracker from "./CryptoTracker.jsx";
import TrumpApproval from "./TrumpApproval.jsx";
import CustomerTestimonials from "./CustomerTestimonials.jsx";
import SmartsuppChat from "./SmartsuppChat.jsx";

export default function Layout() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustedBy />
      {/* <TrumpApproval /> */}
      <WhyTrustUs />
      <About />
      <CryptoTracker />
      <CustomerTestimonials />
      <MobileApp />
      {/* <SmartsuppChat /> */}
      <Footer />
    </>
  );
}
