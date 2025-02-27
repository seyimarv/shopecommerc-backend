import { z } from "zod";

export const PostAdminCreateAnnouncement = z.object({
  message: z.string(),
});

// curl -X POST 'http://localhost:9000/admin/auth/token' \
// -H 'Content-Type: application/json' \
// --data '{
//     "email": "oluwaseyitan299@gmail.com",
//     "password": "Tomilayo1"
// }'

