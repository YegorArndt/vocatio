export type LsSkills = {
  name: string;
  id: string;
}[];

export enum Items {
  SKILLS = "skills",
  EXPERIENCE = "experience",
  EXPERIENCE_ENTRY = "experience-entry",
  GENERATED_DATA = "gen",
}

export class LocalStorageManager {
  private static instance: LocalStorageManager;
  private vacancyId: string;
  private readonly baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://vocatio.cat";

  private constructor() {
    const url = window.location.href;
    const match = url.match(`${this.baseUrl}/create/([a-f0-9-]+)`);
    if (match && match[1]) {
      this.vacancyId = match[1];
    } else {
      throw new Error("Vacancy ID not found in URL");
    }
  }

  public static getInstance(): LocalStorageManager {
    if (!LocalStorageManager.instance) {
      LocalStorageManager.instance = new LocalStorageManager();
    }
    return LocalStorageManager.instance;
  }

  getItem<T>(item: Items, id?: string): T | null {
    const data = localStorage.getItem(
      `${item}-${this.vacancyId}${id ? `-${id}` : ""}`
    );
    return data ? JSON.parse(data) : null;
  }

  setItem<T>(item: Items, data: T, id?: string): void {
    localStorage.setItem(
      `${item}-${this.vacancyId}${id ? `-${id}` : ""}`,
      JSON.stringify(data)
    );
  }

  removeItem(item: Items): void {
    localStorage.removeItem(`${item}-${this.vacancyId}`);
  }
}
