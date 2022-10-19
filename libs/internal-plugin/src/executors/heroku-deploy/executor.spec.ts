import { HerokuDeployExecutorSchema } from './schema';
import executor from './executor';

const options: HerokuDeployExecutorSchema = {
  distLocation: '',
  herokuAppName: ''
};

describe('HerokuDeploy Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});