import { describe, it, expect } from "vitest";
import { getPublicSellerDisplayName, listingToBookDisplay } from "../lib/api/adapters";

describe("listingToBookDisplay", () => {
  it("should prefer the saved profile username over slug or email when building public seller names", () => {
    const defaultBook = listingToBookDisplay({
      id: 42,
      title: "Atomic Habits",
      author: "James Clear",
      price: 2000,
      storeSlug: "bookish-chioma",
      createdBy: "chioma@example.com",
    });

    expect(defaultBook.sellerName).toBe("bookish-chioma");

    const namedBook = listingToBookDisplay({
      id: 43,
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: 2500,
      storeSlug: "bookish-chioma",
      createdBy: "chioma@example.com",
      storeName: "Bookish Chioma",
    });

    expect(namedBook.sellerName).toBe("Bookish Chioma");

    expect(getPublicSellerDisplayName({
      storeSlug: "bookish-chioma",
      username: "chioma",
      userName: "chioma",
      storeName: "Bookish Chioma",
      createdBy: "chioma@example.com",
    })).toBe("chioma");
  });

  it("should not propagate a seller vacation flag onto individual books", () => {
    const book = listingToBookDisplay({
      id: 42,
      title: "Atomic Habits",
      author: "James Clear",
      price: 2000,
      isSellerOnVacation: true,
    });

    expect(book.isSellerOnVacation).toBeUndefined();
    expect(Object.prototype.hasOwnProperty.call(book, "isSellerOnVacation")).toBe(false);
  });
});
