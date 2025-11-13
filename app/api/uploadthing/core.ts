import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { getCurrentUser } from "@/lib/auth";

const f = createUploadthing();

export const uploadRouter = {
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await getCurrentUser();
      if (!user?.id) {
        throw new UploadThingError("Neautorizat: trebuie să fii autentificat.");
      }

      return {
        userId: user.id,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Fișier încărcat de", metadata.userId, ":", file.url);

      return {
        url: file.url,
        key: file.key,
      };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof uploadRouter;


