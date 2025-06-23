export type Environment = 'prod' | 'dev';

export const environments: Environment[] = ['prod', 'dev'];

export interface StackConfig {
  environment: Environment;
  resourceNameSuffix: string;
}

export const configs: Record<Environment, StackConfig> = {
  prod: {
    environment: 'prod',
    resourceNameSuffix: '',
  },
  dev: {
    environment: 'dev',
    resourceNameSuffix: 'Dev',
  },
};
