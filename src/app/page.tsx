import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionTitle } from "@/components/SectionTitle";
import { Benefits } from "@/components/Benefits";
import { Video } from "@/components/Video";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Cta } from "@/components/Cta";
import { Pricing } from "@/components/Pricing";


import { benefitOne, benefitTwo } from "@/components/data";
export default function Home() {
  return (
    <Container>
      <Hero />
      <SectionTitle
        preTitle="회사소개"
        title="GKClean을 선택해야 하는 이유"
      >
        GKClean은 헬스장, 필라테스, 병원, 호텔 등 다양한 업종의 매장을 대상으로
        정시 수거와 전문 세탁 공정을 제공하는 B2B 세탁 서비스입니다.
        안정적인 운영을 돕는 신뢰받는 세탁 파트너로, 매장의 시간을 절약하고
        위생적인 환경을 유지할 수 있도록 지원합니다.
      </SectionTitle>


      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      {/* Pricing Section */}
<Pricing  />
{/*
      <SectionTitle
        preTitle="Watch a video"
        title="Learn how to fullfil your needs"
      >
        This section is to highlight a promo or demo video of your product.
        Analysts says a landing page with video has 3% more conversion rate. So,
        don&apos;t forget to add one. Just like this.
      </SectionTitle>

      <Video videoId="fZ0D0cnR88E" />

      <SectionTitle
        preTitle="Testimonials"
        title="Here's what our customers said"
      >
        Testimonials is a great way to increase the brand trust and awareness.
        Use this section to highlight your popular customers.
      </SectionTitle>

      <Testimonials />

      <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
        Answer your customers possible questions here, it will increase the
        conversion rate as well as support or chat requests.
      </SectionTitle>
*/}
      {/*     <Faq />*/}
      {/* <Cta />*/}
    </Container>
  );
}
