ALTER TABLE accounts
ADD COLUMN sessionVersion INTEGER NOT NULL DEFAULT 0;

ALTER TABLE reservedareaaccounts
ADD COLUMN sessionVersion INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS accounts_email_unique
ON accounts (email);

CREATE UNIQUE INDEX IF NOT EXISTS accounts_username_unique
ON accounts (username);

CREATE UNIQUE INDEX IF NOT EXISTS accountideadata_account_idea_unique
ON accountideadata (accountid, ideaid);
