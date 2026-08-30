export const syntheticSuburbs = [
  "Chermside",
  "Carindale",
  "Toowong",
  "Paddington",
  "New Farm",
  "Wynnum",
  "Indooroopilly",
  "Coorparoo",
  "Nundah",
  "Mount Gravatt",
] as const;

export type SyntheticSuburb = (typeof syntheticSuburbs)[number];
