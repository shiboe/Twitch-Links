export const maxDuration = 1000 * 60 * 15;

export interface Link {
  url: string;
  created: number;
  hidden: boolean;
  saved: boolean;
}
