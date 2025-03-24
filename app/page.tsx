import { File, Pen, Tag, Boxes, User, Folder } from 'lucide-react';
import Balancer from 'react-wrap-balancer';
import Link from 'next/link';
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