import { type User, type InsertUser, type ContactRequest, type InsertContactRequest, type BookingRequest, type InsertBookingRequest } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactRequest(contactRequest: InsertContactRequest): Promise<ContactRequest>;
  createBookingRequest(bookingRequest: InsertBookingRequest): Promise<BookingRequest>;
  getAllContactRequests(): Promise<ContactRequest[]>;
  getAllBookingRequests(): Promise<BookingRequest[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactRequests: Map<string, ContactRequest>;
  private bookingRequests: Map<string, BookingRequest>;

  constructor() {
    this.users = new Map();
    this.contactRequests = new Map();
    this.bookingRequests = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactRequest(insertContactRequest: InsertContactRequest): Promise<ContactRequest> {
    const id = randomUUID();
    const contactRequest: ContactRequest = {
      ...insertContactRequest,
      id,
      company: insertContactRequest.company || null,
      phone: insertContactRequest.phone || null,
      createdAt: new Date(),
    };
    this.contactRequests.set(id, contactRequest);
    return contactRequest;
  }

  async createBookingRequest(insertBookingRequest: InsertBookingRequest): Promise<BookingRequest> {
    const id = randomUUID();
    const bookingRequest: BookingRequest = {
      ...insertBookingRequest,
      id,
      company: insertBookingRequest.company || null,
      message: insertBookingRequest.message || null,
      preferredTime: insertBookingRequest.preferredTime || null,
      createdAt: new Date(),
    };
    this.bookingRequests.set(id, bookingRequest);
    return bookingRequest;
  }

  async getAllContactRequests(): Promise<ContactRequest[]> {
    return Array.from(this.contactRequests.values());
  }

  async getAllBookingRequests(): Promise<BookingRequest[]> {
    return Array.from(this.bookingRequests.values());
  }
}

export const storage = new MemStorage();
