import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { Chapter, CreateChapter } from '../models/chapter.model.js'
import { ObjectId } from 'mongoose'
import { Comic } from '../models/comic.model.js'
import { getUserById, updatePointsAndLevel } from './user.service.js'
import { IUser } from 'src/models/user.model.js'
import { getViewByComicId, incrementView } from './view.service.js'

const createChapter = async (chapterBody: CreateChapter) => {
  return Chapter.create(chapterBody)
}

const getChapterById = async (chapterId: ObjectId | string, userId?: ObjectId | string) => {
  const chapter: any = await Chapter.findById(chapterId).populate({
    path: 'comic',
    select: 'vip id'
  })
  let user: IUser | undefined
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found')
  }
  if (userId) {
    user = await getUserById(userId)
  }
  if (chapter.comic.vip && !user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Comic is VIP, please login to read')
  }
  if (chapter.comic.vip && user) {
    if (user.role === 'USERVIP') {
      await updatePointsAndLevel(userId as ObjectId, 2)
      await incrementView(chapter.comic._id)
      return chapter
    } else if (user.progress.ruby < 1) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Ruby not enough')
    } else {
      user.progress.ruby -= 1
      await user.save()
      await updatePointsAndLevel(userId as ObjectId, 2)
      await incrementView(chapter.comic._id)
      return chapter
    }
  }

  if (user) {
    await updatePointsAndLevel(userId as ObjectId, 1)
  }
  await incrementView(chapter.comic._id)
  return chapter
}

const getChaptersByComicId = async (comicId: ObjectId | string) => {
  const comic = await Comic.findById(comicId)
  if (!comic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comic not found')
  }
  const chapters = await Chapter.find({ comic: comicId })
  return chapters
}

const queryChapters = async (filter: any, options: any) => {
  const chapters = await Chapter.paginate(filter, options)
  return chapters
}

const updateChapterById = async (chapterId: ObjectId | string, updateBody: CreateChapter) => {
  const chapter = await getChapterById(chapterId)
  Object.assign(chapter, updateBody)
  await chapter.save()
  return chapter
}

const deleteChapterById = async (chapterId: ObjectId | string) => {
  const chapter = await getChapterById(chapterId)
  await chapter.deleteOne()
  return chapter
}

const getLastChapterByComicId = async (comicId: ObjectId | string) => {
  const comic = await Comic.findById(comicId)
  if (!comic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comic not found')
  }
  const chapter = await Chapter.findOne({ comic: comicId }).sort({ chapter_name: -1 })
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found')
  }
  return chapter
}

export {
  createChapter,
  getChapterById,
  getChaptersByComicId,
  queryChapters,
  updateChapterById,
  deleteChapterById,
  getLastChapterByComicId
}
