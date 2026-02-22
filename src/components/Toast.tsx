type ToastProps = {
  message: string;
  visible: boolean;
};

function Toast({ message, visible }: ToastProps) {
  return (
    <div
      className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-rosewood px-4 py-2 text-xs text-white transition-all ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export default Toast;
