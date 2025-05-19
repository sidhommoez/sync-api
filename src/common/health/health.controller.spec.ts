import type { HealthCheckResult, HealthCheckService } from '@nestjs/terminus';

import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let healthCheckSerjestce: HealthCheckService;

  beforeEach(() => {
    healthCheckSerjestce = {
      check: jest.fn().mockResolvedValue({
        status: 'ok',
        info: { API: { status: 'up' } },
        error: {},
        details: { API: { status: 'up' } },
      } as HealthCheckResult),
    } as unknown as HealthCheckService;

    healthController = new HealthController(healthCheckSerjestce);
  });

  it('should return health check result', async () => {
    const result = await healthController.check();
    expect(result).toEqual({
      status: 'ok',
      info: { API: { status: 'up' } },
      error: {},
      details: { API: { status: 'up' } },
    });
    expect(healthCheckSerjestce.check).toHaveBeenCalled();
  });
});
