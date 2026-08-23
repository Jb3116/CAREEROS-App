/**
 * CAREEROS - Contextual YouTube Learning Resources Database
 * Verified, relevant video tutorials for DSA and System Design topics
 * from top accredited channels (NeetCode, freeCodeCamp, Striver, Abdul Bari, MIT OCW).
 */

export interface YouTubeVideoItem {
  id: string;
  title: string;
  channel: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  topics: string[];
  views?: string;
}

export const YOUTUBE_RESOURCES_DB: YouTubeVideoItem[] = [
  // ---------------- ARRAYS & HASHING / TWO POINTERS ----------------
  {
    id: 'KLlXCFG5TnA',
    title: 'Two Sum - Leetcode 1 - Python & Hash Map',
    channel: 'NeetCode',
    duration: '9:43',
    thumbnailUrl: 'https://img.youtube.com/vi/KLlXCFG5TnA/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
    topics: ['arrays & hashing', 'two sum', 'hash table', 'two pointers', 'array'],
    views: '1.2M views',
  },
  {
    id: '8hly31xKli0',
    title: 'Data Structures & Algorithms - Arrays & Hash Maps',
    channel: 'freeCodeCamp.org',
    duration: '5:24:12',
    thumbnailUrl: 'https://img.youtube.com/vi/8hly31xKli0/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=8hly31xKli0',
    topics: ['arrays & hashing', 'hash table', 'array', 'complexity', 'dsa'],
    views: '2.4M views',
  },
  {
    id: 'UXDSeD9mN-k',
    title: 'Two Sum Problem - Brute to Optimal 2 Pointer',
    channel: 'take U forward (Striver)',
    duration: '21:15',
    thumbnailUrl: 'https://img.youtube.com/vi/UXDSeD9mN-k/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=UXDSeD9mN-k',
    topics: ['arrays & hashing', 'two sum', 'two pointers', 'sorting'],
    views: '850K views',
  },

  // ---------------- BINARY TREES & BST ----------------
  {
    id: 'Hr5cWUld4vU',
    title: 'Binary Tree Maximum Path Sum - Leetcode 124',
    channel: 'NeetCode',
    duration: '14:22',
    thumbnailUrl: 'https://img.youtube.com/vi/Hr5cWUld4vU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Hr5cWUld4vU',
    topics: ['trees', 'binary tree', 'dfs', 'recursion', 'binary tree maximum path sum'],
    views: '420K views',
  },
  {
    id: 'WszrfSwMz58',
    title: 'Maximum Path Sum in Binary Tree | Tree Series',
    channel: 'take U forward (Striver)',
    duration: '18:40',
    thumbnailUrl: 'https://img.youtube.com/vi/WszrfSwMz58/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=WszrfSwMz58',
    topics: ['trees', 'binary tree', 'recursion', 'maximum path sum'],
    views: '610K views',
  },
  {
    id: '9GMkdVTQC84',
    title: 'Binary Trees & Tree Traversals Deep Dive',
    channel: 'Abdul Bari',
    duration: '38:10',
    thumbnailUrl: 'https://img.youtube.com/vi/9GMkdVTQC84/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=9GMkdVTQC84',
    topics: ['trees', 'binary tree', 'bst', 'inorder', 'preorder'],
    views: '3.1M views',
  },

  // ---------------- SLIDING WINDOW ----------------
  {
    id: 'wiGpQwVHdE0',
    title: 'Longest Substring Without Repeating Characters',
    channel: 'NeetCode',
    duration: '11:05',
    thumbnailUrl: 'https://img.youtube.com/vi/wiGpQwVHdE0/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=wiGpQwVHdE0',
    topics: ['sliding window', 'two pointers', 'string', 'substring'],
    views: '920K views',
  },
  {
    id: '9kdHxplyl5I',
    title: 'Sliding Window & Two Pointer Core Masterclass',
    channel: 'take U forward (Striver)',
    duration: '32:45',
    thumbnailUrl: 'https://img.youtube.com/vi/9kdHxplyl5I/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=9kdHxplyl5I',
    topics: ['sliding window', 'two pointers', 'arrays', 'subarrays'],
    views: '540K views',
  },

  // ---------------- DYNAMIC PROGRAMMING ----------------
  {
    id: 'oBt53YbR9Kk',
    title: 'Dynamic Programming - Learn to Solve Algorithmic Problems',
    channel: 'freeCodeCamp.org',
    duration: '5:10:30',
    thumbnailUrl: 'https://img.youtube.com/vi/oBt53YbR9Kk/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=oBt53YbR9Kk',
    topics: ['dynamic programming', 'dp', 'memoization', 'knapsack', 'recursion'],
    views: '4.8M views',
  },
  {
    id: 'Hdr64lKQ3e4',
    title: 'Dynamic Programming Patterns Roadmap',
    channel: 'NeetCode',
    duration: '22:18',
    thumbnailUrl: 'https://img.youtube.com/vi/Hdr64lKQ3e4/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=Hdr64lKQ3e4',
    topics: ['dynamic programming', 'dp', 'patterns', 'subsequences'],
    views: '880K views',
  },

  // ---------------- GRAPHS & BFS/DFS ----------------
  {
    id: '09_LlHjoEiY',
    title: 'Graph Theory & Graph Algorithms Full Course',
    channel: 'freeCodeCamp / William Fiset',
    duration: '6:48:00',
    thumbnailUrl: 'https://img.youtube.com/vi/09_LlHjoEiY/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=09_LlHjoEiY',
    topics: ['graphs', 'bfs', 'dfs', 'dijkstra', 'topological sort'],
    views: '2.9M views',
  },
  {
    id: 'EgI5nU9etnU',
    title: 'Course Schedule - Graph Topological Sort',
    channel: 'NeetCode',
    duration: '13:54',
    thumbnailUrl: 'https://img.youtube.com/vi/EgI5nU9etnU/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=EgI5nU9etnU',
    topics: ['graphs', 'topological sort', 'bfs', 'dfs', 'cycle detection'],
    views: '510K views',
  },

  // ---------------- LINKED LISTS ----------------
  {
    id: 'G0_I-ZF0S38',
    title: 'Reverse a Linked List - Iterative & Recursive',
    channel: 'NeetCode',
    duration: '8:45',
    thumbnailUrl: 'https://img.youtube.com/vi/G0_I-ZF0S38/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=G0_I-ZF0S38',
    topics: ['linked lists', 'linked list', 'pointers', 'recursion'],
    views: '760K views',
  },
  {
    id: '2Kd0KKmmHFc',
    title: 'Detect Cycle in Linked List (Floyd Cycle Finding)',
    channel: 'take U forward (Striver)',
    duration: '15:20',
    thumbnailUrl: 'https://img.youtube.com/vi/2Kd0KKmmHFc/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=2Kd0KKmmHFc',
    topics: ['linked lists', 'linked list', 'fast and slow pointers', 'cycle'],
    views: '490K views',
  },

  // ---------------- BINARY SEARCH ----------------
  {
    id: 's4DPM8ct1pI',
    title: 'Binary Search - Leetcode 704 & Boundary Conditions',
    channel: 'NeetCode',
    duration: '7:35',
    thumbnailUrl: 'https://img.youtube.com/vi/s4DPM8ct1pI/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=s4DPM8ct1pI',
    topics: ['binary search', 'search', 'array', 'complexity'],
    views: '630K views',
  },

  // ---------------- HEAPS & PRIORITY QUEUES ----------------
  {
    id: 'HqPJF2L5h9U',
    title: 'Heap Data Structure & Heap Sort Masterclass',
    channel: 'Abdul Bari',
    duration: '45:30',
    thumbnailUrl: 'https://img.youtube.com/vi/HqPJF2L5h9U/hqdefault.jpg',
    videoUrl: 'https://www.youtube.com/watch?v=HqPJF2L5h9U',
    topics: ['heap', 'priority queue', 'heap sort', 'max heap', 'min heap'],
    views: '2.1M views',
  },
];

/**
 * Match relevant YouTube videos based on problem category, title, and tags
 */
export function getContextualYouTubeVideos(problem: { category?: string; title?: string; constraints?: string[] }): YouTubeVideoItem[] {
  if (!problem) return YOUTUBE_RESOURCES_DB.slice(0, 3);

  const keywords: string[] = [
    ...(problem.category ? [problem.category.toLowerCase()] : []),
    ...(problem.title ? [problem.title.toLowerCase()] : []),
    ...(problem.constraints ? problem.constraints.map((c) => c.toLowerCase()) : []),
  ];

  const scored = YOUTUBE_RESOURCES_DB.map((video) => {
    let score = 0;
    for (const kw of keywords) {
      for (const vt of video.topics) {
        if (kw.includes(vt) || vt.includes(kw)) score += 30;
      }
      if (video.title.toLowerCase().includes(kw)) score += 25;
    }
    return { video, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matched = scored.filter((s) => s.score > 0).map((s) => s.video);

  if (matched.length >= 2) {
    return matched.slice(0, 3);
  }

  // Fallback to top curated videos if direct match is sparse
  const fallback = YOUTUBE_RESOURCES_DB.slice(0, 3);
  const combined = [...matched, ...fallback];
  const unique = Array.from(new Set(combined.map((v) => v.id))).map(
    (id) => combined.find((v) => v.id === id)!
  );
  return unique.slice(0, 3);
}
