import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "691f77a2d63e9371c24f1dbb", 
  requiresAuth: true // Ensure authentication is required for all operations
});
