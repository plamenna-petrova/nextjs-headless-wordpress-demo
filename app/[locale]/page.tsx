import { useTranslations } from 'next-intl';
import Balancer from 'react-wrap-balancer';
import Container from "@/components/container/container";
import Section from "@/components/section/section";
import WordPressStarterGrid from '@/components/wordpress-starter/WordPressStarter';

const WordPressStarter = () => {
  const t = useTranslations("WordPressStarter");

  return (
    <div className="space y-6">
      <h1 className="text-left text-2xl">
        <Balancer>{t('demoApplicationTitle')}</Balancer>
      </h1>
      <p className="mt-6 mb-9 text-left sm:text-justify">{t('demoApplicationDescription')}</p>
      <WordPressStarterGrid />
    </div>
  )
}

const Home = () => {
  return (
    <Section>
      <Container>
        <WordPressStarter />
      </Container>
    </Section>
  );
}

export default Home;