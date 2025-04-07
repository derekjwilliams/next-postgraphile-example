# Simple Example of Using Postgraphile Version 5 with Next.js

This project demonstrates how to integrate [PostGraphile version 5](https://postgraphile.org/postgraphile/next/) with a Next.js 15 application using the `app` router and API routes. It includes support for both GraphQL queries/mutations and the Ruru (GraphiQL) interface.

## Getting Started

### Prerequisites

-   Node.js (v20 or later)
-   A PostgreSQL database (with PostGIS extension if you need to get WKT data from geograpy or geometry columns)
-   Environment variable `DATABASE_URL` set to your PostgreSQL connection string.

### Configuration

Set up your `.env` file, for example

```
DATABASE_URL=postgres://username:password@localhost:5432/mydatabase
```

replacing `username`, `password`, and `mydatabase` with your values; and change the port from `5432` to your value.

### Installing

```bash
npm install
# or
yarn install
```

### Running

First, run the development server:

```bash
npm run dev
# or
yarn dev
```
*Note: Errors are encountered when using pnpm, so use npm or yarn for now*

Navigate to `http://localhost:3000/api/graphql` to see the Ruru web interface to run queries and mutations.


## Features

-   GraphQL API: Handle GraphQL queries and mutations via `POST` requests to `/api/graphql`.
-   Ruru Interface: Access the Ruru (GraphiQL like) interface via `GET` requests to `/api/graphql`.
-   PostGraphile Configuration: Customizable PostGraphile setup with support for presets, and plugins.  Includes example of external plugin [PgPostgisWktPlugin](https://www.npmjs.com/package/postgraphile-postgis-wkt), 


### Thanks

I followed a pattern similar to the hono example found [here](https://github.com/graphile/crystal/blob/main/grafast/grafserv/src/servers/hono/v4/index.ts), thanks to Benjie for the great help with the implementation, any shortcomings are mine :).

### Adapting Next.js Requests and Responses

Next.js uses its own request and response objects (`NextRequest` and `NextResponse`), which are not directly compatible with Node.js's `IncomingMessage` and `ServerResponse`. To handle this we have the `getNormalizedDigest` method which does the conversion.

## API Endpoints

### `/api/graphql`

#### POST - GraphQL Queries/Mutations

Send a `POST` request to `/api/graphql` with a GraphQL query or mutation in the request body.

Example: 

```bash
curl -X POST <http://localhost:3000/api/graphql>\
-H "Content-Type: application/json"\
-d '{"query": "{ __typename }"}'
```

Also see the example curl request `example_curl.txt`

```
curl  -X POST 'http://localhost:3000/api/graphql' \
  -H 'accept: application/json' \
  -H 'content-type: application/json' \
  --data-raw '{"query":"{\n  query {\n    allEvents(first: 10) {\n      edges {\n        node {\n          title\n          geoLocation         \n        }\n      }\n    }\n  }\n}\n"}'
```

For an events table with `title` and `geoLocation` columns.

#### GET - Ruru (GraphiQL) Interface

Open your browser and navigate to `http://localhost:3000/api/graphql` to access the Ruru (GraphiQL) interface.

The Ruru interface allows you to explore your GraphQL schema, run queries and mutations interactively.

## Code Overview

### Helper Functions

-   `getNormalizedDigest`: Constructs a `NormalizedRequestDigest` object from a Next.js `NextRequest`. This function normalizes headers, extracts query parameters, and handles the request body in the format expected by PostGraphile.

### Handlers

   - `POST`: Handles GraphQL queries and mutations.
   - `GET`: Serves the Ruru (GraphiQL) interface.

###  PostGraphile Configuration
   - PostGraphile configuration with presets, and [postgraphile-postgis-wkt](https://www.npmjs.com/package/postgraphile-postgis-wkt) plugin 

### `createMockRequest`

### `getNormalizedDigest`

The `getNormalizedDigest` function adapts a Next.js `NextRequest` object into a `NormalizedRequestDigest` object, which is required by PostGraphile. This function handles the conversion of headers, query parameters, and body into the format expected by PostGraphile.

```typescript
export function getNormalizedDigest(req: NextRequest): NormalizedRequestDigest {
  const digest: RequestDigest =  {
    httpVersionMajor: 1, // Default HTTP version
    httpVersionMinor: 1, // Default HTTP version
    isSecure: req.nextUrl.protocol === 'https:', // Determine if the request is secure
    method: req.method, // HTTP method
    path: req.nextUrl.pathname, // Request path
    headers: processHeaders(Object.fromEntries(req.headers.entries())), // Normalize headers
    getQueryParams: () => Object.fromEntries(req.nextUrl.searchParams.entries()), // Query parameters
    async getBody() {
      const body = await req.text()
      return {
        type: 'json',
        json: body ? JSON.parse(body) : {}, // Empty object if the body is empty
      }
    },
    requestContext: {},
  }
  return normalizeRequest(digest)
```

### POST Handler

Handles GraphQL queries and mutations. This handler uses `getNormalizedDigest` to adapt the Next.js request into a `NormalizedRequestDigest` object and processes the request using PostGraphile's `graphqlHandler`.

```typescript
export async function POST(req: NextRequest) {
  try {
    const normalizedDigest = getNormalizedDigest(req)
    const handlerResult = await serv.graphqlHandler(normalizedDigest)
    const result = await convertHandlerResultToResult(handlerResult)

    if (result && result.type === 'buffer') {
      const {buffer, headers, statusCode} = result
      return new NextResponse(buffer, {
        status: statusCode,
        headers,
      })
    }
    console.error('Response may be null or empty')
    return new NextResponse('Response may be null or empty:', { status: 500 })
  } catch (error) {
    console.error('Error in POST handler:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
```

### GET Handler

Handles requests for the Ruru (GraphiQL-like) interface. This handler uses `getNormalizedDigest` to adapt the Next.js request into a `NormalizedRequestDigest` object and processes the request using PostGraphile's `graphiqlHandler`.

*Of note: PostGraphile v5 does support querying using GET, see the example here: <https://github.com/graphile/crystal/blob/main/grafast/grafserv/examples/graphile.config.mjs>, but that is not being used in this example.*

```typescript
export async function GET(req: NextRequest) {
  try {
    const normalizedDigest = getNormalizedDigest(req)
    const handlerResult = await serv.graphiqlHandler(normalizedDigest)
    const result = await convertHandlerResultToResult(handlerResult)

    if (result && result.type === 'buffer') {
      const { buffer, headers, statusCode } = result

      return new NextResponse(buffer, {
        status: statusCode,
        headers,
      })
    }
  } catch (error) {
    console.error("Error in GET handler:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
```

### PostGraphile Configuration

The PostGraphile instance is configured with the Amber preset and connects to the PostgreSQL database specified in the DATABASE_URL environment variable. This configuration enables the Ruru (GraphiQL like) web interface and sets up the database schema.

```typescript
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
```

----

# Next Boiler Plate:

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
