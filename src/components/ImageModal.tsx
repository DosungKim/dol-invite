import type { MouseEvent } from 'react';

type ImageModalProps = {
  src: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

function ImageModal({ src, onClose, onNext, onPrev }: ImageModalProps) {
  const handleContentClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          onClose();
        }
      }}
      aria-label="이미지 닫기"
    >
      <div className="relative" onClick={handleContentClick}>
        <img src={src} alt="확대 이미지" className="max-h-[85vh] rounded-2xl object-contain" />

        <button
          type="button"
          onClick={onPrev}
          className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-xl text-white"
          aria-label="이전 이미지"
        >
          &lt;
        </button>

        <button
          type="button"
          onClick={onNext}
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-xl text-white"
          aria-label="다음 이미지"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default ImageModal;
