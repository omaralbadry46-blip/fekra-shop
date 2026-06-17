// Supabase Configuration for Fekra Shop (Images Storage)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// TODO: Replace with your actual Supabase URL and Anon Key
const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseKey = "YOUR_SUPABASE_ANON_KEY";

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a file to Supabase Storage bucket and returns the public URL.
 * @param {File} file - The file object to upload.
 * @param {string} bucket - The name of the bucket (e.g., 'product-images').
 * @returns {Promise<string>} The public URL of the uploaded image.
 */
export async function uploadProductImage(file, bucket = 'product-images') {
  try {
    // Clean file name to prevent issues (replace spaces and special characters)
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    // Upload file to bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image to Supabase:', error);
    throw error;
  }
}

export { supabase };
