BEGIN;

CREATE TABLE IF NOT EXISTS app_user (
                                        id          BIGSERIAL PRIMARY KEY,
                                        name        VARCHAR(100) NOT NULL,
                                        email       VARCHAR(254) NOT NULL,
                                        created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                        updated_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                        CONSTRAINT ck_app_user_name_not_blank
                                            CHECK (BTRIM(name) <> ''),
                                        CONSTRAINT ck_app_user_email_not_blank
                                            CHECK (BTRIM(email) <> '')
);

-- Remove a estrutura de contato usada em versões antigas do projeto.
-- Como todo o script roda em uma transação, uma instalação antiga que ainda
-- possua usuários sem e-mail será preservada e a migração será interrompida.
ALTER TABLE app_user
    DROP CONSTRAINT IF EXISTS ck_app_user_has_contact;

ALTER TABLE app_user
    DROP CONSTRAINT IF EXISTS ck_app_user_phone_e164;

DROP INDEX IF EXISTS uk_app_user_phone;

ALTER TABLE app_user
    DROP COLUMN IF EXISTS phone;

ALTER TABLE app_user
    ALTER COLUMN email SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_app_user_email
    ON app_user (LOWER(email));

CREATE TABLE IF NOT EXISTS trip (
                                    id              BIGSERIAL PRIMARY KEY,
                                    user_id         BIGINT NOT NULL,
                                    destination     VARCHAR(150) NOT NULL,
                                    departure_date  DATE NOT NULL,
                                    return_date     DATE,
                                    currency        CHAR(3) NOT NULL,
                                    status          VARCHAR(20) NOT NULL DEFAULT 'planning',
                                    notes           VARCHAR(1000),
                                    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                    CONSTRAINT fk_trip_user
                                        FOREIGN KEY (user_id)
                                            REFERENCES app_user (id)
                                            ON DELETE CASCADE,

                                    CONSTRAINT ck_trip_destination_not_blank
                                        CHECK (BTRIM(destination) <> ''),

                                    CONSTRAINT ck_trip_date_range
                                        CHECK (return_date IS NULL OR return_date >= departure_date),

                                    CONSTRAINT ck_trip_currency
                                        CHECK (currency ~ '^[A-Z]{3}$'),

                                    CONSTRAINT ck_trip_status
                                        CHECK (status IN ('planning', 'confirmed', 'completed'))
);

CREATE INDEX IF NOT EXISTS ix_trip_user_departure
    ON trip (user_id, departure_date);

CREATE INDEX IF NOT EXISTS ix_trip_user_status
    ON trip (user_id, status);

COMMIT;

-- =============================================================
-- Dados opcionais para testar o sistema
-- Remova os comentários abaixo somente em ambiente de desenvolvimento.
-- =============================================================

-- INSERT INTO app_user (name, email)
-- VALUES ('Lucas', 'lucas@tripping.com');

-- INSERT INTO trip
--     (user_id, destination, departure_date, return_date, currency, status, notes)
-- VALUES
--     (1, 'Lisboa, Portugal', '2026-09-12', '2026-09-20', 'EUR', 'confirmed',
--      'Hospedagem reservada próxima ao centro histórico.'),
--     (1, 'Tóquio, Japão', '2026-11-04', '2026-11-16', 'JPY', 'planning',
--      'Pesquisar opções de transporte entre Tóquio e Quioto.'),
--     (1, 'Nova York, Estados Unidos', '2027-01-18', '2027-01-25', 'USD', 'planning',
--      NULL);
