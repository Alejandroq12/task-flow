import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// RTL cannot auto-register cleanup without vitest globals — do it explicitly,
// otherwise rendered DOM leaks between tests.
afterEach(cleanup)
