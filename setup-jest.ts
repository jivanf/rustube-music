import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// biome-ignore lint/suspicious/noExplicitAny: We don't have a type for `globalThis`
const testEnvironmentOptions = (globalThis as any).ngJest?.testEnvironmentOptions ?? Object.create(null);

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), testEnvironmentOptions);
