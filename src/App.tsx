import { useEffect, useState } from 'react';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Info from './components/Info';
import Location from './components/Location';
import Toast from './components/Toast';
import { inviteConfig } from './config';
import Gallery from "./components/Gallery"

function App() {
  const [imageError, setImageError] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.src = '/baby.jpg';
    image.onerror = () => setImageError(true);
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(inviteConfig.address);
    } finally {
      setToastVisible(true);
      window.setTimeout(() => setToastVisible(false), 1800);
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 py-6 sm:py-10">
      <main className="space-y-4">
        <Hero imageError={imageError} />
        <Info onCopyAddress={handleCopyAddress} />
	<Gallery photos={inviteConfig.photos} />
        <Location />
      </main>
      <div className="pt-4">
        <Footer />
      </div>
      <Toast message="주소가 복사되었어요." visible={toastVisible} />
    </div>
  );
}


export default App;
