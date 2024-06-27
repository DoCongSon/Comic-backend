import { run } from 'node:test'

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
  }
]

export const levelNames = levels.map((level) => level.levelName)
