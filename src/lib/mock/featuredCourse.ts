export interface IFeaturedCourse {
  category: string;
  description: string;
  instructor: {
    name: string;
  };
  title: {
    en: string;
  };
}

export const featuredCourse: IFeaturedCourse = {
  category: 'Strategy',
  description:
    'Everything you need to know to master an intensive training plan to dramatically improve Marth.',
  instructor: {
    name: 'Magnus Carlsen'
  },
  title: {
    en: 'Learn the Queens Gambit: Cambridge Springs and Orthodox Defense'
  }
};
