import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { Comic, type CreateComic } from '../models/comic.model.js'
import { type ObjectId } from 'mongoose'
import { type Options } from '../models/plugins/paginate.plugin.js'
import { createChapter, getChaptersByComicId } from './chapter.service.js'
import { CreateChapter } from '../models/chapter.model.js'
import { createViewForComic } from './view.service.js'
import { getCategoryBySlug } from './category.service.js'
const createComic = async (comicBody: CreateComic) => {
  if (await Comic.isSlugTaken(comicBody.slug)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slug is already taken')
  }
  return Comic.create(comicBody)
}

const getComicById = async (comicId: ObjectId | string) => {
  const comic = await Comic.findById(comicId)
  if (!comic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comic not found')
  }
  return comic
}

const getComicBySlug = async (slug: string) => {
  const comic = await Comic.findOne({ slug })
  if (!comic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comic not found')
  }
  return comic
}

const queryComics = async (filter: any, options: Options) => {
  const comics = await Comic.paginate(filter, options)
  return comics
}

const updateComicById = async (comicId: ObjectId | string, updateBody: CreateComic) => {
  const comic = await getComicById(comicId)
  if (updateBody.slug && (await Comic.isSlugTaken(updateBody.slug, comicId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slug is already taken')
  }
  Object.assign(comic, updateBody)
  await comic.save()
  return comic
}

const deleteComicById = async (comicId: ObjectId | string) => {
  const comic = await getComicById(comicId)
  await comic.deleteOne()
  return comic
}

/**
 * Fetches comics from the o truyen api on the provided slugs.
 *
 * @param slugs - The slugs of the comics to fetch, separated by commas.
 * @returns A promise that resolves to an array of objects representing the fetched comics and their chapters.
 * @throws {ApiError} If there is an error fetching data from the API.
 */
const getComicsFromApi = async (slugs: string) => {
  const api = 'https://otruyenapi.com/v1/api/truyen-tranh/'
  try {
    const promises = slugs.split(',').map((slug) => fetch(`${api}${slug}`))
    const responses = await Promise.all(promises)
    const data = await Promise.all(responses.map((response) => response.json()))

    const result = data.map(async (comic) => {
      if (!comic.status) {
        return { status: false, msg: `Error fetching data from API: ${comic.msg}` }
      } else {
        if (await Comic.isSlugTaken(comic.data?.item?.slug)) {
          const alreadyTakenComic = await Comic.findOne({ slug: comic.data?.item?.slug })

          if ((alreadyTakenComic?.updatedAt.getTime() as number) < new Date(comic.data?.item?.updatedAt).getTime()) {
            const alreadyTakenComicChapters = await getChaptersByComicId(alreadyTakenComic?._id as ObjectId)
            const chapterNames = alreadyTakenComicChapters.map((chapter) => chapter.chapter_name)
            // chapters
            const chapterLinks: string[] = comic.data?.item?.chapters[0]?.server_data
              .filter((chapter: { chapter_name: string }) => !chapterNames.includes(chapter.chapter_name))
              .map((chapter: { chapter_api_data: string }) => chapter.chapter_api_data)

            const promises = chapterLinks.map((link) => fetch(link))
            const responses = await Promise.all(promises)
            const data = await Promise.all(responses.map((response) => response.json()))

            const result = data.map(async (chapter) => {
              if (chapter.status === 'success' && !chapterNames.includes(chapter.data?.item?.chapter_name)) {
                const path = `${chapter.data?.domain_cdn}/${chapter.data?.item?.chapter_path}`
                const newChapter: CreateChapter = {
                  comic: alreadyTakenComic?._id as ObjectId,
                  chapter_name: chapter.data?.item?.chapter_name,
                  chapter_path: path,
                  chapter_images: chapter.data?.item?.chapter_image
                }
                await createChapter(newChapter)
                return { status: 'success', msg: `Successfully get chapter: ${chapter.data?.item?.chapter_name}` }
              } else {
                return { status: 'success', msg: `Chapter is already taken: ${comic.data?.item?.name}` }
              }
            })
            const resultChapter = await Promise.all(result)
            return { status: 'success', msg: `Successfully update: ${comic.data?.item?.name}`, chapters: resultChapter }
          }
          return { status: 'success', msg: `Slug is already taken: ${comic.data?.item?.name}` }
        }
        const newComic: CreateComic = {
          name: comic.data?.item?.name,
          vip: false,
          slug: comic.data?.item?.slug,
          origin_name: comic.data?.item?.origin_name,
          content: comic.data?.item?.content,
          status: comic.data?.item?.status,
          thumb_url: comic.data?.seoOnPage?.seoSchema?.image,
          author: comic.data?.item?.author,
          category: [],
          likes: 0
        }
        // category
        const resultCategory = await comic.data?.item?.category.map(
          async (category: { name: string; slug: string }) => {
            const categorySlug = category.slug
            const categoryComic = await getCategoryBySlug(categorySlug)
            if (categoryComic) {
              newComic.category.push(categoryComic._id as ObjectId)
            }
            return categoryComic
          }
        )
        await Promise.all(resultCategory)
        const comicCreated = await Comic.create(newComic)
        // view
        await createViewForComic(comicCreated._id as ObjectId)
        // chapters
        const chapterLinks: string[] = comic.data?.item?.chapters[0]?.server_data.map(
          (chapter: { chapter_api_data: string }) => chapter.chapter_api_data
        )

        const promises = chapterLinks.map((link) => fetch(link))
        const responses = await Promise.all(promises)
        const data = await Promise.all(responses.map((response) => response.json()))
        const result = data.map(async (chapter) => {
          if (chapter.data) {
            const path = `${chapter.data?.domain_cdn}/${chapter.data?.item?.chapter_path}`
            const newChapter: CreateChapter = {
              comic: comicCreated?._id as ObjectId,
              chapter_name: chapter.data?.item?.chapter_name,
              chapter_path: path,
              chapter_images: chapter.data?.item?.chapter_image
            }
            await createChapter(newChapter)
            return { status: 'success', msg: `Successfully get chapter: ${chapter.data?.item?.chapter_name}` }
          } else {
            return { status: false, msg: `Error get chapter: ${chapter.message}` }
          }
        })
        const resultChapter = await Promise.all(result)
        return {
          status: 'success',
          msg: `Successfully get comic: ${comic.data?.item?.name}`,
          chapters: resultChapter
        }
      }
    })
    return await Promise.all(result)
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error as string)
  }
}

export { getComicsFromApi, createComic, getComicById, getComicBySlug, queryComics, updateComicById, deleteComicById }
