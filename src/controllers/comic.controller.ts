import { Request, Response } from 'express'
import * as comicService from '../services/comic.service.js'
import * as chapterService from '../services/chapter.service.js'
import * as userService from '../services/user.service.js'
import catchAsync from '../utils/catchAsync.js'
import httpStatus from 'http-status'
import pick from '../utils/pick.js'
import { IUser } from 'src/models/user.model.js'

export class ComicController {
  public getComicsFromApi = catchAsync(async (req: Request, res: Response) => {
    const slugs = req.query.slugs
    const comics = await comicService.getComicsFromApi(slugs as string)
    res.status(httpStatus.OK).send(comics)
  })

  public getComic = catchAsync(async (req: Request, res: Response) => {
    const comic = await comicService.getComicByIdOrSlug(req.params.comicIdOrSlug)
    res.status(httpStatus.OK).send(comic)
  })

  public getComics = catchAsync(async (req: Request, res: Response) => {
    const filter = pick(req.query, ['vip', 'status', 'name', 'category'])
    const options = pick(req.query, ['sortBy', 'limit', 'page'])
    const result = await comicService.queryComics({ filter, options })
    res.status(httpStatus.OK).send(result)
  })

  public getTopViewedComics = catchAsync(async (req: Request, res: Response) => {
    const result = await comicService.getTopViewComics()
    res.status(httpStatus.OK).send(result)
  })

  public createComic = catchAsync(async (req: Request, res: Response) => {
    const comic = await comicService.createComic(req.body)
    res.status(httpStatus.CREATED).send(comic)
  })

  public updateComic = catchAsync(async (req: Request, res: Response) => {
    const comic = await comicService.updateComicById(req.params.comicId, req.body)
    res.status(httpStatus.OK).send(comic)
  })

  public deleteComic = catchAsync(async (req: Request, res: Response) => {
    await comicService.deleteComicById(req.params.comicId)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public getChapters = catchAsync(async (req: Request, res: Response) => {
    const filter = { comic: req.params.comicId }
    const options = pick(req.query, ['limit', 'page'])
    options.sortBy = 'chapter_name:asc'
    const result = await chapterService.queryChapters(filter, options)
    res.status(httpStatus.OK).send(result)
  })

  public createChapter = catchAsync(async (req: Request, res: Response) => {
    const chapter = await chapterService.createChapter({ ...req.body, comic: req.params.comicId })
    res.status(httpStatus.CREATED).send(chapter)
  })

  public updateChapter = catchAsync(async (req: Request, res: Response) => {
    const chapter = await chapterService.updateChapterById(req.params.chapterId, req.body)
    res.status(httpStatus.OK).send(chapter)
  })

  public deleteChapter = catchAsync(async (req: Request, res: Response) => {
    await chapterService.deleteChapterById(req.params.chapterId)
    res.status(httpStatus.NO_CONTENT).send()
  })

  public getChapter = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IUser
    const chapter = await chapterService.readChapterById(req.params.chapterId, user?.id)
    if (user) {
      await userService.addComicToHistory(user.id, chapter.id)
    }
    res.status(httpStatus.OK).send(chapter)
  })
}
