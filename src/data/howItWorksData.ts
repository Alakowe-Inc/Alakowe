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
    articleCount: 9,
    articles: [
      {
        id: "what-is-alakowe",
        title: "What is Alákòwé?",
        content: `Alákòwé is a community marketplace where readers can buy, sell, and request books.\n\nEvery book on Alákòwé comes from someone's personal bookshelf, students, parents, teachers, professionals, collectors, libraries, and book lovers who believe great books deserve another reader.\n\nIf you're looking for an affordable textbook, searching for a rare novel, or hoping to earn money from books you've finished reading, Alákòwé brings readers together in one trusted place.`
      },
      {
        id: "why-sell-books",
        title: "Why sell your books?",
        content: `Your bookshelf is worth more than you think.\n\nBooks you've finished reading can become someone else's next favourite read while earning you extra money.\n\nEvery book you sell helps another reader access affordable books, and every 25 books successfully sold on Alákòwé helps save one tree by extending the life of books already in circulation.`
      },
      {
        id: "why-buy-secondhand",
        title: "Why buy second-hand books?",
        content: `Buying second-hand books is one of the easiest ways to save money while giving great books another life.\n\nYou'll often find books at significantly lower prices than buying new, including novels, children's books, business books, and academic textbooks.\n\nEvery purchase also supports another reader and reduces unnecessary waste by keeping books in circulation for longer.`
      },
      {
        id: "why-sell-on-alakowe",
        title: "Why sell on Alákòwé?",
        content: `Alákòwé was built by readers, for readers.\n\nUnlike a general marketplace, every feature on Alákòwé is designed specifically for books, from condition guides and secure payments to personal bookstores and book requests.\n\nWhen you sell on Alákòwé, you're joining a growing community of independent booksellers who are helping books find new readers across Nigeria.`
      },
      {
        id: "how-alakowe-protects",
        title: "How Alákòwé protects buyers and sellers",
        content: `Trust is at the heart of everything we do.\n\nWhen a buyer pays for a book, the payment is held securely by Alákòwé.\n\nThe seller is only paid after the buyer receives the book and confirms that everything matches the listing.\n\nIf there's ever a problem, our team steps in to review the situation fairly and help both parties reach a resolution.\n\nThis protects buyers from inaccurate listings and protects sellers from unfair payment disputes.`
      },
      {
        id: "creating-account",
        title: "Creating your account",
        content: `Creating an Alákòwé account only takes a few minutes.\n\nSimply click Sign Up, enter your details, verify your email address, and you're ready to start buying, selling, or requesting books.\n\nCreating an account is completely free.`
      },
      {
        id: "logging-in",
        title: "Logging in",
        content: `Click Log In and enter the email address and password you used when creating your account.\n\nOnce you're signed in, you'll be able to access your purchases, listings, bookstore, earnings, requests, and account settings.\n\nIf you're having trouble logging in, make sure you're using the correct email address or reset your password.`
      },
      {
        id: "resetting-password",
        title: "Resetting your password",
        content: `Forgot your password? No problem.\n\nSelect Forgot Password on the login page and enter your registered email address.\n\nWe'll send you a secure link that allows you to create a new password.\n\nFor your security, password reset links expire after a limited time.`
      },
      {
        id: "updating-profile",
        title: "Updating your profile",
        content: `You can update your account information at any time.\n\nGo to Profile to edit details such as:\n• Your name\n• Profile photo\n• Phone number\n• Address\n• Bank details\n\nKeeping your information up to date helps ensure smoother transactions and faster communication.`
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
        content: `1. Search for book with book title, author, category, tags\n2. Find the book you’d like to buy.\n3. Review the condition, photos, delivery model, and seller notes.\n4. Add it to your cart.\n5. Complete checkout securely.\n6. We'll notify the seller immediately.\n\nFrom there, your order begins its journey to you. You can track every step from My Purchases.`
      },
      {
        id: "understanding-book-conditions-buying",
        title: "Understanding book conditions",
        content: `Every listing includes a condition selected by the seller.\n\nBooks may be listed as:\n• New\n• Like New\n• Very Good\n• Good\n• Fair\n\nWe encourage you to read both the condition notes before making a purchase. Many pre-loved books may contain light highlighting, notes, or signs of use, which will always be disclosed by the seller.`
      },
      {
        id: "buying-multiple-books",
        title: "Buying multiple books from different sellers",
        content: `Yes, you can buy as many books from different independent sellers as you'd like in a single order. Simply add each book to your cart before checking out.\n\nWe'll coordinate the fulfillment as one to make the experience as seamless as possible. One of the best things about Alákòwé is that you're not limited to buying from a single bookstore.\n\nFeel free to browse across multiple independent booksellers and purchase the books you need in one checkout.`
      },
      {
        id: "one-checkout-explained",
        title: "One checkout explained",
        content: `Instead of paying separately for every seller, Alákòwé lets you complete your purchase in a single checkout.\n\nBehind the scenes, we coordinate each order individually while giving you one simple buying experience.\n\nIt's one of the ways we make buying from independent booksellers easier.`
      },
      {
        id: "how-courier-delivery-works",
        title: "How Does Courier Delivery Work?",
        content: `Once your payment is confirmed:\n1. The seller is notified immediately by email.\n2. The seller goes to My Sales and schedules a drop-off at their nearest Speedaf centre.\n3. The seller generates a waybill number for the order.\n4. The seller takes the packaged book and waybill number to the selected Speedaf centre within 48 working hours.\n5. Speedaf processes the book and sends it to Alákòwé's office in Lagos.\n6. If your order contains books from multiple sellers, we'll wait for the remaining books to arrive before gathering them into one shipment.\n7. Alákòwé then dispatches the order to you.\n\nFor a single-book order, Alákòwé may send the book directly from Speedaf to you or receive it at our Lagos office first, depending on what works best for the order.\n\nThe seller's fulfilment responsibility ends once they have successfully dropped the book at the selected Speedaf centre.`
      },
      {
        id: "delivery-timelines-buying",
        title: "Delivery timelines",
        content: `Estimated delivery times are:\n\nLagos:\n4–7 working days.\n\nOther supported states:\n6–10 working days.\n\nDelivery times may vary during holidays, severe weather, or other unforeseen circumstances.`
      },
      {
        id: "tracking-your-order",
        title: "Tracking your order",
        content: `Every order can be tracked from your account.\n\nSimply visit:\nMy Purchases → Track Order\n\nYou'll see each stage of your order, from payment confirmation to final delivery.`
      },
      {
        id: "receiving-your-order",
        title: "Receiving Your Order",
        content: `Inspect your book as soon as it arrives.\n\nWhen your order is delivered, please open the package and inspect your book(s) as soon as possible. If someone else receives the package on your behalf, ask them to check the contents carefully before accepting it.\n\nOnce you're happy with your order:\n1. Go to My Purchases.\n2. Select Track Order.\n3. Tap Delivered (Buyer Confirmed).\n4. Select Satisfied.\n\nOnce you confirm your order, payment will be released to the seller.`
      },
      {
        id: "reporting-an-issue",
        title: "Reporting an Issue",
        content: `If there's an issue with your order, please report it within 12 hours of receiving it.\n\nTo report an issue:\n1. Go to My Purchases.\n2. Select Track Order.\n3. Tap Delivered (Buyer Confirmed).\n4. Select Report an Issue.\n5. Briefly explain what happened, with photos.\n\nWe'll review the information and work towards a fair resolution.`
      },
      {
        id: "valid-issues-to-report",
        title: "Valid issues to report",
        content: `You should report your order if:\n• You received the wrong book.\n• You received the wrong edition.\n• The book's condition is significantly worse than described.\n• The book has major damage that wasn't disclosed in the listing.\n\nWhat isn't considered a valid issue?\nWe generally won't approve claims based on:\n• Changing your mind after purchase.\n• Minor signs of wear that were clearly described or shown in the listing.\n• Normal characteristics of pre-loved books, such as light creases, small notes, or gentle signs of use.`
      },
      {
        id: "twelve-hour-reporting-window",
        title: "The 12-hour reporting window",
        content: `If your book appears to have been damaged in transit, please report it within 12 hours and include clear photos of both the packaging and the book.\n\nWe'll investigate the issue and work towards a fair resolution. You won't be held responsible for damage caused during delivery.\n\nIf no issue is reported within 12 hours of delivery, we'll assume your order was received in satisfactory condition and the transaction will be completed.`
      },
      {
        id: "how-buyer-pickup-works",
        title: "How Does Buyer Pickup Work?",
        content: `Buyer Pickup depends on the fulfilment option selected by the seller. If the seller offers Pickup or Either:\n\n1. Review the pickup address shown on the listing.\n2. Make sure you're comfortable with the location before purchasing.\n3. Complete payment securely through Alákòwé.\n4. After payment, you'll be able to select an available pickup date.\n5. The seller will be notified of the selected pickup date.\n6. Your pickup code and the seller's phone number will become available to you.\n7. Contact the seller to arrange the pickup.\n8. Collect and inspect the book.\n9. Give the seller your pickup code.\n10. Confirm delivery or raise a dispute through Alákòwé.\n\nThe seller cannot mark the order as picked up without the pickup code.`
      },
      {
        id: "when-seller-address-shared",
        title: "When is the seller's address shared?",
        content: `For books offered with Pickup or Either, the pickup address is visible on the book listing so you can review the location before deciding to buy.\n\nSellers are encouraged to use a safe, popular landmark close to their location rather than their exact home address.\n\nFor Buyer Pickup orders, the seller's phone number becomes available to the buyer after payment and once a pickup date has been selected.\n\nThe phone number is removed from the buyer's view once the order is completed.`
      },
      {
        id: "what-to-check-before-accepting",
        title: "What should I check before accepting the book?",
        content: `Before confirming your order, check that:\n• The title is correct.\n• The edition matches the listing.\n• The condition matches the description.\n• No major damage has been omitted.\n\nOnce you confirm receipt, the transaction moves to the next stage.`
      },
      {
        id: "what-if-something-feels-wrong",
        title: "What if something feels wrong?",
        content: `Don't complete the transaction if something doesn't seem right. Instead, contact Alákòwé immediately. Our team will review the situation and guide you on the next steps before any payment is released.\n\nSafety tips:\nFor a safe pickup experience:\n• Meet during the daytime whenever possible.\n• Choose a safe and convenient location.\n• Inspect the book before confirming the order.\n\nIf anything makes you uncomfortable, contact Alákòwé immediately.`
      },
      {
        id: "when-do-i-confirm-pickup",
        title: "When do I confirm pickup?",
        content: `Only confirm the order after you've:\n1. Received the book.\n2. Inspected it.\n3. Confirmed it matches the listing.\n\nSteps:\n1. Go to My Purchases.\n2. Select Track Order.\n3. Tap Delivered (Buyer Confirmed).\n4. Select Satisfied.`
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
        content: `We welcome a wide variety of books on Alákòwé, provided they're in readable condition and honestly described.\n\nYou can list:\n• Fiction\n• Non-Fiction\n• Primary School Textbooks\n• Secondary School Textbooks\n• Higher Institution Textbooks\n• Exam Preparation Books\n• Children's Books\n• Religious Books\n• Professional & Educational Books\n• Others\n\nEvery book should be complete, readable, and accurately represented in your listing.`
      },
      {
        id: "books-we-dont-accept",
        title: "Books we don't accept",
        content: `To keep our marketplace safe and trustworthy, some books cannot be listed.\n\nThese include:\n• Pirated or photocopied books\n• Books with missing pages\n• Books that are no longer readable\n• Books promoting hate, violence, or illegal activity\n• Counterfeit publications\n• Offensive or prohibited material\n\nIf we're unable to approve your listing, we'll explain why so you can make the necessary changes.`
      },
      {
        id: "understanding-conditions-selling",
        title: "Understanding book conditions",
        content: `Choosing the correct condition helps buyers know exactly what to expect.\n\nBooks can be listed as:\n\nNew (Unread)\nPristine and unused. No marks, no writing, no highlighting, no creases or folds. Pages clean and binding perfect.\n\nLike New\nAlmost new, with very little sign of use. Very light wear on cover/edges, clean pages, binding intact.\n\nVery Good\nClearly used, but well kept. Light creases or small signs of use, pages intact, may contain light highlighting or small notes.\n\nGood\nUsed, but still in solid reading condition. Noticeable wear on cover or edges, pages slightly yellowed, readable.\n\nFair\nHeavily used, but still readable. Visible wear, yellowed pages, writing present, binding slightly loose but not falling apart.`
      },
      {
        id: "taking-good-photos",
        title: "Taking good photos",
        content: `Photos are one of the biggest factors that influence whether a book sells.\n\nWe recommend including:\n• Front cover\n• Back cover\n• Spine\n• Inside pages (where necessary)\n• Any noticeable imperfections\n\nUse natural lighting whenever possible and avoid blurry or heavily edited photos.`
      },
      {
        id: "declaring-book-condition",
        title: "Declaring book condition",
        content: `An honest condition note answers the questions a buyer would naturally ask.\n\nInclude details such as:\n• The overall condition\n• Any writing or highlighting\n• Missing accessories (if applicable)\n• The edition\n• Anything a buyer should know before purchasing`
      },
      {
        id: "love-notes-selling",
        title: "Leaving a note for the next reader",
        content: `Love Notes are short messages that booksellers can choose to leave inside their books for the next reader.\n\nIt could be:\n• A favourite quote.\n• A word of encouragement.\n• A lesson the book taught you.\n• A simple "Enjoy this book."\n\nIt's a small gesture that turns a second-hand book into something even more meaningful.`
      },
      {
        id: "how-do-i-list-edit-remove",
        title: "How do I list/edit/remove a book?",
        content: `Listing a book only takes a few minutes:\n1. Select List a Book/Sell\n2. Enter the book details.\n3. Upload clear photos.\n4. Explain the condition.\n5. Set your price.\n6. Choose your fulfilment option.\n7. Submit your listing for review.\n\nOnce approved, your book becomes visible. To remove an unsold book: My Listings → Select Book → Unpublish.`
      },
      {
        id: "why-listings-get-rejected",
        title: "Why listings get rejected",
        content: `Every listing is reviewed before going live.\n\nCommon reasons for rejection include:\n• Poor quality photos\n• Missing information\n• Incorrect category\n• Unclear condition\n• Prohibited books\n• Duplicate listings`
      },
      {
        id: "fulfillment-options-explained",
        title: "Drop off, Buyer Pickup or Both?",
        content: `Choose Drop off if you'd prefer not to meet buyers in person:\n1. Receive notification & waybill number.\n2. Package book securely.\n3. Take to nearest Speedaf centre within 48 hours.\n\nChoose Pickup if you'd like the buyer to collect directly:\n1. Buyer completes payment.\n2. Arrange convenient pickup time.\n3. Buyer inspects & provides pickup code.\n\nSellers offering Both generally sell faster!`
      },
      {
        id: "which-option-sells-faster",
        title: "Which option helps books sell faster?",
        content: `While every book is different, sellers who offer Pickup or Either may sell faster because they give buyers more flexibility. If you're comfortable with both options, Either gives buyers the choice.`
      },
      {
        id: "can-i-change-fulfillment",
        title: "Can I change my fulfillment option?",
        content: `Yes! You can update your fulfilment option at any time before your book is purchased under My Listings → Edit Listing.`
      },
      {
        id: "what-happens-after-a-sale",
        title: "What happens after a sale?",
        content: `If Courier: Package securely, drop off at Speedaf within 48h, Alákòwé inspects and delivers to buyer.\n\nIf Buyer Pickup: Arrange pickup, buyer inspects and enters code, payment is released.`
      },
      {
        id: "tracking-your-sales",
        title: "Tracking your sales",
        content: `Every sale can be tracked from My Sales through status updates: Payment Received → Awaiting Action → Drop-off Scheduled → Dropped Off → Received by Alákòwé → Inspection & Processing → Dispatched → Delivered → Completed.`
      },
      {
        id: "order-cancellation-seller",
        title: "Order cancellation",
        content: `Orders may be cancelled if seller cannot fulfil, book differs from listing, or seller is unresponsive. Buyers receive a full refund.`
      }
    ]
  },
  {
    id: "disputes-trust",
    number: "04",
    title: "DISPUTES, REFUNDS & TRUST",
    subtitle: "Buyer & seller protections, inspection & fair dispute resolution",
    iconName: "ShieldCheck",
    articleCount: 8,
    articles: [
      {
        id: "buyer-issue-reporting",
        title: "If something isn’t right with your order (buyer)",
        content: `Every eligible purchase on Alákòwé is protected:\n1. Go to My Purchases.\n2. Open Track Order.\n3. Select Report an Issue.\n4. Upload clear photos.\n5. Tell us what happened.`
      },
      {
        id: "valid-reporting-reasons",
        title: "Valid reasons to report an issue",
        content: `• Wrong book\n• Wrong edition\n• Book condition significantly worse than described\n• Major undisclosed damage`
      },
      {
        id: "uncovered-issues",
        title: "Issues that aren't covered",
        content: `• Change of mind\n• Minor wear already shown or described in the listing\n• Normal signs of use expected with pre-loved books`
      },
      {
        id: "seller-protection-explained",
        title: "How we protect sellers",
        content: `If a buyer reports a problem, we review the listing, photos, description, physical book, and report. If the listing was accurate, payment is released as normal. If there's a minor difference, partial refund may be offered. If major difference, order is cancelled.`
      },
      {
        id: "dual-side-protection",
        title: "How we protect both sides (buyer & seller)",
        content: `First inspection happens at Alákòwé Processing Centre before dispatch. Final inspection happens when buyer receives the book. Payment is released only after confirmation.`
      },
      {
        id: "reporting-platform-issues",
        title: "Reporting an issue",
        content: `Please report fraudulent listings, suspicious activity, harassment, offensive content, or attempts to move payments outside Alákòwé.`
      },
      {
        id: "privacy-policy-summary",
        title: "Privacy",
        content: `Personal information is never displayed publicly unless required for transaction. Pickup addresses and phone numbers are shared securely only after payment.`
      },
      {
        id: "pickup-safety-guidelines",
        title: "Safety during Buyer Pickup",
        content: `Meet during daytime, use safe popular landmarks, inspect before confirming, and never share payment outside Alákòwé.`
      }
    ]
  },
  {
    id: "delivery-logistics",
    number: "05",
    title: "DELIVERY, LOGISTICS & BUYER PICK UP",
    subtitle: "Speedaf drop-offs, tracking timelines & responsibilities",
    iconName: "Truck",
    articleCount: 10,
    articles: [
      {
        id: "dropping-off-book",
        title: "Dropping off your book",
        content: `1. Go to My Sales.\n2. Open the order.\n3. Click “Awaiting Seller Confirmation’ and confirm.\n4. Take the book to your selected Speedaf collection centre within 48 hours.\n5. Follow instructions provided in your email.`
      },
      {
        id: "tracking-shipments",
        title: "Tracking shipments",
        content: `Both buyers and sellers can track orders from My Purchases (Buyers) and My Sales (Sellers).`
      },
      {
        id: "delivery-timelines-logistics",
        title: "Delivery timelines",
        content: `Lagos: 4–7 working days.\nOther supported states: 6–10 working days.`
      },
      {
        id: "seller-responsibilities",
        title: "Seller responsibilities",
        content: `Keep the book available, respect time, present exact listed book in declared condition, and contact support if unable to complete.`
      },
      {
        id: "buyer-responsibilities",
        title: "Buyer responsibilities",
        content: `Review location, select pickup date, contact seller, inspect book before confirming, and provide pickup code.`
      },
      {
        id: "delayed-delivery",
        title: "What if my delivery is delayed?",
        content: `Contact Alákòwé if tracking hasn't updated for an unusually long period. We'll investigate with logistics partners.`
      },
      {
        id: "lost-package",
        title: "What if my package appears lost?",
        content: `Notify us immediately if package cannot be located in transit for proper resolution.`
      },
      {
        id: "unupdated-tracking",
        title: "What if my tracking hasn't been updated?",
        content: `Contact support team if tracking hasn't changed for more than a reasonable period.`
      },
      {
        id: "third-party-receipt",
        title: "Can someone else receive my delivery?",
        content: `Yes! Ask them to inspect carefully. Report any issues within 12 hours with photos.`
      },
      {
        id: "damaged-package-arrival",
        title: "What if my package arrives damaged?",
        content: `Take clear photos immediately and report through your order page within 12 hours.`
      }
    ]
  },
  {
    id: "payments",
    number: "06",
    title: "PAYMENTS & PAYOUTS",
    subtitle: "Escrow safety, refunds, seller payouts & bank management",
    iconName: "Wallet",
    articleCount: 11,
    articles: [
      {
        id: "is-payment-safe",
        title: "Is my payment safe (buyer)?",
        content: `Yes! Every payment is safely held until you've received your book and confirmed it matches the listing.`
      },
      {
        id: "escrow-explained",
        title: "How does Escrow work?",
        content: `1. You pay for your order.\n2. Alákòwé securely holds payment.\n3. Seller sends or hands over book.\n4. You inspect & confirm.\n5. Seller is paid.`
      },
      {
        id: "cancelling-payment",
        title: "Can I cancel a payment?",
        content: `Contact Alákòwé immediately if you need to cancel an order before fulfillment begins.`
      },
      {
        id: "failed-payment",
        title: "What happens if my payment fails?",
        content: `Check if debited, refresh order history, or contact support if money was deducted without order creation.`
      },
      {
        id: "refunds-overview",
        title: "When do I receive a refund?",
        content: `Refunds occur when order cannot be completed, item is wrong/damaged, or order is cancelled before completion.`
      },
      {
        id: "refund-timelines",
        title: "How long do refunds take?",
        content: `Approved refunds take 24 to 72 hours depending on bank/provider.`
      },
      {
        id: "when-do-sellers-get-paid",
        title: "When do I get paid (seller)?",
        content: `Payment is released after buyer receives and confirms delivery or pickup.`
      },
      {
        id: "why-not-paid-immediately",
        title: "Why isn't the seller paid immediately?",
        content: `Holding payment protects buyers from wrong items and ensures sellers know funds are secured.`
      },
      {
        id: "bank-setup",
        title: "How do I add/change my bank account?",
        content: `Go to My Account → Bank Details to enter Account Name, Number, and Bank.`
      },
      {
        id: "payout-timeline",
        title: "Payout timeline",
        content: `Once requested after release, Alákòwé credits payouts within 24 hours.`
      },
      {
        id: "failed-payouts",
        title: "Failed payouts",
        content: `If payout fails, we notify you to verify bank details before re-attempting transfer.`
      }
    ]
  },
  {
    id: "my-bookstore",
    number: "07",
    title: "MY BOOKSTORE",
    subtitle: "Your personal shop, shareable page & selling tips",
    iconName: "Store",
    articleCount: 7,
    articles: [
      {
        id: "what-is-my-bookstore",
        title: "What is My Bookstore?",
        content: `My Bookstore is your personal shop on Alákòwé. All your books are grouped together on one dedicated page that belongs to you.`
      },
      {
        id: "is-bookstore-free",
        title: "Do I need to pay for a bookstore?",
        content: `No! Creating and maintaining your bookstore is completely free.`
      },
      {
        id: "multiple-books-from-bookstore",
        title: "Can people buy multiple books from my bookstore?",
        content: `Yes! Buyers can add multiple books from your store in one checkout.`
      },
      {
        id: "sharing-bookstore",
        title: "Can I share my bookstore page?",
        content: `Absolutely! Share your link on WhatsApp, Instagram, Facebook, X, LinkedIn, or Email.`
      },
      {
        id: "selling-more-books",
        title: "How can I sell more books?",
        content: `High-quality photos, honest descriptions, and regularly updating listings help sell more.`
      },
      {
        id: "home-delivery-bookstore-impact",
        title: "Does offering Pickup or Either help?",
        content: `Yes! Offering flexible options attracts more buyers.`
      },
      {
        id: "building-bookstore-over-time",
        title: "Can I build a bookstore over time?",
        content: `Yes! Start small and grow your bookstore into a collection reflecting your interests.`
      }
    ]
  },
  {
    id: "book-requests",
    number: "08",
    title: "BOOK REQUESTS",
    subtitle: "Requesting books, waitlists & matching notifications",
    iconName: "BookOpenCheck",
    articleCount: 12,
    articles: [
      {
        id: "what-is-book-request",
        title: "What is a Book Request?",
        content: `Book Requests let you tell the community what book you're looking for. We notify you when it's listed.`
      },
      {
        id: "creating-a-request",
        title: "How do I create a Book Request?",
        content: `1. Go to Book Requests.\n2. Select Create a Request.\n3. Enter title, author, details, and publish.`
      },
      {
        id: "request-visibility",
        title: "Who can see my request?",
        content: `Book Requests are visible to the community, but contact details are never shared.`
      },
      {
        id: "joining-waitlist",
        title: "Joining an existing waitlist",
        content: `Join an existing request instead of creating a duplicate to signal demand.`
      },
      {
        id: "why-join-instead-of-duplicate",
        title: "Why should I join instead of creating another request?",
        content: `Keeps marketplace organized and notifies everyone interested at once.`
      },
      {
        id: "request-notifications",
        title: "Notifications",
        content: `We notify you via email as soon as a matching book is listed.`
      },
      {
        id: "request-matching-system",
        title: "How does matching work?",
        content: `Our system continuously checks new listings against active requests.`
      },
      {
        id: "request-guarantee",
        title: "Does creating a request guarantee I'll get the book?",
        content: `No, but higher request numbers encourage sellers to list copies.`
      },
      {
        id: "multiple-requests",
        title: "Can I request more than one book?",
        content: `Yes! Create separate requests for each title.`
      },
      {
        id: "requesting-textbooks",
        title: "Can I request textbooks?",
        content: `Yes! Include required edition details when requesting textbooks.`
      },
      {
        id: "rare-books-requests",
        title: "Can I request rare or out-of-print books?",
        content: `Yes! Alert community members who might own a copy.`
      },
      {
        id: "book-request-tips",
        title: "Book request tips",
        content: `Use correct title, author, edition, and check existing requests first.`
      }
    ]
  },
  {
    id: "my-account",
    number: "09",
    title: "TRUST & SAFETY",
    subtitle: "Updating profile, security, bank details & order history",
    iconName: "User",
    articleCount: 5,
    articles: [
      {
        id: "updating-account-profile",
        title: "Updating your profile",
        content: `Update photo, name, phone, address, and bio under My Account → Profile.`
      },
      {
        id: "changing-password",
        title: "Changing your password",
        content: `Go to My Account → Security → Change Password.`
      },
      {
        id: "bank-account-management",
        title: "Bank account",
        content: `Add valid Nigerian bank details under My Account → Bank Details.`
      },
      {
        id: "order-history-dashboards",
        title: "Order history",
        content: `Review My Purchases, My Sales, My Listings, and My Earnings.`
      },
      {
        id: "deleting-account",
        title: "Deleting your account",
        content: `Contact support after completing all active purchases, sales, and payouts.`
      }
    ]
  },
  {
    id: "tips-best-practices",
    number: "10",
    title: "TIPS & BEST PRACTICES",
    subtitle: "Tips for selling faster, photo guides & buyer advice",
    iconName: "Lightbulb",
    articleCount: 10,
    articles: [
      {
        id: "sell-books-faster",
        title: "How do I sell my books faster?",
        content: `Clear photos, honest descriptions, fair pricing, and flexible delivery options.`
      },
      {
        id: "pricing-tips",
        title: "Pricing tips",
        content: `Check market value and condition before setting a fair price.`
      },
      {
        id: "better-book-photos",
        title: "Better book photos",
        content: `Photograph covers, spine, and imperfections in natural light.`
      },
      {
        id: "writing-condition-notes",
        title: "Writing better condition notes",
        content: `Detail any marks or wear to build buyer trust.`
      },
      {
        id: "pausing-bookstore",
        title: "Temporarily close your bookstore",
        content: "Toggle Bookstore to Off in My Listings when traveling."
      },
      {
        id: "packaging-books",
        title: "Package books carefully",
        content: `Wrap securely to protect corners during transit.`
      },
      {
        id: "quick-response-times",
        title: "Respond quickly after a sale",
        content: `Prompt drop-off leads to faster payouts.`
      },
      {
        id: "buying-textbooks-guide",
        title: "Buying textbooks",
        content: `Verify title, author, and edition against your syllabus.`
      },
      {
        id: "successful-book-requests-tips",
        title: "Making successful Book Requests",
        content: `Provide accurate details and edition numbers.`
      },
      {
        id: "check-before-confirming",
        title: "Check before confirming receipt",
        content: `Inspect book before tapping delivered.`
      }
    ]
  },
  {
    id: "about-community",
    number: "11",
    title: "ABOUT THE COMMUNITY",
    subtitle: "Love Notes, sustainability & book lovers across Nigeria",
    iconName: "Heart",
    articleCount: 8,
    articles: [
      {
        id: "what-is-love-note",
        title: "What is a Love Note?",
        content: `Personal messages left inside books for the next reader.`
      },
      {
        id: "why-love-notes-matter",
        title: "Why do Love Notes matter?",
        content: `They connect readers through shared literary experiences.`
      },
      {
        id: "supporting-readers-nigeria",
        title: "Supporting Readers Across Nigeria",
        content: `Making reading accessible and affordable for all.`
      },
      {
        id: "supporting-independent-booksellers",
        title: "Supporting Independent Booksellers",
        content: `Empowering everyday readers to build mini-bookstores.`
      },
      {
        id: "keeping-books-in-circulation",
        title: "Helping Books Stay in Circulation",
        content: `Extending book life through reader-to-reader exchange.`
      },
      {
        id: "books-and-the-planet",
        title: "Books and the Planet",
        content: `Saving trees by recycling pre-loved books.`
      },
      {
        id: "the-alakowe-story",
        title: "The Alákòwé Story",
        content: `Connecting readers across Nigeria through shared love of books.`
      },
      {
        id: "join-the-community",
        title: "Join the Community",
        content: `Start buying, selling, or requesting today!`
      }
    ]
  },
  {
    id: "general-faq",
    number: "12",
    title: "FAQS",
    subtitle: "Quick answers to common questions",
    iconName: "HelpCircle",
    articleCount: 22,
    articles: [
      {
        id: "faq-multiple-books",
        title: "Can I buy more than one book at a time?",
        content: `Yes! Add multiple books to cart and checkout together.`
      },
      {
        id: "faq-different-sellers",
        title: "Can I buy books from different sellers?",
        content: `Yes! Buy from multiple sellers in one order.`
      },
      {
        id: "faq-contact-seller",
        title: "Can I contact a seller before buying?",
        content: `No. Contact details shared post-payment for pickup orders.`
      },
      {
        id: "faq-cant-find-book",
        title: "What if I can't find the book I'm looking for?",
        content: `Create a Book Request!`
      },
      {
        id: "faq-cancel-order",
        title: "Can I cancel my order?",
        content: `Contact support immediately after ordering.`
      },
      {
        id: "faq-change-address",
        title: "Can I change my delivery address after ordering?",
        content: `Contact support right away.`
      },
      {
        id: "faq-delivery-time",
        title: "How long does delivery take?",
        content: `Lagos: 4–7 working days. Other states: 6–10 working days.`
      },
      {
        id: "faq-arrive-together",
        title: "Will all my books arrive together?",
        content: `Yes, consolidated at our processing centre.`
      },
      {
        id: "faq-someone-else-receive",
        title: "Can someone else receive my order?",
        content: `Yes, report any transit issues within 12 hours.`
      },
      {
        id: "faq-buyer-pickup-process",
        title: "What happens during Buyer Pickup?",
        content: `Contact shared post-payment to arrange pickup.`
      },
      {
        id: "faq-pickup-suspicious",
        title: "What if something feels wrong during Buyer Pickup?",
        content: `Do not confirm. Contact support.`
      },
      {
        id: "faq-listing-cost",
        title: "How much does it cost to list a book?",
        content: `100% free.`
      },
      {
        id: "faq-approval-time",
        title: "How long does approval take?",
        content: `Listings reviewed promptly within 24 hours.`
      },
      {
        id: "faq-listing-rejection",
        title: "Why was my listing rejected?",
        content: `Feedback provided for quick resubmission.`
      },
      {
        id: "faq-edit-remove-listing",
        title: "Can I edit/remove my listing?",
        content: `Edit or unpublish under My Listings anytime before sale.`
      },
      {
        id: "faq-never-sells",
        title: "What if my book never sells?",
        content: `Stays listed until sold or unpublished.`
      },
      {
        id: "faq-fulfillment-speed",
        title: "Which fulfilment option sells faster?",
        content: `Home Delivery or Both.`
      },
      {
        id: "faq-is-payment-safe",
        title: "Is my payment safe?",
        content: `Protected via escrow.`
      },
      {
        id: "faq-when-seller-paid",
        title: "When do sellers get paid?",
        content: `After buyer confirms delivery/pickup.`
      },
      {
        id: "faq-direct-payment",
        title: "Can buyers pay sellers directly?",
        content: `No, all payments go through Alákòwé escrow.`
      },
      {
        id: "faq-refund-process",
        title: "How do refunds work?",
        content: `Processed within 24–72 hours to original payment method.`
      },
      {
        id: "faq-disappearing-buyer",
        title: "What happens if the buyer disappears during Buyer Pickup?",
        content: `Contact support for assistance.`
      }
    ]
  }
]
