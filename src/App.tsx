import { useEffect, useRef, useState } from 'react';
import Footer from './components/Footer';
import Gallery from './components/Gallery';
import Guestbook from './components/Guestbook';
import Hero from './components/Hero';
import ImageModal from './components/ImageModal';
import Info from './components/Info';
import Location from './components/Location';
import Toast from './components/Toast';
import { inviteConfig } from './config';

function App() {
  const [imageError, setImageError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const image = new Image();
    image.src = '/baby.jpg';
    image.onerror = () => setImageError(true);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToastMessage(message);
    setToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), 1800);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(inviteConfig.address);
      showToast('주소가 복사되었어요.');
    } catch {
      showToast('복사 권한을 확인해 주세요.');
    }
  };

  const handleSubmitGuestbook = (payload: { name: string; message: string }) => {
    console.log('GUESTBOOK:', payload);
    showToast('방명록이 등록되었어요.');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${inviteConfig.babyName}의 돌잔치`,
          text: '돌잔치 초대장을 확인해 주세요.',
          url: window.location.href,
        });
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      showToast('링크가 복사되었어요.');
    } catch {
      // 사용자가 공유를 취소하는 경우도 많아 조용히 종료합니다.
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 py-6 sm:py-10">
      <main className="space-y-4">
        <Hero imageError={imageError} />
        <Info onCopyAddress={handleCopyAddress} />
        <Location />
        <Gallery onSelectImage={setSelectedImage} />
        <Guestbook onSubmit={handleSubmitGuestbook} />
      </main>

      <div className="pt-4">
        <Footer onShare={handleShare} />
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
      {selectedImage ? <ImageModal src={selectedImage} onClose={() => setSelectedImage(null)} /> : null}
    </div>
  );
}

export default App;
