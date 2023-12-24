import Head from "next/head";
import { Fragment, ReactNode } from "react";
import { FormProvider, UseFormRegister, useForm } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";
import { type Vacancy } from "@prisma/client";

import { Layout } from "~/components/layout/Layout";
import { api } from "~/utils/api";
import { startCase, lowerCase } from "lodash-es";
import { CiCalendarDate, CiFilter } from "react-icons/ci";
import { FaDollarSign, FaLayerGroup } from "react-icons/fa";
import { GoSortAsc } from "react-icons/go";
import { Chip, Placeholder } from "~/components";
import { Lines, CardStack } from "~/components/Spinner";
import { Divider } from "~/components/layout/Divider";
import { Checkbox } from "~/components/ui/inputs/Checkbox";
import { Text } from "~/components/ui/inputs/Text";
import { usePostMessage } from "~/hooks/usePostMessage";
import { CuratedVacancies } from "~/modules/vacancies/CuratedVacancies";

const { log } = console;

const defaultValues = {
  search: "",
  salary: "",
  date: "",
};

const Down = () => <IoIosArrowDown />;
const Up = () => <IoIosArrowDown style={{ transform: "rotate(180deg)" }} />;
const ToolbarEntry = (props: { text: ReactNode; icon: ReactNode }) => {
  const { text, icon } = props;
  return (
    <div className="flex-y gap-2">
      {icon}
      {text}
    </div>
  );
};
const ToolbarRadio = (props: {
  register: UseFormRegister<typeof defaultValues>;
  name: keyof typeof defaultValues;
}) => {
  const { register, name } = props;
  return (
    <div className="flex-y gap-3">
      {["desc", "asc"].map((value, i) => (
        <label key={value} className="flex-y gap-2">
          {i === 0 ? <Up /> : <Down />}
          <input type="radio" value={value} {...register(name)} />
        </label>
      ))}
    </div>
  );
};

const getFilters = (vacancies: Vacancy[], key: keyof Vacancy) => {
  const availableOptions = vacancies
    .map((v) => v[key])
    .filter((v) => typeof v === "string") as string[];
  const filters = Array.from(new Set(availableOptions));

  return filters;
};

export const Vacancies = () => {
  const { data: vacancies, isLoading: vacanciesLoading } =
    api.vacancies.getAll.useQuery();
  api.drafts.getAll.useQuery();

  const methods = useForm({
    defaultValues,
  });
  const { control, register } = methods;

  usePostMessage();

  return (
    <>
      <Head>
        <title>Vacancies - Vocatio</title>
        <meta
          name="description"
          content="Free AI based CV builder. Generate CVs tailored to the job description."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout
        toolbar={
          vacanciesLoading ? (
            <Lines />
          ) : (
            vacancies &&
            vacancies.length > 0 && (
              <>
                <ToolbarEntry text="Sort by" icon={<GoSortAsc />} />
                <Divider />
                <div className="flex-between gap-2">
                  <ToolbarEntry text="Salary" icon={<FaDollarSign />} />
                  <ToolbarRadio register={register} name="salary" />
                </div>
                <div className="flex-between gap-2">
                  <ToolbarEntry text="Date posted" icon={<CiCalendarDate />} />
                  <ToolbarRadio register={register} name="date" />
                </div>
                <Divider className="mt-4" />
                <ToolbarEntry text="Filter by" icon={<CiFilter />} />
                <Divider />
                {!vacanciesLoading && vacancies && (
                  <Fragment>
                    {getFilters(vacancies, "requiredSeniority").map(
                      (seniority) => (
                        <Checkbox
                          key={seniority}
                          label={startCase(lowerCase(seniority)) + " jobs"}
                          name={seniority}
                          control={control}
                        />
                      )
                    )}
                    {getFilters(vacancies, "employmentType").map((et) => (
                      <Checkbox
                        key={et}
                        label={startCase(lowerCase(et))}
                        name={et}
                        control={control}
                      />
                    ))}
                    <Divider className="mt-4" />
                    <ToolbarEntry
                      text={
                        <>
                          Group by <Chip text="Soon" className="bg-sky px-3" />
                        </>
                      }
                      icon={<FaLayerGroup />}
                    />
                  </Fragment>
                )}
              </>
            )
          )
        }
      >
        <div className="content flex flex-col gap-8">
          {(vacanciesLoading || !!vacancies?.length) && (
            <Text
              control={control}
              name="search"
              placeholder="Search for vacancies"
              disabled={vacanciesLoading}
            />
          )}
          {vacanciesLoading && <CardStack className="vacancies" />}
          {!vacanciesLoading && vacancies && vacancies.length > 0 && (
            <FormProvider {...methods}>
              <div className="card-grid vacancies">
                {/* {isRefetching && <CardSkeleton />} */}
                <CuratedVacancies vacancies={vacancies} />
              </div>
            </FormProvider>
          )}
          {!!(!vacanciesLoading && !vacancies?.length) && (
            <Placeholder
              title="No vacancies found"
              text="Use our Google Extension to add a new vacancy"
              actionContent="Get Extension"
              to="https://chrome.google.com/webstore/detail/Vocatio/bknmlolcaccbfcedimgmpnfcjadfelbn"
              newTab
            />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Vacancies;
