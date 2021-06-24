export interface IHighlightedCourse {
  category: string;
  description: string;
  instructor: {
    name: string;
    picture: string;
  };
  title: {
    en: string;
  };
}

export const highlightedCourses: IHighlightedCourse[] = [
  {
    category: 'Gaming',
    description:
      'Everything you need to know to master an intensive training plan to dramatically improve Marth.',
    instructor: {
      name: 'Mew2King',
      picture: '/img/mew2king.png'
    },
    title: {
      en: 'Master Marth: The Exceptional Swordfighter'
    }
  },
  {
    category: 'Gaming',
    description:
      'Over the course of 8 weeks, I’ll teach you everything you need to know to master an intensive training plan to dramatically improve your overall smash gameplay.',
    instructor: {
      name: 'MkLeo',
      picture: '/img/mkleo.png'
    },
    title: {
      en: 'Mastering Joker'
    }
  }
];
