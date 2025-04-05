import { postgraphile } from 'postgraphile'
import preset from './graphile.config' // the graphile.config.ts file is compiled to js, hence the .js on this import

export const pgl = postgraphile(preset)
