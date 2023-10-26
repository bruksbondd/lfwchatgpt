import { ParsedUrlQuery } from 'querystring';

export interface Stack {
  href?: string;
  logo: string;
  info: string;
  docs?: string[];
  name?: string;
  hoverClass?: string;
}

export type StackKey = 'react' | 'next' | 'typetscript';

export interface StackPageProps extends Record<string, unknown> {
  stack: Stack;
  stackKey: string | string[] | undefined;
}

export interface Params extends ParsedUrlQuery {
  stack: string;
}
