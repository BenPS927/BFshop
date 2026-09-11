DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "orderitem" AS order_item
    LEFT JOIN "Product" AS product ON product."id" = order_item."product_id"
    WHERE product."id" IS NULL
  ) THEN
    RAISE EXCEPTION 'Cannot add product relationship: orderitem contains an unknown product_id';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'orderitem_product_id_fkey'
  ) THEN
    ALTER TABLE "orderitem"
      ADD CONSTRAINT "orderitem_product_id_fkey"
      FOREIGN KEY ("product_id")
      REFERENCES "Product"("id")
      ON DELETE RESTRICT
      ON UPDATE CASCADE;
  END IF;
END $$;
