-- DropForeignKey
ALTER TABLE "public"."order" DROP CONSTRAINT "order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."refresh_token" DROP CONSTRAINT "refresh_token_user_id_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
