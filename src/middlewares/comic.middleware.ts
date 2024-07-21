// import passport from 'passport'
// import httpStatus from 'http-status'
// import ApiError from '../utils/ApiError.js'
// import { getComicById, getComicBySlug } from 'src/services/comic.service.js'
// import { updatePointsAndLevel } from 'src/services/user.service.js'
//
// const verifyCallback =
//   (req: any, resolve: any, reject: any, ruby: number, point: number) => async (err: any, user: any, info: any) => {
//     let comic = null
//     if (req.params.comicId) {
//       comic = await getComicById(req.params.comicId)
//     } else if (req.params.slug) {
//       comic = await getComicBySlug(req.params.slug)
//     }
//     if (comic?.vip) {
//       if (err || info || !user) {
//         return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'))
//       }
//       if (user.ruby < ruby) {
//         return reject(new ApiError(httpStatus.FORBIDDEN, 'Not enough ruby'))
//       }
//       await updatePointsAndLevel(user.id, point)
//       user.ruby -= ruby
//       await user.save()
//     }
//     req.comic = comic
//     resolve()
//   }
//
// const comic =
//   (ruby: number = 1, point: number = 1) =>
//   async (req: any, res: any, next: any) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, ruby, point))(
//         req,
//         res,
//         next
//       )
//     })
//       .then(() => next())
//       .catch((err: any) => next(err))
//   }
//
// export default comic
