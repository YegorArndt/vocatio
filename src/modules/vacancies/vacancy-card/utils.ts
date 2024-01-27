type Nullable = string | null;

export const getSalaryRange = (
  min: Nullable,
  max: Nullable,
  isAnnualSalary: boolean
) => {
  const isValid = min && max;
  if (!isValid) return null;

  const salary = +min === +max ? min : `${min} - ${max}`;
  const salaryType = isAnnualSalary ? "annually" : "monthly";

  return `${salary} ${salaryType}`;
};
