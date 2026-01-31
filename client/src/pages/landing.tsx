import Head from 'next/head';
import { Home } from '@/modules/home/home';

export default function Landing() {
  return (
    <>
      <Head>
        <title>PROJECT_NAME - Build your SaaS faster</title>
        <meta
          name="description"
          content="A production-ready template with authentication, payments, and everything you need to launch your next project."
        />
        <meta property="og:title" content="PROJECT_NAME" />
        <meta property="og:description" content="Build your SaaS faster with a modern stack" />
        <meta property="og:type" content="website" />
      </Head>
      <Home />
    </>
  );
}
