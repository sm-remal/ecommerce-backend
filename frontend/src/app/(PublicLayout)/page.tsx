import Contact from "@/components/Contact/Contact";
import FAQ from "@/components/FAQ/FAQ";
import BestSeller from "@/components/Home/BestSeller/BestSeller";
import Brands from "@/components/Home/Brands/Brands";
import Categories from "@/components/Home/Categories/Categories";
import DiscountProducts from "@/components/Home/DiscountProducts/DiscountProducts";
import HeroBanner from "@/components/Home/HeroBanner";
import NewArrivals from "@/components/Home/NewArrivals/NewArrivals";
import TrendingProducts from "@/components/Home/TrendingProducts/TrendingProducts";
import Testimonials from "@/components/Testimonials/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <div>
        <HeroBanner></HeroBanner>
        <Categories></Categories>
        <NewArrivals></NewArrivals>
        <BestSeller></BestSeller>
        <DiscountProducts></DiscountProducts>
        <TrendingProducts></TrendingProducts>
        <Brands></Brands>
        <WhyChooseUs></WhyChooseUs>
        <Testimonials></Testimonials>
        <FAQ></FAQ>
        <Contact></Contact>
      </div>
    </div>
  );
}
