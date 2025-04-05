// Node.js built-in modules
import { Readable } from "stream"
import type { IncomingMessage, ServerResponse } from "node:http"

// PostGraphile core and related modules
import { postgraphile } from "postgraphile"
import { grafserv } from "postgraphile/grafserv/node"
import { PostGraphileAmberPreset } from "postgraphile/presets/amber"
import { makePgService } from "postgraphile/adaptors/pg"

// PostGraphile plugins
import { PgPostgisWktPlugin } from "postgraphile-postgis-wkt"

// Next.js modules
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

// PostGraphile configuration
const preset = {
  extends: [PostGraphileAmberPreset],
  plugins: [PgPostgisWktPlugin],
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ["public"],
    }),
  ],
  grafserv: {
    graphqlPath: "/api/graphql",
  },
  grafast: {
    explain: process.env.NODE_ENV === "development",
  },
}

// Create PostGraphile instance
const pgl = postgraphile(preset)

// Create the grafserv instance
const serv = pgl.createServ(grafserv)

/**
 * Creates a mock IncomingMessage object for PostGraphile.
 */

function createMockRequest(
  req: NextRequest,
  body?: string
): IncomingMessage {
  const { method, headers, nextUrl } = req
  // Extract the path and query string from the Next.js request
  const url = nextUrl.pathname + nextUrl.search
  // Create a Readable stream for the body
  const bodyStream = body ? Readable.from([Buffer.from(body)]) : Readable.from([])
  // Return the mock IncomingMessage
  return Object.assign(bodyStream, {
    method,
    url,
    headers: Object.fromEntries(headers.entries()), // Assign headers to the correct property
  }) as unknown as IncomingMessage
}

function createMockResponse(): {
  mockResponse: ServerResponse
  chunks: string[]
  headersObject: Record<string, string>
} {
  const statusCode = 200
  const headersObject: Record<string, string> = {}
  const chunks: string[] = []

  const mockResponse = {
    statusCode,
    setHeader(name: string, value: string) {
      headersObject[name] = value
    },
    getHeader(name: string) {
      return headersObject[name]
    },
    getHeaders() {
      return headersObject
    },
    write(chunk: string | Buffer | Uint8Array) {
      chunks.push(typeof chunk === "string" ? chunk : chunk.toString())
    },
    end(chunk?: string | Buffer | Uint8Array) {
      if (chunk) chunks.push(typeof chunk === "string" ? chunk : chunk.toString())
    },
    writeHead(status: number, headers: Record<string, string>) {
      this.statusCode = status
      Object.assign(headersObject, headers)
    },
  } as ServerResponse

  return { mockResponse, chunks, headersObject }
}

/**
 * Handle POST requests (GraphQL queries/mutations).
 */
export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text()
    const mockRequest = createMockRequest(req, bodyText)
    const { mockResponse, chunks, headersObject } = createMockResponse()

    await serv.createHandler()(mockRequest, mockResponse)

    return new NextResponse(chunks.join(""), {
      status: mockResponse.statusCode,
      headers: headersObject,
    })
  } catch (error) {
    console.error("Error in POST handler:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

/**
 * Handle GET requests (GraphiQL interface).
 */
export async function GET(req: NextRequest) {
  try {
  const mockRequest = createMockRequest(req)
  const { mockResponse, chunks, headersObject } = createMockResponse()

  // await is required, DO NOT REMOVE await
  await serv.createHandler()(mockRequest, mockResponse)

  return new NextResponse(chunks.join(""), {
    status: mockResponse.statusCode,
    headers: headersObject,
  })}
  catch (error) {
    console.error("Error in POST handler:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
