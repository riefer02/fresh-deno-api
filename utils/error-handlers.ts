import { PostgresError } from "https://deno.land/x/postgres@v0.16.1/mod.ts";

export const errorHandler = (err: PostgresError) => {
  switch (err.name) {
    case "PostgresError":
      return postgresErrorHandler(err);

    default:
      return "Bark, bark something went wrong.";
  }
};

const postgresErrorHandler = (err: PostgresError) => {
  console.log(err.fields)
  switch (err.fields.code) {
    case "23505":
      return "Email has already been registered";

    default:
      return "Bark, bark something went wrong with our database.";
  }
};
