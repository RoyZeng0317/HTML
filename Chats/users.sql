SELECT * FORM messages
WHERE burn_at IS NOT NULL
AND burn_at <= NOW()
AND deleted_at IS NUL