export type BookCondition = 'Very Good' | 'Good' | 'Average' | 'Below Average'
export type BookBadge = 'Best Value' | 'Recently Added' | null

export interface Book {
  id: string
  title: string
  author: string
  genre: string
  condition: BookCondition
  price: number
  location: string
  badge: BookBadge
  coverColor: string
  description: string
  sellerName: string
  sellerRating: number
  loveNote: string
}

export const books: Book[] = [
  {
    id: '1',
    title: 'Things Fall Apart',
    author: 'Chinua Achebe',
    genre: 'African Fiction',
    condition: 'Very Good',
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
    condition: 'Good',
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
    condition: 'Very Good',
    price: 4000,
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
    condition: 'Average',
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
    condition: 'Very Good',
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
    price: 4500,
    location: 'Ikeja, Lagos',
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
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Why Nigerian Literature Deserves a Seat at Your Bedside',
    excerpt:
      "From Achebe to Adichie, the stories coming out of Nigeria have always been world-class. Here's why you should be reading them.",
    category: 'Nigerian Authors',
    date: 'March 28, 2025',
    readTime: '4 min read',
  },
  {
    id: '2',
    title: 'The Joy of a Second-Hand Book: What No One Tells You',
    excerpt:
      "There's something magical about opening a book and finding a stranger's underlines. Used books carry stories within stories.",
    category: 'Reading Culture',
    date: 'March 15, 2025',
    readTime: '3 min read',
  },
  {
    id: '3',
    title: 'How Buying Used Books Saves You Money and the Planet',
    excerpt:
      'Every used book purchased is one less book printed. And your wallet will thank you too.',
    category: 'Why Used Books',
    date: 'March 3, 2025',
    readTime: '5 min read',
  },
  {
    id: '4',
    title: 'Reading in Lagos: Where to Find Your Next Book Fix',
    excerpt:
      'From booksellers on the bridge to online marketplaces, Lagos has more reading spots than you think.',
    category: 'Reading Culture',
    date: 'February 20, 2025',
    readTime: '6 min read',
  },
  {
    id: '5',
    title: "The Secret Life of a Book: What Happens After You're Done",
    excerpt:
      "Books don't retire when you finish them. They find new homes, new readers, and new meanings.",
    category: 'Why Used Books',
    date: 'February 8, 2025',
    readTime: '4 min read',
  },
  {
    id: '6',
    title: 'Top 10 African Authors You Should Be Reading Right Now',
    excerpt:
      "The continent's literary scene is richer than ever. Here are the voices you shouldn't miss.",
    category: 'Nigerian Authors',
    date: 'January 25, 2025',
    readTime: '7 min read',
  },
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
