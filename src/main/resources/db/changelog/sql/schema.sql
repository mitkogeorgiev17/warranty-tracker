--liquibase formatted sql

-- changeset mitko:create_users_table
CREATE TABLE users (
    id                  VARCHAR(128)        PRIMARY KEY NOT NULL,
    username            VARCHAR(64)         NOT NULL,
    email               VARCHAR(128)        NOT NULL,
    first_name          VARCHAR(64)         NOT NULL,
    last_name           VARCHAR(64)         NOT NULL,
    account_language    VARCHAR(2)          NOT NULL
);

--changeset mitko:create_categories_table
CREATE TABLE categories (
    id                  INT                 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                VARCHAR(64)         NOT NULL
);

--changeset mitko:create_warranties_table
CREATE TABLE warranties (
    id                  INT                 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                VARCHAR(64)         NOT NULL,
    start_date          DATE                NOT NULL,
    end_date            DATE                NOT NULL,
    status              VARCHAR(16)         NOT NULL,
    note                VARCHAR(2048),
    created_at          TIMESTAMP           NOT NULL,
    updated_at          TIMESTAMP,

    category_id         INT,
    CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,

    user_id             VARCHAR(128)        NOT NULL,
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

-- changeset mitko:create_warranty_files_table
CREATE TABLE files (
    id                  INT                 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    file_id             TEXT                NOT NULL,
    file_path           TEXT                NOT NULL,
    name                VARCHAR(255)        NOT NULL,
    content_type        VARCHAR(64)         NOT NULL,
    file_size           BIGINT              NOT NULL,
    upload_date         DATE                NOT NULL,

    warranty_id         INT                 NOT NULL,
    CONSTRAINT fk_warranty_id FOREIGN KEY (warranty_id) REFERENCES warranties(id)
);

-- changeset mitko:create_user_warranty_name_index
CREATE UNIQUE INDEX idx_user_warranty_name
ON warranties (name, user_id);