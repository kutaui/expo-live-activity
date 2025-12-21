import { requireNativeModule } from 'expo';
import { Platform } from 'react-native';
import type {
  ActivityOngoingResponse,
  ActivityStartResponse,
  ActivityStopResponse,
} from './LiveActivityManager.types';

const nativeModule =
  Platform.OS === 'android' ? null : requireNativeModule('LiveActivityManager');

type NativeModuleShape = {
  beginActivity?: (
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number,
    currentQuarter: number,
    timeRemaining: string
  ) => Promise<any> | any;
  updateActivity?: (
    id: string,
    homeScore: number,
    awayScore: number,
    currentQuarter: number,
    timeRemaining: string
  ) => Promise<any> | any;
  endActivity?: (id: string) => Promise<any> | any;
  fetchPushToken?: () => Promise<any> | any;
} | null;

const native: NativeModuleShape = nativeModule as any;

const mapStartResponse = (value: any): ActivityStartResponse => ({
  id: value?.activityId ?? value?.id,
  isSuccess: Boolean(value?.success ?? value?.isSuccess),
  message: value?.errorMessage ?? value?.message,
});

const mapStopResponse = (value: any): ActivityStopResponse => ({
  id: value?.activityId ?? value?.id,
  isSuccess: Boolean(value?.success ?? value?.isSuccess),
  message: value?.errorMessage ?? value?.message,
});

const mapOngoingResponse = (value: any): ActivityOngoingResponse => ({
  isSuccess: Boolean(value?.success ?? value?.isSuccess),
});

export const LiveActivityManagerNativeModule = {
  start: (
    homeTeam: string,
    awayTeam: string,
    homeScore: number,
    awayScore: number,
    currentQuarter: number,
    timeRemaining: string
  ): Promise<ActivityStartResponse> => {
    if (!native?.beginActivity) {
      return Promise.resolve({ isSuccess: false });
    }

    return Promise.resolve(
      native.beginActivity(
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        currentQuarter,
        timeRemaining
      )
    ).then(mapStartResponse);
  },

  ongoing: (
    id: string,
    homeScore: number,
    awayScore: number,
    currentQuarter: number,
    timeRemaining: string
  ): Promise<ActivityOngoingResponse> => {
    if (!native?.updateActivity) {
      return Promise.resolve({ isSuccess: false });
    }

    return Promise.resolve(
      native.updateActivity(
        id,
        homeScore,
        awayScore,
        currentQuarter,
        timeRemaining
      )
    ).then(mapOngoingResponse);
  },

  stop: (id: string): Promise<ActivityStopResponse> => {
    if (!native?.endActivity) {
      return Promise.resolve({ isSuccess: false });
    }

    return Promise.resolve(native.endActivity(id)).then(mapStopResponse);
  },

  getPushToStartToken: () => {
    if (!native?.fetchPushToken) {
      return Promise.resolve({ isSuccess: false });
    }

    return Promise.resolve(native.fetchPushToken());
  },
};

export default LiveActivityManagerNativeModule;