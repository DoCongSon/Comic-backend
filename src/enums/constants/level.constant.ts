export const levels = [
  {
    level: 0,
    levelName: 'Newbie',
    points: 0,
    ruby: 0
  },
  {
    level: 1,
    levelName: 'Beginner',
    points: 10,
    ruby: 50
  },
  {
    level: 2,
    levelName: 'Intermediate',
    points: 100,
    ruby: 100
  },
  {
    level: 3,
    levelName: 'Advanced',
    points: 500,
    ruby: 300
  },
  {
    level: 4,
    levelName: 'Expert',
    points: 1000,
    ruby: 500
  },
  {
    level: 5,
    levelName: 'Master',
    points: 5000,
    ruby: 1000
  }
]

export const levelNames = levels.map((level) => level.levelName)
