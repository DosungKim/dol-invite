import { inviteConfig } from '../config';

type HeroProps = {
  imageError: boolean;
};

function Hero({ imageError }: HeroProps) {
  return (
    <section className="rounded-3xl bg-white/80 p-5 shadow-card">
      <div className="mb-5 overflow-hidden rounded-2xl border border-rosewood/20 bg-blush">
        {imageError ? (
          <div className="flex h-64 items-center justify-center text-sm text-rosewood/70">
            /public/baby.jpg 파일을 넣어 주세요
          </div>
        ) : (
          <img src="/baby.jpg" alt="아기 사진" className="h-64 w-full object-cover" />
        )}
      </div>
      <p className="text-center font-serif text-4xl text-rosewood">{inviteConfig.babyName}의 돌잔치</p>
      <p className="mt-4 whitespace-pre-line text-center text-sm leading-relaxed text-rosewood/80">{inviteConfig.message}</p>
      <p className="mt-5 border-t border-rosewood/20 pt-4 text-center text-sm text-rosewood/80">
        {inviteConfig.eventDateTime}
      </p>
    </section>
  );
}

export default Hero;
