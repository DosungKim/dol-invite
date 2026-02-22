type ImageModalProps = {
  src: string;
  onClose: () => void;
};

function ImageModal({ src, onClose }: ImageModalProps) {
  return (
    <button
      type="button"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
      aria-label="이미지 닫기"
    >
      <img src={src} alt="확대 이미지" className="max-h-[85vh] rounded-2xl object-contain" />
    </button>
  );
}

export default ImageModal;
