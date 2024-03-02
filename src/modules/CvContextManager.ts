import { Cv, Gen } from "./init-gen/types";

export enum CvContext {
  GEN = "gen",
  CV = "cv",
}

export class CvContextManager {
  private static instance: CvContextManager;
  private vacancyId: string = "default";

  constructor() {
    const url = window.location.href;
    const pattern = /https?:\/\/[^/]+\/(?:create|init-gen)\/([a-f0-9-]+)/;
    const match = url.match(pattern);
    if (match && match[1]) {
      this.vacancyId = match[1];
    }
  }

  public static getInstance(): CvContextManager {
    if (!CvContextManager.instance) {
      CvContextManager.instance = new CvContextManager();
    }
    return CvContextManager.instance;
  }

  getItem<T>(item: CvContext, id?: string): T | null {
    const data = localStorage.getItem(
      `${item}-${this.vacancyId}${id ? `-${id}` : ""}`
    );
    return data ? JSON.parse(data) : null;
  }

  setItem<T>(item: CvContext, data: T, id?: string): void {
    localStorage.setItem(
      `${item}-${this.vacancyId}${id ? `-${id}` : ""}`,
      JSON.stringify(data)
    );
  }

  removeItem(item: CvContext): void {
    localStorage.removeItem(`${item}-${this.vacancyId}`);
  }

  getGen() {
    return this.getItem<Gen>(CvContext.GEN);
  }

  getCv() {
    return this.getItem<Cv>(CvContext.CV);
  }

  getVacancy() {
    return this.getGen()?.vacancy;
  }

  setGen(gen: Gen) {
    this.setItem<Gen>(CvContext.GEN, gen);
  }

  setCv(cv: Cv) {
    this.setItem<Cv>(CvContext.CV, cv);
  }

  updateCv(cv: Partial<Cv> | ((prev: Cv) => Cv)) {
    const prev = this.getCv();
    const updated = typeof cv === "function" ? cv(prev as Cv) : cv;

    this.setItem<Cv>(CvContext.CV, { ...prev, ...(updated as Cv) });
  }

  updateGen(gen: Partial<Gen>) {
    const prev = this.getGen();
    this.setItem<Gen>(CvContext.GEN, { ...prev, ...(gen as Gen) });
  }
}
