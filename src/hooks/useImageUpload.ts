import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const useImageUpload = () => {
  const [error, setError] = useState<string>('');
  const [pending, setPending] = useState(false);

  const upload = async (file: File) => {
    setPending(true);
    setError('');

    console.log('upload');
    let data;
    const formData = new FormData();
    formData.append('file', file);

    try {
      data = await fetch('/api/image/upload', {
        method: 'post',
        body: formData,
      }).then((res) => res.json());
      const fileId = data['fileId'];
      const error = data['error'] ?? '';

      if (error === 'invalid-filetype') {
        setError('Invalid filetype');
      } else if (error === 'unknown') {
        setError('An unexpected error occured');
      }

      setPending(false);
      return fileId;
    } catch (e) {
      console.log(e);
      setError('An unexpected error occured');
      setPending(false);
      return '';
    }
  };

  return { upload, pending, error };
};
export default useImageUpload;
