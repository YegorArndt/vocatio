import { Layout } from "~/components/layout/Layout";
import { preferencesToolbar } from "~/modules/preferences/constants";

const AutocompletePreferences = () => {
  return (
    <Layout toolbar={preferencesToolbar}>
      <section className="content">
        <h1>Customize autocomplete</h1>
        <p>
          Here you can configure what fields you'd like to be always the same
          and what should be adjusted.
        </p>
      </section>
      <section className="callout bg-red">yo</section>
    </Layout>
  );
};
export default AutocompletePreferences;
