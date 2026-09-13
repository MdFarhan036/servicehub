import HeroSection from "../components/home/HeroSection";
import FeaturedServices from "../components/home/FeaturedServices";
import TrustBadges from "../components/home/TrustBadges";
import Testimonials from "../components/home/Testimonials";
import HowItWorks from "../components/home/HowItWorks";
import FAQSection from "../components/home/FAQSection";
import CommentSection from "../components/home/CommentSection";
import "./home.css";
import HomePopularServices from "../components/popular/HomePopularServices";
import HomeDailyDeals from "../components/daily-deals/HomeDailyDeals";
import AllCategoryServices from "../components/all-categories/AllCategoryServices";
import HomeCategories from "../components/categories/HomeCategories";
export default function Home() {
  return (
    <>
      <HeroSection />
      <HomeCategories />
      <HomePopularServices />
      <HomeDailyDeals />
      <AllCategoryServices />
      <TrustBadges />
      <Testimonials />
      <HowItWorks />
      <FAQSection />
      <CommentSection />
    </>
  );
}