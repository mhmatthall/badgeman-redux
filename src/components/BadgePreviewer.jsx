import { generateBadgePreview } from "@/lib/gfx/image";
import { useEffect, useState } from "react";

export default function BadgePreviewer({ badgeData, ...props }) {
  const [badgePreviewUrl, setBadgePreviewUrl] = useState("");

  useEffect(() => {
    generateBadgePreview(badgeData.userData)
      .then((img) => {
        setBadgePreviewUrl(img);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [badgeData]);

  return (
    <div>
      <img
        src={badgePreviewUrl}
        alt="A visual preview of your badge"
        crossOrigin="anonymous"
        {...props}
      />
    </div>
  );
}
