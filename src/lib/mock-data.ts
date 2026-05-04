export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "User" | "Seller";
  status: "Active" | "Suspended" | "Flagged" | "Banned";
  joined: string;
  orders: number;
  listings: number;
}

export interface Listing {
  id: string;
  title: string;
  seller: string;
  price: number;
  status: "Pending" | "Approved" | "Rejected" | "Flagged" | "Sold";
  cover: string;
  condition: string;
  category: string;
  listedAt: string;
}

export const users: UserRow[] = [
  { id: "U001", name: "Amara Okonkwo", email: "amara@example.com", role: "User", status: "Active", joined: "Jan 2024", orders: 12, listings: 0 },
  { id: "U002", name: "Tunde Bakare", email: "tunde@example.com", role: "Seller", status: "Active", joined: "Feb 2024", orders: 3, listings: 8 },
  { id: "U003", name: "Ngozi Adeyemi", email: "ngozi@example.com", role: "Seller", status: "Flagged", joined: "Mar 2024", orders: 5, listings: 14 },
  { id: "U004", name: "Emeka Nwosu", email: "emeka@example.com", role: "User", status: "Active", joined: "Apr 2024", orders: 7, listings: 0 },
  { id: "U005", name: "Funmi Alade", email: "funmi@example.com", role: "Seller", status: "Suspended", joined: "Jan 2024", orders: 1, listings: 3 },
  { id: "U006", name: "Kola Adetoye", email: "kola@example.com", role: "User", status: "Active", joined: "May 2024", orders: 4, listings: 0 },
  { id: "U007", name: "Bisi Olawale", email: "bisi@example.com", role: "Seller", status: "Active", joined: "Mar 2024", orders: 2, listings: 22 },
  { id: "U008", name: "Chidi Okeke", email: "chidi@example.com", role: "User", status: "Active", joined: "Jun 2024", orders: 9, listings: 0 },
];

export const listings: Listing[] = [
  { id: "L001", title: "Things Fall Apart", seller: "Tunde Bakare", price: 2500, status: "Pending", cover: "from-amber-400 to-orange-500", condition: "Good", category: "Fiction", listedAt: "2 days ago" },
  { id: "L002", title: "Purple Hibiscus", seller: "Bisi Olawale", price: 3200, status: "Approved", cover: "from-purple-400 to-pink-500", condition: "Very Good", category: "Fiction", listedAt: "1 week ago" },
  { id: "L003", title: "Half of a Yellow Sun", seller: "Ngozi Adeyemi", price: 4000, status: "Pending", cover: "from-yellow-400 to-amber-500", condition: "Fair", category: "Fiction", listedAt: "3 days ago" },
  { id: "L004", title: "Season of Migration", seller: "Tunde Bakare", price: 1800, status: "Flagged", cover: "from-teal-400 to-cyan-500", condition: "Good", category: "Fiction", listedAt: "5 days ago" },
  { id: "L005", title: "Americanah", seller: "Bisi Olawale", price: 3500, status: "Approved", cover: "from-blue-400 to-indigo-500", condition: "Like New", category: "Fiction", listedAt: "2 weeks ago" },
  { id: "L006", title: "Arrow of God", seller: "Funmi Alade", price: 2200, status: "Rejected", cover: "from-green-400 to-emerald-500", condition: "Fair", category: "Fiction", listedAt: "1 day ago" },
  { id: "L007", title: "The Famished Road", seller: "Kola Adetoye", price: 2800, status: "Pending", cover: "from-red-400 to-rose-500", condition: "Good", category: "Fiction", listedAt: "4 days ago" },
  { id: "L008", title: "So Long a Letter", seller: "Ngozi Adeyemi", price: 1500, status: "Sold", cover: "from-violet-400 to-purple-500", condition: "Good", category: "Fiction", listedAt: "3 weeks ago" },
];

export const orders = [
  { id: "#ORD-001", buyer: "Amara Okonkwo", book: "Things Fall Apart", amount: 2500, status: "Delivered" },
  { id: "#ORD-002", buyer: "Emeka Nwosu", book: "Purple Hibiscus", amount: 3200, status: "Processing" },
  { id: "#ORD-003", buyer: "Chidi Okeke", book: "Half of a Yellow Sun", amount: 4000, status: "Shipped" },
  { id: "#ORD-004", buyer: "Amara Okonkwo", book: "Americanah", amount: 3500, status: "Delivered" },
  { id: "#ORD-005", buyer: "Kola Adetoye", book: "Season of Migration", amount: 1800, status: "Cancelled" },
  { id: "#ORD-006", buyer: "Chidi Okeke", book: "Arrow of God", amount: 2200, status: "Processing" },
];

export const revenueSeries = [
  { month: "Jul", revenue: 120000, orders: 34 },
  { month: "Aug", revenue: 185000, orders: 52 },
  { month: "Sep", revenue: 143000, orders: 41 },
  { month: "Oct", revenue: 220000, orders: 63 },
  { month: "Nov", revenue: 198000, orders: 57 },
  { month: "Dec", revenue: 310000, orders: 89 },
  { month: "Jan", revenue: 275000, orders: 78 },
  { month: "Feb", revenue: 330000, orders: 94 },
  { month: "Mar", revenue: 290000, orders: 83 },
  { month: "Apr", revenue: 415000, orders: 118 },
  { month: "May", revenue: 380000, orders: 108 },
  { month: "Jun", revenue: 450000, orders: 128 },
];

export const userGrowth = [
  { week: "W1", users: 120, sellers: 18 },
  { week: "W2", users: 145, sellers: 22 },
  { week: "W3", users: 163, sellers: 27 },
  { week: "W4", users: 188, sellers: 31 },
  { week: "W5", users: 210, sellers: 38 },
  { week: "W6", users: 245, sellers: 44 },
  { week: "W7", users: 278, sellers: 51 },
  { week: "W8", users: 312, sellers: 58 },
];

export const topSellers = [
  { name: "Bisi Olawale", books: 22, rating: 4.9, revenue: 87500 },
  { name: "Tunde Bakare", books: 8, rating: 4.7, revenue: 54200 },
  { name: "Ngozi Adeyemi", books: 14, rating: 4.5, revenue: 43800 },
  { name: "Kola Adetoye", books: 6, rating: 4.8, revenue: 31400 },
  { name: "Funmi Alade", books: 3, rating: 4.2, revenue: 18700 },
];

export const activityFeed = [
  { text: "New seller registration: Bisi Olawale", time: "2 min ago" },
  { text: "Order #ORD-012 marked as delivered", time: "8 min ago" },
  { text: "Listing flagged for review: 'Season of Migration'", time: "15 min ago" },
  { text: "Payment of ₦87,500 processed for Tunde Bakare", time: "1 hr ago" },
  { text: "New book request: 'Weep Not, Child'", time: "2 hr ago" },
  { text: "User Emeka Nwosu completed their first purchase", time: "3 hr ago" },
];

export const statCards = [
  { key: "users", label: "Total Users", value: "3,241", delta: "+12%", icon: "Users", currency: false },
  { key: "sellers", label: "Active Sellers", value: "418", delta: "+8%", icon: "Store", currency: false },
  { key: "listings", label: "Book Listings", value: "1,892", delta: "+23%", icon: "BookOpen", currency: false },
  { key: "orders", label: "Orders This Month", value: "128", delta: "+18%", icon: "ShoppingBag", currency: false },
  { key: "pending", label: "Pending Reviews", value: "34", delta: "-5%", icon: "Clock", currency: false },
  { key: "revenue", label: "Revenue", value: "₦450k", delta: "+31%", icon: "DollarSign", currency: true },
  { key: "disputes", label: "Open Disputes", value: "7", delta: "-12%", icon: "Flag", currency: false },
  { key: "activity", label: "Platform Health", value: "98.4%", delta: "+0.2%", icon: "Activity", currency: false },
];

export const dropOffs = [
  { id: "DO-001", seller: "Tunde Bakare", hub: "Yaba Hub", books: 3, status: "Pending", date: "Today" },
  { id: "DO-002", seller: "Bisi Olawale", hub: "Ikeja Hub", books: 7, status: "Verified", date: "Yesterday" },
  { id: "DO-003", seller: "Ngozi Adeyemi", hub: "VI Hub", books: 2, status: "Pending", date: "Today" },
  { id: "DO-004", seller: "Funmi Alade", hub: "Lekki Hub", books: 4, status: "Rejected", date: "2 days ago" },
  { id: "DO-005", seller: "Kola Adetoye", hub: "Yaba Hub", books: 1, status: "Verified", date: "3 days ago" },
];

export const payouts = [
  { id: "PAY-001", seller: "Bisi Olawale", amount: 87500, status: "Paid", date: "Jun 1, 2024" },
  { id: "PAY-002", seller: "Tunde Bakare", amount: 54200, status: "Pending", date: "Jun 3, 2024" },
  { id: "PAY-003", seller: "Ngozi Adeyemi", amount: 43800, status: "Paid", date: "May 28, 2024" },
  { id: "PAY-004", seller: "Kola Adetoye", amount: 31400, status: "Processing", date: "Jun 4, 2024" },
  { id: "PAY-005", seller: "Funmi Alade", amount: 18700, status: "Held", date: "Jun 2, 2024" },
];

export const pickupRequests = [
  { id: "PK-001", seller: "Tunde Bakare", address: "14 Allen Ave, Ikeja", books: 5, status: "Scheduled", date: "Jun 6, 2024" },
  { id: "PK-002", seller: "Ngozi Adeyemi", address: "22 Broad St, Lagos Island", books: 3, status: "Pending", date: "Jun 7, 2024" },
  { id: "PK-003", seller: "Kola Adetoye", address: "8 Admiralty Way, Lekki", books: 8, status: "Completed", date: "Jun 3, 2024" },
  { id: "PK-004", seller: "Bisi Olawale", address: "5 Herbert Macaulay, Yaba", books: 12, status: "Scheduled", date: "Jun 8, 2024" },
];

export const categoryBreakdown = [
  { name: "Fiction", value: 42 },
  { name: "Academic", value: 28 },
  { name: "Non-Fiction", value: 15 },
  { name: "Children", value: 9 },
  { name: "Other", value: 6 },
];
