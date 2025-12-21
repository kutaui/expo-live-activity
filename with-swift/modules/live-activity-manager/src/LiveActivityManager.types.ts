type BaseActivityResponse = {
  isSuccess: boolean;
  message?: string;
};

export type ActivityStartResponse = {
  id?: string;
} & BaseActivityResponse;

export type ActivityStopResponse = {
  id?: string;
} & BaseActivityResponse;

export type ActivityOngoingResponse = {
  isSuccess: boolean;
};

export type StartLiveActivityFn = (
  homeTeam: string,
  awayTeam: string,
  homeScore: number,
  awayScore: number,
  currentQuarter: number,
  timeRemaining: string
) => Promise<ActivityStartResponse>;

export type OngoingLiveActivityFn = (
  id: string,
  homeScore: number,
  awayScore: number,
  currentQuarter: number,
  timeRemaining: string
) => Promise<ActivityOngoingResponse>;

export type StopLiveActivityFn = (id:string) => Promise<ActivityStopResponse>