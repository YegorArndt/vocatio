type Nullable = string | null;

export const getSalaryRange = (salary: Nullable, isAnnualSalary: boolean) => {
  if (!salary) return null;

  const salaryType = isAnnualSalary ? "annually" : "monthly";

  return `${salary} ${salaryType}`;
};
