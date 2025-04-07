import Balancer from 'react-wrap-balancer';
import Container from "@/components/container/container";
import Section from "@/components/section/section";
import WordPressStarterGrid from '@/components/wordpress-starter/WordPressStarter';

const WordPressStarter = () => {
  return (
    <div className="space y-6">
      <h1 className="text-left text-2xl">
        <Balancer>
          Демонстративно приложение, разработено със Next.js и WordPress
        </Balancer>
      </h1>
      <p className="mt-6 mb-9 text-justify">
        Приложението съдържа документирани курсови работи на студенти от бакалавърските програми Софтуерно инженерство
        (втори курс, редовно обучение) и Информационно брокерство и дигитални медии (трети курс, редовно обучение) по учебните дисциплини
        Системи за управление на съдържанието и Софтуерна и медийна ергономия към Факултет „Математика и информатика“,
        Великотърновски университет „Св. св. Кирил и Методий“.
      </p>
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