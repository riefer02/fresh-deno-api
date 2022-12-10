import { PostgresError } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { capitalizeFirstLetter } from "./strings.ts";

export const errorHandler = (err: PostgresError, model: string) => {
  switch (err.name) {
    case "PostgresError":
      return postgresErrorHandler(err, model);

    default:
      return `Bark, bark something went wrong. Error: ${err.message}`;
  }
};

const postgresErrorHandler = (err: PostgresError, model: string) => {
  console.log("Postgres Error Fields:", err.fields);

  switch (err.fields.code) {
    case "23505":
      return `${capitalizeFirstLetter(model)} has already been registered`;

    default:
      return `Bark, bark something went wrong with our database. ErrorCode: ${err.fields.code}, ErrorMessage: ${err.message}`;
  }
};
