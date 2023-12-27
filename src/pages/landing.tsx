import cn from "classnames";
import { BlurImage, Chip } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
import { Link } from "~/components/ui/buttons/Link";
import { Arrow, Gpt, Linkedin, PerkCheck } from "~/icons";
import { TbDatabaseImport, TbSum } from "react-icons/tb";
import { LuChrome } from "react-icons/lu";
import { CiLinkedin } from "react-icons/ci";
import { BsArrowsCollapse } from "react-icons/bs";
import { MdFormatListBulleted } from "react-icons/md";
import { HiLanguage } from "react-icons/hi2";
import { PiInfinity } from "react-icons/pi";
import { RxLetterCaseCapitalize } from "react-icons/rx";
import { VscOpenPreview } from "react-icons/vsc";
import { GoRepoTemplate } from "react-icons/go";

const Landing = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center px-4 lg:px-6">
        <Link className="flex-center gap-2" to="#">
          <MountainIcon className="h-6 w-6" />
          <span>Vocatio</span>
          <Chip text="Beta" className="bg-sky px-3" />
          <span className="sr-only">Vocatio</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          {["features", "pricing", "contact"].map((link) => (
            <Link
              key={link}
              text={link}
              className="text-sm font-medium underline-offset-4 first-letter:capitalize hover:underline"
              to={`#${link}`}
            />
          ))}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full border-y pb-20 pt-12 md:pt-24 lg:pt-32">
          <div className="container mx-auto grid grid-cols-1 gap-11 lg:grid-cols-2">
            <div className="flex flex-col items-center gap-2  text-center lg:items-start lg:text-start">
              <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                The first AI powered CV Tailor in one click.
              </h1>
              <p className="md:text-xl">
                Beautifully designed resumes tailored to your desired vacancy.
              </p>
              <Link
                text="Generate my CV"
                className="primary sm w-1/3 min-w-[150px] whitespace-nowrap"
                to="/login"
                newTab
              />
            </div>
            <div className="lg:card-grid hidden">
              {["venusaur", "raichu", "charizard"].map((cvName) => (
                <BlurImage
                  src={`/${cvName}.png`}
                  height={300}
                  width={300}
                  alt={cvName}
                  className={cn(
                    "transform cursor-pointer transition hover:-translate-y-1 motion-reduce:transition-none"
                  )}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="flex-center gap-5 bg-card px-5 py-20 text-[1rem]">
          <Gpt className="shrink-0 rounded-full bg-black p-2" fontSize={40} />
          The AI will transform your CV to match the vacancy you are applying
          to.
          <br /> It will highlight the skills that are relevant to the vacancy
          and will rephrase your CV to match the vacancy description. <br />
          It will only use your own data to generate the CV.
        </section>
        <section className="w-full border pb-20 pt-12 md:pt-24 lg:pt-32">
          <div className="container flex flex-col gap-20">
            <h2 className="flex-center text-3xl font-bold tracking-tighter sm:text-5xl">
              How it works in 4 steps
            </h2>
            <div className="flex flex-col gap-5">
              {[
                {
                  title: (
                    <Link
                      to="/my-data"
                      text="1. Install Vocatio Chrome Extension - 20 seconds"
                      frontIcon={<LuChrome />}
                      newTab
                      className="flex-y clr-blue"
                    />
                  ),
                  description:
                    "Chrome extension is the crucial part of the CV generation process.",
                },
                {
                  title: (
                    <Link
                      to="/preferences/my-data"
                      text="2. Import your data - 3 minutes"
                      frontIcon={<TbDatabaseImport />}
                      newTab
                      className="flex-y clr-blue"
                    />
                  ),
                  description:
                    "Instead of manually typing, just import your CV material from a source of your liking. A variety of sources are supported.",
                },

                {
                  title: (
                    <span className="flex-y gap-2">
                      <CiLinkedin />
                      3. Choose any vacancy on your favorite platform
                    </span>
                  ),
                  description:
                    'Browse as you normally would. When you like a vacancy, just click ✨ "Generate CV" in the extension.',
                },
                {
                  title: (
                    <span className="flex-y gap-2">
                      <Gpt />
                      4. Review the generated CV
                    </span>
                  ),
                  description:
                    "You will be redirected to the CV builder where the generated CV can be edited or a pdf can be downloaded immediately. Yes, it's that easy.",
                },
              ].map(({ title, description }) => (
                <div
                  key={description}
                  className="grid items-center gap-5 px-11 md:grid-cols-2"
                >
                  <span className="text-[1.1rem]">{title}</span>
                  <span className="text-[1.1rem]">{description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="w-full border py-12 md:py-24 lg:py-32 "
          id="features"
        >
          <div className="container space-y-12 px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                We focus only on the features that matter to you
              </h2>
              <p className="md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Vocatio gives you all the tools you need to craft the perfect
                resume.
              </p>
            </div>
            <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
              {[
                {
                  icon: <BsArrowsCollapse />,
                  title: "Resume condenser",
                  description:
                    "Condense your entire CV in just one click if it goes over the 1-2 page limit. You can condense texts, images, and spacing.",
                },
                {
                  icon: <MdFormatListBulleted />,
                  title: "AI bullet points converter",
                  description:
                    "Convert your employment histories into bullet points with a single click.",
                },
                {
                  icon: <HiLanguage />,
                  title: "Multi language support",
                  description:
                    "Generate CVs for vacancies in different languages. The AI will automatically translate your CVs.",
                },
                {
                  icon: <GoRepoTemplate className="mr-2" />,
                  title: "Free design templates",
                  description:
                    "Choose between a variety of design templates. Seamlessly review how your data looks on different templates.",
                },
                {
                  icon: <PiInfinity className="mr-2" />,
                  title: "Endless employment histories",
                  description:
                    "That's a big deal. Being able to describe your employment histories in every possible detail you can remember poses a huge advantage over a static CV. Describe it only once in your life and the AI will always find what's relevant for the vacancy and leave out the rest.",
                },
                {
                  icon: <TbSum />,
                  title: "AI text summarizer",
                  description:
                    "Our AI summarizer will condense a text of your choosing when your CV gets too big.",
                },
                {
                  icon: <RxLetterCaseCapitalize />,
                  title: "AI rephrasing",
                  description:
                    "Have the AI rephrase your texts as much as you want until it gets to your liking.",
                },
                {
                  icon: <Gpt />,
                  title: "Custom AI commands",
                  description:
                    "Write your own commands for the part of CV of your choosing. The AI will know the context.",
                },
                {
                  icon: <span className="mr-1">🦾</span>,
                  title: "The most powerful CV editor",
                  description:
                    "Our CV editor is the most powerful on the market: the components used to craft a CV are smart enough to know exactly where they should be on the CV when you rearrange elements.",
                },
                {
                  icon: <Linkedin />,
                  title: "Update data when needed",
                  description:
                    "Vocatio values your time and offers you tools to import your data instead of manual typing or copying.",
                },
                {
                  icon: <VscOpenPreview />,
                  title: "Change viewer",
                  description:
                    "See what exactly changed between two versions of your CV.",
                },
              ].map(({ icon, title, description }) => (
                <div key={title} className="grid gap-1 rounded-md border p-4">
                  <h3 className="flex-y gap-2 text-lg font-bold">
                    {icon}
                    {title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section
          className="bg-gray-100 w-full py-12 md:py-24 lg:py-32"
          id="pricing"
        >
          <div className="container grid items-center justify-center gap-4 px-4 md:px-6">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Pricing
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mx-auto md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Ready to take your application process to the next level?
              </p>
            </div>
            <div className="mt-[2rem] grid gap-8 md:grid-cols-2">
              {[
                {
                  name: "Free",
                  price: 0,
                  features: [
                    "Skills highlighting",
                    "Access to all CV builder functionalities except AI features",
                    "Access to all design templates",
                  ],
                },
                {
                  name: "☕️ Coffee (applies to the next 100 CVs)",
                  price: 5,
                  features: [
                    "All features from Free",
                    "Professional summary & employment history generation",
                    "Access to AI tools",
                    "Multiple languages support",
                  ],
                },
              ].map(({ name, price, features }, index) => (
                <div
                  key={name}
                  className="flex flex-col gap-4 rounded-md border p-9"
                >
                  <span className="flex-y gap-2 text-[18px]">{name}</span>
                  <span className="text-[2rem] font-bold">
                    {"$"}
                    {price}
                  </span>
                  <div className="flex flex-col gap-2">
                    {features.map((feature) => (
                      <span className="flex-y gap-2">
                        <PerkCheck />
                        {feature}
                      </span>
                    ))}
                  </div>
                  {index > 0 && (
                    <Button className="primary lg strong-white-box-shadow !flex-between mt-3">
                      Upgrade now
                      <Arrow />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-gray-500 dark:text-gray-400 text-xs">
          © SaaS Inc. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" to="#">
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" to="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
};

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

export default Landing;
