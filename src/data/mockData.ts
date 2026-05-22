export type BookCondition = string
export type BookBadge = 'Best Value' | 'Recently Added' | null

export interface Book {
  id: string
  title: string
  author: string
  genre: string

  condition: string
  conditionNotes: string

  quantity: number
  format: string

  price: number
  discount?: number   // ← ADD THIS

  location: string
  badge: BookBadge
  coverColor: string

  description: string
  sellerName: string
  sellerUsername?: string
  sellerRating: number

  loveNote: string
}

export const books: Book[] = [
  {
    id: '1',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    genre: 'African Fiction',

    condition: 'Good',
    conditionNotes: 'Minor cover scuff, pages slightly yellowed',

    quantity: 1,
    format: 'Paperback',

    price: 2500,
    location: 'Lagos Island',
    badge: 'Best Value',
    coverColor: '#C8A97E',

    description:
      'A novel about pre-colonial life in the southeastern part of Nigeria and the arrival of Europeans during the late nineteenth century. One of the most widely read books in modern African literature.',

    sellerName: 'Chidi O.',
    sellerRating: 4.8,
    loveNote:
      'This book changed how I see myself and my roots. I hope it does the same for you.',
  },
  {
    id: '2',
    title: 'Purple Hibiscus',
    author: 'Chimamanda Ngozi Adichie',
    genre: 'African Fiction',

    condition: 'Good',
    conditionNotes: 'Small crease on spine, light pencil marks inside',

    quantity: 1,
    format: 'Paperback',

    price: 3000,
    location: 'Ibadan',
    badge: 'Recently Added',
    coverColor: '#9B5DE5',
    description:
      'A coming-of-age story about Kambili, a young girl who lives in a privileged household in Enugu, Nigeria, where love and religion are twisted into tools of control.',
    sellerName: 'Amaka T.',
    sellerRating: 4.6,
    loveNote:
      "Kambili's courage moved me to tears more than once. Pass it on to someone brave.",
  },
  {
    id: '3',
    title: 'Half of a Yellow Sun',
    author: 'Chimamanda Ngozi Adichie',
    genre: 'African Fiction',

    condition: 'Fair',
    conditionNotes: 'Faded spine, minor corner wear',

    quantity: 1,
    format: 'Paperback',

    price: 3500,
    location: 'Abuja',
    badge: null,
    coverColor: '#F4A261',
    description:
      'Set before and during the Nigerian Civil War, this novel centres on three characters — Ugwu, Olanna, and Richard — whose lives are transformed by love, loss, and the violence of history.',
    sellerName: 'Tunde M.',
    sellerRating: 4.9,
    loveNote: 'A story that must not be forgotten. Read it with tissue nearby.',
  },
  {
    id: '4',
    title: 'Americanah',
    author: 'Chimamanda Ngozi Adichie',
    genre: 'African Fiction',

    condition: 'Good',
    conditionNotes: 'Clean pages, small sticker residue on back cover',

    quantity: 1,
    format: 'Paperback',

    price: 4000,
    discount: 5, // ← add this
    location: 'Victoria Island, Lagos',
    badge: 'Best Value',
    coverColor: '#2D6A4F',
    description:
      'A story about race, identity, and love following Ifemelu, a young Nigerian woman who emigrates to America. Sharp, funny, and deeply honest.',
    sellerName: 'Ngozi A.',
    sellerRating: 4.7,
    loveNote: "This one made me think about home differently. It's a keeper — but I'm letting go.",
  },
  {
    id: '5',
    title: 'The Famished Road',
    author: 'Ben Okri',
    genre: 'African Fiction',

    condition: 'Fair',
    conditionNotes: 'Torn back cover corner, water stain on first 10 pages, heavy underlining',

    quantity: 1,
    format: 'Paperback',

    price: 2000,
    location: 'Port Harcourt',
    badge: 'Best Value',
    coverColor: '#E63946',
    description:
      'A magical realist novel about Azaro, an abiku — a spirit child who repeatedly chooses to be born, die, and return. Lyrical, visionary, and unforgettable.',
    sellerName: 'Emeka R.',
    sellerRating: 4.5,
    loveNote: "Azaro's world is unlike anything else. Enter with an open mind.",
  },
  {
    id: '6',
    title: 'Stay With Me',
    author: 'Ayobami Adeyemi',
    genre: 'African Fiction',

    condition: 'Like New',
    conditionNotes: 'Like new, no visible wear',

    quantity: 1,
    format: 'Paperback',

    price: 3200,
    location: 'Lagos',
    badge: 'Recently Added',
    coverColor: '#457B9D',
    description:
      "Set in Nigeria, this is a story about a couple whose marriage is tested by the inability to have children and the secrets they keep from each other.",
    sellerName: 'Funmi B.',
    sellerRating: 4.8,
    loveNote: 'I read this in two days. It will haunt you in the best way.',
  },
  {
  id: '7',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self Help',

    condition: 'Good',
    conditionNotes: 'Slight yellowing on edges',

    quantity: 1,
    format: 'Paperback',

    price: 4500,
    discount: 10, // ← add this

    location: 'Ikeja Lagos',
    badge: null,
    coverColor: '#1D3557',
    description:
      'A practical guide to building good habits and breaking bad ones through small, incremental changes. One of the most actionable books on personal growth.',
    sellerName: 'Kola D.',
    sellerRating: 4.9,
    loveNote: "Applied the 1% rule. Didn't need it anymore. Pass it forward.",
  },
  {
    id: '8',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Foreign Fiction',

    condition: 'Good',
    conditionNotes: 'Minor spine crease, small ink mark on page 34',

    quantity: 1,
    format: 'Paperback',

    price: 2800,
    location: 'Lekki, Lagos',
    badge: 'Best Value',
    coverColor: '#E9C46A',
    description:
      "A philosophical novel about Santiago, a young Andalusian shepherd's journey to the Egyptian pyramids, following his personal legend.",
    sellerName: 'Ada N.',
    sellerRating: 4.6,
    loveNote: "My personal legend led me to sell this. May it help you find yours.",
  },
]

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  body: string[]
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'why-nigerian-literature-deserves-a-seat-at-your-bedside',
    title: 'Why Nigerian Literature Deserves a Seat at Your Bedside',
    excerpt:
      "From Achebe to Adichie, the stories coming out of Nigeria have always been world-class. Here's why you should be reading them.",
    category: 'Nigerian Authors',
    date: 'March 28, 2025',
    readTime: '4 min read',
    body: [
      "Nigerian literature is not a niche — it is a movement. Long before the world caught on, writers from Lagos, Enugu, Ibadan, and beyond were crafting stories that spoke to the universal human experience while staying rooted in a landscape uniquely their own.",
      "Chinua Achebe's Things Fall Apart was the opening shot heard around the world. Published in 1958, it dismantled the colonial narrative and gave Africans a literature that belonged to them. But Achebe was not alone. Wole Soyinka, Buchi Emecheta, Ben Okri — a whole generation of writers was quietly building a canon.",
      "Then came the new wave. Chimamanda Ngozi Adichie's Purple Hibiscus and Half of a Yellow Sun introduced Nigerian voices to a generation of global readers who had never considered that their most affecting read might come from Enugu. Teju Cole's Open City brought a quiet, cerebral cosmopolitanism. Sefi Atta, Elnathan John, Oyinkan Braithwaite — the list keeps growing.",
      "What makes Nigerian fiction so compelling? It is the tension. The tension between tradition and modernity, between faith and doubt, between belonging and exile. These are not small themes. They are the questions every human being carries, dressed in the specific fabric of Nigerian life.",
      "If you have never picked up a Nigerian novel, start anywhere. Start with Achebe if you want the foundation. Start with Adichie if you want to be swept away. Start with Oyinkan Braithwaite's My Sister the Serial Killer if you want to laugh while your heart breaks. You will not regret it.",
    ],
  },
  {
    id: '2',
    slug: 'the-joy-of-a-second-hand-book-what-no-one-tells-you',
    title: 'The Joy of a Second-Hand Book: What No One Tells You',
    excerpt:
      "There's something magical about opening a book and finding a stranger's underlines. Used books carry stories within stories.",
    category: 'Reading Culture',
    date: 'March 15, 2025',
    readTime: '3 min read',
    body: [
      "There is a particular thrill that comes with cracking open a used book and finding someone else has been there before you. A pencil mark in the margin. A sentence underlined twice. A small question mark next to a paragraph that once troubled a stranger.",
      "New books are pristine, yes. But pristine can also feel sterile. A used book arrives with a history. It has been read on a bus, dog-eared on a nightstand, maybe even wept over. It carries trace evidence of a life you will never know.",
      "I once bought a copy of Half of a Yellow Sun from a seller in Surulere and found, tucked between pages 112 and 113, a receipt from a suya spot dated 2011. Someone had been reading this novel on a warm Lagos night, eating suya, marking their place with whatever was in their pocket. That receipt told me more about that reader than any inscription could.",
      "Used books also force a certain democracy on reading. You buy what is available, not only what is new and celebrated. You stumble across titles you would never have sought out and find yourself changed by them.",
      "The next time you hesitate between a crisp new paperback and its battered used twin, choose the twin. The folds and creases are not damage — they are documentation. Someone loved this book enough to carry it everywhere. Now it is your turn.",
    ],
  },
  {
    id: '3',
    slug: 'how-buying-used-books-saves-you-money-and-the-planet',
    title: 'How Buying Used Books Saves You Money and the Planet',
    excerpt:
      'Every used book purchased is one less book printed. And your wallet will thank you too.',
    category: 'Why Used Books',
    date: 'March 3, 2025',
    readTime: '5 min read',
    body: [
      "Books are not cheap. In Nigeria, a new hardcover can cost between ₦8,000 and ₦25,000 — that is a real barrier for students, avid readers, and anyone trying to build a home library on a budget. Used books change that equation entirely.",
      "A pre-owned copy of the same title often sells for a third of the cover price, sometimes less. For a reader who finishes five or six books a month, that saving adds up to tens of thousands of naira over a year. That is not small money. That is another shelf of books.",
      "But the case for used books is not only financial. Every book that changes hands instead of going to press is a book that did not require new paper, new ink, new energy, new logistics. The publishing industry has a significant environmental footprint. Print runs require trees, water, and carbon. When you buy used, you step entirely outside that cycle.",
      "Think of it as the most literary form of recycling. The book already exists. It has already borne its environmental cost. Passing it on costs almost nothing and gains everything — a new reader, a new conversation, a new set of margins to fill.",
      "At ALÁKÒWÉ, we believe a great book should outlive one reading. Our platform exists precisely to keep books in circulation, to match the reader who needs a book with the reader who has already loved it. The planet benefits. Your wallet benefits. And the book — finally — gets the audience it deserves.",
    ],
  },
  {
    id: '4',
    slug: 'reading-in-lagos-where-to-find-your-next-book-fix',
    title: 'Reading in Lagos: Where to Find Your Next Book Fix',
    excerpt:
      'From booksellers on the bridge to online marketplaces, Lagos has more reading spots than you think.',
    category: 'Reading Culture',
    date: 'February 20, 2025',
    readTime: '6 min read',
    body: [
      "Lagos is not a city that pauses. It moves, it roars, it negotiates. But if you know where to look, it also reads.",
      "The most legendary source of affordable books in Lagos remains the booksellers of Lagos Island — traders who stack titles on makeshift tables along the roadside, often with an eye sharper than any catalogue. You will find textbooks, fiction, business titles, and the occasional out-of-print gem if you are patient and willing to talk.",
      "Tejuosho Market in Yaba has long been a reliable destination for used academic texts, especially for university students at UNILAG or Yaba Tech. The prices are aggressive and the bargaining is part of the experience. Come early. Come with cash. Come prepared to walk away if the first price offends you.",
      "For those who prefer air conditioning and browsing at their own pace, a growing number of independent bookshops have opened across Lagos Island, Victoria Island, and Lekki. These are not the chain stores of another era — they are curated spaces run by people who actually read, who can recommend a title based on a single sentence about what you are looking for.",
      "And then, of course, there is the internet. Online marketplaces — including ALÁKÒWÉ — have made it possible to browse thousands of used books from sellers across Lagos (and beyond) without leaving your house. The books come to you, inspected and verified. It is not as visceral as hunting through roadside stalls, but on a Wednesday afternoon when you just want a specific novel, it is hard to beat.",
    ],
  },
  {
    id: '5',
    slug: 'the-secret-life-of-a-book-what-happens-after-youre-done',
    title: "The Secret Life of a Book: What Happens After You're Done",
    excerpt:
      "Books don't retire when you finish them. They find new homes, new readers, and new meanings.",
    category: 'Why Used Books',
    date: 'February 8, 2025',
    readTime: '4 min read',
    body: [
      "You close the back cover. You sit with the ending for a moment. Then you place the book on the shelf and, gradually, it fades into the background of your room. Most books end their journeys here — gathering dust, waiting.",
      "But a book is not a static object. It is an argument waiting to be heard again, a character waiting to be met by someone who needs them, a sentence waiting to arrive at exactly the right moment in someone else's life.",
      "When you pass a book on, you do not lose it. You multiply it. The underlines you made become conversation starters for the next reader. The inscription you wrote becomes a mystery for the reader after that. The book accumulates meaning with every pair of hands it passes through.",
      "There is a concept in West African culture — the idea that nothing of real value should stay idle. A skill shared teaches two people. A tool lent builds two homes. A book passed on educates two minds.",
      "At ALÁKÒWÉ, we built our platform around this idea. Your finished books are not waste. They are inventory. They are gifts to strangers who do not yet know they need them. List them. Let them go. They will do more good in motion than on your shelf.",
    ],
  },
  {
    id: '6',
    slug: 'top-10-african-authors-you-should-be-reading-right-now',
    title: 'Top 10 African Authors You Should Be Reading Right Now',
    excerpt:
      "The continent's literary scene is richer than ever. Here are the voices you shouldn't miss.",
    category: 'Nigerian Authors',
    date: 'January 25, 2025',
    readTime: '7 min read',
    body: [
      "African literature has never been one thing. It has always been plural — many languages, many traditions, many ways of telling. What has changed in recent years is the world's willingness to pay attention. Here are ten writers whose work demands that attention.",
      "Chimamanda Ngozi Adichie (Nigeria) needs no introduction, but if you have not read Americanah, start there. Her prose is warm and precise, her observations devastating in the quietest way.",
      "Teju Cole (Nigeria/USA) writes at the intersection of photography, history, and quiet personal grief. Open City is a novel about walking and loss that will follow you long after you finish it.",
      "Nnedi Okofor (Nigeria/USA) is rewriting what African science fiction can be. Who Fears Death and the Binti series are essential reading for anyone interested in where the genre is going.",
      "Maaza Mengiste (Ethiopia/USA) brought the story of Ethiopian women soldiers during Mussolini's invasion to global attention in The Shadow King. It is one of the great war novels of this century.",
      "Oyinkan Braithwaite (Nigeria) proved with My Sister the Serial Killer that African literary fiction can also be a page-turner. Sharp, funny, and darker than you expect.",
      "NoViolet Bulawayo (Zimbabwe) won the Booker Prize shortlist with We Need New Names and continues to be one of the most important voices writing about displacement and belonging.",
      "Leila Aboulela (Sudan/Scotland) writes about Muslim women navigating faith and migration with extraordinary empathy. Minaret is a quiet masterpiece.",
      "Yaa Gyasi (Ghana/USA) made her debut with Homegoing, a multigenerational saga tracing the consequences of the slave trade across eight generations. It is the kind of novel that rearranges things inside you.",
      "Alain Mabanckou (Congo/France) is playful, political, and deeply funny. Broken Glass and Memoirs of a Porcupine show the full range of what Congolese literature can hold.",
      "Start anywhere on this list. There is no wrong door into African literature — only the regret of having waited too long to open one.",
    ],
  },
]

export interface BookRequest {
  id: string
  title: string
  author?: string
  requestCount: number
  postedBy: string
  daysAgo: number
}

export const bookRequests: BookRequest[] = [
  { id: '1', title: 'Purple Hibiscus', author: 'Chimamanda Ngozi Adichie', requestCount: 14, postedBy: 'Amaka O.', daysAgo: 1 },
  { id: '2', title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki', requestCount: 31, postedBy: 'Emeka T.', daysAgo: 2 },
  { id: '3', title: 'The Alchemist', author: 'Paulo Coelho', requestCount: 22, postedBy: 'Chisom A.', daysAgo: 3 },
  { id: '4', title: 'Atomic Habits', author: 'James Clear', requestCount: 19, postedBy: 'Bolu F.', daysAgo: 4 },
  { id: '5', title: 'Half of a Yellow Sun', author: 'Chimamanda Ngozi Adichie', requestCount: 8, postedBy: 'Ngozi K.', daysAgo: 5 },
  { id: '6', title: 'Why Nations Fail', requestCount: 5, postedBy: 'Hassan M.', daysAgo: 6 },
]

export const bookQuotes = [
  {
    quote:
      'A reader lives a thousand lives before he dies. The man who never reads lives only one.',
    author: 'George R.R. Martin',
  },
  {
    quote:
      'Until I feared I would lose it, I never loved to read. One does not love breathing.',
    author: 'Harper Lee',
  },
  {
    quote:
      'Not all those who wander are lost.',
    author: 'J.R.R. Tolkien',
  },
]
