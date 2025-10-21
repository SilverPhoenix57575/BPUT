#!/bin/bash
# Database restore script

BACKUP_DIR="/backups"
DB_FILE="app.db"

if [ -z "$1" ]; then
  echo "Usage: ./restore.sh <backup_file>"
  echo "Available backups:"
  ls -lh $BACKUP_DIR/backup_*.db.gz
  exit 1
fi

BACKUP_FILE=$1

# Check if backup exists
if [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
  echo "Error: Backup file not found: $BACKUP_FILE"
  exit 1
fi

# Create backup of current database
echo "Creating safety backup of current database..."
cp $DB_FILE ${DB_FILE}.before_restore

# Restore from backup
echo "Restoring from: $BACKUP_FILE"
gunzip -c $BACKUP_DIR/$BACKUP_FILE > $DB_FILE

echo "Restore completed successfully"
echo "Previous database saved as: ${DB_FILE}.before_restore"
