import Fastify from "fastify";
import { analyze } from "./analyze.js";

const app = Fastify();

app.post("/analyze", async (req, reply) => {
  const { url } = req.body as { url: string };
  if (!url) {
    return reply.status(400).send({ error: "URL required" });
  }

  const result = await analyze(url);
  reply.send(result);
});

app.listen({ port: 3000 }, () => console.log("Selda API running on :3000"));

