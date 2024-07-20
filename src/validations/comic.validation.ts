import Joi from 'joi'
import { SchemaValidator } from '../middlewares/validate.middleware.js'

const createComic: SchemaValidator = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    vip: Joi.boolean().required(),
    origin_name: Joi.array().items(Joi.string()).required(),
    content: Joi.string().required(),
    status: Joi.string().required(),
    thumb_url: Joi.string().required(),
    author: Joi.array().items(Joi.string()).required(),
    category: Joi.array().items(Joi.string()).required()
  })
}

const getComic: SchemaValidator = {
  params: Joi.object().keys({
    comicId: Joi.string().required()
  })
}

const getComicBySlug: SchemaValidator = {
  params: Joi.object().keys({
    slug: Joi.string().required()
  })
}

const getComics: SchemaValidator = {
  query: Joi.object().keys({
    name: Joi.string(),
    status: Joi.string(),
    category: Joi.string(),
    author: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer()
  })
}

const updateComic: SchemaValidator = {
  params: Joi.object().keys({
    comicId: Joi.string().required()
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    slug: Joi.string().required(),
    vip: Joi.boolean().required(),
    origin_name: Joi.array().items(Joi.string()).required(),
    content: Joi.string().required(),
    status: Joi.string().required(),
    thumb_url: Joi.string().required(),
    author: Joi.array().items(Joi.string()).required(),
    category: Joi.array().items(Joi.string()).required()
  })
}

const deleteComic: SchemaValidator = {
  params: Joi.object().keys({
    comicId: Joi.string().required()
  })
}

const getChapters: SchemaValidator = {
  params: Joi.object().keys({
    comicId: Joi.string().required()
  })
}

const getChapter: SchemaValidator = {
  params: Joi.object().keys({
    comicId: Joi.string().required(),
    chapterId: Joi.string().required()
  })
}

const createChapter: SchemaValidator = {
  body: Joi.object().keys({
    comic: Joi.string().required(),
    chapter_name: Joi.string().required(),
    chapter_path: Joi.string().required(),
    chapter_images: Joi.array()
      .items(
        Joi.object().keys({
          image_page: Joi.number().required(),
          image_file: Joi.string().required()
        })
      )
      .required()
  })
}

const updateChapter: SchemaValidator = {
  params: Joi.object().keys({
    comicId: Joi.string().required(),
    chapterId: Joi.string().required()
  }),
  body: Joi.object().keys({
    comic: Joi.string().required(),
    chapter_name: Joi.string().required(),
    chapter_path: Joi.string().required(),
    chapter_images: Joi.array()
      .items(
        Joi.object().keys({
          image_page: Joi.number().required(),
          image_file: Joi.string().required()
        })
      )
      .required()
  })
}

const deleteChapter: SchemaValidator = {
  params: Joi.object().keys({
    comicId: Joi.string().required(),
    chapterId: Joi.string().required()
  })
}

export default {
  createComic,
  getComic,
  getComicBySlug,
  getComics,
  updateComic,
  deleteComic,
  getChapters,
  getChapter,
  createChapter,
  updateChapter,
  deleteChapter
}
