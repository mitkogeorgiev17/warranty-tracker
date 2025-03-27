--liquibase formatted sql

-- changeset mitko:create_users_table
create table users (
    id varchar(128) primary key not null,
    username varchar(64) not null,
    email varchar(128) not null,
    first_name varchar(64) not null,
    last_name varchar(64) not null
);

--changeset mitko:create_categories_table
create table categories (
    id int primary key generated always as identity,
    name varchar(64) not null
);

--changeset mitko:create_warranties_table
create table warranties (
    id int primary key generated always as identity,
    name varchar(64) not null,
    start_date date not null,
    end_date date not null,
    status varchar(16) not null,
    note varchar(2048),
    created_at timestamp not null,
    updated_at timestamp,

    category_id int,
    constraint fk_category_id foreign key (category_id) references categories(id) on delete set null,

    user_id varchar(128) not null,
    constraint fk_user_id foreign key (user_id) references users(id)
);

-- changeset mitko:create_warranty_files_table
create table files (
    id int primary key generated always as identity,
    file_id text not null,
    file_path text not null,
    name varchar(255) not null,
    content_type varchar(64) not null,
    file_size bigint not null,
    upload_date date not null,

    warranty_id int not null,
    constraint fk_warranty_id foreign key (warranty_id) references warranties(id)
);

-- changeset mitko:create_user_warranty_name_index
create unique index idx_user_warranty_name
on warranties (name, user_id);