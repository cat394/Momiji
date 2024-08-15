import { type Middleware, Status } from '../deps.ts';
import { MomijiValidationError } from '../src/error-class/main.ts';

export const t_zodErrorCatcher = (): Middleware => async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		if (err instanceof MomijiValidationError) {
			ctx.response.status = Status.BadRequest;
			ctx.response.body = err.zodErrors;
		}
	}
};
