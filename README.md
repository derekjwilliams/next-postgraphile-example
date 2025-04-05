# Simple Example of Using Postgraphile Version 5 with Next.js

This project demonstrates how to integrate [PostGraphile version 5](https://postgraphile.org/postgraphile/next/) with a Next.js 15 application using the `app` router and API routes. It includes support for both GraphQL queries/mutations and the Ruru (GraphiQL) interface.


## Features

-   GraphQL API: Handle GraphQL queries and mutations via `POST` requests to `/api/graphql`.
-   Ruru Interface: Access the Ruru (GraphiQL) interface via `GET` requests to `/api/graphql`.
-   Reusable Mock Request/Response: Custom helper functions to adapt Next.js requests and responses to Node.js's `IncomingMessage` and `ServerResponse` types.
-   PostGraphile Configuration: Customizable PostGraphile setup with support for presets, and plugins.  Includes example of external plugin [PgPostgisWktPlugin](https://www.npmjs.com/package/postgraphile-postgis-wkt), 


## Why Workarounds Were Necessary

### Using the Deprecated `createHandler` Method

PostGraphile's `createHandler` method is deprecated in favor of `addTo`, which is designed to work with Node.js HTTP servers or frameworks like Express. 

However, Next.js abstracts away the underlying HTTP server, making it incompatible with `addTo`. As a result, I had to use `createHandler` to manually adapt Next.js requests (`NextRequest`) and responses (`NextResponse`) to Node.js's `IncomingMessage` and `ServerResponse` types.

#### Why Not Use addTo?

The `addTo` method in PostGraphile is designed for use with Node.js HTTP servers or frameworks like Express. However, Next.js abstracts away the underlying HTTP server, making it incompatible with addTo. As a result, I used the deprecated createHandler method to manually adapt Next.js requests and responses to Node.js types.

### Adapting Next.js Requests and Responses

Next.js uses its own request and response objects (`NextRequest` and `NextResponse`), which are not directly compatible with Node.js's `IncomingMessage` and `ServerResponse`. To work around this, I created helper functions (`createMockRequest` and `createMockResponse`) to mimic the expected Node.js types. These mock objects allow PostGraphile to process GraphQL requests and render the Ruru interface.


## Setup

### Prerequisites

-   Node.js (v20 or later)
-   A PostgreSQL database (with PostGIS extension if you need to get WKT data from geograpy or geometry columns)
-   Environment variable `DATABASE_URL` set to your PostgreSQL connection string.

### Installation

1.  Clone the repository: 

```bash 
git clone git@github.com:derekjwilliams/next-postgraphile-example.git
```

```bash 
 cd next-postgraphile-example
```

2.  Install dependencies: 

```bash
npm install
```

3.  Set up your `.env` file: 
```
DATABASE_URL=postgres://username:password@localhost:5432/mydatabase
```

4.  Start the development server: 

```bash
npm dev
```


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

#### GET - Ruru (GraphiQL) Interface

Open your browser and navigate to `http://localhost:3000/api/graphql` to access the Ruru (GraphiQL) interface.

The Ruru interface allows you to explore your GraphQL schema, run queries, and test mutations interactively.


## Code Overview

### Helper Functions

   - `createMockRequest`: Converts Next.js requests (`NextRequest`) into Node.js requests (`IncomingMessage`).
   - `createMockResponse`: Creates a mock response object (`ServerResponse`) for PostGraphile.

### Handlers

   - `POST`: Handles GraphQL queries and mutations.
   - `GET`: Serves the Ruru (GraphiQL) interface.

###  PostGraphile Configuration
   - PostGraphile configuration with presets, and [postgraphile-postgis-wkt](https://www.npmjs.com/package/postgraphile-postgis-wkt) plugin 

### `createMockRequest`

The `createMockRequest` function adapts a Next.js `NextRequest` object to a Node.js `IncomingMessage` object, which is required by PostGraphile. This function handles the conversion of headers and body to the format expected by Node.js.

```typescript
function createMockRequest(
  req: NextRequest,
  body?: string
): IncomingMessage {...}
```

### `createMockResponse`

The `createMockResponse` function creates a mock `ServerResponse` object, along with helper properties (`chunks` and `headersObj`) to collect the response data. This allows PostGraphile to process the response and return it in a format compatible with Next.js.

```typescript
function createMockResponse(): {
  mockResponse: ServerResponse
  chunks: string[]
  headersObject: Record<string, string>
} {...}
```


### POST Handler

Handles GraphQL queries and mutations. This handler uses `createMockRequest` to adapt the Next.js request and `createMockReponse` for the response.

```typescript
export async function POST(req: NextRequest) {
  ...
  const mockRequest = createMockRequest(req, bodyText)
  const { mockResponse, chunks, headersObject } = createMockResponse()
  ...
}
```


### GET Handler

Handles requests for the Ruru (GraphiQL like) interface. This handler uses `createMockRequest` to adapt the Next.js request and `createMockRespose` for the response.

*Of note: Postgraphile V5 does support querying using GET, see the example here: https://github.com/graphile/crystal/blob/main/grafast/grafserv/examples/graphile.config.mjs but that is not being used in this example*

```typescript
export async function GET(req: NextRequest) {
  ...
  const mockRequest = createMockRequest(req)
  const { mockResponse, chunks, headersObject } = createMockResponse()
  ...
}
```


### PostGraphile Configuration

The PostGraphile instance is configured with the Amber preset and connects to the PostgreSQL database specified in the DATABASE_URL environment variable. This configuration enables the Ruru (GraphiQL like) web interface and sets up the database schema.

```typescript
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
```



# Next Boiler Plate:

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
