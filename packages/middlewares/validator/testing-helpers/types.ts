import type { ZodIssueCode } from '../deps.ts';

export type CreateParamErrorMessageArgs = {
	type?: ZodIssueCode;
	path: string;
	expected: string;
	received: string;
	message?: string;
};
