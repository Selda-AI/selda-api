import Fastify from "fastify";
import dotenv from "dotenv";
import { analyze } from "./analyze";

dotenv.config();

export const app = Fastify({
  logger: true,
});

app.post("/analyze", async (req, reply) => {
  const { url } = (req.body as { url?: string }) ?? {};

  if (!url) {
    return reply.status(400).send({ error: "URL is required" });
  }

  try {
    const result = await analyze(url);
    return reply.send(result);
  } catch (error) {
    req.log.error(error, "Analysis failed");
    return reply.status(500).send({
      error: "Failed to analyze the provided URL",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export async function startServer(): Promise<void> {
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST ?? "0.0.0.0";

  try {
    await app.listen({ port, host });
    app.log.info(`Selda API running on http://${host}:${port}`);
  } catch (error) {
    app.log.error(error, "Failed to start Selda API");
    process.exit(1);
  }
}

if (require.main === module) {
  void startServer();
}

