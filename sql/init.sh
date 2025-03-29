#!/bin/bash

if [ -f /sql_backup/sql_data_volume.tar.gz ]; then
  echo "Restoring volume from backup..."
  mkdir -p /tmp_restore
  tar -xzf /sql_backup/sql_data_volume.tar.gz -C /tmp_restore
  cp -a /tmp_restore/. /var/opt/mssql/
  rm -rf /tmp_restore
  echo "Volume restore completed."
else
  echo "No backup file found, using empty volume."
fi

/opt/mssql/bin/sqlservr