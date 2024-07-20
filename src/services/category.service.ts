import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { Category, type CreateCategory } from '../models/category.model.js'
import { ObjectId } from 'mongoose'
import { Options } from '../models/plugins/paginate.plugin.js'

const createCategory = async (categoryBody: CreateCategory) => {
  if (await Category.isSlugTaken(categoryBody.slug)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slug is already taken')
  }
  return Category.create(categoryBody)
}

const getCategoryById = async (categoryId: ObjectId | string) => {
  const category = await Category.findById(categoryId)
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found')
  }
  return category
}

const getCategoryBySlug = async (slug: string) => {
  const category = await Category.findOne({ slug })
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found')
  }
  return category
}

const queryCategories = async (filter: any, options: Options) => {
  const categories = await Category.paginate(filter, options)
  return categories
}

const updateCategoryById = async (categoryId: ObjectId | string, updateBody: CreateCategory) => {
  const category = await getCategoryById(categoryId)
  if (updateBody.slug && (await Category.isSlugTaken(updateBody.slug, categoryId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Slug is already taken')
  }
  Object.assign(category, updateBody)
  await category.save()
  return category
}

const deleteCategoryById = async (categoryId: ObjectId | string) => {
  const category = await getCategoryById(categoryId)
  await category.deleteOne()
  return category
}

const getCategoryFromApi = async () => {
  // Fetch data from the o truyen API
  const response = await fetch('https://otruyenapi.com/v1/api/the-loai')
  const data = await response.json()
  if (!response.ok || !data.status) {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch data from the API')
  }
  const result = data.data.items.map(async (item: { _id: string; name: string; slug: string }) => {
    const category = {
      name: item.name,
      slug: item.slug
    }
    if (await Category.isSlugTaken(category.slug)) {
      return { status: false, msg: 'Slug is already taken' }
    }
    await Category.create(category)
    return { status: 'success', msg: 'Category created successfully' }
  })
  return result
}

export {
  createCategory,
  getCategoryById,
  getCategoryBySlug,
  queryCategories,
  updateCategoryById,
  deleteCategoryById,
  getCategoryFromApi
}
