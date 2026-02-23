import { inviteConfig } from '../config';

type HeroProps = {
  imageError: boolean;
};

function Hero({ imageError }: HeroProps) {
  return (
    <section className="invitation-card animate-rise">
      <div className="mb-5 overflow-hidden rounded-2xl border border-rosewood/20 bg-blush">
        {imageError ? (
          <div className="flex h-64 items-center justify-center text-sm text-rosewood/70">
            /public/baby.webp 파일을 넣어 주세요
          </div>
        ) : (
          <img src="/baby.webp" alt="아기 사진" className="h-64 w-full object-cover" />
        )}
      </div>

      <p className="text-center font-fredoka text-4xl text-rosewood">{inviteConfig.babyName}가 뭘 잡게 될까요?</p>
      <p className="mt-4 whitespace-pre-line text-center text-lg leading-relaxed text-rosewood/80">{inviteConfig.message}</p>
      <p className="mt-5 border-t border-rosewood/20 pt-4 text-center text-sm text-rosewood/80">
        {inviteConfig.eventDateTime}
      </p>
    </section>
  );
}

export default Hero;
