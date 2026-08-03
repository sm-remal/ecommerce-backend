-- AlterTable
ALTER TABLE `users`
    MODIFY `type` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER';
