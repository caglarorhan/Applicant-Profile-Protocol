/**
 * Global error handling middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      error: 'File too large',
      maxSize: `${process.env.MAX_FILE_SIZE_MB || 10}MB`
    });
  }

  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Only PDF files are allowed.'
    });
  }

  // Firebase errors
  if (err.code && err.code.startsWith('auth/')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication error',
      details: err.message
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}
