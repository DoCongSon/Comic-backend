import { Request, Response } from 'express'
import * as categoryService from '../services/category.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'

export class CategoryController {
  public getCategoriesFromApi = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.getCategoryFromApi()
    res.status(httpStatus.OK).send(result)
  })

  public getCategories = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['name'])
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await categoryService.queryCategories(filter, options)
    res.status(httpStatus.OK).send(result)
  })

  public getCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await categoryService.getCategoryById(req.params.categoryId)
    res.status(httpStatus.OK).send(category)
  })

  public createCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body)
    res.status(httpStatus.CREATED).send(category)
  })

  public updateCategory = catchAsync(async (req: Request, res: Response) => {
    const category = await categoryService.updateCategoryById(req.params.categoryId, req.body)
    res.status(httpStatus.OK).send(category)
  })

  public deleteCategory = catchAsync(async (req: Request, res: Response) => {
    await categoryService.deleteCategoryById(req.params.categoryId)
    res.status(httpStatus.NO_CONTENT).send()
  })
}
