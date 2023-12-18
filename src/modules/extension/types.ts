export enum ProfessionField {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  FULLSTACK = "FULLSTACK",
  SECURITY = "SECURITY",
  PROJECT_MANAGER = "PROJECT_MANAGER",
  PRODUCT_MANAGER = "PRODUCT_MANAGER",
  DATA_SCIENTIST = "DATA_SCIENTIST",
  DEVOPS = "DEVOPS",
  UI_UX_DESIGNER = "UI_UX_DESIGNER",
  SYSTEM_ADMINISTRATOR = "SYSTEM_ADMINISTRATOR",
  DATABASE_ADMINISTRATOR = "DATABASE_ADMINISTRATOR",
  MOBILE_DEVELOPER = "MOBILE_DEVELOPER",
  EMBEDDED_DEVELOPER = "EMBEDDED_DEVELOPER",
  QA = "QA",
  NETWORK_ENGINEER = "NETWORK_ENGINEER",
  CLOUD_ENGINEER = "CLOUD_ENGINEER",
  MACHINE_LEARNING_ENGINEER = "MACHINE_LEARNING_ENGINEER",
  ANALYST = "ANALYST",
  SCRUM_MASTER = "SCRUM_MASTER",
}

export enum SkillLevel {
  BASIC = "BASIC",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
  NATIVE = "NATIVE",
}

export enum Currency {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  CAD = "CAD",
  AUD = "AUD",
  RUB = "RUB",
  UAH = "UAH",
  BYN = "BYN",
}

export enum SourceName {
  LINKEDIN = "LINKEDIN",
  INDEED = "INDEED",
  GLASSDOOR = "GLASSDOOR",
  HH = "HH",
}

export enum Seniority {
  JUNIOR = "JUNIOR",
  MIDDLE = "MIDDLE",
  SENIOR = "SENIOR",
  LEAD = "LEAD",
}

export enum Remote {
  HYBRID = "HYBRID",
  ON_SITE = "ON_SITE",
  REMOTE = "REMOTE",
}

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
}
export type VacancyDto = Partial<{
  image: string;
  companyName: string;
  location: string;
  country: string;
  age: string;
  numApplicants: string | null;
  salaryMin: string;
  salaryMax: string;
  isAnnualSalary: boolean;
  salaryCurrency: Currency;
  jobTitle: string;
  description: string;
  professionField: ProfessionField;
  requiredRemote: Remote;
  requiredSeniority: Seniority;
  employmentType: EmploymentType;
  requiredYearsMin: string;
  requiredYearsMax: string;
  requiredEducation: string;
  requiredLanguages: string | null;
  requiredSkills: string | null;
  sourceUrl: string;
  sourceName: SourceName;
}>;

export type Entry = {
  name: string;
  level: SkillLevel;
};

export type BigEntry = {
  place: string;
  period: string;
  description: string;
  image: string;
  title: string;
  skills?: string[];
};

export type User = {
  name: string;
  image: string;
  jobTitle: string;
  professionalSummary: string;
  location: string;

  professionField: ProfessionField;

  contact: {
    linkedin: string;
  };

  languages: Entry[];
  skills: Entry[];

  education: BigEntry[];
  employmentHistory: BigEntry[];
  recommendations: BigEntry[];
  awards: BigEntry[];
  certificates: BigEntry[];
};

export enum Sender {
  Extension,
  Content,
}

export enum Message {
  GET_LANGUAGES,
  GET_EMPLOYMENT_HISTORY,
  GET_EDUCATION,
  GET_RECOMMENDATIONS,
  GET_CERTIFICATES,
  GET_AWARDS,
  GET_SKILLS,
  GET_USER,
  ADD_VACANCY,
}

export interface ChromeMessage {
  from: Sender;
  message: Message;
}

export type RequestArgs<T> = T & {
  userId: string;
  token: string;
};
