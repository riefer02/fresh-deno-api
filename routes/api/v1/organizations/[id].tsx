

import { Handlers } from "$fresh/server.ts";
import prisma from "../../../../lib/prisma-client.ts";

export const handler: Handlers = {
    async GET(req, ctx) {
      try {
        const { id } = ctx.params;
        const res = await prisma.organizations.findUnique({
          where: {
            org_id: id,
          },
        });
  
        return new Response(
          JSON.stringify({
            message: `Here is the organization name by id: ${res.name}`,
            data: res,
          })
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            message: `There was a problem executing ${req.url} requests`,
          }),
          { status: 500 }
        );
      }
    },
  
    async DELETE(req, ctx) {
      try {
        const { id } = ctx.params;
        const res = await prisma.organizations.delete({
          where: {
            org_id: id,
          },
        });
  
        return new Response(
          JSON.stringify({
            message: `Here is the organization by id that was deleted: ${res.name}`,
            data: res,
          })
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            message: `There was a problem executing ${req.url} requests. Error: ${err.message}`,
          }),
          { status: 500 }
        );
      }
    },
  
    async PATCH(req, ctx) {
      const { id } = ctx.params;
      const { organizationName } = await req.json();
  
      try {
        const updateOrg = await prisma.organizations.update({
          where: {
            org_id: id,
          },
          data: {
            name: organizationName,
          },
        });
  
        return new Response(
          JSON.stringify({
            data: updateOrg,
            message: "Successfully updated the organization",
          }),
          {
            status: 200,
            statusText: "OK",
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (err) {
        return new Response(`${err.message}`, { status: 404 });
      }
    },
  };
  