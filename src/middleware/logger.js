const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent') || 'Unknown';

  // Log request details
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

  // Add response time logging
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`);
  });

  next();
};

module.exports = logger;
