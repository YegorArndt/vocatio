import Head from "next/head";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Header } from "~/components/layout/Header";
import { Link } from "~/components/ui/buttons/Link";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Careerpilot</title>
      </Head>
      <Header className="py-5">
        <Link to="/vacancies" className="gap-3 clr-blue">
          <AiOutlineArrowLeft />
          Dashboard
        </Link>
      </Header>
      <main className="container mx-auto my-6 rounded-md bg-white p-6 shadow-xl clr-secondary">
        <h1 className="text-xl font-semibold text-gray-900">
          Privacy Policy - Careerpilot
        </h1>
        <p className="mt-2 text-gray-600">Effective date: Tue 7 Nov 2023</p>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">1. Introduction</h2>
          <p>
            Careerpilot (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
            operates the website accessible from{" "}
            <a href="https://chirp-mu-rust-60.vercel.app" className="clr-blue">
              https://chirp-mu-rust-60.vercel.app
            </a>{" "}
            (the &quot;Service&quot;). We are committed to protecting the
            privacy of our users (&quot;user&quot;, &quot;you&quot;, or
            &quot;your&quot;). This Privacy Policy explains how we collect, use,
            disclose, and safeguard your information when you visit our Service.
            By using the Service, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </section>

        <section className="my-4">
          <h2 className="font-semibold text-gray-900">
            2. Information Collection and Use
          </h2>
          <p>
            We collect various types of information for various purposes to
            provide and improve our Service to you.
          </p>
        </section>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            3. Types of Data Collected
          </h2>
          <h3 className="text-md font-semibold text-gray-900">Personal Data</h3>
          <p>
            While using our Service, we may ask you to provide us with certain
            personally identifiable information that can be used to contact or
            identify you (&quot;Personal Data&quot;). This may include, but is
            not limited to:
          </p>
          <ul className="list-disc pl-6">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Cookies and Usage Data</li>
          </ul>
          <p>
            We use your Personal Data to provide and improve the Service. By
            using the Service, you agree to the collection and use of
            information in accordance with this policy.
          </p>
        </section>

        <section className="my-4">
          <h3 className="text-md font-semibold text-gray-900">Usage Data</h3>
          <p>
            We may also collect information on how the Service is accessed and
            used (&quot;Usage Data&quot;). This Usage Data may include
            information such as your computer&apos;s Internet Protocol address
            (e.g., IPaddress, browser type, browser version, the pages of our
            Service that you visit, the time and date of your visit, the time
            spent on those pages, and other diagnostic data.
          </p>
        </section>
        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            4. Data Use Compliance
          </h2>
          <p>
            Our Service includes a Google Chrome extension that interacts with
            LinkedIn to scan and store vacancies. In full compliance with
            Google's User Data Privacy policy, particularly the Limited Use of
            User Data policy, we ensure the following:
          </p>
          <ul className="list-disc pl-6">
            <li>
              We only collect data that directly supports the extension's single
              purpose of scanning and storing job vacancies and generating
              tailored CVs.
            </li>
            <li>User consent is obtained before any data collection occurs.</li>
            <li>
              A prominent disclosure of our data collection practices is
              provided in our Privacy Policy and within the Chrome Web Store
              listing.
            </li>
            <li>
              Options for user data opt-out and an "offline mode" are available
              within the extension's settings.
            </li>
          </ul>
        </section>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            5. Data Collection Consent
          </h2>
          <p>
            Before data collection begins, we will inform you through a clear
            and visible notice within the extension, detailing what data is
            being collected and how it will be used. You will have the
            opportunity to consent to this collection or opt-out entirely.
          </p>
          <p>
            By utilizing our Service, you acknowledge that you have read these
            terms and consent to the privacy practices described herein.
          </p>
        </section>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            6. Data Handling and Security
          </h2>
          <p>
            The data collected via the Chrome extension, our web application,
            and any associated services, including authentication through Clerk
            and database services through Supabase, are subject to rigorous
            security measures to ensure the confidentiality, integrity, and
            availability of your personal information. Clerk's privacy policy
            can be found{" "}
            <a
              href="https://clerk.com/privacy?utm_source=www.google.com&utm_medium=referral&utm_campaign=none"
              className="clr-blue"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            . Supabase's privacy policy can be found{" "}
            <a
              href="https://supabase.com/privacy"
              className="clr-blue"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
          <p>
            We implement a variety of security measures, including encryption
            and authentication tools, to maintain the safety of your personal
            data.
          </p>
        </section>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            7. Hosting and Data Transfer
          </h2>
          <p>
            Our Service is hosted by Vercel, which provides us with the online
            platform that allows us to offer our Service to you. Your data may
            be stored through Vercel's data storage, databases, and general
            applications. They store your data on secure servers behind a
            firewall.
          </p>
          Vercel's privacy policy can be found{" "}
          <a
            href="https://vercel.com/legal/privacy-policy"
            className="clr-blue"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </section>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            8. Compliance with Google's User Data Policy
          </h2>
          <p>
            We adhere to all the requirements set forth by Google's User Data
            Policy, ensuring that the collection and use of your data via our
            Google Chrome extension are transparent, secure, and within the
            scope of the extension's purpose.
          </p>
          <p>
            For any additional questions or concerns about our privacy practices
            or the handling of your personal data, please contact us at{" "}
            <a href="mailto:yegorarndt@gmail.com" className="clr-blue">
              yegorarndt@gmail.com
            </a>
            .
          </p>
        </section>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            9. Changes to This Privacy Policy
          </h2>
          <p>
            We reserve the right to modify this privacy policy at any time, so
            please review it frequently. Changes and clarifications will take
            effect immediately upon their posting on the website. If we make
            material changes to this policy, we will notify you here that it has
            been updated, so that you are aware of what information we collect,
            how we use it, and under what circumstances, if any, we use and/or
            disclose it.
          </p>
        </section>

        <section className="my-4">
          <h2 className="mb-2 font-semibold text-gray-900">
            10. Consent Withdrawal
          </h2>
          <p>
            You have the right to withdraw your consent at any time. To do so,
            please adjust your preferences in the extension's settings or
            contact us directly.
          </p>
        </section>

        <footer className="my-8 text-center">
          <p className="text-gray-600">Last updated: Tue 7 Nov 2023</p>
        </footer>
      </main>
    </>
  );
};

export default PrivacyPolicy;
