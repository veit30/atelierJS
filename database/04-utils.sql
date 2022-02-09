-- SHORTKEY
-- by Nathan Fritz (andyet.com); turbo (github.com/turbo)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE DOMAIN SHORTKEY as varchar(11);
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE OR REPLACE FUNCTION shortkey_generate()
RETURNS TRIGGER AS $$
DECLARE
  gkey TEXT;
  key SHORTKEY;
  qry TEXT;
  found TEXT;
  user_id BOOLEAN;
BEGIN
  qry := 'SELECT id FROM ' || quote_ident(TG_TABLE_NAME) || ' WHERE id=';

  LOOP
    IF NEW.id IS NOT NULL THEN
      key := NEW.id;
      user_id := TRUE;

      IF length(key) <> 11 THEN
        RAISE 'User defined key value % has invalid length. Expected 11, got %.', key, length(key);
      END IF;
    ELSE
      gkey := encode(gen_random_bytes(8), 'base64');
      gkey := replace(gkey, '/', '_');  -- url safe replacement
      gkey := replace(gkey, '+', '-');  -- url safe replacement
      key := rtrim(gkey, '=');          -- cut off padding
      user_id := FALSE;
    END IF;

    EXECUTE qry || quote_literal(key) INTO found;

    IF found IS NULL THEN
      EXIT;
    END IF;

    IF user_id THEN
      RAISE 'ID % already exists in table %', key, TG_TABLE_NAME;
    END IF;

  END LOOP;

  NEW.id = key;
  RETURN NEW;
END
$$ language 'plpgsql';