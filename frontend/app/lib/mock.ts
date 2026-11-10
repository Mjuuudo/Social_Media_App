// Placeholder data for the UI. Replace each export with real API data
// (fetch from the backend) when you build the logic.
import type { SceneName } from "../components/ui/Scene";

export type Person = {
  name: string;
  initials: string;
  color: string;
  username?: string;
  city?: string;
  online?: boolean;
};

export const me: Person = {
  name: "Yasmine Alaoui",
  initials: "YA",
  color: "#2a2c33",
  username: "yasmine.a",
};

export const people = {
  lena: { name: "Lena Hoffmann", initials: "LH", color: "#f4cd6b", city: "Berlin", online: true },
  omar: { name: "Omar Haddad", initials: "OH", color: "#a8e0c8", city: "Casablanca", online: true },
  karim: { name: "Karim Benali", initials: "KB", color: "#f2b8a2", city: "Marrakech", online: false, username: "karim.trails" },
  sofia: { name: "Sofia Marin", initials: "SM", color: "#d9cdf7", city: "Lisbon", online: true },
  amira: { name: "Amira Saidi", initials: "AS", color: "#f2a8b8", city: "Rabat", online: false },
  theo: { name: "Theo Laurent", initials: "TL", color: "#c8d6f5", city: "Lyon", online: true },
  ines: { name: "Ines Moreau", initials: "IM", color: "#d3efe1", city: "Paris", online: false },
  youssef: { name: "Youssef Amrani", initials: "YA", color: "#fbe3a8", city: "Fès", online: true },
  nadia: { name: "Nadia Kerr", initials: "NK", color: "#ffffff" },
  jonas: { name: "Jonas Berg", initials: "JB", color: "#ffffff" },
  rafael: { name: "Rafael Costa", initials: "RC", color: "#ffffff" },
} satisfies Record<string, Person>;

// Card background colours that rotate through lists
export const tints = ["bg-sky", "bg-cream", "bg-blush", "bg-mist"] as const;

export const posts = [
  {
    author: people.karim,
    time: "2 hours ago",
    text: "Hi everyone, today I hiked up the most beautiful mountain I've ever seen. I also want to say hi to",
    mentions: [people.lena, people.omar, people.sofia],
    images: ["canyon", "flower", "mountain"] as SceneName[],
    views: "6,355",
    liked: false,
  },
  {
    author: people.amira,
    time: "3 hours ago",
    text: "Found a wonderful little café this morning and had to share — they make a latte with coconut milk that is honestly the best thing I've tasted all week. Smooth, a little nutty, and not too sweet.",
    mentions: [],
    images: [] as SceneName[],
    views: "2,148",
    liked: false,
  },
];

export const stories = [
  { person: people.theo, scene: "desert" as SceneName, ring: "#b8a5f0" },
  { person: people.nadia, scene: "hills" as SceneName, ring: "#f4a6b8" },
  { person: people.lena, scene: "lake" as SceneName, ring: "#f4cd6b" },
  { person: people.omar, scene: "city" as SceneName, ring: "#a8e0c8" },
];

export const suggestions = [
  { ...people.jonas, color: "#d9cdf7" },
  { ...people.sofia, color: "#f4cd6b" },
  { ...people.rafael, color: "#c8d6f5" },
];

export const topics = ["All", "Hiking", "UI/UX", "Music", "Cooking"];

export const forumThreads = [
  {
    tag: "Hiking",
    trending: true,
    time: "2h ago",
    title: "Best autumn trails in the High Atlas?",
    body: "Planning a three-day loop in late November. Looking for routes with water sources and a refuge to sleep in.",
    author: people.karim,
    replies: 48,
    views: "1.9k",
  },
  {
    tag: "UI/UX",
    trending: false,
    time: "5h ago",
    title: "How do you present design rationale to non-designers?",
    body: 'Our stakeholders keep asking for "more pop". Share the frameworks or one-pagers that worked for you.',
    author: people.sofia,
    replies: 31,
    views: "1.2k",
  },
  {
    tag: "Music",
    trending: true,
    time: "8h ago",
    title: "Share one album that got you through this week",
    body: "Rules: one album, one sentence on why. I will start — something slow and warm for rainy mornings.",
    author: people.omar,
    replies: 112,
    views: "3.4k",
  },
  {
    tag: "Cooking",
    trending: false,
    time: "Yesterday",
    title: "Weeknight tagine in under an hour — is it possible?",
    body: "I have a pressure cooker and limited patience. Looking for shortcuts that keep the flavour.",
    author: people.amira,
    replies: 27,
    views: "860",
  },
];

export const communities = [
  { name: "UI/UX", members: "3.2k", bg: "#dfe6f8", shape: "rounded-full" },
  { name: "Music", members: "5.8k", bg: "#f2a8b8", shape: "rounded-full" },
  { name: "Cooking", members: "2.1k", bg: "#fbf1d9", shape: "rounded-[28px]" },
  { name: "Hiking", members: "4.4k", bg: "#b8a5f0", shape: "rounded-[28px]" },
];

export const contributors = [
  { person: people.omar, posts: 412 },
  { person: people.lena, posts: 298 },
  { person: people.karim, posts: 187 },
];

export const friendRequests = [
  { person: people.nadia, mutual: 12 },
  { person: people.jonas, mutual: 5 },
  { person: people.rafael, mutual: 8 },
];

export const friends = [
  people.lena,
  people.omar,
  people.karim,
  people.sofia,
  people.amira,
  people.theo,
  people.ines,
  people.youssef,
];

export const albums = [
  { title: "Atlas trip", count: 64, scene: "mountain" as SceneName },
  { title: "Café hopping", count: 23, scene: "latte" as SceneName },
  { title: "Golden hour", count: 41, scene: "hills" as SceneName },
  { title: "City nights", count: 18, scene: "city" as SceneName },
];

export const conversations = [
  { person: people.lena, last: "I want to try it before the snow closes everything.", time: "10:31", unread: 0 },
  { person: people.omar, last: "Sending the playlist tonight", time: "09:12", unread: 4 },
  { person: people.karim, last: "Haha that ridge was brutal", time: "Yesterday", unread: 0 },
  { person: people.sofia, last: "See you at the meetup!", time: "Yesterday", unread: 0 },
  { person: people.amira, last: "The café is on Rue Atlas", time: "Mon", unread: 0 },
  { person: people.theo, last: "You: Thanks for the tip", time: "Sun", unread: 0 },
];

export const profile = {
  person: people.karim,
  bio: "Weekend hiker, weekday product designer. Chasing ridgelines across the Atlas and posting the views so you don't have to carry the backpack.",
  stats: [
    { value: "248", label: "Posts" },
    { value: "12.4k", label: "Followers" },
    { value: "386", label: "Following" },
  ],
  about: [
    { icon: "pin", text: "Lives in Marrakech, Morocco" },
    { icon: "briefcase", text: "Product designer" },
    { icon: "calendar", text: "Joined March 2023" },
  ] as const,
  interests: [
    { name: "Hiking", bg: "#b8a5f0" },
    { name: "UI/UX", bg: "#dfe6f8" },
    { name: "Music", bg: "#f2a8b8" },
    { name: "Coffee", bg: "#fbf1d9" },
    { name: "Photography", bg: "#d3efe1" },
  ],
  photos: ["canyon", "flower", "lake", "hills", "desert", "city"] as SceneName[],
};
