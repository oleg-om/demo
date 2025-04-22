import { HttpStatus } from "@/enums/httpStatus";

export interface IError {
  status: HttpStatus;
  statusText: string;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}
