#!/bin/bash

if [ -f /sql_backup/sql_data_volume.tar.gz ]; then
  echo "Restoring volume from backup..."

  mkdir -p /var/opt/mssql/tmp_restore
  tar -xzf /sql_backup/sql_data_volume.tar.gz -C /var/opt/mssql/tmp_restore
  cp -a /var/opt/mssql/tmp_restore/. /var/opt/mssql/
  rm -rf /var/opt/mssql/tmp_restore
  echo "Volume restore completed."
else
  echo "No backup file found, using empty volume."
fi

# Start SQL Server
/opt/mssql/bin/sqlservr