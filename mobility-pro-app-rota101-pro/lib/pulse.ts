import { Pulse } from '../lib/pulse-sdk';
import { buildApp, nameApp } from '../src/constantBuild/config';

const groupId = buildApp().PULSE_CODE;

export const pulse = new Pulse({
  app: `${nameApp}_app_pro`,
  groupId: groupId,
});