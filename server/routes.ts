import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactRequestSchema, insertBookingRequestSchema } from "@shared/schema";
import { z } from "zod";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(validatedData);
      res.json({ success: true, id: contactRequest.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid request data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to submit contact request" });
      }
    }
  });

  // Booking form submission
  app.post("/api/booking", async (req, res) => {
    try {
      const validatedData = insertBookingRequestSchema.parse(req.body);
      const bookingRequest = await storage.createBookingRequest(validatedData);
      res.json({ success: true, id: bookingRequest.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid booking data", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to submit booking request" });
      }
    }
  });

  // Get all contact requests (for admin purposes)
  app.get("/api/contact-requests", async (req, res) => {
    try {
      const contactRequests = await storage.getAllContactRequests();
      res.json(contactRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact requests" });
    }
  });

  // Get all booking requests (for admin purposes)
  app.get("/api/booking-requests", async (req, res) => {
    try {
      const bookingRequests = await storage.getAllBookingRequests();
      res.json(bookingRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking requests" });
    }
  });

  // PayPal integration routes - as per blueprint:javascript_paypal
  app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/paypal/order", async (req, res) => {
    // Request body should contain: { intent, amount, currency }
    await createPaypalOrder(req, res);
  });

  app.post("/paypal/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  const httpServer = createServer(app);
  return httpServer;
}
