ALTER TABLE "teams" RENAME COLUMN "stripe_customer_id" TO "mp_customer_id";
ALTER TABLE "teams" RENAME COLUMN "stripe_subscription_id" TO "mp_subscription_id";
ALTER TABLE "teams" DROP COLUMN "stripe_product_id";
