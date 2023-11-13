/**
 * ID matches the field's name in the DB.
 * "name" matches the field's key in the LS.
 *
 * Every time we initialize a new draft, we put the design (CV) chosen by the user through a function that appends "vacancyId"
 * to the name of the field so that the LS knows it. It will also properly initialize the values of the fields.
 */

/**
 * The designs we save in the database can be reviewed and added to the list of designs.
 * We'll only need to replace another user's data with the current user's data.
 */

/**
 * We need two separate models for designs: one as user's CVs and another one as designs the user can choose from.
 */

/**
 * Do elements that have no db backup actually need an id?
 */

// export const dbIdsArray = [
//   "user-name",
//   "job-title",
//   "objective",
//   "email",
//   "experience",
//   "skills-list",
//   "country",
//   "city",
//   "address",
//   "phone",
//   "linkedin",
//   "github",
//   "education-duration",
//   "education-degree",
//   "education-university",
//   "english-level",
//   "german-level",
//   "russian-level",
//   "spanish-level"
// ];

export const DBIds = {
  // We'll probably add these fields to User Model.
  "user-name": "user-name",
  "job-title": "job-title",
  objective: "objective",
  email: "email",
  experience: "experience",
  "skills-list": "skills-list",
  country: "country",
  city: "city",
  address: "address",
  phone: "phone",
  linkedin: "linkedin",
  github: "github",
  "education-duration": "education-duration",
  "education-degree": "education-degree",
  "education-university": "education-university",
  "english-level": "english-level",
  "german-level": "german-level",
  "russian-level": "russian-level",
  "spanish-level": "spanish-level",
};

/**
 * Hardcoded by designs we have or tweaked by the user.
 * Not stored in the DB.
 */
export const LSIds = {
  "general-title": "general-title",
  "contact-title": "contact-title",
  "languages-title": "languages-title",
  "education-title": "education-title",
  "skills-title": "skills-title",
  "employment-history-title": "employment-history-title",
};

/**
 * 1. First filter through user's preferences if they'd like to tailor the field to the vacancy. If so, we'll use the vacancy's data.
 * 2. Otherwise, we'll try to find something in the LS.
 * 3. If nothing found, we'll try to find something in the DB.
 * 4. If nothing found, we'll use the default data.
 */
