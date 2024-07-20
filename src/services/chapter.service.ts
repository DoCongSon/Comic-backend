import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { Chapter, CreateChapter } from '../models/chapter.model.js'
import { ObjectId } from 'mongoose'
import { Comic } from '../models/comic.model.js'

const createChapter = async (chapterBody: CreateChapter) => {
  return Chapter.create(chapterBody)
}

const getChapterById = async (chapterId: ObjectId | string) => {
  const chapter = await Chapter.findById(chapterId)
  if (!chapter) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chapter not found')
  }
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
