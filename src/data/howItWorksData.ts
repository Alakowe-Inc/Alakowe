export interface GuideArticle {
  id: string
  title: string
  content: string | string[]
  bullets?: string[]
}

export interface GuideCategory {
  id: string
  number: string
  title: string
  subtitle: string
  iconName: string
  articleCount: number
  articles: GuideArticle[]
}

export const welcomeText = {
  greeting: "HEY READER,",
  title: "You've found our How it Works page. Welcome!",
  body: "If you are new here, or just trying to understand how everything on Alakowe works, you’re in the right place. We have put this together to guide you through buying, selling, requesting, delivery, payments, and everything in between. Take your time, explore, and you’ll find what you need. And if something still isn’t clear, we’re always here to help.",
}

export const guideCategories: GuideCategory[] = [
  {
    id: "getting-started",
    number: "01",
    title: "GETTING STARTED",
    subtitle: "What is Alákòwé, why join, and account basics",
    iconName: "Sparkles",
    articleCount: 8,
    articles: [
      {
        id: "what-is-alakowe",
        title: "What is Alákòwé?",
        content: `Alákòwé is a community marketplace where readers can buy, sell, and request books. Every book on Alákòwé comes from someone's personal bookshelf — students, parents, teachers, professionals, collectors, libraries, and book lovers who believe great books deserve another reader. If you're looking for an affordable textbook, searching for a rare novel, or hoping to earn money from books you've finished reading, Alákòwé brings readers together in one trusted place.`
      },
      {
        id: "why-sell-books",
        title: "Why sell your books?",
        content: `Your bookshelf is worth more than you think. Books you've finished reading can become someone else's next favourite read while earning you extra money. Every book you sell helps another reader access affordable books, and every 25 books successfully sold on Alákòwé helps save one tree by extending the life of books already in circulation.`
      },
      {
        id: "why-buy-secondhand",
        title: "Why buy second-hand books?",
        content: `Buying second-hand books is one of the easiest ways to save money while giving great books another life. You'll often find books at significantly lower prices than buying new, including novels, children's books, business books, and academic textbooks. Every purchase also supports another reader and reduces unnecessary waste by keeping books in circulation for longer.`
      },
      {
        id: "why-sell-on-alakowe",
        title: "Why sell on Alákòwé?",
        content: `Alákòwé was built by readers, for readers. Unlike a general marketplace, every feature on Alákòwé is designed specifically for books, from condition guides and secure payments to personal bookstores and book requests. When you sell on Alákòwé, you're joining a growing community of independent booksellers who are helping books find new readers across Nigeria.`
      },
      {
        id: "how-alakowe-protects",
        title: "How Alákòwé protects buyers and sellers",
        content: `Trust is at the heart of everything we do. When a buyer pays for a book, the payment is held securely by Alákòwé. The seller is only paid after the buyer receives the book and confirms that everything matches the listing. If there's ever a problem, our team steps in to review the situation fairly and help both parties reach a resolution. This protects buyers from inaccurate listings and protects sellers from unfair payment disputes.`
      },
      {
        id: "creating-account",
        title: "Creating your account",
        content: `Creating an Alákòwé account only takes a few minutes. Simply click Sign Up, enter your details, verify your email address, and you're ready to start buying, selling, or requesting books. Creating an account is completely free.`
      },
      {
        id: "logging-in",
        title: "Logging in",
        content: `Click Log In and enter the email address and password you used when creating your account. Once you're signed in, you'll be able to access your purchases, listings, bookstore, earnings, requests, and account settings. If you're having trouble logging in, make sure you're using the correct email address or reset your password.`
      },
      {
        id: "resetting-password",
        title: "Resetting your password",
        content: `Forgot your password? No problem. Select Forgot Password on the login page and enter your registered email address. We'll send you a secure link that allows you to create a new password. For your security, password reset links expire after a limited time.`
      },
      {
        id: "updating-profile",
        title: "Updating your profile",
        content: `You can update your account information at any time. Go to Profile to edit details such as: Your name, Profile photo, Phone number, Address, and Bank details. Keeping your information up to date helps ensure smoother transactions and faster communication.`
      }
    ]
  },
  {
    id: "buying-books",
    number: "02",
    title: "BUYING BOOKS",
    subtitle: "How to order, delivery options, conditions & receiving orders",
    iconName: "ShoppingCart",
    articleCount: 16,
    articles: [
      {
        id: "how-do-i-buy",
        title: "How do I buy a book?",
        content: "Search for a book by title, author, category, or tags. Find the book you’d like to buy, review the condition, photos, delivery model, and seller notes. Add it to your cart and complete checkout securely. We'll notify the seller immediately, and your order begins its journey to you. You can track every step from My Purchases."
      },
      {
        id: "understanding-book-conditions-buying",
        title: "Understanding book conditions",
        content: "Every listing includes a condition selected by the seller. Books may be listed as: New, Like New, Very Good, Good, or Fair. We encourage you to read both the condition notes before making a purchase. Many pre-loved books may contain light highlighting, notes, or signs of use, which will always be disclosed by the seller."
      },
      {
        id: "buying-multiple-books",
        title: "Buying multiple books from different sellers",
        content: "Yes, you can buy as many books from different independent sellers as you'd like in a single order. Simply add each book to your cart before checking out. We'll coordinate the fulfillment to make the experience as seamless as possible. One of the best things about Alákòwé is that you're not limited to buying from a single bookstore."
      },
      {
        id: "one-checkout-explained",
        title: "One checkout explained",
        content: "Instead of paying separately for every seller, Alákòwé lets you complete your purchase in a single checkout. Behind the scenes, we coordinate each order individually while giving you one simple buying experience."
      },
      {
        id: "how-home-delivery-works",
        title: "How Does Home Delivery Work?",
        content: "Once your payment is confirmed, the seller is notified to drop the book off at Speedaf collection centre within 48 hours. Speedaf transports the book to Alákòwé's Processing Centre in Lagos for inspection. If your order contains books from multiple sellers, we wait for all to arrive before packing them together in one shipment to your delivery address."
      },
      {
        id: "delivery-timelines-buying",
        title: "Delivery timelines",
        content: "Estimated delivery times are: Lagos (4–7 working days), Other supported states (6–10 working days). Delivery times may vary during holidays or severe weather."
      },
      {
        id: "tracking-your-order",
        title: "Tracking your order",
        content: "Every order can be tracked from your account. Visit My Purchases → Track Order to see each stage of your order from payment confirmation to final delivery."
      },
      {
        id: "receiving-your-order",
        title: "Receiving Your Order",
        content: "Inspect your book as soon as it arrives. Open the package and inspect your book(s) carefully. Once satisfied: Go to My Purchases → Select Track Order → Tap Delivered (Buyer Confirmed) → Select Satisfied. Payment will then be released to the seller."
      },
      {
        id: "reporting-an-issue",
        title: "Reporting an Issue",
        content: "If there's an issue with your order, please report it within 12 hours of receiving it. Go to My Purchases → Track Order → Tap Delivered → Select Report an Issue. Briefly explain what happened with clear photos."
      },
      {
        id: "valid-issues-to-report",
        title: "Valid issues to report",
        content: "Valid issues include: receiving the wrong book, wrong edition, condition significantly worse than described, or major undisclosed damage. Change of mind or minor described signs of wear are not valid issues."
      },
      {
        id: "twelve-hour-reporting-window",
        title: "The 12-hour reporting window",
        content: "Please report transit damage within 12 hours with photos. If no issue is reported within 12 hours, we assume the order was received in satisfactory condition and complete the transaction."
      },
      {
        id: "how-buyer-pickup-works",
        title: "How Does Buyer Pickup Work?",
        content: "Purchase the book as usual. Payment is securely held in escrow. Seller contact & pickup address become available after payment. Arrange a convenient pickup time, meet the seller, inspect the book, and confirm the order when satisfied."
      },
      {
        id: "when-seller-address-shared",
        title: "When is the seller's address shared?",
        content: "The seller's address and contact information are never displayed publicly. They become available only after payment has been successfully completed for that specific order."
      },
      {
        id: "what-to-check-before-accepting",
        title: "What should I check before accepting the book?",
        content: "Check that the title is correct, the edition matches the listing, condition matches description, and no major damage was omitted before confirming."
      },
      {
        id: "what-if-something-feels-wrong",
        title: "What if something feels wrong?",
        content: "Don't complete the transaction if something doesn't seem right. Contact Alákòwé immediately. For safe pickup: meet during daytime in public locations, inspect first, and prioritize your safety."
      },
      {
        id: "when-do-i-confirm-pickup",
        title: "When do I confirm pickup?",
        content: "Only confirm after you've received the book, inspected it, and confirmed it matches the listing: Go to My Purchases → Track Order → Tap Delivered → Select Satisfied."
      }
    ]
  },
  {
    id: "selling-books",
    number: "03",
    title: "SELLING BOOKS",
    subtitle: "Listing, condition guidelines, photos, drop-off & payouts",
    iconName: "PlusCircle",
    articleCount: 14,
    articles: [
      {
        id: "what-books-can-i-sell",
        title: "What books can I sell?",
        content: "We welcome a wide variety of books: Fiction, Non-Fiction, Primary & Secondary School Textbooks, Higher Institution Textbooks, Exam Preparation, Children's Books, Religious Books, Professional & Educational Books, and others. Every book should be complete, readable, and accurately represented."
      },
      {
        id: "books-we-dont-accept",
        title: "Books we don't accept",
        content: "Pirated or photocopied books, books with missing pages, unreadable books, books promoting hate or illegal activity, counterfeit publications, or prohibited materials are strictly not accepted."
      },
      {
        id: "understanding-conditions-selling",
        title: "Understanding book conditions (Seller Guide)",
        content: "Books can be listed as: New (Unread, pristine), Like New (Almost new, minimal wear), Very Good (Clearly used but well kept, light creases), Good (Solid reading condition, noticeable wear/highlighting), or Fair (Heavily used, scuffed but complete and readable)."
      },
      {
        id: "taking-good-photos",
        title: "Taking good photos",
        content: "Photos build buyer trust! Include: Front cover, Back cover, Spine, Inside pages (where necessary), and any noticeable imperfections. Use natural lighting and avoid heavy filters."
      },
      {
        id: "declaring-book-condition",
        title: "Declaring book condition",
        content: "Be transparent! Include overall condition, any writing/highlighting, missing accessories, edition, and anything a buyer should know upfront."
      },
      {
        id: "love-notes-selling",
        title: "Leaving a note for the next reader (Love Notes)",
        content: "Love Notes are short messages sellers can leave inside books for the next reader—a favorite quote, encouragement, or lesson. It turns a second-hand book into something deeply meaningful."
      },
      {
        id: "how-do-i-list-edit-remove",
        title: "How do I list / edit / remove a book?",
        content: "Select List a Book/Sell, enter details, upload photos, set condition, price, and fulfillment option. Once approved, it goes live. You can edit any time before it sells, or unpublish under My Listings → Select Book → Unpublish."
      },
      {
        id: "why-listings-get-rejected",
        title: "Why listings get rejected",
        content: "Common reasons include: poor quality photos, missing information, incorrect category, unclear condition, or duplicate/prohibited listings. We'll provide feedback so you can resubmit."
      },
      {
        id: "fulfillment-options-explained",
        title: "Drop off, Buyer Pickup or Both?",
        content: "Choose Drop off if you prefer not to meet in person—take the book to Speedaf within 48h using your waybill number. Choose Buyer Pickup if you prefer direct handover after secure payment confirmation. Offering Both helps your books sell faster!"
      },
      {
        id: "which-option-sells-faster",
        title: "Which option helps books sell faster?",
        content: "Sellers who offer Home Delivery or Both generally receive more interest because buyers love the convenience and flexibility."
      },
      {
        id: "can-i-change-fulfillment",
        title: "Can I change my fulfillment option?",
        content: "Yes, you can edit fulfillment options anytime under My Listings → Edit Listing before a book is purchased."
      },
      {
        id: "what-happens-after-a-sale",
        title: "What happens after a sale?",
        content: "For Home Delivery: package securely and drop off at Speedaf within 48 hours. For Buyer Pickup: arrange a safe meeting with the buyer after payment confirmation."
      },
      {
        id: "tracking-your-sales",
        title: "Tracking your sales",
        content: "Track every stage under My Sales: Payment Received → Awaiting Action → Dropped Off → Received by Alákòwé → Dispatched → Delivered → Completed."
      },
      {
        id: "order-cancellation-seller",
        title: "Order cancellation",
        content: "Orders may be cancelled if seller cannot fulfill, inspection fails, or seller is unresponsive. In such cases, buyers receive a full refund."
      }
    ]
  },
  {
    id: "disputes-trust",
    number: "04",
    title: "DISPUTES, REFUNDS & TRUST",
    subtitle: "Buyer & seller protections, inspection & fair dispute resolution",
    iconName: "ShieldCheck",
    articleCount: 9,
    articles: [
      {
        id: "buyer-issue-reporting",
        title: "If something isn’t right with your order (Buyer)",
        content: "Every eligible purchase is protected. Go to My Purchases → Track Order → Report an Issue. Upload photos and explain the problem. We review before releasing payment."
      },
      {
        id: "valid-reporting-reasons",
        title: "Valid reasons to report an issue",
        content: "Wrong book, wrong edition, condition significantly worse than described, or major undisclosed damage."
      },
      {
        id: "uncovered-issues",
        title: "Issues that aren't covered",
        content: "Change of mind, minor wear already shown/described, or normal pre-loved signs of use."
      },
      {
        id: "seller-protection-explained",
        title: "How we protect sellers",
        content: "If a buyer reports a problem, we carefully inspect the listing, description, photos, and physical book. If the listing was accurate, payment is released to the seller as normal."
      },
      {
        id: "dual-side-protection",
        title: "How we protect both sides (Buyer & Seller)",
        content: "Two-step verification: First inspection at Alákòwé Processing Centre before dispatch, and final inspection by buyer upon delivery. Payment is released only after confirmation."
      },
      {
        id: "mismatch-handling",
        title: "If something doesn’t match",
        content: "If a major mismatch is found during inspection, the order is cancelled, buyer receives a full refund, and we arrange return or collection of the book with the seller."
      },
      {
        id: "reporting-platform-issues",
        title: "Reporting an issue on the platform",
        content: "Help us keep Alákòwé safe! Report fraudulent listings, harassment, offensive content, or attempts to move payments off-platform."
      },
      {
        id: "privacy-policy-summary",
        title: "Privacy and Data Protection",
        content: "Personal details are never shown publicly. Contact details for Buyer Pickup are shared only after payment. Payment info is never shared."
      },
      {
        id: "pickup-safety-guidelines",
        title: "Safety during Buyer Pickup",
        content: "Arrange convenient daytime meetings in safe public locations. Inspect the book before confirming receipt, and contact Alákòwé immediately if anything feels suspicious."
      }
    ]
  },
  {
    id: "delivery-logistics",
    number: "05",
    title: "DELIVERY, LOGISTICS & PICKUP",
    subtitle: "Speedaf drop-offs, tracking timelines & responsibilities",
    iconName: "Truck",
    articleCount: 10,
    articles: [
      {
        id: "dropping-off-book",
        title: "Dropping off your book",
        content: "Go to My Sales → Open order → Confirm → Take book to selected Speedaf collection centre within 48 hours with your waybill number. Dropping off quickly means faster payment!"
      },
      {
        id: "tracking-shipments",
        title: "Tracking shipments",
        content: "Both buyers and sellers get step-by-step updates from My Purchases and My Sales throughout the shipping process."
      },
      {
        id: "delivery-timelines-logistics",
        title: "Delivery timelines",
        content: "Lagos: 4–7 working days. Other supported states: 6–10 working days."
      },
      {
        id: "seller-responsibilities",
        title: "Seller responsibilities",
        content: "Keep books available, present the exact listed book in declared condition, respect buyer's time, and notify us immediately if circumstances change."
      },
      {
        id: "buyer-responsibilities",
        title: "Buyer responsibilities",
        content: "Inspect the book before confirming, respect seller's time, and only tap confirm after receiving and verifying the book."
      },
      {
        id: "delayed-delivery",
        title: "What if my delivery is delayed?",
        content: "If tracking hasn't updated for an unusually long period, contact Alákòwé support. We will investigate with Speedaf logistics."
      },
      {
        id: "lost-package",
        title: "What if my package appears lost?",
        content: "Notify us immediately if a package cannot be located in transit. We will investigate and process appropriate resolutions."
      },
      {
        id: "unupdated-tracking",
        title: "What if my tracking hasn't been updated?",
        content: "Reach out to support if tracking is stalled beyond a reasonable period so we can investigate."
      },
      {
        id: "third-party-receipt",
        title: "Can someone else receive my delivery?",
        content: "Yes! Just ask them to inspect carefully upon arrival. If there is transit damage, report within 12 hours with photos."
      },
      {
        id: "damaged-package-arrival",
        title: "What if my package arrives damaged?",
        content: "Take photos immediately and report through your order page within 12 hours. We will investigate and resolve fairly."
      }
    ]
  },
  {
    id: "payments",
    number: "06",
    title: "PAYMENTS & ESCROW",
    subtitle: "How escrow works, buyer safety, payouts & bank setup",
    iconName: "Wallet",
    articleCount: 11,
    articles: [
      {
        id: "is-payment-safe",
        title: "Is my payment safe (Buyer)?",
        content: "Yes! Every payment is protected. Funds are safely held in escrow until you receive and confirm your book matches the listing."
      },
      {
        id: "escrow-explained",
        title: "How does Escrow work?",
        content: "Escrow holds your money safely while the order is completed: You pay → Alákòwé holds funds → Seller sends book → You inspect & confirm → Seller gets paid."
      },
      {
        id: "cancelling-payment",
        title: "Can I cancel a payment?",
        content: "If you need to cancel an order right after placing it, contact support immediately. Availability depends on fulfillment stage."
      },
      {
        id: "failed-payment",
        title: "What happens if my payment fails?",
        content: "Common causes: insufficient funds, bank/network errors. Check if debited, wait a few minutes, and contact support if funds were deducted without order creation."
      },
      {
        id: "refunds-overview",
        title: "When do I receive a refund?",
        content: "Refunds occur when an order cannot be fulfilled or a dispute is resolved in buyer's favor (e.g. wrong book, cancellation before dispatch)."
      },
      {
        id: "refund-timelines",
        title: "How long do refunds take?",
        content: "Approved refunds take 24 to 72 hours depending on your bank / payment provider."
      },
      {
        id: "when-do-sellers-get-paid",
        title: "When do I get paid (Seller)?",
        content: "Payout is released after buyer confirms delivery (or pickup receipt)."
      },
      {
        id: "why-not-paid-immediately",
        title: "Why isn't the seller paid immediately?",
        content: "Holding funds ensures buyers receive correct books and sellers know funds are secured before dispatch—building trust across Alákòwé."
      },
      {
        id: "bank-setup",
        title: "How do I add/change my bank account?",
        content: "Go to My Account → Bank Details to enter Account Name, Number, and Bank before receiving payouts."
      },
      {
        id: "payout-timeline",
        title: "Payout timeline",
        content: "Once released, payouts are completed within 24 to 48 hours directly into your bank account."
      },
      {
        id: "failed-payouts",
        title: "Failed payouts",
        content: "If a payout fails (e.g. incorrect account details), we will notify you to review details and re-attempt transfer."
      }
    ]
  },
  {
    id: "my-bookstore",
    number: "07",
    title: "MY BOOKSTORE",
    subtitle: "Your personal shop, shareable link & selling strategies",
    iconName: "Store",
    articleCount: 7,
    articles: [
      {
        id: "what-is-my-bookstore",
        title: "What is My Bookstore?",
        content: "My Bookstore is your personal shop on Alákòwé! All your books are grouped together on one shareable page that belongs to you. Every seller gets one automatically after their first approved listing."
      },
      {
        id: "is-bookstore-free",
        title: "Do I need to pay for a bookstore?",
        content: "No! Creating and maintaining your bookstore is 100% free with no setup fees or subscriptions."
      },
      {
        id: "multiple-books-from-bookstore",
        title: "Can people buy multiple books from my bookstore?",
        content: "Yes! Buyers can add as many books as they like from your store in one single checkout."
      },
      {
        id: "sharing-bookstore",
        title: "Can I share my bookstore page?",
        content: "Absolutely! Every bookstore has its own shareable link. Post it on WhatsApp, Instagram, Facebook, X, or email to reach more readers."
      },
      {
        id: "selling-more-books",
        title: "How can I sell more books?",
        content: "High quality photos, honest descriptions, and regularly updating your inventory attract returning readers."
      },
      {
        id: "home-delivery-bookstore-impact",
        title: "Does offering Home Delivery help?",
        content: "Yes! Sellers who offer Home Delivery or Both attract significantly more buyers due to delivery flexibility."
      },
      {
        id: "building-bookstore-over-time",
        title: "Can I build a bookstore over time?",
        content: "Yes! Start with a few books and watch your bookstore naturally grow into a curated collection."
      }
    ]
  },
  {
    id: "book-requests",
    number: "08",
    title: "BOOK REQUESTS",
    subtitle: "Requesting unlisted books, waitlists & matching notifications",
    iconName: "BookOpenCheck",
    articleCount: 12,
    articles: [
      {
        id: "what-is-book-request",
        title: "What is a Book Request?",
        content: "If a book isn't listed yet, Book Requests let you notify the community! We'll notify you as soon as a seller lists a matching copy."
      },
      {
        id: "creating-a-request",
        title: "How do I create a Book Request?",
        content: "Go to Book Requests → Select Create a Request → Enter Title, Author, details, and publish."
      },
      {
        id: "request-visibility",
        title: "Who can see my request?",
        content: "Book Requests are visible to the community so sellers know what readers are actively searching for. Your personal contact details are never shared."
      },
      {
        id: "joining-waitlist",
        title: "Joining an existing waitlist",
        content: "If someone already requested the book you want, join their waitlist! It measures demand and notifies everyone when listed."
      },
      {
        id: "why-join-instead-of-duplicate",
        title: "Why should I join instead of creating another request?",
        content: "It keeps the marketplace organized, measures true demand, and encourages sellers to list popular titles faster."
      },
      {
        id: "request-notifications",
        title: "Notifications",
        content: "When a matching book is listed, Alákòwé notifies you immediately via email."
      },
      {
        id: "request-matching-system",
        title: "How does matching work?",
        content: "Our system continuously checks new listings against active requests and alerts interested waitlist members."
      },
      {
        id: "request-guarantee",
        title: "Does creating a request guarantee I'll get the book?",
        content: "It doesn't guarantee a seller has or will list it, but higher request counts signal strong demand to booksellers!"
      },
      {
        id: "multiple-requests",
        title: "Can I request more than one book?",
        content: "Yes! You can create separate requests for as many titles as you need."
      },
      {
        id: "requesting-textbooks",
        title: "Can I request textbooks?",
        content: "Yes! Textbooks, exam prep, and higher education books are among the most requested items. Be sure to specify the edition."
      },
      {
        id: "rare-books-requests",
        title: "Can I request rare or out-of-print books?",
        content: "Yes! Posting a request alerts collectors and readers who might have a copy on their bookshelf."
      },
      {
        id: "book-request-tips",
        title: "Book request tips",
        content: "Use exact title, author name, specify edition, and search existing requests first for best results."
      }
    ]
  },
  {
    id: "my-account",
    number: "09",
    title: "MY ACCOUNT",
    subtitle: "Profile, security, bank details, order history & settings",
    iconName: "User",
    articleCount: 5,
    articles: [
      {
        id: "updating-account-profile",
        title: "Updating your profile",
        content: "Edit photo, full name, phone number, address, and bookstore bio anytime under My Account → Profile."
      },
      {
        id: "changing-password",
        title: "Changing your password",
        content: "Go to My Account → Security → Change Password. Enter current password, confirm new password, and save."
      },
      {
        id: "bank-account-management",
        title: "Bank account management",
        content: "Add or update valid Nigerian bank details under My Account → Bank Details to receive seamless payouts."
      },
      {
        id: "order-history-dashboards",
        title: "Order history & dashboards",
        content: "Review My Purchases, My Sales, My Listings, and My Earnings from your central account dashboard."
      },
      {
        id: "deleting-account",
        title: "Deleting your account",
        content: "Contact support if you wish to close your account. All active orders, sales, and payouts must be completed first."
      }
    ]
  },
  {
    id: "tips-best-practices",
    number: "10",
    title: "TIPS & BEST PRACTICES",
    subtitle: "Sell faster, pricing advice, photography & textbook tips",
    iconName: "Lightbulb",
    articleCount: 10,
    articles: [
      {
        id: "sell-books-faster",
        title: "How do I sell my books faster?",
        content: "Clear well-lit photos, honest detailed descriptions, competitive pricing, and offering Home Delivery or Both options."
      },
      {
        id: "pricing-tips",
        title: "Pricing tips",
        content: "Consider book condition, edition, current market demand, and price of similar books on Alákòwé to offer great value."
      },
      {
        id: "better-book-photos",
        title: "Better book photos",
        content: "Use natural light, photograph front/back covers, spine, and clearly show any markings or wear."
      },
      {
        id: "writing-condition-notes",
        title: "Writing better condition notes",
        content: "Be transparent about highlighting, notes, edition, or minor damage to build trust and avoid disputes."
      },
      {
        id: "pausing-bookstore",
        title: "Temporarily close your bookstore",
        content: "Going on holiday? Toggle Bookstore to Off in My Listings so buyers don't place orders while you're away."
      },
      {
        id: "packaging-books",
        title: "Package books carefully",
        content: "Keep books clean, dry, protect corners, and seal packages securely before dropping off at Speedaf."
      },
      {
        id: "quick-response-times",
        title: "Respond quickly after a sale",
        content: "Prompt drop-off leads to faster buyer delivery, earlier payout release, and positive seller reviews."
      },
      {
        id: "buying-textbooks-guide",
        title: "Buying textbooks",
        content: "Double-check title, author, required edition, and publisher against your school syllabus before purchasing."
      },
      {
        id: "successful-book-requests-tips",
        title: "Making successful Book Requests",
        content: "Use exact titles, specify edition, author name, and check existing requests before creating new ones."
      },
      {
        id: "check-before-confirming",
        title: "Check before confirming receipt",
        content: "Always inspect title, edition, condition, and pages upon receipt before tapping confirm."
      }
    ]
  },
  {
    id: "about-community",
    number: "11",
    title: "ABOUT THE COMMUNITY",
    subtitle: "Love Notes, sustainability, independent sellers & the Alákòwé story",
    iconName: "Heart",
    articleCount: 8,
    articles: [
      {
        id: "what-is-love-note",
        title: "What is a Love Note?",
        content: "Love Notes are short messages sellers leave inside books for the next reader—a quote, encouragement, or lesson learned."
      },
      {
        id: "why-love-notes-matter",
        title: "Why do Love Notes matter?",
        content: "They connect readers across generations, reminding us that every book carries a human story."
      },
      {
        id: "supporting-readers-nigeria",
        title: "Supporting Readers Across Nigeria",
        content: "Affordable books create educational opportunities for students, teachers, and book lovers nationwide."
      },
      {
        id: "supporting-independent-booksellers",
        title: "Supporting Independent Booksellers",
        content: "Every purchase directly supports everyday readers, students, parents, and micro-booksellers."
      },
      {
        id: "keeping-books-in-circulation",
        title: "Helping Books Stay in Circulation",
        content: "A finished book isn't a finished story. Reusing books extends their life and keeps wisdom moving."
      },
      {
        id: "books-and-the-planet",
        title: "Books and the Planet",
        content: "Every 25 books sold on Alákòwé helps save one tree by extending the life of existing books."
      },
      {
        id: "the-alakowe-story",
        title: "The Alákòwé Story",
        content: "Built on one simple belief: books deserve another reader. Connecting bookshelves with readers across Nigeria."
      },
      {
        id: "join-the-community",
        title: "Join the Community",
        content: "Every book bought, sold, or requested builds a stronger reading community across Nigeria. Welcome!"
      }
    ]
  },
  {
    id: "general-faq",
    number: "12",
    title: "GENERAL FAQ",
    subtitle: "Quick answers to the most frequently asked questions",
    iconName: "HelpCircle",
    articleCount: 22,
    articles: [
      {
        id: "faq-multiple-books",
        title: "Can I buy more than one book at a time?",
        content: "Yes! Add multiple books to your cart and checkout in a single transaction."
      },
      {
        id: "faq-different-sellers",
        title: "Can I buy books from different sellers?",
        content: "Absolutely! Shop from multiple independent sellers in one order, consolidated whenever possible."
      },
      {
        id: "faq-contact-seller",
        title: "Can I contact a seller before buying?",
        content: "No. Contact info is shared only after payment confirmation for Buyer Pickup to protect community privacy."
      },
      {
        id: "faq-cant-find-book",
        title: "What if I can't find the book I'm looking for?",
        content: "Create a Book Request! We'll notify you as soon as a matching copy is listed."
      },
      {
        id: "faq-cancel-order",
        title: "Can I cancel my order?",
        content: "Contact support immediately after placing your order. Cancellation depends on fulfillment progress."
      },
      {
        id: "faq-change-address",
        title: "Can I change my delivery address after ordering?",
        content: "Contact support right away. We'll assist if the order hasn't entered delivery processing."
      },
      {
        id: "faq-delivery-time",
        title: "How long does delivery take?",
        content: "Lagos: 4–7 working days. Other states: 6–10 working days."
      },
      {
        id: "faq-arrive-together",
        title: "Will all my books arrive together?",
        content: "Yes! Orders from multiple sellers are consolidated at our Lagos Processing Centre into one delivery."
      },
      {
        id: "faq-someone-else-receive",
        title: "Can someone else receive my order?",
        content: "Yes. Ask them to inspect carefully upon arrival. Any transit issues must be reported within 12 hours with photos."
      },
      {
        id: "faq-buyer-pickup-process",
        title: "What happens during Buyer Pickup?",
        content: "Seller contact is shared post-payment. You arrange pickup, inspect the book, and confirm receipt."
      },
      {
        id: "faq-pickup-suspicious",
        title: "What if something feels wrong during Buyer Pickup?",
        content: "Don't confirm transaction! Contact Alákòwé support immediately to investigate."
      },
      {
        id: "faq-listing-cost",
        title: "How much does it cost to list a book?",
        content: "Nothing! Listing books on Alákòwé is 100% free."
      },
      {
        id: "faq-approval-time",
        title: "How long does approval take?",
        content: "Listings are reviewed promptly and you'll be notified as soon as it goes live."
      },
      {
        id: "faq-listing-rejection",
        title: "Why was my listing rejected?",
        content: "Unclear photos, missing info, wrong category, or guidelines mismatch. We'll provide exact feedback to resubmit."
      },
      {
        id: "faq-edit-remove-listing",
        title: "Can I edit/remove my listing?",
        content: "Yes! Update price, description, photos, or unpublish anytime before the book is sold."
      },
      {
        id: "faq-never-sells",
        title: "What if my book never sells?",
        content: "It stays listed as long as you'd like. Consider updating photos, description, or pricing to attract buyers."
      },
      {
        id: "faq-fulfillment-speed",
        title: "Which fulfilment option sells faster?",
        content: "Books offering Home Delivery or Both attract more buyers due to delivery convenience."
      },
      {
        id: "faq-is-payment-safe",
        title: "Is my payment safe?",
        content: "Yes! Protected via Alákòwé escrow until you inspect and confirm receipt."
      },
      {
        id: "faq-when-seller-paid",
        title: "When do sellers get paid?",
        content: "After buyer confirms receipt or applicable confirmation window completes without issue."
      },
      {
        id: "faq-direct-payment",
        title: "Can buyers pay sellers directly?",
        content: "No. All payments must go through Alákòwé's secure system to keep everyone protected."
      },
      {
        id: "faq-refund-process",
        title: "How do refunds work?",
        content: "Approved refunds are returned to your original payment method within 24–72 hours."
      },
      {
        id: "faq-disappearing-buyer",
        title: "What happens if the buyer disappears during Buyer Pickup?",
        content: "Notify support! We will contact the buyer or cancel/refund the order appropriately."
      }
    ]
  }
]
