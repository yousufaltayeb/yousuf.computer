import { createSocialImage, socialImageSize } from "@/lib/social-image";

export const dynamic = "force-static";
export const alt = "Yousuf Altayeb / يوسف الطيب — Software Engineer";
export const size = socialImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage({
    title: "Yousuf Altayeb",
  });
}
