import { ZodType } from "zod";

export interface RequestValidator {
    body? : ZodType<any>,
  };
  