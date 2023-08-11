import { z } from "zod";

export const ParamsWithId = z.object({
    id: z.string().refine(
        value => {
          const parsed = parseInt(value, 10);
          return !isNaN(parsed) && value === parsed.toString();
        },
        {
          message: "Not a valid integer string",
        }).transform(x => parseInt(x))
});


export type ParamsWithId = z.infer<typeof ParamsWithId>; 