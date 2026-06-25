import { handlers } from "@/auth";

// Expose Auth.js GET and POST handlers at /api/auth/*
export const { GET, POST } = handlers;
