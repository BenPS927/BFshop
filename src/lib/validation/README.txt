Validation schemas and guards.
Use zod schemas per feature and share them across UI and API boundaries.

validation is where you define what “valid” means for your app. Think of it as your bouncer at the door. If somebody tries to create an order with missing fields, wrong status, or bad shape, validation catches it before it causes damage.