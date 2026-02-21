type Props = {
  photos: string[]
}

export default function Gallery({ photos }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-8">
      {photos.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt={`KakaoTalk_20260222_004049797_${idx}`}
          className="rounded-xl shadow-md object-cover w-full h-40"
        />
      ))}
    </div>
  )
}
