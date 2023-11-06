import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Header } from "~/components/layout/Header";
import { UserPresentator } from "~/components/layout/UserPresentator";
import { Link } from "~/components/ui/buttons/Link";
import { api } from "~/utils";

const PrivacyPolicy = () => {
  const defaultUserData = useUser();
  const { data: user } = api.users.get.useQuery();

  const imageSrc = user?.ownImage || defaultUserData.user?.imageUrl;

  return (
    <>
      <Head>
        <title>Privacy Policy - Careerpilot</title>
      </Head>
      <Header className="flex flex-col gap-3 pb-3">
        {imageSrc && (
          <UserPresentator
            name={user?.ownName || defaultUserData.user?.fullName || ""}
            src={imageSrc}
          />
        )}
        <Link to="/vacancies" className="sm !justify-start gap-3 clr-blue">
          <AiOutlineArrowLeft /> Back to vacancies
        </Link>
      </Header>
      <main className="container flex flex-col gap-3 pt-5">
        <h1>Privacy Policy for Careerpilot </h1>
        <small>Last Updated: Tue Nov 07 2023</small>
        <h3>Introduction</h3>
        <div>
          Welcome to the privacy policy for Careerpilot (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;). Our service, accessible from
          <a href="https://chirp-mu-rust-60.vercel.app" className="clr-blue">
            {" "}
            https://chirp-mu-rust-60.vercel.app
          </a>
          , is committed to protecting your privacy and handling your personal
          data transparently. This policy outlines our practices regarding data
          collection, usage, and sharing.
        </div>
        <h3>Data Collection </h3>
        We collect information that you provide to us directly, such as when you
        create an account, use our services, or communicate with us. This may
        include but is not limited to your name, email address, and any other
        information you choose to provide.
        <h3>Data Usage</h3>
        The data we collect is used to provide, maintain, and improve our
        services, to understand how you use our services, and to personalize
        your experience. We also use the information to communicate with you,
        for example, informing you about updates to our service or customer
        support.
        <h3>Data Sharing</h3>
        We may share your data with third parties under the following
        circumstances: Service Providers: We may share your data with
        third-party companies that perform services on our behalf, such as
        hosting, data analysis, payment processing, order fulfillment,
        information technology and related infrastructure, customer service,
        email delivery, and auditing services. Legal Requirements: If required
        to do so by law or in response to valid requests by public authorities
        (e.g., a court or a government agency). Business Transfers: As we
        develop our business, we might sell or buy businesses or assets. In the
        event of a corporate sale, merger, reorganization, dissolution, or
        similar event, personal data may be part of the transferred assets.
        <h3>Third-Party Privacy Policies</h3>
        This privacy policy does not apply to the practices of companies that we
        do not own or control or to people that we do not employ or manage. Our
        service may include links to third-party websites or services that are
        not operated by us. If you click on a third-party link, you will be
        directed to that third party&apos;s site. We strongly advise you to
        review the privacy policy of every site you visit.
        <h3>Your Rights</h3>
        You have certain rights regarding the personal information we hold about
        you. These may include the rights to access, modify, or delete the
        personal information we have about you.
        <h3>Changes to This Privacy Policy</h3>
        We may update our privacy policy from time to time. We will notify you
        of any changes by posting the new privacy policy on this page and
        updating the &quot;Last Updated&quot; date.
        <h3>Contact Us</h3>
        <div>
          If you have any questions about this privacy policy, please contact us
          at{" "}
          <a href="mailto:yegorarndt@gmail.com" className="inline clr-blue">
            yegorarndt@gmail.com
          </a>
          .
        </div>
      </main>
      <div role="spacer" className="h-20"></div>
    </>
  );
};

export default PrivacyPolicy;
