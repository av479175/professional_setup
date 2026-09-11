const asyncHandler = (requestHandler) => {
    // Receive a controller function and create an error-handling wrapper for it.
    return (req, res, next) => {
        // Express calls this returned function with the request, response, and next function.
        Promise
            .resolve(requestHandler(req, res, next))
            // Send any asynchronous error to Express's error-handling middleware.
            .catch((error) => next(error));
    };
};
export { asyncHandler };
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
//     // Promise.resolve(fn(req, res, next)).catch(next);
// };

// const asyncHandler = () => {}

// const asyncHandler = (func) => () => {}

// const asyncHandler = () => async () => {}

// function asyncHandler(fn) {
//   return function() {
//     // your logic goes here
// Promise.resolve(fn(req, res, next)).catch(next);
//   };
// }
