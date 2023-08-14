export type RawVacancy = {
  id: string;
  companyName: string | null;
  location: string | null;
  age: string | null;
  numApplicants: string | null;
  salaryRange: string | null;
  level: string | null;
  jobTitle: string;
  requirementsBase64: string;
};

export type Vacancy = Omit<RawVacancy, "requirementsBase64"> & {
  requirements: string;
};
