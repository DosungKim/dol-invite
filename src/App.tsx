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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
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

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';

    document.body.appendChild(textArea);
    textArea.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (!copied) {
      throw new Error('Clipboard copy failed.');
    }
  };

  const handleCopyAddress = async () => {
    try {
      await copyToClipboard(inviteConfig.address);
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

      await copyToClipboard(window.location.href);
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
        <Gallery onSelectImage={setSelectedImageIndex} />
        <Guestbook onSubmit={handleSubmitGuestbook} />
      </main>

      <div className="pt-4">
        <Footer onShare={handleShare} />
      </div>

      <Toast message={toastMessage} visible={toastVisible} />
      {selectedImageIndex !== null ? (
        <ImageModal
          src={inviteConfig.galleryImages[selectedImageIndex]}
          onClose={() => setSelectedImageIndex(null)}
          onPrev={() =>
            setSelectedImageIndex((prev) =>
              prev === null
                ? 0
                : (prev - 1 + inviteConfig.galleryImages.length) % inviteConfig.galleryImages.length,
            )
          }
          onNext={() =>
            setSelectedImageIndex((prev) =>
              prev === null ? 0 : (prev + 1) % inviteConfig.galleryImages.length,
            )
          }
        />
      ) : null}
    </div>
  );
}

export default App;
