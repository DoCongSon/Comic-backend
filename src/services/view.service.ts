import httpStatus from 'http-status'
import ApiError from '../utils/ApiError.js'
import { ObjectId } from 'mongoose'
import { CreateViewOfDate, View } from '../models/view.model.js'

type DateKey = 'day' | 'week' | 'month'

/**
 * Compares two dates based on the specified date key.
 * @param date1 - The first date to compare.
 * @param date2 - The second date to compare.
 * @param dateKey - The date key to determine the comparison criteria ('day', 'week', or 'month').
 * @returns True if the dates match the specified criteria, false otherwise.
 */
const compareDates = (date1: Date, date2: Date, dateKey: DateKey) => {
  if (dateKey === 'day') {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }
  if (dateKey === 'week') {
    const getWeek = (date: Date) => {
      const onejan = new Date(date.getFullYear(), 0, 1)
      return Math.ceil(((date.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7)
    }
    return getWeek(date1) === getWeek(date2) && date1.getFullYear() === date2.getFullYear()
  }
  if (dateKey === 'month') {
    return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  }
}

/**
 * Updates the views array based on the current date.
 * If a view for the current date already exists, increments the view count.
 * Otherwise, adds a new view entry for the current date with a view count of 1.
 *
 * @param {CreateViewOfDate[]} viewsArray - The array of views to update.
 * @param {DateKey} dateKey - The date key used for comparing dates.
 */
const updateView = (viewsArray: CreateViewOfDate[], dateKey: DateKey) => {
  const currentDate = new Date()
  const currentView = viewsArray.find((view) => {
    const viewDate = new Date(view.date)
    return compareDates(viewDate, currentDate, dateKey)
  })
  if (currentView) {
    currentView.views += 1
  } else {
    viewsArray.push({ date: currentDate, views: 1 })
  }
}

const createViewForComic = async (comicId: ObjectId | string) => {
  const view = await getViewByComicId(comicId)
  if (view) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'View already exists for comic')
  }
  return View.create({ comic: comicId })
}

const getViewByComicId = async (comicId: ObjectId | string) => {
  const view = await View.findOne({ comic: comicId })
    .populate('dailyViews')
    .populate('weeklyViews')
    .populate('monthlyViews')
  return view
}

const incrementView = async (comicId: ObjectId | string) => {
  const view: any = await getViewByComicId(comicId)
  if (!view) {
    throw new ApiError(httpStatus.NOT_FOUND, 'View not found')
  }
  updateView(view.dailyViews, 'day')
  updateView(view.weeklyViews, 'week')
  updateView(view.monthlyViews, 'month')
  view.totalViews += 1
  await view.save()
  return view
}

export { updateView, createViewForComic, getViewByComicId, incrementView }
