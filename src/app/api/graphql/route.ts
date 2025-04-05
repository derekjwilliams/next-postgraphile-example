import { Readable } from "stream";
import { grafserv } from "postgraphile/grafserv/node";
import { postgraphile } from "postgraphile";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from "postgraphile/adaptors/pg";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { IncomingMessage, ServerResponse } from "node:http";

// PostGraphile configuration
const preset = {
  extends: [PostGraphileAmberPreset],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ["public"],
    }),
  ],
  grafserv: {
    graphqlPath: "/api/graphql",
    graphiql: true, // Enable GraphiQL/Ruru
  },
  grafast: {
    explain: process.env.NODE_ENV === "development",
  },
};

// Create PostGraphile instance
const pgl = postgraphile(preset);

// Create the grafserv instance
const serv = pgl.createServ(grafserv);

/**
 * Handle POST requests (GraphQL queries/mutations).
 */
export async function POST(req: NextRequest) {
  const { method, headers } = req;

  // Extract the path from the Next.js request
  const url = req.nextUrl.pathname + req.nextUrl.search; // This will give `/api/graphql` for your endpoint

  // Create a Readable stream for the request body
  const bodyText = await req.text();
  const bodyStream = Readable.from([Buffer.from(bodyText)]); // Convert the string to a Buffer

  // Mimic an IncomingMessage
  const mockReq = Object.assign(bodyStream, {
    method,
    url, // Use the path instead of the full URL
    headers: Object.fromEntries(headers.entries()),
  }) as IncomingMessage;

  // Mimic a ServerResponse
  const statusCode = 200;
  const headersObj: Record<string, string> = {};
  const chunks: string[] = [];

  const mockRes = {
    statusCode,
    setHeader(name: string, value: string) {
      headersObj[name] = value;
    },
    getHeader(name: string) {
      return headersObj[name];
    },
    getHeaders() {
      return headersObj;
    },
    write(chunk: string | Buffer | Uint8Array) {
      chunks.push(typeof chunk === "string" ? chunk : chunk.toString());
    },
    end(chunk?: string | Buffer | Uint8Array) {
      if (chunk) chunks.push(typeof chunk === "string" ? chunk : chunk.toString());
    },
    writeHead(status: number, headers: Record<string, string>) {
      this.statusCode = status;
      Object.assign(headersObj, headers);
    },
  } as ServerResponse;

  // Use the PostGraphile handler
  await serv.createHandler()(mockReq, mockRes);

  return new NextResponse(chunks.join(""), {
    status: mockRes.statusCode,
    headers: headersObj,
  });
}



/**
 * Handle GET requests (GraphiQL interface).
 */
export async function GET(req: NextRequest) {
  const { method, headers } = req;

  // Extract the path from the Next.js request
  const url = req.nextUrl.pathname + req.nextUrl.search; // This will give `/api/graphql` for your endpoint

  // No body for GET, but still need a Readable for compatibility
  const bodyStream = Readable.from([]); // Empty stream for GET requests

  // Mimic an IncomingMessage
  const mockReq = Object.assign(bodyStream, {
    method,
    url, // Use the path instead of the full URL
    headers: Object.fromEntries(headers.entries()),
  }) as IncomingMessage;

  // Mimic a ServerResponse
  const statusCode = 200;
  const headersObj: Record<string, string> = {};
  const chunks: string[] = [];

  const mockRes = {
    statusCode,
    setHeader(name: string, value: string) {
      headersObj[name] = value;
    },
    getHeader(name: string) {
      return headersObj[name];
    },
    getHeaders() {
      return headersObj;
    },
    write(chunk: string | Buffer | Uint8Array) {
      chunks.push(typeof chunk === "string" ? chunk : chunk.toString());
    },
    end(chunk?: string | Buffer | Uint8Array) {
      if (chunk) chunks.push(typeof chunk === "string" ? chunk : chunk.toString());
    },
    writeHead(status: number, headers: Record<string, string>) {
      this.statusCode = status;
      Object.assign(headersObj, headers);
    },
  } as ServerResponse;

  // Use the PostGraphile handler
  await serv.createHandler()(mockReq, mockRes);

  return new NextResponse(chunks.join(""), {
    status: mockRes.statusCode,
    headers: headersObj,
  });
}
