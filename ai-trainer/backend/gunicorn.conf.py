# Gunicorn configuration for Render deployment
# ─────────────────────────────────────────────

# Workers
workers = 2

# Timeout – AI generation calls (Gemini) can take 30-60s
timeout = 120

# Graceful timeout
graceful_timeout = 30

# Keep-alive
keepalive = 5

# Bind
bind = "0.0.0.0:10000"

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
