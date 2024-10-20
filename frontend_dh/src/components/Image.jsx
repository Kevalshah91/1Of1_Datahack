import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

const Image = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setInsights('');
      setError('');
    }
  };

  const processImage = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First, upload the image
      const formData = new FormData();
      formData.append('image', selectedImage);

      const uploadResponse = await fetch('http://localhost:5020/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const { encoded_image } = await uploadResponse.json();

      // Then, get the caption/insights
      const captionResponse = await fetch('http://localhost:5020/get_caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encoded_image }),
      });

      if (!captionResponse.ok) {
        throw new Error('Failed to get insights');
      }

      const { caption } = await captionResponse.json();
      setInsights(caption);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-purple-700">Image Analysis</h1>
          <p className="text-purple-600 mt-2">Upload an image to get AI-powered insights</p>
        </div>

        {/* Upload Section */}
        <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="imageInput"
          />
          <label
            htmlFor="imageInput"
            className="cursor-pointer block"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-md"
              />
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <Upload className="w-12 h-12 text-purple-500" />
                <span className="text-purple-600">Click to upload an image</span>
              </div>
            )}
          </label>
        </div>

        {/* Process Button */}
        <button
          onClick={processImage}
          disabled={!selectedImage || loading}
          className={`w-full py-3 px-4 rounded-md text-white font-medium 
            ${loading || !selectedImage 
              ? 'bg-purple-300 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700'
            } transition-colors duration-200`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="animate-spin mr-2" />
              Processing...
            </span>
          ) : (
            'Analyze Image'
          )}
        </button>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {/* Insights Section */}
        {insights && (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">AI Insights</h2>
            <p className="text-purple-900 whitespace-pre-wrap">{insights}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Image;