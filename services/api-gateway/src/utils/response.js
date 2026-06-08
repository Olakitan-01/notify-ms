const sendResponse = (res, { status_code = 200, success = true, message = '', data = null, error = null, meta = {} }) => {
  return res.status(status_code).json({
    success,
    message,
    data,
    error,
    meta: {
      total: meta.total || 0,
      limit: meta.limit || 0,
      page: meta.page || 0,
      total_pages: meta.total_pages || 0,
      has_next: meta.has_next || false,
      has_previous: meta.has_previous || false,
    },
  })
}

module.exports = { sendResponse }