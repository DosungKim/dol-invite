import { inviteConfig } from '../config';

type GalleryProps = {
  onSelectImage: (index: number) => void;
};

function Gallery({ onSelectImage }: GalleryProps) {
  return (
    <section className="invitation-card animate-rise" style={{ animationDelay: '0.08s' }}>
      <h2 className="section-title">1년 동안 이렇게 자랐어요</h2>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {inviteConfig.galleryImages.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => onSelectImage(index)}
            className="overflow-hidden rounded-xl border border-rosewood/15 focus:outline-none focus:ring-2 focus:ring-rosewood/40"
            aria-label={`갤러리 이미지 ${index + 1} 확대`}
          >
            <img src={src} alt={`아기 사진 ${index + 1}`} className="h-24 w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
