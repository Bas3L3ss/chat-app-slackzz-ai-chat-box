import { userCreateWorkspaceValues } from "@/hooks/create-workspace-values";
import { UploadDropzone } from "@/lib/uploadingthing";
import Image from "next/image";

import { ImCancelCircle } from "react-icons/im";

function ImageUpload() {
  const { imageUrl, updateImageUrl } = userCreateWorkspaceValues();

  if (imageUrl) {
    return (
      <div className="flex items-center justify-center h-32 w-32 relative">
        <Image
          src={imageUrl}
          className="object-cover w-full h-full rounded-md"
          alt="workspace"
          width={320}
          height={320}
        />
        <ImCancelCircle
          className="absolute cursor-pointer -right-2 -top-2 z-10 hover:scale-110 "
          size={30}
          onClick={() => updateImageUrl("")}
        />
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint="workspaceImage"
      onClientUploadComplete={(res) => {
        updateImageUrl(res?.[0].url);
      }}
      onUploadError={(err) => console.log(err)}
    />
  );
}

export default ImageUpload;
