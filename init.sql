CREATE TABLE company (
    company_id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    company_code char(5) NOT NULL,
    company_name char(50) NOT NULL
);

CREATE TABLE employees (
    employee_id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    first_name varchar(100),
    last_name varchar(100),
    position varchar(100),
    department varchar(100),
    email varchar(100),
    phone varchar(20),
    is_active bit,
    created_by varchar(50),
    created_at datetime,
    updated_by varchar(50),
    updated_at datetime
);

CREATE TABLE petty_cash_vouchers (
    voucher_id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    company_id int,
    voucher_no varchar(50),
    request_date date,
    requested_by int,
    total_amount decimal(12,2),
    status varchar(50),
    remarks varchar(255),
    is_active bit,
    created_by varchar(50),
    created_at datetime,
    updated_by varchar(50),
    updated_at datetime,
    FOREIGN KEY (company_id) REFERENCES company(company_id),
    FOREIGN KEY (requested_by) REFERENCES employees(employee_id)
);

CREATE TABLE petty_cash_items (
    item_id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    voucher_id int,
    description varchar(255),
    expense_date date,
    amount decimal(12,2),
    gl_account varchar(50),
    cost_center varchar(50),
    is_active bit,
    created_by varchar(50),
    created_at datetime,
    updated_by varchar(50),
    updated_at datetime,
    FOREIGN KEY (voucher_id) REFERENCES petty_cash_vouchers(voucher_id)
);

CREATE TABLE approvals (
    approval_id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    voucher_id int,
    approver_id int,
    approval_date datetime,
    approval_status varchar(50),
    comments varchar(255),
    is_active bit,
    created_by varchar(50),
    created_at datetime,
    updated_by varchar(50),
    updated_at datetime,
    FOREIGN KEY (voucher_id) REFERENCES petty_cash_vouchers(voucher_id),
    FOREIGN KEY (approver_id) REFERENCES employees(employee_id)
);

CREATE TABLE cash_payments (
    payment_id int NOT NULL IDENTITY(1,1) PRIMARY KEY,
    voucher_id int NOT NULL,
    paid_date datetime,
    paid_by int,
    paid_amount decimal(12,2),
    payment_method varchar(50),
    reference_number varchar(100),
    is_active bit,
    created_by varchar(50),
    created_at datetime,
    updated_by varchar(50),
    updated_at datetime,
    FOREIGN KEY (voucher_id) REFERENCES petty_cash_vouchers(voucher_id),
    FOREIGN KEY (paid_by) REFERENCES employees(employee_id)
);