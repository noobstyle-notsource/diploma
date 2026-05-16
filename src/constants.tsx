import { Service, Review, Operator, UserProfile, Chat, Message } from './types';

export const CURRENT_USER: UserProfile = {
  id: 'me',
  name: 'Alex_Vortex',
  email: 'alex@zen-gamer.com',
  avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200',
  role: 'buyer',
  balance: 4250000.00,
  joinedDate: 'March 2024',
  bio: 'Competitive FPS enthusiast and gear collector. Looking for elite coaching to break into Radiant tier.'
};

export const CHATS: Chat[] = [
  {
    id: 'c1',
    participantName: 'Viper_Protocol',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    lastMessage: 'The session is confirmed for 6 PM. see you then.',
    timestamp: '10:45 AM',
    unreadCount: 1
  },
  {
    id: 'c2',
    participantName: 'Zen_Support',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    lastMessage: 'Your refund for order #8827 has been processed.',
    timestamp: 'Yesterday',
    unreadCount: 0
  }
];

export const MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'viper',
    senderName: 'Viper_Protocol',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    content: 'Hey Alex, are you ready for the coaching session tomorrow?',
    timestamp: '09:00 AM',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'me',
    senderName: 'Alex_Vortex',
    senderAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=200',
    content: 'Yes! I have my VODs ready for review.',
    timestamp: '09:15 AM',
    isRead: true
  }
];

export const SERVICES: Service[] = [
  {
    id: '1',
    title: 'Elite Rank Mastery',
    description: 'One-on-one session with top 100 global players to refine your tactical awareness.',
    category: 'Coaching',
    price: 155000.00,
    priceUnit: 'Starting at',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2qRfavW7hW5WdTNeGkCP9YNVmXcFQpMkJK-qbC3luQeHrOz9QZvWwgRxusCBAfXfcck7FJFvE2cdOy68yjdVAaVDzolC0jXVsNPfSmsDtWooNzsg0LCjs8IjPMWhMHrUhwKITcltsm--3_VtYvTc4bLlGuOer8F3Qj_eLu_vZ7WH1sKd5tJDnvyknGlwvvxAxOuT1ngzibuvB2aQ0cg7xdNLOeMlCoCzzuMUNjXqE8_aHvohwcdRRwvRGq-DJqg1vwBMlpJxGqBHs',
    trending: true,
    verified: true,
  },
  {
    id: '2',
    title: 'Plat to Diamond Jump',
    description: 'Rapid rank advancement with 100% win rate guarantee and secure VPN usage.',
    category: 'Boosting',
    price: 305000.00,
    priceUnit: 'Fixed Price',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBscrn3VnttSlES0WS0V7_3MWiD4IukQKkZ5_QqmTm_-GXb7sjgQaoCTXpUbELSt8VynyPfIQ_l2I3cFE_pBifmIXPkiAnOudtpzHTKOmxFFJyOsmuYBNqvUddhsYDu3tC6mQ65BvWqkBQH6ZU6LzryI21OOgMtBG9yRRbQcq4l2mIeNSZc_FEf9-5fkUfAfxfX24aSVkSrjsCebKKW1fJUgQUHkoJQfQoN99fGNkqUYNCDHA2lBnA68MdbroMCNmZmgHSew5HjZEqD',
    trending: true,
    verified: true,
  },
  {
    id: '3',
    title: 'OG Skins Collection',
    description: '24-hour access to a legacy account featuring rare, vaulted skins and badges.',
    category: 'Rentals',
    price: 55000.00,
    priceUnit: 'Per 24 Hours',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfNBEZK2LMQMjzFlc3WK_r0QwyAkvydR9JAIhC17NhKocq7wzAjgWFzwsHQdOUQqMxN-0BIfaUP6Xb6gvM7snnmdKJ_3ArIinorLw51bUAbcviJ97RrGOJaBsH4eqNtLvKlD3-Pz-aZFR5cwnOcYCLgFAzD89n2gDAvCBKujpGxBiHbvesv2LN51uIf-EEt-QOhDACWcYvSKtjlc8_HZaIyLS3T16eotAeeR937ip6diVNNrFuN1y9EMZSZhnNB15pqaZShgQ5iCSn',
    trending: true,
  },
  {
    id: '4',
    title: 'Zen-Audio Pro Mk.II',
    description: 'Studio-grade audio for crystal clear spatial awareness in competitive play.',
    category: 'Gear',
    price: 685000.00,
    priceUnit: 'New Condition',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJyDPncEeZyjUknPkpy0SY0-rifo9fLF43QPZW-6PSRFXcwfBCZgSDezH2Um6a5t6T-jja2gCm0bZqMq0x-uAQw54fXQZ-dleLZ9Lds05I2cvf3q-zrNVabgtU-iiqHqyhQ1WmSwTXh6a5H7sGCzEZ_BgiL4aKPb6zntfHDodNSUVuktb88L9ySSStyneasImiXCS441QJYULA8pLjhXicLBAZ2BzuGtEr508Rydi97hqCTTgu7j27YgrKHTfFKtquytwR-BxFq_4y',
    trending: true,
  },
  {
    id: '11',
    title: 'Vortex Mechanical XL',
    description: 'Precision engineered optical switches for zero-latency response timing.',
    category: 'Gear',
    price: 545000.00,
    priceUnit: 'Limited Edition',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA5quMhrHCiX_ektWAtkdB9KjvZ9s4h0MzPJAID07sZY9YhlYI8maN9WE3f2JC9LswBCyPGBOG1lSNKL1GrTQpO8W9Zf1yTJIYCsgoKP2Hv-JGSv3xa-YAUXHYpNStNSW-qtQBzB9kSNy5ewuUqYBSGb_ThFEpSQVEHupNCvPREHTodxve_HQi-cBtHmc11aEez4ixdXTpdF8MoOxBjdPpayXkBrSEmrzhRh5IBtVELIGEao6UxiJYumua78BhrHaKRqOPjF2IIgtp',
  },
  {
    id: '12',
    title: 'Neural-Sync Mousepad',
    description: 'Hybrid surface optimized for both micro-flicking and heavy tracking.',
    category: 'Gear',
    price: 155000.00,
    priceUnit: 'In Stock',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBscrn3VnttSlES0WS0V7_3MWiD4IukQKkZ5_QqmTm_-GXb7sjgQaoCTXpUbELSt8VynyPfIQ_l2I3cFE_pBifmIXPkiAnOudtpzHTKOmxFFJyOsmuYBNqvUddhsYDu3tC6mQ65BvWqkBQH6ZU6LzryI21OOgMtBG9yRRbQcq4l2mIeNSZc_FEf9-5fkUfAfxfX24aSVkSrjsCebKKW1fJUgQUHkoJQfQoN99fGNkqUYNCDHA2lBnA68MdbroMCNmZmgHSew5HjZEqD',
  },
  {
    id: '5',
    title: 'Diamond Rank Boost',
    description: 'Secure your spot in the Diamond tier with our professional, discrete boosting service. Estimated time: 48 hours.',
    category: 'Boosting',
    price: 305000.00,
    priceUnit: 'Starts at',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKiWuhZxwGKggPcWSUEaXmjJCtSGuYflsG6WGTybt5aAII3-0P2tZ2o6R7iyVr3inyV0RNW2dHxc3A1nQCootD-ZL9d40B-H_huru7ENHP8vy8RgaoeDIUy80xCUq77VzjcUh0ipDXONWhEPeGivvNUKmaaTG47Klv8Xg1nZlU59jTiIiFvxsQvh-67bYlS0d6-siqYlw6E7RbWcF0n3nCFPxOUGRPyJvx_akAsYcYr5dAqBS63sGkeXh9fNlGHE_6_tilINHzi-6u',
    verified: true,
  },
  {
    id: '6',
    title: '1-on-1 Pro Coaching',
    description: 'Review your gameplay with a top 100 world player. Focus on positioning, strategy, and mental game.',
    category: 'Coaching',
    price: 155000.00,
    priceUnit: 'Hourly rate',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8gR3OWZCIhiuzj_FnIr-Io8to5USbmeLOCyrIUbR4IWTCBWbDeJmZ6B5aQq99f2gVYpQc5uoJxu3aHdkOA0J-SlPkXw2K6kcdEeFl1VBGMITnqy5lq97B67qZxkYw0vOG_xJnOdmeZtPZ-Hn9VYijh4XNvkbWESyt1N-eaXEC0kpolhugp67L53krpltZzElnopdUPe28RtIH08OPLBJkCPsyNHH2J4-LJhfyreaxqjoTyVh0TzNHknbfdcr_mhebA0a8gT7reqGB',
    verified: true,
  },
  {
    id: '7',
    title: 'Legendary Skin Bundle',
    description: 'Rent a full collection of ultra-rare legendary skins for your next tournament or weekend grind.',
    category: 'Rentals',
    price: 55000.00,
    priceUnit: '24h Rental',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAURodp2Awgc-PiJK-84O27o5Xu10jrFWdqmusAfTwyXam3ZtagaFqrp39ltfGDC1T0ogynH1Gk66nWmhDVlqFuYtENXDAYzzvk4QiudwdCOKgYhEATfPT3WbAESwjlXZoo8JO1qsafgbROS8HZRxSDjTxEeLZc9LWHPhrB91-2l8ZHjbLMoAknZj4J6bcvzq-jcBtqlCDB1FAvYhwCl-hdVZzsTOWFambo4Wrn9mtoN-cJllu-TK0VqtY-CJCVySbA3Ojh_thyhwIZ',
  },
  {
    id: '8',
    title: 'Win Streak Package',
    description: 'Guaranteed 10-win streak in competitive matchmaking. Fast results with 100% safety protocols.',
    category: 'Boosting',
    price: 410000.00,
    priceUnit: 'Flat Rate',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXvT_RAjW5xQ_1zydhv2ZLhysnAyiFHiHT2uSegUxV5iFjszuBLiEBjYdxim976ZSgxyO0Ezix-GoLMGzaXwQfUO-L8H1u8TJorkriE29MfmHUswz9sSN-Cc7m2PXqo3TLuVpaPJ5uwyx-boEE-pQocWqDPALQqTOdgrMGcBgQkJ9jNdsmGRyYcRQgJpDZZkJHVLA2x-wkFAm-IWQU8Icq8YyJpKg_0zZEcnIxN69kAfQSCH_f8YDIUoFGZs9HxTz_VEDDCwSfyLun',
  },
  {
    id: '9',
    title: 'Mental Game Mastery',
    description: 'Specialized performance coaching focusing on focus, tilt-management, and high-pressure decision making.',
    category: 'Coaching',
    price: 205000.00,
    priceUnit: 'Session rate',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYZ19fWCXeQU6QnaEBSEz8AXBIKl3w23iKOiY-ek9-7EdAwWf0CwB9OJz9q6fgxGV8i7XOeZtgMY0d6XldlDb6XKkCLDNPSmeA6Xsm_2ftNdDu81tbh6y09i2XhaKLsykxK1xseYq8ZHhE2cAcDGPdpXbH8nQ9upnm090dVSaZhSXpCzjS5W-TxTkMPoo2ujn97rnbVwT0WpdeBgWJDbEOC_YFmkvcOOIT3jywZa4J7-a5qvBaSg7dcZGbBFZ1mCQoKyrkexbIqwZN',
  },
  {
    id: '10',
    title: 'Top-Tier Account Access',
    description: 'Full access to a high-ELO account with all champions and skins unlocked for competitive practice.',
    category: 'Rentals',
    price: 85000.00,
    priceUnit: 'Per Day',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2XCnuzO-KqVVTP6ZekSI0-7JJrUXFCNTB3MIzRLeHfdbH2kHNkI2X4p7-v6Ez_igXtblpiSMYfCCbmW2zPDd05cFkITUqHD8MgsLQ2h-7O4YKrRAS_rLre-A-dgBhOFz5094m9qgd7iaLfGl2O4PYSFmWAaoWJtEnHe1ZKLczkIfVPbewdOK5LE8SYFFPigemWp-_2Ui57qUF3_PC91e91AvGTfAWccBHUEkmknNcOjRNBMs8n773iMnn-aYuoVXjIhPDjyOcaS50',
  },
  {
    id: '13',
    title: 'Focus-Zen Nootropic',
    description: 'Clean energy and heightened focus without the crash. Pharmaceutical grade ingredients.',
    category: 'Supplements',
    price: 135000.00,
    priceUnit: '30 Servings',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '14',
    title: 'Night-Recover Magnesium',
    description: 'Optimize your sleep cycles for peak performance the next day.',
    category: 'Supplements',
    price: 105000.00,
    priceUnit: '60 Capsules',
    image: 'https://images.unsplash.com/photo-1471864190281-ad5f9f81ce4c?auto=format&fit=crop&q=80&w=400',
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    author: 'Jordan_D',
    avatar: 'JD',
    rating: 5,
    date: '2 days ago',
    comment: '"Incredible experience. Viper didn\'t just carry, he explained every rotation. I went from Gold to Platinum in one weekend with 0 losses."'
  },
  {
    id: '2',
    author: 'S_Aoki',
    avatar: 'SA',
    rating: 5,
    date: '1 week ago',
    comment: '"Professional, quiet, and extremely effective. The glass-morphism UI on this site makes booking so much easier than the old forums."'
  }
];

export const OPERATOR: Operator = {
  id: 'viper',
  name: 'Viper_Protocol',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC862_v-UMH1ItZCyBEj-TPuwgWou-rDpMl3Sy1JtIMevNIxhuQYCRSbhV1_OCzXk7er1-3eoW8YDb-XhlFhip6RdWSg8UzQL75ouUT8fTtfDbcNx0e9lv_3t5sw8bxTgIIYrZ14PUCvbfEAmA0rn3U8UuXLh4Lwh-vSLLYvUJ_VKFQBu2UoOesReLKJuZFVafyiXKbDLV_HSZQDfCKiqUeTCvX6AQJVpq-UZoSsOe5PRanVpo9MzhREIXhHAOLJuf3fo8VVawcjgE9',
  description: 'Specializing in high-tier rank advancement and mechanical coaching. Over 5,000 successful sessions completed with a focus on strategic positioning and mental game refinement.',
  rating: 4.9,
  reviewsCount: 1240,
  verifiedStatus: 'Top 0.1% Verified'
};
