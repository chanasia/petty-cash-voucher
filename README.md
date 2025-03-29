## Start web-application
```bash
docker-compose up --build -d
```

## หน้าแรกเว็บไซต์คือ http://localhost/vouchers

# Others
## Import volume
```bash
docker volume create petty-cash-voucher_sql_data
```
```bash
docker run --rm -v petty-cash-voucher_sql_data:/destination -v $(pwd)/sql:/backup alpine sh -c "cd /destination && tar -xzf /backup/sql_data_volume.tar.gz"
```
## Stop containers
```bash
docker-compose down --rmi local
```
## Backup volume
```bash
docker run --rm -v petty-cash-voucher_sql_data:/source -v $(pwd)/volume_backup:/backup alpine sh -c "cd /source && tar -czf /backup/sql_data_volume.tar.gz ."
```