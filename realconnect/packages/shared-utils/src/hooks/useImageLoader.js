import { useState, useEffect } from "react";
import axios from "axios";

/**
 * 이미지 로딩 Hook
 * Blob URL 생성 및 메모리 관리를 자동으로 처리합니다.
 *
 * @param {string} imagePath - 이미지 경로
 * @param {string} accessToken - 인증 토큰
 * @param {Object} options - 옵션
 * @param {string} options.baseUrl - 기본 URL (기본값: VITE_API_URL)
 * @param {boolean} options.enabled - 로딩 활성화 여부 (기본값: true)
 * @returns {Object} { imageUrl, loading, error }
 */
export function useImageLoader(imagePath, accessToken, options = {}) {
  const { baseUrl = import.meta.env.VITE_API_URL, enabled = true } = options;

  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 조건이 맞지 않으면 초기화
    if (!imagePath || !accessToken || !enabled) {
      setImageUrl(null);
      setError(null);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const loadImage = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${baseUrl}${imagePath}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: "blob",
        });

        if (!isCancelled) {
          const url = URL.createObjectURL(response.data);
          setImageUrl(url);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("이미지 로드 실패:", err);
          setError(err);
          setImageUrl(null);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      isCancelled = true;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imagePath, accessToken, baseUrl, enabled]);

  // 컴포넌트 언마운트 시 Blob URL 해제
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return { imageUrl, loading, error };
}

/**
 * 다중 이미지 로딩 Hook
 * 여러 이미지를 동시에 로딩합니다.
 *
 * @param {Array<string>} imagePaths - 이미지 경로 배열
 * @param {string} accessToken - 인증 토큰
 * @param {Object} options - 옵션
 * @returns {Object} { imageUrls, loading, errors }
 */
export function useMultipleImageLoader(imagePaths, accessToken, options = {}) {
  const [imageUrls, setImageUrls] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!imagePaths || imagePaths.length === 0 || !accessToken) {
      setImageUrls({});
      setErrors({});
      setLoading(false);
      return;
    }

    let isCancelled = false;
    const currentUrls = {};
    const currentErrors = {};

    const loadAllImages = async () => {
      setLoading(true);

      const promises = imagePaths.map(async (path, index) => {
        if (!path) return;

        try {
          const response = await axios.get(
            `${options.baseUrl || import.meta.env.VITE_API_URL}${path}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              responseType: "blob",
            }
          );

          if (!isCancelled) {
            const url = URL.createObjectURL(response.data);
            currentUrls[path] = url;
          }
        } catch (err) {
          if (!isCancelled) {
            console.error(`이미지 로드 실패 (${path}):`, err);
            currentErrors[path] = err;
          }
        }
      });

      await Promise.allSettled(promises);

      if (!isCancelled) {
        setImageUrls(currentUrls);
        setErrors(currentErrors);
        setLoading(false);
      }
    };

    loadAllImages();

    return () => {
      isCancelled = true;
      // Cleanup all created URLs
      Object.values(currentUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imagePaths, accessToken, options.baseUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  return { imageUrls, loading, errors };
}
