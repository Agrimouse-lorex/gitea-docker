import { mergeTests } from '@playwright/test';
import { test as base } from './fixtureBase';
import { test as repo } from './fixtureRepo';

export const test = mergeTests(base, repo);