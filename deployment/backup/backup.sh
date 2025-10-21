#!/bin/bash
# Database backup script

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_FILE="app.db"
BACKUP_FILE="backup_${TIMESTAMP}.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "Creating backup: $BACKUP_FILE"
cp $DB_FILE $BACKUP_DIR/$BACKUP_FILE

# Compress backup
gzip $BACKUP_DIR/$BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.db.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"

# Optional: Upload to cloud storage
# aws s3 cp $BACKUP_DIR/${BACKUP_FILE}.gz s3://your-bucket/backups/
