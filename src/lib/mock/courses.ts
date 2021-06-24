export interface ICourse {
  bgPoster: string;
  category: string;
  description: string;
  lessonCount: number;
  instructor: {
    name: string;
    picture: string;
  };
  poster: string;
  title: {
    en: string;
  };
}

export const courses: ICourse[] = [
  {
    bgPoster: '/img/chess-bg.svg',
    category: 'Strategy',
    description: '',
    lessonCount: 6,
    instructor: {
      name: 'Countlive',
      picture: '/img/countlive.png'
    },
    poster: '/img/chess.jpg',
    title: {
      en: 'Learn Chess: From Beginner to Advanced at Warp Speed'
    }
  },
  {
    bgPoster: '',
    category: 'Cooking',
    description: '',
    lessonCount: 6,
    instructor: {
      name: 'John',
      picture: ''
    },
    poster: '/img/spoons.png',
    title: {
      en: 'Learn All the Basics of Cooking'
    }
  },
  {
    bgPoster: '',
    category: 'Gaming',
    description: '',
    lessonCount: 6,
    instructor: {
      name: 'Mew2King',
      picture: ''
    },
    poster: '/img/marth.png',
    title: {
      en: 'Intro to Super Smash Bros. Melee'
    }
  },
  {
    bgPoster: '',
    category: 'Music',
    description: '',
    lessonCount: 6,
    instructor: {
      name: 'John',
      picture: ''
    },
    poster: '/img/piano.png',
    title: {
      en: 'Incredible New Way To Learn Piano & Keyboard'
    }
  }
];
