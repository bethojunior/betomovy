import { RealtimeEventsHelper } from './realtime-events.helper';

describe('RealtimeEventsHelper.extractCallingDriverIds', () => {
  it('normaliza lista, texto e número para ids de sala', () => {
    expect(
      RealtimeEventsHelper.extractCallingDriverIds({ callingDriver: ['12', 34, ' 56 '] }),
    ).toEqual(['12', '34', '56']);

    expect(
      RealtimeEventsHelper.extractCallingDriverIds({ callingDriver: '7, 8,,null' }),
    ).toEqual(['7', '8']);

    expect(RealtimeEventsHelper.extractCallingDriverIds({ callingDriver: 9 })).toEqual(['9']);
    expect(RealtimeEventsHelper.extractCallingDriverIds(null)).toEqual([]);
  });
});
