export type Inputs = HTMLInputElement | HTMLTextAreaElement;

export type OmitDbStuff<T, M extends keyof T | never = never> = Omit<
  T,
  "id" | "createdAt" | "updatedAt" | M
>;

export type Falsy<T> = T | null | undefined;
