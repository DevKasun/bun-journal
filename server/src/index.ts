import { serve } from "bun";
import { router } from "./routes";

serve({
  port: 3000,
  fetch: router,
});

console.log("🚀 Server running at http://localhost:3000");
