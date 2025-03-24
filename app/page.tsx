import Balancer from 'react-wrap-balancer';
import Container from "@/components/container/container";
import Section from "@/components/section/section";
import WordPressStarterGrid from '@/components/wordpress-starter/WordPressStarter';

const WordPressStarter = () => {
  return (
    <article className="prose-m-none">
      <h1 className="text-center">
        <Balancer>
          Welcome to the Next.js and WordPress Starter
        </Balancer>
      </h1>
      <WordPressStarterGrid />
    </article>
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