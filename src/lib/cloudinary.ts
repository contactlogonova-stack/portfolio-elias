export const uploadImage = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dlnkqoipr';
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'portfolio_realisations';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erreur lors de l'upload sur Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Erreur d'upload d'image: ${error.message}`);
  }
};

export const deleteImage = async (publicId: string): Promise<void> => {
  // Placeholder pour l'instant
  console.log('Delete image placeholder for publicId:', publicId);
};
