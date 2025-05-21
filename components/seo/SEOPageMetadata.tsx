import Head from "next/head";

interface SEOPageMetadataProps {
  title: string;
  description?: string;
  url: string;
  image?: string;
  type?: "website" | "article" | "tag" | "author";
  locale?: string;
  siteName?: string;
  tags?: string[];
  publishedTime?: string;
  modifiedTime?: string;
}

const ROOT_URL = process.env.WORDPRESS_INSTANCE_BASE_URL;
const pageImage = ROOT_URL + "/assets/favicons/NextJS-Headless-WordPress-Demo-Logo.jpg";

export const SEOPageMetadata = ({ 
  title,
  description,
  url,
  image,
  type = "website",
  locale = "bg-BG",
  siteName = "Демонстративно приложение на WordPress като система за управление на съдържанието, базирана на ,,Headless’’ архитектурата",
  tags = [],
  publishedTime,
  modifiedTime,
}: SEOPageMetadataProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta name="description" content={description} />
      <meta name="robots" content="follow, index" />

      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={locale} />

      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}

      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {type === "article" && tags.length > 0 && (
        tags.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />        
        ))
      )}

      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-icon-180x180.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png" />  

      <meta name="msapplication-TileColor" content="#18181B" />
      <meta name="theme-color" content="#ffffff"/>

      <link rel="canonical" href={url} />
    </Head>
  );
}

export default SEOPageMetadata;