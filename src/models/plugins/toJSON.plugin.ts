interface Schema {
  methods: any
  obj: any
}

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
const toJSON = (schema: Schema) => {
  schema.methods.toJSON = function () {
    const obj = this.toObject({ getters: true, virtuals: true })
    delete obj._id
    delete obj.__v
    delete obj.createdAt
    delete obj.updatedAt
    // Loop through all fields and remove the ones marked as private
    Object.keys(schema.obj).forEach((key) => {
      if (schema.obj[key].private) {
        delete obj[key]
      }
    })
    return obj
  }
}

export default toJSON
