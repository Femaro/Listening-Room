"use client";

import useHomePage from "@/hooks/useHomePage";
import LoadingScreen from "@/components/landing/LoadingScreen";
import Header from "@/components/landing/Header";
import GlobalAccessibilityBanner from "@/components/landing/GlobalAccessibilityBanner";
import HeroSection from "@/components/landing/HeroSection";
import InspirationalSlides from "@/components/landing/InspirationalSlides";
import GlobalFeatures from "@/components/landing/GlobalFeatures";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ImpactStats from "@/components/landing/ImpactStats";
import CrisisNotice from "@/components/landing/CrisisNotice";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Listening Room - Global Mental Health Support & Crisis Chat 24/7",
  description:
    "Connect instantly with trained volunteers worldwide for free, Global mental health support. Available 24/7 across 40+ countries with specialized volunteer support. No judgment, complete privacy.",
  keywords:
    "mental health support, anonymous chat, crisis help, suicide prevention, emotional support, depression help, anxiety support, free counseling, mental health crisis, confidential therapy, peer support, crisis intervention, online therapy, mental wellness, listening volunteers, global mental health, Africa mental health, Europe mental health, Asia mental health, specialized volunteers, marital advisor, life coach, motivational speaker",
  openGraph: {
    title: "Listening Room - Global Mental Health Support",
    description:
      "Connect instantly with trained volunteers worldwide for free, anonymous mental health support. Available 24/7 across 40+ countries with specialized volunteer support.",
  },
};

export default function Homepage() {
  const {
    user,
    userLoading,
    selectedLocation,
    currencyInfo,
    isMatching,
    handleLocationSelect,
    handleStartChat,
  } = useHomePage();

  if (userLoading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <LoadingScreen message="Redirecting to dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <GlobalAccessibilityBanner />
      <HeroSection
        selectedLocation={selectedLocation}
        currencyInfo={currencyInfo}
        onLocationSelect={handleLocationSelect}
        onStartChat={handleStartChat}
        isMatching={isMatching}
      />
      <InspirationalSlides />
      <GlobalFeatures />
      <WhyChooseUs />
      <ImpactStats />
      <CrisisNotice />
      <Footer />
    </div>
  );
}