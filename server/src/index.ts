import { serve } from "bun";

const port = 3000;

const server = Bun.serve({
  port,
  fetch(req) {
    return new Response("Hello World from Bun server");
  },
});

console.log(`Server started on port ${port}`);
