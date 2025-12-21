// Reexport the native module. On web, it will be resolved to ExpoLiveControllerModule.web.ts
// and on native platforms to ExpoLiveControllerModule.ts
export * from './src/LiveActivityManager.types';
export { default, LiveActivityManagerNativeModule } from './src/LiveActivityManagerModule';

