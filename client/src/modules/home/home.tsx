import { Footer } from '@/components/footer/footer';
import { Header } from '@/components/header/header';
import { BlogSection } from './blog-section';
import { ComparisonSection } from './comparison-section';
import { CTASection } from './cta-section';
import { FeaturesSection } from './features-section';
import { HeroSection } from './hero-section';
import { ActionSection } from './action-section';
import { FAQSection } from './faq-section';
import SecuritySection from './security-section/page';
import { ShowcaseSection } from './showcase-section';
import { TestimonialsSection } from './testimonials-section';

export function Home() {
  return (
    <main className="marketing overflow-hidden">
      <Header />
      <HeroSection />
      <ShowcaseSection />
      <SecuritySection />
      <TestimonialsSection />
      <FeaturesSection />
      <ComparisonSection />
      <ActionSection />
      <FAQSection />
      <BlogSection />
      <CTASection />
      <Footer />
    </main>
  );
}
