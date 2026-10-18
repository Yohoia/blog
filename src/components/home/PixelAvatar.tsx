import { pixelMarkup } from "@/lib/brand";
export function PixelAvatar({ label }: { label: string }) {
  return (
    <>
      <button
        type="button"
        className="pixel-avatar"
        aria-label={label}
        data-terminal-avatar
      >
        <span
          className="pixel-svg"
          dangerouslySetInnerHTML={{ __html: pixelMarkup }}
        />
        <canvas hidden aria-hidden="true"></canvas>
      </button>
    </>
  );
}
