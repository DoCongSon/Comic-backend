import mongoose from 'mongoose'

interface Schema {
  statics: any
}

export interface Options {
  sortBy?: string
  populate?: string
  limit?: number
  page?: number
}

const paginate = (schema: Schema) => {
  schema.statics.paginate = async function (filter: any, options: Options) {
    let sort = ''
    if (options.sortBy) {
      const sortingCriteria: string[] = []
      options.sortBy.split(',').forEach((sortOption: string) => {
        const [key, order] = sortOption.split(':')
        sortingCriteria.push((order === 'desc' ? '-' : '') + key)
      })
      sort = sortingCriteria.join(' ')
    } else {
      sort = 'createdAt'
    }

    const limit =
      options.limit && parseInt(options.limit.toString(), 10) > 0 ? parseInt(options.limit.toString(), 10) : 10
    const page = options.page && parseInt(options.page.toString(), 10) > 0 ? parseInt(options.page.toString(), 10) : 1
    const skip = (page - 1) * limit

    if (filter.name) {
      filter.name = { $regex: new RegExp(filter.name, 'i') }
    }
    // category: slug => category: _id
    if (filter.category) {
      const category = await mongoose.model('Category').findOne({ slug: filter.category })
      filter.category = category ? { $in: [category._id] } : null
    }

    const countPromise = this.countDocuments(filter).exec()
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit)

    if (options.populate) {
      // progress.achievements>fieldsOfAchievements - populate nested fields
      options.populate.split(',').forEach((populateOption: string) => {
        let populateObj = {}
        populateOption
          .split('>')
          .reverse()
          .forEach((item: string, index: number, arr: string[]) => {
            populateObj = index === 0 ? { path: item } : { path: arr[index - 1], populate: populateObj }
          })
        docsPromise = docsPromise.populate(populateObj)
      })
    }

    docsPromise = docsPromise.exec()

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values
      const totalPages = Math.ceil(totalResults / limit)
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults
      }
      return Promise.resolve(result)
    })
  }
}

export default paginate
