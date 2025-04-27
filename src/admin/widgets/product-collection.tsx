import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text, Button } from "@medusajs/ui";
import { useState } from "react";
import { DetailWidgetProps, AdminCollection } from "@medusajs/framework/types";
import { useMutation } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";

const ProductCollectionWidget = ({
  data,
}: DetailWidgetProps<AdminCollection>) => {
  const [coverImage, setCoverImage] = useState<any | null>(
    data.metadata?.cover_image || null
  );

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const PUBLISHABLE_API_KEY = import.meta.env.VITE_PUBLISHABLE_API_KEY;

  // Upload file mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: FileList) => {
      const response = await sdk.admin.upload.create(file); // Uploading as an array
      return response.files?.[0]?.url; // Get uploaded file URL
    },
    onSuccess: (uploadedUrl) => {
      if (uploadedUrl) {
        setCoverImage(uploadedUrl);
        updateCollectionMutation.mutate(uploadedUrl);
      }
    },
    onError: (error) => {
      console.error("Error uploading file:", error);
    },
  });

  const updateCollectionMutation = useMutation({
    mutationFn: async (coverImageUrl: string) => {
      const newData = {
        title: data.title,
        handle: data.handle,
        metadata: {
          ...data.metadata,
          cover_image: coverImageUrl,
        },
      };
      return await fetch(`/admin/collections/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": PUBLISHABLE_API_KEY!,
        },
        body: JSON.stringify(newData),
      });
    },
    onSuccess: (data) => {
    },
    onError: (error) => {
      console.error("Mutation Failed:", error.message);
    },
  });

  const fileToFileList = (file: File): FileList => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file); // Store file for later upload
    const imageUrl = URL.createObjectURL(file);
    setCoverImage(imageUrl); // Preview image
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const fileList = fileToFileList(selectedFile);
    uploadMutation.mutate(fileList);
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        {data.title}
        <Heading level="h2">Collection Details</Heading>
      </div>

      <div className="px-6 py-4">
        <Text className="mb-2">Cover Image:</Text>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4"
          placeholder="Choose cover"
        />

        {coverImage && (
          <div className="mt-2">
            <Text className="mb-2">Preview:</Text>
            <img
              src={coverImage}
              alt="Cover Preview"
              className="w-full max-w-xs rounded-md shadow-md"
            />
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="mt-4"
          isLoading={uploadMutation.isPending}
        >
          Submit
        </Button>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product_collection.details.before",
});

export default ProductCollectionWidget;
