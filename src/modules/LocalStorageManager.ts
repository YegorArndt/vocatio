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

  private constructor() {
    const url = window.location.href;
    const pattern = /https?:\/\/[^/]+\/create\/([a-f0-9-]+)/;
    const match = url.match(pattern);
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

  test() {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key?.includes(`${Items.EXPERIENCE_ENTRY}-${this.vacancyId}`)) {
        // Delete it
        localStorage.removeItem(key);
      }
    }
  }

  removeItem(item: Items): void {
    localStorage.removeItem(`${item}-${this.vacancyId}`);
  }
}
