import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";
import { validateRequest } from "../src/middleware/validateRequest";

test("validateRequest writes parsed body back to request", async () => {
    const middleware = validateRequest({
        body: z.object({
            count: z.coerce.number().int(),
        }),
    });
    const req = { body: { count: "7" } };

    await new Promise<void>((resolve, reject) => {
        middleware(req as never, {} as never, (error?: unknown) => {
            if (error) reject(error);
            else resolve();
        });
    });

    assert.deepEqual(req.body, { count: 7 });
});

test("validateRequest forwards validation errors", async () => {
    const middleware = validateRequest({
        body: z.object({
            email: z.string().email(),
        }),
    });
    const req = { body: { email: "wrong" } };

    const error = await new Promise<unknown>((resolve) => {
        middleware(req as never, {} as never, (nextError?: unknown) => {
            resolve(nextError);
        });
    });

    assert.ok(error instanceof z.ZodError);
});
